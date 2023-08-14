import React, { useEffect, useState } from 'react'
import Sidebar from '../sidebar/sidebar'
import Settings from '../settings/settings'
import moment from 'moment/moment'
import { collection, deleteDoc, doc, getDoc, getDocs, increment, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore'
import { db } from '../../firebase'
import { round } from '../../components/functions/regex'
import { Alert, AlertTitle, AppBar, Backdrop, Box, Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Grid, IconButton, List, ListItem, ListItemText, Slide, Snackbar, Toolbar, Typography } from '@mui/material'
import { useStateValue } from '../../components/stateProvider'
import VisibilityIcon from '@mui/icons-material/Visibility';
import CurrencyFormat from 'react-currency-format'
import { useParams } from 'react-router-dom'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function SlideTransition(props) {
    return <Slide {...props} direction="left" />;
}

export default function Daily() {

    const params = useParams()

    const [{ employee, products, stock, user }, dispatch] = useStateValue()

    const [date, setDate] = useState(params.date ? moment(params.date).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'))
    const [dailyDoc, setDailyDoc] = useState(null)
    const [prevDay, setPrevDay] = useState()
    const [dash, setDash] = useState([])
    const [dailyOrders, setDailyOrder] = useState(null)
    const [prevOrder, setPrevOrder] = useState(null)
    const [dailyStock, setDailyStock] = useState(null)
    const [sellers, setSellers] = useState(null)
    const [openDatePicker, setOpenDatePicker] = React.useState(false);
    const [openSnack, setOpenSnack] = useState(false);
    const [allDocs, setAllDocs] = useState([])
    const [loading, setLoading] = useState(false)
    const [states, setStates] = useState({
        variant: '',
        message: '',
        title: ''
    })
    const [lastDay, setLastDay] = useState()

    useEffect(() => {
        const getData = async () => {
            const docRef = doc(db, "dailyclosure", moment(date).format('DDMMYYYY'));
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return
            } else {
                alert('Cette date est introuvable')
                return window.location.assign('/dailyclosure')
            }
        }
        if (moment(params.date).format('YYYY-MM-DD') !== moment().format('YYYY-MM-DD')) {
            getData()
        }
    }, [params.date])


    const [open, setOpen] = React.useState(false);

    const handleClickOpenDatePicker = () => {
        setOpenDatePicker(true);
    };

    useEffect(() => {

        if (!date) {
            alert('Mauvais format de date')
            return window.location.assign('/dailyclosure')
        }
    }, [params.date])


    const handleClickAlert = (variant, title, msg) => {
        setOpenSnack(true);
        setStates({
            ...states,
            ['variant']: variant,
            ['message']: msg,
            ['title']: title
        })
    };



    const handleSubmitDate = (e) => {
        e.preventDefault()
        window.location.assign(`dailyclosure/search/${moment(date).format()}`)
    }

    const handleCloseDatePicker = () => {
        setOpenDatePicker(false);
    };
    useEffect(() => {
        document.title = 'Bouclage journalier'
    }, [])

    const handleDateChanged = (e) => {
        setDate(e.target.value)
    }


    const handleClickOpen = () => {
        setOpen(true);
    };


    const handleCloseSnack = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const getLastDay = async (date) => {
        let i = 1
        let data
        while (i > 0) {
            const docRef = doc(db, "dailyclosure", moment(date).subtract(i, 'day').format('DDMMYYYY'));
            const docSnap = await getDoc(docRef);
            if (!docSnap.exists()) {
                i++
            }
            if (docSnap.exists()) {
                let docs = docSnap.data()
                let id = docSnap.id
                data = { id, ...docs }
                i = 0
            }
        }
        return new Promise((resole, reject) => {
            resole(data)
        })
    }



    const handleCloseDay = async () => {
        setLoading(true)
        setOpenDatePicker(false)
        try {
            const docRef = doc(db, "dailyclosure", moment().format('DDMMYYYY'));
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const docRef = doc(db, "dailyclosure", `${moment().format('DDMMYYYY')}`);
                await updateDoc(docRef, {
                    closedAt: serverTimestamp(),
                    closed: true
                }).then(async () => {
                    const q = query(collection(db, "invoices"), orderBy('createdAt', 'asc'));
                    const querySnapshot = await getDocs(q);
                    let arrayInvoices = []
                    querySnapshot.forEach(async (docData) => {
                        const data = docData.data()
                        const id = docData.id
                        arrayInvoices.push({ id, ...data })
                    });

                    arrayInvoices.filter(el => el.delivered == false).forEach(async (el) => {
                        const q = query(collection(db, "invoicesProduct"), where('invoiceNum', '==', el.invoiceNum));
                        const querySnapshot = await getDocs(q);
                        let arrayProducts = []

                        querySnapshot.forEach((doc) => {
                            const data = doc.data()
                            const id = doc.id
                            arrayProducts.push({ id, ...data })
                        });
                        for (let i = 0; i < arrayProducts.length; i++) {
                            const element = arrayProducts[i];
                            if (element.parfum !== null) {
                                const docRef = doc(db, "parfum", `${element.productId}-${element.parfum}`);
                                await updateDoc(docRef, {
                                    stock: increment(element.qty),
                                    already: increment(-element.qty)
                                });
                            }
                            const docRef = doc(db, "stock", element.productId);
                            await updateDoc(docRef, {
                                stock: increment(element.qty),
                                already: increment(-element.qty)
                            });
                            await deleteDoc(doc(db, "invoicesProduct", element.id));
                        }
                        await deleteDoc(doc(db, "invoices", el.id)).then(console.log(el.id, 'deleted successfully'));
                    });
                })

                const q = query(collection(db, "stock"));
                const querySnapshot = await getDocs(q);
                let arrayStock = []
                querySnapshot.forEach(async (docData) => {
                    const data = docData.data()
                    const id = docData.id
                    arrayStock.push({ id, ...data })
                });
                arrayStock.forEach(async function (el) {
                    await updateDoc(doc(db, `dailyclosure`, `${moment().format('DDMMYYYY')}`, `dailyStock`, `${el.id}`,), {
                        finalStock: el.stock
                    });
                })

            } else {
                console.log('document do not exist')
            }
        } catch (error) {
            console.log(error)
        }
        setLoading(false)
        handleClickAlert('success', 'Succes', `La journee a été cloturée avec succès`)
        setTimeout(() => {
            window.location.reload()
        }, 3000);
    }


    useEffect(() => {
        onSnapshot(doc(db, "dailyclosure", moment(date).format('DDMMYYYY')), { includeMetadataChanges: true }, (doc) => {
            if (doc.exists()) {
                setDailyDoc(doc.data())
            }
        });
        getLastDay(date).then(e => setPrevDay(e))
        const getOrder = async () => {
            var start = new Date(date);
            start.setHours(0, 0, 0, 0);
            const q = query(collection(db, "invoices"), where('delivered', '==', true), orderBy('createdAt'));
            const querySnapshot = await getDocs(q);
            let array = []
            querySnapshot.forEach((doc) => {
                const data = doc.data()
                const id = doc.id
                const createdAt = moment(data.createdAt.toDate()).format()
                array.push({ id, ...data, createdAt })
            });
            setAllDocs(array)
            setDailyOrder(array.filter((obj) => moment(obj.createdAt).format('YYYY-MM-DD') === moment(date).format('YYYY-MM-DD')))
            setPrevOrder(array.filter((obj) => moment(obj.createdAt).format('YYYY-MM-DD') === moment(date).subtract(1, 'day').format('YYYY-MM-DD')))
        }

        const fetchDocs = async () => {
            var start = new Date(date);
            start.setHours(0, 0, 0, 0);
            const q = query(collection(db, "sellers"));
            const querySnapshot = await getDocs(q);
            let array = []
            querySnapshot.forEach((doc) => {
                const data = doc.data()
                const id = doc.id
                const createdAt = moment(data.createdAt.toDate()).format('x')
                array.push({ id, ...data, createdAt })
            });
            setSellers(array.filter((obj) => moment(obj.createdAt).format('YYYY-MM-DD') === moment(date).format('YYYY-MM-DD')))
        }
        getOrder()
        fetchDocs()
    }, [])

    useEffect(() => {
        const dashboard = [
            {
                'id': '1',
                'text': 'Recette journalière',
                'icon': 'fas fa-box',
                'bgColor': 'l-bg-cyan',
                'number': dailyOrders?.map((_, i) => { return _.amountToPaid }).reduce((acc, currentValue) => acc + currentValue, 0) + sellers?.filter(el => el.closed == true).map((_, i) => { return _.toPaid }).reduce((acc, currentValue) => acc + currentValue, 0),
                'lastUpdated': '',
                'numberColor': 'red',
                'increase': ((dailyOrders?.map((_, i) => { return _.amountToPaid }).reduce((acc, currentValue) => acc + currentValue, 0) -
                    prevOrder?.map((_, i) => { return _.amountToPaid }).reduce((acc, currentValue) => acc + currentValue, 0)) /
                    (prevOrder?.map((_, i) => { return _.amountToPaid }).reduce((acc, currentValue) => acc + currentValue, 0) === 0 ? 1 :
                        prevOrder?.map((_, i) => { return _.amountToPaid }).reduce((acc, currentValue) => acc + currentValue, 0))) * 100
            },
            {
                'id': '2',
                'text': 'Despense journalière',
                'icon': 'fas fa-dollar-sign',
                'bgColor': 'l-bg-red-dark',
                'number': dailyDoc?.depense,
                'lastUpdated': 'last month',
                'numberColor': 'red',
                'increase': ((dailyDoc?.depense - prevDay?.depense) / (prevDay?.depense === 0 ? 1 : prevDay?.depense)) * 100,
            },
            {
                'id': '3',
                'text': 'Bénéfice journalier',
                'icon': 'fas fa-coins',
                'bgColor': 'l-bg-green-dark',
                'number': dailyDoc?.marge,
                'lastUpdated': 'last month',
                'numberColor': 'red',
                'increase': ((dailyDoc?.marge - prevDay?.marge) / (prevDay?.marge === 0 ? 1 : prevDay?.marge)) * 100,
            },
            {
                'id': '4',
                'text': 'Montant en caisse',
                'icon': 'far fa-money-bill-alt',
                'bgColor': 'l-bg-orange',
                'number': dailyDoc?.caisse,
                'lastUpdated': 'last month',
                'numberColor': 'red',
                'increase': ((dailyDoc?.caisse - prevDay?.caisse) / (prevDay?.caisse === 0 ? 1 : prevDay?.caisse)) * 100,
            }
        ]
        setDash(dashboard)
    }, [dailyDoc, prevDay])

    useEffect(() => {
        const fetchData = async () => {
            const subColRef = collection(db, "dailyclosure", moment(date).format('DDMMYYYY'), 'dailyStock');
            const qSnap = await getDocs(subColRef)
            setDailyStock(qSnap.docs.map(d => ({ id: d.id, ...d.data() })))
        }
        fetchData()
    }, [])

    const LiDelivererCard = ({ item }) => {
        const [open, setOpen] = React.useState(false);
        const [display, setDisplay] = useState('sell')

        const handleClickOpen = () => {
            setOpen(true);
        };

        const handleClose = () => {
            setOpen(false);
        };

        return (
            <React.Fragment key={item.id}>
                <li class="media hoverable">
                    <img alt="image" src={item.profilePic}
                        class="mr-3 user-img-radious-style user-list-img" />
                    <div class="media-body">
                        <div class="mt-0 font-weight-bold text-uppercase">{employee.find(el => el.id == item.id)?.name} {employee.find(el => el.id == item.employeeId)?.surname}</div>
                        <div class="text-medium">
                            {
                                (dailyOrders.filter(el => el.deliverer == item.id)?.reduce((accumulator, currentValue) => accumulator + currentValue.amountToPaid, 0)) +
                                (sellers.filter(el => el.employeeId == item.id && el.closed == true)?.reduce((accumulator, currentValue) => accumulator + currentValue.toPaid, 0))
                            }FCFA
                        </div>
                    </div>
                </li>
                <Dialog
                    maxWidth={'lg'}
                    open={open}
                    fullWidth
                >
                    <DialogTitle>Details de versement <span class="mt-0 text-uppercase">{item.surname}</span></DialogTitle>
                    <DialogContent>
                        <Box sx={{ flexGrow: 1 }}>
                            <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                                <Grid item xs={4}>
                                    <List>
                                        {
                                            item.cat == '1' &&
                                            <>
                                                <ListItem button>
                                                    <ListItemText primary="Livraison" secondary={<CurrencyFormat value={dailyOrders.filter(el => el.deliverer == item.id)?.reduce((accumulator, currentValue) => accumulator + currentValue.amountToPaid, 0)} displayType={'text'} thousandSeparator={true} suffix={' Fcfa'} />} />
                                                </ListItem>
                                                <Divider />
                                            </>
                                        }
                                        <ListItem button>
                                            <ListItemText primary="Ventes" secondary={<CurrencyFormat value={sellers.filter(el => el.employeeId == item.id && el.closed == true)?.reduce((accumulator, currentValue) => accumulator + currentValue.toPaid, 0)} displayType={'text'} thousandSeparator={true} suffix={' Fcfa'} />} />
                                        </ListItem>
                                        <Divider />
                                        <ListItem>
                                            <ListItemText primary="Total versement"
                                                secondary={
                                                    <CurrencyFormat
                                                        value={
                                                            (dailyOrders.filter(el => el.deliverer == item.id)?.reduce((accumulator, currentValue) => accumulator + currentValue.amountToPaid, 0)) +
                                                            (sellers.filter(el => el.employeeId == item.id && el.closed == true)?.reduce((accumulator, currentValue) => accumulator + currentValue.toPaid, 0))
                                                        }
                                                        displayType={'text'}
                                                        thousandSeparator={true}
                                                        suffix={' Fcfa'}
                                                    />
                                                }
                                            />
                                        </ListItem>
                                    </List>
                                </Grid>

                                <Grid item xs={8}>
                                </Grid>
                            </Grid>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Fermer</Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        )
    }

    if (!dailyDoc, !prevDay, !dailyOrders, !prevOrder, !dailyStock, !sellers) {
        return <div class="loader"></div>
    }

    return (
        <div>
            <div id="app">
                <div class="main-wrapper main-wrapper-1">
                    <div class="navbar-bg"></div>
                    <Sidebar />
                    <Dialog
                        open={openDatePicker}
                        TransitionComponent={Transition}
                        keepMounted
                        aria-describedby="alert-dialog-slide-description"
                    >
                        <DialogTitle>{"Voullez-vous vraiment cloturer la journée ?"}</DialogTitle>
                        <DialogContent>
                            <Typography>
                                - Toutes les factures non receptionnées seront automatiquement supprimées
                            </Typography>
                            <Typography>
                                - vous ne pourrez plus faire de facture aujourd'hui
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button color='error' onClick={handleCloseDatePicker}>Annuler</Button>
                            <Button onClick={handleCloseDay}>Confirmer</Button>
                        </DialogActions>
                    </Dialog>

                    <Snackbar
                        TransitionComponent={SlideTransition}
                        transitionDuration={200}
                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                        open={openSnack} autoHideDuration={5000} onClose={handleCloseSnack}
                    >
                        <Alert onClose={handleCloseSnack} severity={states.variant} sx={{ maxWidth: '400px' }}>
                            <AlertTitle>{states.title}</AlertTitle>
                            {states.message}
                        </Alert>
                    </Snackbar>

                    <Backdrop
                        sx={{ color: '#000', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={loading}
                    >
                        <CircularProgress color="inherit" /> <span class='h4 mx-2'>en cour...</span>
                    </Backdrop>

                    <Dialog
                        fullScreen
                        open={open}
                        TransitionComponent={Transition}
                    >
                        <AppBar sx={{ position: 'relative', background: '#000' }}>
                            <Toolbar>
                                <Button autoFocus color="inherit" onClick={handleClose}>
                                    Fermer
                                </Button>
                            </Toolbar>
                        </AppBar>
                        <div class="table-responsive">
                            <table class="table table-striped table-dark table-md responsive-table table-hover">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Article</th>
                                        <th class='text-right'>Stock initial</th>
                                        <th class='text-right'>Approvisionement</th>
                                        <th class='text-right'>Quantite vendue</th>
                                        <th class='text-right'>Stock final</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        dailyStock.map((_, i) => (
                                            <tr key={i}>
                                                <td>{i + 1}</td>
                                                <td>{products.find(el => el.id === _.id).nom}</td>
                                                <td class='text-right'>
                                                    {_.stock}
                                                </td>
                                                <td class='text-right'>
                                                    {_?.appro}
                                                </td>
                                                <td class='text-right'>
                                                    {dailyDoc.closed == false ? 'en attente...' : Math.abs(_?.finalStock - (_?.appro + _.stock))}
                                                </td>
                                                <td class='text-right'>
                                                    {dailyDoc.closed == false ? 'en attente...' : _?.finalStock}
                                                </td>
                                            </tr>
                                        ))
                                    }

                                </tbody>
                            </table>
                        </div>
                    </Dialog>
                    <div class="main-content">
                        <section class="section">
                            <div class="section-body">
                                <div class='row'>
                                    <div class='col-12'>
                                        <div class='card'>
                                            <div class="card-header">
                                                <h4>Bouclage journalier</h4>

                                                <div class="card-header-action row">
                                                    {
                                                        user.accountType == 'admin' && (
                                                            dailyDoc.closed == false ?
                                                                <button onClick={handleClickOpenDatePicker} data-toggle="tooltip" data-placement="top" title='cloturer la journée' class="btn btn-icon btn-success mr-sm-2"><i class="fas fa-check"></i></button>
                                                                :
                                                                <button disabled data-toggle="tooltip" data-placement="top" title='Journée cloturée' class="btn btn-icon btn-secondary mr-sm-2 pe-none"><i class="fas fa-check"></i></button>
                                                        )
                                                    }
                                                    <form class="card-header-form">
                                                        <div class="input-group">
                                                            <input
                                                                type="date" class="form-control"
                                                                min={allDocs.length > 0 ? moment(allDocs[0].createdAt).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')}
                                                                max={moment().format('YYYY-MM-DD')}
                                                                value={date}
                                                                onChange={(e) => setDate(e.target.value)}
                                                            />
                                                            <div class="input-group-btn">
                                                                <button onClick={handleSubmitDate} class="btn btn-primary btn-icon"><i class="fas fa-search"></i></button>
                                                            </div>
                                                        </div>
                                                    </form>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="row">
                                    {
                                        dash.map((item, index) => (
                                            user.accountType != 'admin' && index == 0 &&
                                            <div class="col-xl-3 col-lg-6" key={index} >
                                                <div class="card">
                                                    <div class="card-body card-type-3">
                                                        <div class="row">
                                                            <div class="col">
                                                                <h6 class="text-muted mb-0">{item.text}</h6>
                                                                <span class="font-weight-bold mb-0">{item.number}</span>
                                                            </div>
                                                            <div class="col-auto">
                                                                <div class={`card-circle ${item.bgColor} text-white`}>
                                                                    <i class={item.icon}></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {
                                                            moment(params.date).format('YYYY-MM-DD') !== moment(allDocs[0]?.createdAt).format('YYYY-MM-DD') &&
                                                            <p class="mt-3 mb-0 text-muted text-sm">
                                                                <span
                                                                    class={`${item.increase == 0 ? 'text-warning' : item.id == 2 ? item.increase < 0 ? "text-success" : "text-danger" : item.increase > 0 ? "text-success" : "text-danger"} mr-2`}
                                                                ><i class={`fa fa-arrow-${item.increase >= 0 ? 'up' : 'down'}`}></i>{' '}
                                                                    {round(item.increase >= 0 ? item.increase : -(item.increase))}%
                                                                </span>
                                                                <span class="text-nowrap">De {item.increase >= 0 ? 'plus' : 'moins'} qu'hier</span>
                                                            </p>
                                                        }
                                                    </div>
                                                </div>
                                            </div>

                                        ))
                                    }

                                </div>
                                <div class="row">
                                    <div class="col-lg-8 col-md-12 col-12 col-sm-12">
                                        <div class="card">
                                            <div class="card-header">
                                                <h4>Stock journalier</h4>
                                            </div>
                                            <div class="card-body" id="top-5-scroll">
                                                <div class="table-responsive">
                                                    <table class="table table-md responsive-table table-hover">
                                                        <thead>
                                                            <tr>
                                                                <th>#</th>
                                                                <th>Article</th>
                                                                <th class='text-right'>Stock initial</th>
                                                                <th class='text-right'>Approvisionement</th>
                                                                <th class='text-right'>Quantite vendue</th>
                                                                <th class='text-right'>Stock final</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                dailyStock.slice(0, 5).map((_, i) => (
                                                                    <tr key={i}>
                                                                        <td>{i + 1}</td>
                                                                        <td>{products.find(el => el.id === _.id).nom}</td>
                                                                        <td class='text-right'>
                                                                            {_.stock}
                                                                        </td>
                                                                        <td class='text-right'>
                                                                            {_?.appro}
                                                                        </td>
                                                                        <td class='text-right'>
                                                                            {dailyDoc.closed == false ? 'en attente...' : Math.abs(_?.finalStock - (_?.appro + _.stock))}
                                                                        </td>
                                                                        <td class='text-right'>
                                                                            {dailyDoc.closed == false ? 'en attente...' : _?.finalStock}
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                            }

                                                        </tbody>
                                                    </table>
                                                    <div class='text-center'>
                                                        {
                                                            dailyStock.length > 5 &&
                                                            <Chip
                                                                label="Voir plus"
                                                                onClick={handleClickOpen}
                                                                sx={{ paddingX: 10 }}
                                                                color="success" variant="outlined"
                                                            />
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-4 col-md-12 col-12 col-sm-12">
                                        <div class="card">
                                            <div class="card-header">
                                                <h4>Recettes des Livreurs</h4>
                                            </div>
                                            <div class="card-body overflow" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                                <ul class="list-unstyled list-unstyled-border user-list">
                                                    {
                                                        sellers.length > 0 || dailyOrders.filter(el => el.delivered == true).length > 0 ?
                                                            employee.map((_, i) => (
                                                                (dailyOrders.filter(el => el.deliverer == _.id)?.reduce((accumulator, currentValue) => accumulator + currentValue.amountToPaid, 0)) +
                                                                    (sellers.filter(el => el.employeeId == _.id && el.closed == true)?.reduce((accumulator, currentValue) => accumulator + currentValue.toPaid, 0)) > 0 ?
                                                                    <LiDelivererCard item={_} />
                                                                    :
                                                                    <></>
                                                            ))
                                                            :
                                                            <div class='text-center h6 w-100 text-bold'> Aucune donnée à afficher</div>

                                                    }
                                                    {
                                                        dailyOrders.filter(el => el.delivered == true && el.deliverer == 'aucun')?.reduce((accumulator, currentValue) => accumulator + currentValue.amountToPaid, 0) > 0 &&
                                                        <li class="media hoverable" >
                                                            <img alt="image" src={'https://firebasestorage.googleapis.com/v0/b/kilombo-f0e07.appspot.com/o/user.png?alt=media&token=82fd2c11-a8cf-4da6-9ef9-d7422bb27292&_gl=1*1t1hyjk*_ga*MzU1MTQ2MzgxLjE2NjI4Mzc4ODE.*_ga_CW55HF8NVT*MTY4NjI4NTc2MC45My4xLjE2ODYyOTE4MDMuMC4wLjA.'}
                                                                class="mr-3 user-img-radious-style user-list-img" />
                                                            <div class="media-body">
                                                                <div class="mt-0 font-weight-bold text-uppercase">Magasin</div>
                                                                <div class="text-small">
                                                                    {
                                                                        (dailyOrders.filter(el => el.delivered == true && el.deliverer == 'aucun')?.reduce((accumulator, currentValue) => accumulator + currentValue.amountToPaid, 0))
                                                                    }FCFA
                                                                </div>
                                                            </div>
                                                        </li>
                                                    }
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class='row'>
                                    <div class="col-lg-12 col-md-12 col-12 col-sm-12">
                                        <div class="card">
                                            <div class="card-header">
                                                <h4>Ventes journalières</h4>
                                            </div>
                                            <div class="card-body" id="top-5-scroll">
                                                <div class="table-responsive">
                                                    <table class="table table-md table-hover table-striped">
                                                        <thead>
                                                            <tr>
                                                                <th>#</th>
                                                                <th >N° de facture</th>
                                                                <th class=''>Client</th>
                                                                <th >Montant</th>
                                                                {user.accountType === 'admin' && <th>Marge directe</th>}
                                                                <th>Date</th>
                                                                <th>Livreur</th>
                                                                <th class='text-center'>Statut</th>
                                                                <th>Actions</th>
                                                            </tr>
                                                        </thead>
                                                        {
                                                            dailyOrders.length > 0 ?
                                                                <tbody>
                                                                    {
                                                                        dailyOrders.map((_, i) => (
                                                                            <tr key={i}>
                                                                                <td>{i + 1}</td>
                                                                                <td>
                                                                                    {_.invoiceNum}
                                                                                </td>
                                                                                <td class='text-bold text-uppercase'><strong>{_.customerName}</strong></td>
                                                                                <td >
                                                                                    <strong>{_.amountToPaid}</strong>
                                                                                </td>
                                                                                {
                                                                                    user.accountType === 'admin' &&
                                                                                    <td >
                                                                                        <strong>{_.directProfit}</strong>
                                                                                    </td>
                                                                                }
                                                                                <td>
                                                                                    {moment(_.createdAt).format("DD-MM-YYYY • HH:mm")}
                                                                                </td>
                                                                                <td class='text-bold text-uppercase'>
                                                                                    {
                                                                                        _.deliverer !== 'aucun' ?
                                                                                            employee.find(el => el.id === _.deliverer)?.name
                                                                                            :
                                                                                            'none'
                                                                                    }
                                                                                </td>
                                                                                <td class='text-center'>
                                                                                    {
                                                                                        _.delivered == true ?
                                                                                            <div class="badge badge-success">Livrée</div>
                                                                                            :
                                                                                            <div class="badge badge-primary">Non livrée</div>
                                                                                    }
                                                                                </td>
                                                                                <td>
                                                                                    <IconButton href={`orders/orderdetails/${_.id}`} color='primary' aria-label="delete" size="small">
                                                                                        <VisibilityIcon fontSize="inherit" />
                                                                                    </IconButton>
                                                                                </td>
                                                                            </tr>
                                                                        ))
                                                                    }
                                                                </tbody>
                                                                :
                                                                <div class='text-center h6 w-100 text-bold'> Aucune donnée à afficher</div>
                                                        }

                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <Settings />
                    </div>
                </div>
            </div >
        </div >
    )
}
