import React, { useEffect, useRef, useState } from 'react'
import Sidebar from '../sidebar/sidebar'
import Settings from '../settings/settings'
import { stock as data, product } from '../../database'
import { useStateValue } from '../../components/stateProvider'
import CurrencyFormat from 'react-currency-format';
import { addDoc, collection, doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { AlertTitle, Backdrop, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide, Snackbar, Typography, useMediaQuery, useTheme } from '@mui/material'
import MuiAlert from '@mui/material/Alert';
import { getRandomNumber } from '../../components/functions/randomNumber'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function SlideTransition(props) {
    return <Slide {...props} direction="left" />;
}

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function NewIncome() {

    useEffect(() => {
        document.title = 'Nouvelle Facture'
    }, [])

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const [{ customerInfo, stock, products, parfum }, dispatch] = useStateValue()

    const [articles, setArticles] = useState([])
    const [des, setDes] = useState(null)
    const [qty, setQty] = useState(0)
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false)
    const [loading1, setLoading1] = useState(true)
    const [active, setActive] = useState(false)
    const [stockInit, setStockInit] = useState([])
    const [stocks, setStocks] = useState([])
    const [customerPrice, setCustomerPrice] = useState(null)
    const [indexn, setIndex] = useState(null)
    const inputRef = useRef()
    const inputQtyRef = useRef()
    const containerRef = useRef()
    const [modalOpened, setModalOpened] = useState(false)
    const [productPrice, setProductPrice] = useState(null)

    const [states, setStates] = useState({
        variant: '',
        message: '',
        title: ''
    })

    const handleClick = e => {
        e.preventDefault()
        const index = articles.findIndex(
            (item) => item.nom === des.nom
        );
        if (index >= 0) {
            if ((articles[index].qty + qty) > des.stock) {
                return handleClickAlert('error', 'Erreur', `Vous n'avez pas assez de produit en stock`)
            }
            setArticles(articles.map(x => (x.id === des.id ? { ...x, qty: x.qty + qty } : x)))
        } else {
            if (des.stock < qty) {
                return handleClickAlert('error', 'Erreur', `Vous n'avez pas assez de produit en stock`)
            }
            if (customerInfo.type) {
                let price = productPrice ? des.pv[productPrice].pv : des.pv[0].pv
                if (productPrice != null && qty < des.pv[productPrice].qty) {
                    return handleClickAlert('error', 'Erreur', `La quantité minimale pour ce prix est de ${des.pv[productPrice].qty}`)
                }
                if (productPrice == null && qty < des.pv[0].qty) {
                    return handleClickAlert('error', 'Erreur', `La quantité minimale pour ce prix est de ${des.pv[0].qty}`)
                }
                setArticles([...articles, {
                    ...des,
                    qty: qty,
                    pu: price
                }])
                setDes(null)
                setQty('')
                return
            }
            setArticles([...articles, {
                ...des,
                qty: qty,
                pu: customerPrice[`price${des.productCode}`] ? customerPrice[`price${des.productCode}`] : pv(indexn).pv
            }])
        }
        setDes(null)
        setQty('')
    }

    const deleteArticle = (nom) => {
        setArticles(articles.filter(item => item.nom !== nom))
    }

    const handleClickAlert = (variant, title, msg) => {
        setOpen(true);
        setStates({
            ...states,
            ['variant']: variant,
            ['message']: msg,
            ['title']: title
        })
    };

    const handleDes = e => {
        setDes(e.target.value)
    }

    const addInvoice = async () => {
        let invoiceNum = getRandomNumber(8)
        setLoading(true)
        for (let i = 0; i < articles.length; i++) {
            const el = articles[i];
            if (el.productParfum) {
                let productRef = doc(db, "stock", el.id);
                await updateDoc(productRef, {
                    stock: el.stock - el.qty,
                    already: el.already + el.qty
                });
                productRef = doc(db, 'parfum', `${el.id}-${el.productParfum}`)
                await updateDoc(productRef, {
                    stock: el.stock - el.qty
                });
            } else {
                const productRef = doc(db, "stock", el.id);
                await updateDoc(productRef, {
                    stock: el.stock - el.qty,
                    already: el.already + el.qty
                });
            }
        }
        const docRef = await addDoc(collection(db, "invoices"), {
            invoiceNum: invoiceNum,
            customerId: customerInfo.type ? customerInfo.type : customerInfo.id,
            customerName: customerInfo.nom,
            createdAt: serverTimestamp(),
            delivered: false
        });
        articles.forEach(async (el) => {
            if (el.hasParfum) {
                const docRefProducts = await addDoc(collection(db, "invoicesProduct"), {
                    invoiceId: docRef.id,
                    productId: el.id,
                    nom: el.nom,
                    parfum: el.productParfum,
                    qty: el.qty,
                    price: el.pu,
                    invoiceNum: invoiceNum
                });
            } else {
                const docRefProducts = await addDoc(collection(db, "invoicesProduct"), {
                    invoiceId: docRef.id,
                    productId: el.id,
                    nom: el.nom,
                    parfum: null,
                    qty: el.qty,
                    price: el.pu,
                    invoiceNum: invoiceNum
                });
            }
        })

        dispatch({
            type: 'REFRESH',
            payload: true
        })
        setLoading(false)
        window.location.reload()
    }

    function liClicked(e, i) {
        setProductPrice(null)
        setDes(e)
        setIndex(i)
        setActive(!active)
        setStocks(stockInit)
        console.log(e)
        inputRef.current.value = ''
        inputQtyRef.current.focus()
    }

    const pv = (i) => {
        if (stocks[i].pv[customerInfo.priceCat]) {
            return stocks[i].pv[customerInfo.priceCat]
        } else if (stocks[i].pv[customerInfo.priceCat - 1]) {
            return stocks[i].pv[customerInfo.priceCat - 1]
        } else if (stocks[i].pv[customerInfo.priceCat - 2]) {
            return stocks[i].pv[customerInfo.priceCat - 2]
        } else {
            return 'price do not exist'
        }
    }

    useEffect(() => {
        let productCode = parfum.map(function (el) {
            return el.productCode
        })
        let data = [...stock]
        for (let i = 0; i < productCode.length; i++) {
            const el = productCode[i];
            data = data.filter(e => e.productCode !== el)
        }
        let parfumModified = parfum.map(el => {
            const data = stock.find(e => e.id == el.productCode)
            const nom = `${data.nom}-${el.parfumName}`
            const productParfum = el.parfumName
            const stockP = el.stock
            return { ...data, nom: nom, stock: stockP, productParfum: productParfum }
        })
        data = data.filter(el => el.hasParfum !== true)

        setStockInit([
            ...data,
            ...parfumModified
        ])
        setStocks([
            ...data,
            ...parfumModified
        ])
    }, [])


    useEffect(() =>
        async () => {
            if (customerInfo.type) {
                setCustomerPrice([])
                setLoading1(false)
                return
            }
            const docRef = doc(db, "customerPrice", customerInfo.id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setCustomerPrice(docSnap.data())
                setLoading1(false)
            } else {
                setCustomerPrice([])
                setLoading1(false)
            }
        }, [])

    function bodyClicked() {
        if (active) {
            setActive(false)
        }
    }

    function sumArray(array) {
        let sum = 0
        for (let i = 0; i < array.length; i += 1) {
            sum += array[i].qty
        }
        return sum
    }

    const handleModify = (e) => {
        setDes(e)
        setQty(e.qty)
        setArticles(articles.filter(item => item.nom !== e.nom))
    }

    function productOfArray(array) {
        let sum = 0
        for (let i = 0; i < array.length; i += 1) {
            sum += (array[i].qty * array[i].pu)
        }
        return sum
    }


    function buttonClicked() {
        setActive(!active)
        if (active) {
            inputRef.current.value = ''
            setStocks(stockInit)
        }
        if (!active) {
            setTimeout(() => {
                inputRef.current.focus()
            }, 50);
        }
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };



    const handleChange = (e) => {
        const newData = stockInit.filter(item => {
            const itemData = `${item.productCode.toUpperCase()} ${item.nom.toUpperCase()}`;
            const textData = e.target.value.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        setStocks(newData)
    }

    const handleChangeNum = (e) => {
        const regex = /^[0-9\b]+$/;
        if (e.target.value === "" || regex.test(e.target.value)) {
            setQty(parseFloat(e.target.value));
        }
    };

    if (stockInit.length < 1) {
        return <div class="loader"></div>
    }

    return (
        <div>
            <div id="app" onClick={bodyClicked}>
                <Snackbar
                    TransitionComponent={SlideTransition}
                    transitionDuration={200}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    open={open} autoHideDuration={5000} onClose={handleClose}
                >
                    <Alert onClose={handleClose} severity={states.variant} sx={{ maxWidth: '400px' }}>
                        <AlertTitle>{states.title}</AlertTitle>
                        {states.message}
                    </Alert>
                </Snackbar>
                <Dialog
                    fullScreen={fullScreen}
                    open={modalOpened}
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogTitle id="responsive-dialog-title">
                        {"Use Google's location service?"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Let Google help apps determine location. This means sending anonymous
                            location data to Google, even when no apps are running.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus onClick={handleClose}>
                            Disagree
                        </Button>
                        <Button onClick={handleClose} autoFocus>
                            Agree
                        </Button>
                    </DialogActions>
                </Dialog>
                <div class="main-wrapper main-wrapper-1">
                    <Sidebar />
                    <div class="main-content">
                        <Backdrop
                            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                            open={loading}
                        >
                            <CircularProgress color="primary" />
                            <Typography color={'#000'}>Création de la facture</Typography>
                        </Backdrop>
                        <div class='col-12' style={{ display: 'flex', justifyContent: "center", alignItems: 'center' }}>

                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-11">
                                <div class="card" style={{ position: 'relative' }}>
                                    <div class="card-header ">
                                        <div class='col-12 d-flex' style={{ justifyContent: 'space-between' }}>
                                            <h5 class='text-left'>
                                                Nouvelle Facture <span class='h6'>• </span> {customerInfo.nom}
                                            </h5>
                                            {
                                                articles.length > 0 ?
                                                    <Button color='primary' variant='outlined' endIcon={<ArrowForwardIosIcon />} onClick={addInvoice}>Continuer</Button>
                                                    :
                                                    <Button color='primary' variant='outlined' disabled endIcon={<ArrowForwardIosIcon />}>Continuer</Button>
                                            }
                                        </div>
                                    </div>
                                    <div class="chat-box" id="mychatbox">
                                        <div class="card-body chat-content">
                                            <table class="table table-sm table-striped">
                                                <thead >
                                                    <tr>
                                                        <th scope="col">#</th>
                                                        <th scope="col">Article</th>
                                                        <th scope="col">P.U</th>
                                                        <th scope="col" style={{ textAlign: 'right' }}>Qte</th>
                                                        <th scope="col" style={{ textAlign: 'right' }}>Total</th>
                                                        <th scope="col" style={{ textAlign: 'center' }}>Actions</th>
                                                    </tr>
                                                </thead>
                                                {articles.length > 0 ?
                                                    <tbody ref={containerRef}>
                                                        {
                                                            articles.map((item, i) => (
                                                                <Slide direction="up" in={item.nom} timeout={200} container={containerRef.current} mountOnEnter unmountOnExit>
                                                                    <tr>
                                                                        <th scope="row">{i + 1}</th>
                                                                        <td>{item.nom}</td>
                                                                        <td>{item.pu}</td>
                                                                        <td class='text-right'>{item.qty}</td>
                                                                        <td class='text-right'>{item.qty * item.pu}</td>
                                                                        <td class='text-center'>
                                                                            <a style={{ cursor: 'pointer' }} onClick={() => handleModify(item)} class="mr-2 text-success"><i class="far fa-edit"></i></a>
                                                                            <a style={{ cursor: 'pointer' }} data-toggle="modal"
                                                                                data-target={`#exampleModalCenter${item.id}`} class=" text-danger"><i class="fas fa-trash"></i></a>
                                                                        </td>
                                                                    </tr>
                                                                </Slide>
                                                            ))
                                                        }
                                                        <tr >
                                                            <th scope="row"></th>
                                                            <td></td>
                                                            <th scope="row">
                                                                <div class='mt-2'></div>
                                                                Total
                                                                <div class='mt-2'></div>
                                                            </th>
                                                            <th scope="row" style={{ textAlign: 'right' }}>
                                                                <div class='mt-2'></div>
                                                                <CurrencyFormat value={sumArray(articles)} displayType={'text'} thousandSeparator={true} prefix={''} />
                                                                <div class='mt-2'></div>
                                                            </th>
                                                            <th scope="row" style={{ textAlign: 'right' }}>
                                                                <div class='mt-2'></div>
                                                                <CurrencyFormat value={productOfArray(articles)} displayType={'text'} thousandSeparator={true} prefix={'XAF'} />
                                                                <div class='mt-2'></div>
                                                            </th>
                                                            <td class='text-center'>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                    :
                                                    <div
                                                        class='h5 text-center'
                                                        style={{ position: 'absolute', top: '30vh', left: '39vh' }}
                                                    >
                                                        Veuillez ajouter des articles à cette facture
                                                    </div>
                                                }
                                            </table>
                                        </div>

                                        <div class="card-footer ">
                                            <form class={`form-inline ${active && 'active'}`} style={{ justifyContent: 'space-between' }}>
                                                <div class="col-lg-3 col-md-3 col-sm-6 mb-1 input-select-item">
                                                    <div class={`select-options`}>
                                                        <div class="search">
                                                            <input ref={inputRef} spellcheck="false" onChange={(e) => handleChange(e)} class="form-input" type="text" placeholder="Search" />
                                                        </div>
                                                        <ul class='ul-options'>
                                                            {
                                                                stocks.length > 0 ?
                                                                    stocks.map((item, index) => (
                                                                        <li
                                                                            class={`hoverable ${des != null ? item.nom == des.nom && 'selected' : ''}`}
                                                                            key={index}
                                                                            onClick={() => liClicked(item, index)}
                                                                        >
                                                                            {item.hasParfum == true ? item.nom : products.find(el => el.id == item.productCode).nom}
                                                                        </li>
                                                                    ))
                                                                    :
                                                                    <li style={{ textAlign: 'center', cursor: 'text' }}>Aucun article correspondant</li>
                                                            }
                                                        </ul>
                                                    </div>
                                                    <div onClick={buttonClicked} class='select-title'>
                                                        <span>
                                                            {des == null ?
                                                                'Sélectionnez un article'
                                                                :
                                                                `${des.hasParfum == true ? des.nom : products.find(el => el.id == des.productCode).nom}`
                                                            }
                                                        </span>
                                                        <i class='fas fa-chevron-up checked'></i>
                                                    </div>
                                                </div>
                                                <input
                                                    type="text" disabled
                                                    class="form-control col-lg-2 col-md-2 mb-1 col-sm-6 disabled"
                                                    id="inlineFormInputName2"
                                                    placeholder="Stock" value={des != null ? des.stock : 'stock'
                                                    }
                                                />
                                                {
                                                    customerInfo.type ?
                                                        des ?
                                                            <select onChange={(e) => setProductPrice(e.target.value)} class="form-control col-lg-2 col-md-3 col-sm-6 mb-1">
                                                                {
                                                                    des.pv.map((el, i) => (
                                                                        <option class='py-1 h6' selected={i == 0 ? true : false} value={i}>{el.pv}</option>
                                                                    ))
                                                                }
                                                            </select>
                                                            :
                                                            <input
                                                                type="text" disabled
                                                                class="form-control col-lg-2 col-md-2 mb-1 col-sm-6 disabled"
                                                                id="inlineFormInputName2"
                                                                placeholder="selectionnez un article"
                                                            />
                                                        :
                                                        <input
                                                            type="text" disabled
                                                            class="form-control col-lg-2 col-md-3 col-sm-6 mb-1 disabled"
                                                            id="inlineFormInputName2"
                                                            placeholder="Prix"
                                                            value={des != null ? customerPrice[`price${des.productCode}`] ? customerPrice[`price${des.productCode}`] : pv(indexn).pv : 'prix'}
                                                        />
                                                }
                                                <input type="number" ref={inputQtyRef} class="form-control col-lg-2 col-md-2 col-sm-6 mb-1" id="inlineFormInputName2"
                                                    placeholder="quantité" max={des != null ? des.stock : 0} value={qty} onChange={handleChangeNum} />
                                                {
                                                    des != null && qty > 0 ?
                                                        <button class='col-lg-2 btn btn-success' onClick={handleClick}> Ajouter</button>
                                                        :
                                                        <button class="col-lg-2 btn btn-secondary pe-none" type="button" disabled>Ajouter</button>
                                                }
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Settings />
                        <Backdrop
                            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                            open={loading1}
                        >
                            <CircularProgress color="primary" />
                        </Backdrop>
                        {
                            articles.map((i, index) => (
                                <div class="modal fade" id={`exampleModalCenter${i.id}`} tabindex="-1" role="dialog"
                                    aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                                    <div class="modal-dialog modal-dialog-centered" role="document">
                                        <div class="modal-content">
                                            {/* <div class="modal-header">
                                        <h5 class="modal-title" id="exampleModalCenterTitle">Modal title</h5>
                                    </div> */}
                                            <div class="modal-body">
                                                <h6>
                                                    Voulez-vous vraiment supprimer <span class='text-dark '>"{i.nom}"</span> de cette facture ?
                                                </h6>
                                            </div>
                                            <div class="modal-footer bg-whitesmoke br">
                                                <button type="button" data-dismiss="modal" onClick={() => deleteArticle(i.nom)} class="btn btn-danger">Supprimer</button>
                                                <button type="button" class="btn btn-info" data-dismiss="modal">Annuler</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div >
        </div >
    )
}
