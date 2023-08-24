import React, { useEffect, useRef, useState } from 'react'
import Sidebar from '../sidebar/sidebar'
import Settings from '../settings/settings'
import {
    AlertTitle, Autocomplete, Backdrop, Button, ButtonGroup, CircularProgress, Dialog,
    DialogActions, DialogContent, DialogContentText,
    DialogTitle, IconButton, Slide, Snackbar, TextField
} from '@mui/material'
import { useStateValue } from '../../components/stateProvider'
import { DataGrid } from '@mui/x-data-grid'
import { onlyNumberTest } from '../../components/functions/regex'
import DeleteIcon from '@mui/icons-material/Delete';
import ModeIcon from '@mui/icons-material/Mode';
import { CancelOutlined, Save, SaveAlt } from '@mui/icons-material'
import MuiAlert from '@mui/material/Alert';
import {
    addDoc, collection, doc, getDocs, increment,
    orderBy, serverTimestamp, updateDoc, where
} from 'firebase/firestore'
import { db } from '../../firebase'
import moment from 'moment'

function SlideTransition(props) {
    return <Slide {...props} direction="left" />;
}
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function Inventory() {

    const [{ stock, parfum, refresh, user }, dispatch] = useStateValue()

    const [data, setData] = useState(null);
    const [value, setValue] = React.useState(null);
    const [inputValue, setInputValue] = React.useState('');
    const [article, setArticle] = useState(null)
    const [rowData, setRowData] = useState([]);
    const [rowSelectionModel, setRowSelectionModel] = React.useState([])
    const [qty, setQty] = useState('')
    const [inventData, setInventData] = useState(null);
    const [open, setOpen] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [modifiedQty, setmodifiedQty] = useState('');
    const [loading, setLoading] = useState(false);
    const [states, setStates] = useState({
        variant: '',
        message: '',
        title: ''
    })

    useEffect(() => {
        document.title = 'Inventaire'
    }, [])

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
        setData([
            ...data,
            ...parfumModified
        ])
    }, [refresh])

    const rows = rowData.map((item, i) => {
        const data = item;
        const key = (i + 1)
        return { ...data, key }
    })

    const columns = [
        { field: 'key', headerName: '#', type: 'number', width: 40 },
        { field: 'productId', headerName: 'Code Produit', type: 'text', width: 200 },
        { field: 'nom', type: 'text', headerName: 'Nom du produit', width: 200 },
        { field: 'stock', text: 'text', headerName: 'Sock initial', type: 'number', width: 100 },
        {
            field: 'qty',
            headerName: 'Quantité entrée',
            type: 'number',
            width: 150
        },
        {
            field: 'diff',
            headerName: 'Ecart',
            width: 150,
            type: 'number',
            valueGetter: (params) =>
                params.row.qty - params.row.stock,
        }
    ];

    const inputQtyRef = useRef(null)

    const handleClickAdd = () => {
        console.log(moment(inventData[0]?.createdAt.toDate()).format('YYYY-MM-DD'))
        if (moment(inventData[0]?.createdAt.toDate()).format('YYYY-MM-DD') == moment().format("YYYY-MM-DD")) {
            return handleClickAlert('error', 'Erreur', "Un inventaire a déja été fait aujourd'hui")
        }
        if (qty === article.stock) {
            return handleClickAlert('error', 'Erreur', 'La quantité ajoutée ne peut pas etre égale au stock ')
        }
        if (rowData.findIndex(el => el.productCode === article.productCode) > -1) {
            return handleClickAlert('error', 'Erreur', 'Cet article existe déja')
        }
        setValue(null)
        setQty('')
        setArticle(null)
        setRowData([...rowData, { ...article, qty: qty }])
    }

    const handleClickSave = () => {
        setRowData(rowData.map((el) => (el.productCode === rowSelectionModel[0] ? { ...el, qty: modifiedQty } : el)))
        setRowSelectionModel([])
        setOpenDialog(false)
    }

    const handleClickSaveInvent = async () => {
        try {
            if (rowData.length < 1) {
                return handleClickAlert('error', 'Erreur', 'Ajoutez un article')
            }
            setLoading(true)
            const docRefInv = await addDoc(collection(db, "history"), {
                createdAt: serverTimestamp(),
                userId: user.userId,
                type: 'inventory',
                enterprise: user.enterprise
            });
            for (let i = 0; i < rowData.length; i++) {
                const item = rowData[i];
                const docRef = doc(db, 'stock', item.productCode);
                if (item.hasParfum) {
                    await updateDoc(doc(db, 'parfum', `${item.productCode}-${item.productParfum}`), {
                        stock: parseInt(item.qty),
                        updateAt: serverTimestamp()
                    });
                    await updateDoc(docRef, {
                        stock: increment(parseInt(item.qty - item.stock)),
                        updateAt: serverTimestamp()
                    });
                } else {
                    await updateDoc(docRef, {
                        stock: parseInt(item.qty),
                        updateAt: serverTimestamp()
                    });
                }
                await addDoc(collection(db, "inventoryHistory"), {
                    article: item.nom,
                    articleId: item.id,
                    inventId: docRefInv.id,
                    initialStock: item.stock,
                    finalStock: item.qty
                });
            }
            dispatch({
                type: 'REFRESH',
                payload: true
            })
            setTimeout(() => {
                window.location.reload()
            }, 3000);
            setLoading(false)
            return handleClickAlert('success', 'Succès', 'Inventaire enregistrer avec succès')
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const getData = async () => {
            const querySnapshot = await getDocs(collection(db, "history"), where('type', '==', 'inventory'), orderBy('createdAt', 'desc'),)
            let result = querySnapshot.docs.map((obj) => {
                const data = obj.data()
                const id = obj.id
                return { ...data, id }
            })
            setInventData(result)
        }
        getData()
    }, []);

    const handleClickAlert = (variant, title, msg) => {
        setOpen(true);
        setStates({
            ...states,
            ['variant']: variant,
            ['message']: msg,
            ['title']: title
        })
    };

    const handleClickDelete = () => {
        if (rowSelectionModel.length < 1) {
            return handleClickAlert('error', 'Erreur', 'selectionnez un article')
        }
        setRowData(rowData.filter(el => {
            return !rowSelectionModel.includes(el.productCode)
        }))
    }

    if (data === null || inventData === null) return <div class="loader"></div>

    return (
        <div>
            <div id="app">
                <div class="main-wrapper main-wrapper-1">
                    <Snackbar
                        TransitionComponent={SlideTransition}
                        transitionDuration={200}
                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                        open={open}
                        autoHideDuration={5000}
                        onClose={() => setOpen(false)}
                    >
                        <Alert onClose={() => setOpen(false)} severity={states.variant} sx={{ maxWidth: '400px' }}>
                            <AlertTitle>{states.title}</AlertTitle>
                            {states.message}
                        </Alert>
                    </Snackbar>
                    <div class="navbar-bg"></div>
                    <Sidebar />
                    <div class="main-content">
                        <Backdrop
                            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                            open={loading}
                        >
                            <CircularProgress color="primary" />
                        </Backdrop>
                        <section class="section">
                            <div class="section-body">
                                <div class='row'>
                                    <div class='col-12'>
                                        <div class='card'>
                                            <div class="card-header">
                                                <h4>Inventaire</h4>
                                                <div div class="card-header-action">
                                                    <a href="/stock/inventory/history" data-toggle="tooltip" data-placement="top" title="Historique d'approvisionement" class="btn btn-icon btn-warning mx-1">
                                                        Historique d'inventaire{' '}
                                                        <i class="fas fa-history"></i>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <div class='card'>
                                            <div class="card-header">
                                                <h4>Nouvel Inventaire</h4>
                                            </div>
                                            <div class="card-body">
                                                <h5 className='text-danger'>
                                                    NB: Les inventaires ne se font qu'une fois par jour
                                                </h5>
                                                <div class='row mt-5' style={{ rowGap: '10px' }}>
                                                    <div class='col-lg-3 col-md-12 col-sm-12'>
                                                        <Autocomplete
                                                            value={value}
                                                            onChange={(event, newValue) => {
                                                                setValue(newValue);
                                                                setArticle(data.find(el => el.nom === newValue))
                                                                inputQtyRef.current.focus()
                                                            }}
                                                            inputValue={inputValue}
                                                            onInputChange={(event, newInputValue) => {
                                                                setInputValue(newInputValue);
                                                            }}
                                                            fullWidth
                                                            id="controllable-states-demo"
                                                            options={data.map((el) => el.nom)}
                                                            sx={{ width: 300 }}
                                                            renderInput={(params) => <TextField {...params} fullWidth size='small' label="Sélectionnez un article" />}
                                                        />
                                                    </div>
                                                    <div class='col-lg-3 col-md-12 col-sm-12'>
                                                        <TextField
                                                            size='small'
                                                            value={!article ? '' : article.stock}
                                                            disabled
                                                            fullWidth
                                                            label={'Stock'}
                                                            id="margin-none"
                                                        />
                                                    </div>
                                                    <div class='col-lg-3 col-md-12 col-sm-12'>
                                                        <TextField
                                                            size='small'
                                                            fullWidth
                                                            type='number'
                                                            ref={inputQtyRef}
                                                            value={qty}
                                                            onChange={(e) => {
                                                                if (onlyNumberTest(e.target.value)) {
                                                                    setQty(e.target.value)
                                                                }
                                                            }}
                                                            label={'Nouveau stock'}
                                                            id="margin-none"
                                                        />
                                                    </div>
                                                    <div class='col-lg-3 col-md-12 col-sm-12'>
                                                        {
                                                            qty == '' || qty < 1 || !article ?
                                                                <Button
                                                                    disabled
                                                                    variant='outlined'
                                                                    fullWidth
                                                                >
                                                                    Ajouter
                                                                </Button>
                                                                :
                                                                <Button
                                                                    variant='outlined'
                                                                    fullWidth
                                                                    onClick={handleClickAdd}
                                                                >
                                                                    Ajouter
                                                                </Button>
                                                        }
                                                    </div>
                                                </div>
                                                <div class='row pb-2'>
                                                    <div class='col-12 my-5'>
                                                        <div class='col-2 rounded-pill my-1 border border-2'>
                                                            <ButtonGroup variant="outlined" aria-label="outlined button group">
                                                                <IconButton
                                                                    onClick={() => {
                                                                        if (rowSelectionModel.length !== 1) {
                                                                            return handleClickAlert('error', 'Erreur', 'selectionnez un article')
                                                                        }
                                                                        setmodifiedQty(rowData.find(el => el.productCode === rowSelectionModel[0])?.qty)
                                                                        setOpenDialog(true)
                                                                    }}
                                                                    color='info'
                                                                >
                                                                    <ModeIcon />
                                                                </IconButton>
                                                                <IconButton
                                                                    onClick={handleClickDelete}
                                                                    color='error'> <DeleteIcon /></IconButton>
                                                                <IconButton
                                                                    onClick={handleClickSaveInvent}
                                                                    color='success'> <Save /></IconButton>
                                                                <IconButton color='warning'> <CancelOutlined /></IconButton>
                                                            </ButtonGroup>
                                                        </div>
                                                        <div class='my-2'>
                                                            <DataGrid
                                                                rows={rows}
                                                                columns={columns}
                                                                onRowSelectionModelChange={(newRowSelectionModel) => {
                                                                    setRowSelectionModel(newRowSelectionModel)
                                                                }}
                                                                rowSelectionModel={rowSelectionModel}
                                                                checkboxSelection
                                                                disableColumnFilter
                                                                disableColumnMenu
                                                                initialState={{
                                                                    pagination: {
                                                                        paginationModel: { page: 0, pageSize: 10 },
                                                                    },
                                                                }}
                                                                pageSizeOptions={[5, 10, 15]}
                                                            />
                                                        </div>
                                                    </div>
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
            </div>
            <Dialog
                open={openDialog}
                TransitionComponent={Transition}
                keepMounted
                // onClose={() => setOpenDialog(false)}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Modifier l'article"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        <TextField
                            size='small'
                            value={rowData.find(el => el.productCode === rowSelectionModel[0])?.nom}
                            disabled
                            fullWidth
                            margin='dense'
                            // label={'Article'}
                            id="margin-none"
                        />
                        <TextField
                            size='small'
                            value={rowData.find(el => el.productCode === rowSelectionModel[0])?.stock}
                            disabled
                            fullWidth
                            margin='dense'
                            // label={'Stock'}
                            id="margin-none"
                        />
                        <TextField
                            size='small'
                            fullWidth
                            type='number'
                            value={modifiedQty}
                            margin='dense'
                            onChange={(e) => {
                                if (onlyNumberTest(e.target.value)) {
                                    setmodifiedQty(parseInt(e.target.value))
                                }
                            }}
                            label={'Nouveau stock'}
                            id="margin-none"
                        />
                        <TextField
                            size='small'
                            value={rowData.find(el => el.productCode === rowSelectionModel[0])?.qty - rowData.find(el => el.productCode === rowSelectionModel[0])?.stock}
                            disabled
                            fullWidth
                            margin='dense'
                            label={'Ecart'}
                            id="margin-none"
                        />
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color='error' onClick={() => setOpenDialog(false)}>Annuler</Button>
                    <Button onClick={handleClickSave}>Enregistrer</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
