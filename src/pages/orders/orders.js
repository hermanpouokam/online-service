import React, { useEffect, useState } from 'react'
import Settings from '../settings/settings'
import Sidebar from '../sidebar/sidebar'
import {
    AppBar, Autocomplete, Button, Card, CardHeader, Chip,
    CircularProgress,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider,
    FormControl,
    IconButton, InputLabel, List, ListItem, ListItemText, MenuItem, Pagination, Popover, Select, Slide,
    Stack, TextField, Toolbar, Typography
} from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useStateValue } from '../../components/stateProvider';
import { db } from '../../firebase';
import { collection, deleteDoc, doc, getDocs, increment, orderBy, query, updateDoc } from 'firebase/firestore';
import moment from 'moment/moment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { CheckOutlined, ClearOutlined, RemoveCircleOutline } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import { DataGrid } from '@mui/x-data-grid';
import { onlyNumberTest } from '../../components/functions/regex';
import CurrencyFormat from 'react-currency-format';
import FilterListIcon from '@mui/icons-material/FilterList';
import HistoryIcon from '@mui/icons-material/History';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


export default function Orders() {

    const navigate = useNavigate()
    const params = useParams()

    const [open, setOpen] = React.useState(false);
    const [scroll, setScroll] = React.useState('paper');
    const [{ customer, stock, parfum, employee, user, products }, dispatch] = useStateValue()
    const [inputsStates, setInputsStates] = useState({
        nom: '',
        tel: '',
        location: ''
    })
    const [filter, setFilter] = useState('tout')
    const [invoices, setInvoices] = React.useState(null)
    const [invoicesSearch, setInvoicesSearch] = useState(null)
    const [invoicesProducts, setInvoicesProducts] = useState([])
    const [value, setValue] = React.useState(null);
    const [inputValue, setInputValue] = React.useState('');
    const [page, setPage] = useState(params.id ? params.id : 1);
    const [numberPerPage, setNumberPerPage] = useState(10)

    const handleClickOpen = (scrollType) => () => {
        setOpen(true);
        setScroll(scrollType);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleChange = (event, value) => {
        const splitedUrl = window.location.href.split('?')
        if (splitedUrl[1]) {
            window.location.assign(`orders/page/${value}?${splitedUrl[1]}`)
        } else {
            window.location.assign(`orders/page/${value}`)
        }
    };

    const descriptionElementRef = React.useRef(null);


    function InvoiceCard(props) {

        const item = props.item
        const i = props.i
        const [modalOpened, setModalOpened] = useState(false)
        const [deliverer, setDeliverer] = useState('aucun')
        const [anchorEl, setAnchorEl] = React.useState(null);
        const [modified, setModified] = useState([]);
        const [modifieQty, setModifiedQty] = useState({})
        const popoverOpened = Boolean(anchorEl);
        const id = open ? 'simple-popover' : undefined;
        const [rowSelectionModel, setRowSelectionModel] = React.useState([])
        const [load, setLoad] = useState(false)
        const [open1, setOpen1] = React.useState(false);
        const [errorP, setErrorP] = React.useState(null)

        const handleClickOpen1 = () => {
            setOpen1(true);
        };

        const handleClose1 = () => {
            setErrorP(null)
            setAllPaid(pendingPaid)
            setOpen1(false);
        };

        const handleClickModalOpen = () => {
            setModalOpened(true);
        };

        const handleCloseModal = () => {
            setModalOpened(false);
        };

        const handleClick = (event) => {
            setAnchorEl(event.currentTarget);
        };

        const handleModifyQTy = async () => {
            let _remBen = 0

            for (let i = 0; i < modified.length; i++) {
                const element = modified[i];


                if (modifieQty[`qty-${element.id}`]) {
                    const qty = modifieQty[`qty-${element.id}`]
                    const productStock = stock.find(item => item.id === element.productId)
                    const qtyToSet = element.qty - parseInt(qty)
                    if (element.parfum !== null) {
                        const parfumStock = parfum.find(item => item.id === `${element.productId}-${element.parfum}`)
                        if (qtyToSet < 0 && parfumStock.stock < qtyToSet) {
                            return alert(`vous n'avez pas assez  de ${element.nom} en stock`)
                        }
                        let productRef = doc(db, "stock", element.productId);
                        let invoiceProductRef = doc(db, "invoicesProduct", element.id);
                        await updateDoc(productRef, {
                            stock: increment(qtyToSet),
                            already: increment(-qtyToSet)
                        });
                        productRef = doc(db, 'parfum', `${element.productId}-${element.parfum}`)
                        await updateDoc(productRef, {
                            stock: increment(qtyToSet),
                            already: increment(-qtyToSet)
                        });
                        await updateDoc(invoiceProductRef, {
                            qty: qty,
                        });

                    } else {
                        if (qtyToSet < 0 && productStock.stock < qtyToSet) {
                            return alert(`vous n'avez pas assez de ${element.nom} en stock`)
                        }
                        const productRef = doc(db, "stock", element.productId);
                        await updateDoc(productRef, {
                            stock: increment(qtyToSet),
                            already: increment(-qtyToSet)
                        });
                        let invoiceProductRef = doc(db, "invoicesProduct", element.id);
                        await updateDoc(invoiceProductRef, {
                            qty: qty,
                        });
                    }
                }
            }
            window.location.reload()
        }

        const handleRemoveProduct = async (el) => {
            const product = stock.find(item => item.id === el.productId)
            await deleteDoc(doc(db, "invoicesProduct", el.id));
            if (el.parfum !== null) {
                const parfumP = parfum.find(item => item.id === `${el.productId}-${el.parfum}`)
                let productRef = doc(db, "stock", el.productId);
                await updateDoc(productRef, {
                    stock: product.stock + parseInt(el.qty),
                    already: product.already - el.qty
                });
                productRef = doc(db, 'parfum', `${el.productId}-${el.parfum}`)
                await updateDoc(productRef, {
                    stock: parfumP.stock + parseInt(el.qty),
                    already: product.already - el.qty
                });
            } else {
                const productRef = doc(db, "stock", el.productId);
                await updateDoc(productRef, {
                    stock: product.stock + parseInt(el.qty),
                    already: product.already - el.qty
                });;
            }
            window.location.reload()
        }
        function productOfArray(array) {
            let sum = 0
            for (let i = 0; i < array.length; i += 1) {
                sum += (array[i].qty * array[i].price)
            }
            return sum
        }
        function sumArray(array) {
            let sum = 0
            for (let i = 0; i < array.length; i += 1) {
                sum += parseInt(array[i].qty)
            }
            return sum
        }

        const columns = [
            { field: 'key', headerName: '#', type: 'number', width: 15 },
            { field: 'productId', headerName: 'Code Produit', type: 'text', width: 100 },
            { field: 'nom', type: 'text', headerName: 'Nom du produit', width: 100 },
            { field: 'qty', text: 'text', headerName: 'Quantite', type: 'number', width: 100 },
            {
                field: 'price',
                headerName: 'Prix Unitaire',
                type: 'number',
                width: 100
            },
            {
                field: 'total',
                headerName: 'Total',
                width: 100,
                type: 'number',
                valueGetter: (params) =>
                    params.row.price * params.row.qty,
            }
        ];
        const handleSelect = (data) => {
            let array = []
            for (let i = 0; i < data.length; i++) {
                const element = data[i];
                const index = array.findIndex(el => el.id === element)
                if (index >= 0) {
                    array.filter(el => el.id !== element)
                } else {
                    array.push(rows.find(el => el.id === element))
                    setModifiedQty({
                        ...modifieQty,
                        [`qty-${array[array.length - 1].id}`]: parseInt(array[array.length - 1].qty)
                    })
                }
            }
            setModified(array)
        }

        let arrayProduct = invoicesProducts.filter(el => el.invoiceNum == item.invoiceNum);

        const handleClickReceipt = async () => {
            if (allPaid > (item.amountToPaid - item.paid)) {
                return setErrorP('Le montant ne peut etre superieur à la facture.')
            }
            setLoad(true)
            try {
                let invoiceProductRef = doc(db, "invoices", item.id);
                await updateDoc(doc(db, `dailyclosure`, `${moment().format('DDMMYYYY')}`), {
                    marge: increment(arrayProduct.reduce((acc, val) => {
                        const product = products.find(el => el.id === val.productId);
                        return acc + ((val.price - product.pu) * val.qty)
                    }, 0)),
                    caisse: increment(allPaid),
                });
                await updateDoc(doc(db, `entreprise`, 'zta23TYCfjPSlR9wZf7r'), {
                    caisse: increment(allPaid),
                });
                await updateDoc(invoiceProductRef, {
                    amountToPaid: productOfArray(arrayProduct),
                    paid: parseInt(allPaid),
                    directProfit: arrayProduct.reduce((acc, val) => {
                        const product = products.find(el => el.id === val.productId);
                        return acc + ((val.price - product.pu) * val.qty)
                    }, 0),
                    deliverer,
                    delivered: true
                });
                window.location.reload()
            } catch (error) {
                setLoad(false)
            }
        }

        const handleClickSold = async () => {
            if (allPaid > (item.amountToPaid - item.paid)) {
                return setErrorP('Le montant ne peut etre superieur à la dette.')
            }
            setLoad(true)
            try {
                let invoiceProductRef = doc(db, "invoices", item.id);
                await updateDoc(doc(db, `dailyclosure`, `${moment().format('DDMMYYYY')}`), {
                    caisse: increment(allPaid),
                });
                await updateDoc(doc(db, `entreprise`, 'zta23TYCfjPSlR9wZf7r'), {
                    caisse: increment(allPaid),
                });
                await updateDoc(invoiceProductRef, {
                    paid: increment(allPaid),
                });
                window.location.reload()
            } catch (error) {
                setLoad(false)
            }
        }


        const [allPaid, setAllPaid] = useState(item.delivered ? parseInt(item.amountToPaid - item.paid) : productOfArray(arrayProduct))
        const [pendingPaid, setPendingPaid] = useState(item.delivered ? parseInt(item.amountToPaid - item.paid) : productOfArray(arrayProduct))

        const rows = arrayProduct.map((item, i) => {
            const data = item;
            const key = (i + 1)
            return { ...data, key }
        })

        return (
            <tr>
                <Dialog
                    fullScreen
                    open={modalOpened}
                    TransitionComponent={Transition}
                >
                    <AppBar color='info' sx={{ position: 'relative' }}>
                        <Toolbar>
                            <IconButton
                                edge="start"
                                color="inherit"
                                onClick={handleCloseModal}
                                aria-label="close"
                            >
                                <CloseIcon />
                            </IconButton>
                            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                                FACTURE N°{item.invoiceNum}
                            </Typography>
                            <Button color="inherit" variant='outlined' onClick={handleClickReceipt}>
                                Encaisser cette facture
                            </Button>
                        </Toolbar>
                    </AppBar>
                    <div class='row col-12'>
                        <div class='col-md-12 col-12 col-lg-3 py-2'>
                            <List>
                                <ListItem button>
                                    <ListItemText primary="Montant de la facture" secondary={<CurrencyFormat value={productOfArray(arrayProduct)} displayType={'text'} thousandSeparator={true} prefix={'XAF'} />} />
                                </ListItem>
                                <Divider />
                                <ListItem button>
                                    <ListItemText primary="Total de colis" secondary={<CurrencyFormat value={sumArray(arrayProduct)} displayType={'text'} thousandSeparator={true} />} />
                                </ListItem>
                                <Divider />
                                <ListItem data-toggle="modal" data-target="#exampleModal" button>
                                    <ListItemText primary="Avance de payment" secondary={<CurrencyFormat value={allPaid} displayType={'text'} thousandSeparator={true} prefix={'XAF'} />} />
                                </ListItem>
                                <Divider />
                                <ListItem button>
                                    <ListItemText primary="Reste à verser" secondary={<CurrencyFormat value={productOfArray(arrayProduct) - allPaid} displayType={'text'} thousandSeparator={true} prefix={'XAF'} />} />
                                </ListItem>
                                <div class="modal fade" id="exampleModal" style={{ zIndex: 999 }} tabindex="-1" role="dialog" aria-labelledby="formModal"
                                    aria-hidden="true">
                                    <div class="modal-dialog modal-dialog-centered" role="document">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h5 class="modal-title" id="formModal">Avance de payment</h5>
                                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div class="modal-body">
                                                <form class="">
                                                    <div class="form-group">
                                                        <div class="input-group">
                                                            <input type="number"
                                                                value={pendingPaid}
                                                                onChange={(e) => {
                                                                    if (onlyNumberTest(e.target.value)) {
                                                                        setPendingPaid(e.target.value)
                                                                    }
                                                                }}
                                                                pattern='[^0-9]' class="form-control" placeholder="Password" name="password"
                                                            />
                                                        </div>
                                                        {
                                                            pendingPaid > productOfArray(arrayProduct) &&
                                                            <p class='h6 text-danger'>Votre entrée est superieure au montant de la facture</p>
                                                        }
                                                    </div>
                                                </form>
                                            </div>
                                            <div class="modal-footer bg-whitesmoke br">
                                                {
                                                    pendingPaid <= productOfArray(arrayProduct) || pendingPaid !== '' ?
                                                        <button type="button" onClick={() => setAllPaid(pendingPaid)} data-dismiss="modal" class="btn btn-primary">Enregistrer</button>
                                                        :
                                                        <button type="button" disabled class="btn btn-primary pe-none">Enregistrer</button>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <Divider />
                                <Popover
                                    id={id}
                                    open={popoverOpened}
                                    anchorEl={anchorEl}
                                    onClose={() => setAnchorEl(null)}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'center',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'center',
                                    }}
                                >
                                    <Card>
                                        <CardHeader
                                            sx={{ px: 2, py: 1 }}
                                            title={'Livreurs'}
                                            subheader={`${deliverer == 'aucun' ? 'aucun' : employee.find(el => el.id === deliverer).surname} selectionné`}
                                        />
                                        <Divider />
                                        <List
                                            sx={{
                                                width: 350,
                                                height: 'auto',
                                                bgcolor: 'background.paper',
                                                overflow: 'auto',
                                            }}
                                            dense
                                            component="div"
                                            role="list"
                                        >

                                            <ListItem
                                                key={value}
                                                role="listitem"
                                                button
                                                onClick={() => { setAnchorEl(null); setDeliverer('aucun') }}
                                            >
                                                <ListItemText primary={`aucun`} />
                                            </ListItem>
                                            {
                                                employee.filter(it => it.job === 'driver' && it.cat == '1').map((el) => (
                                                    <ListItem
                                                        key={value}
                                                        role="listitem"
                                                        button
                                                        onClick={() => { setAnchorEl(null); setDeliverer(el.id) }}
                                                    >
                                                        <ListItemText primary={`${el.surname}`} />
                                                    </ListItem>
                                                ))
                                            }
                                        </List>
                                    </Card>
                                </Popover>
                                <ListItem button onClick={handleClick} aria-describedby={id} >
                                    <ListItemText primary="Livreur" secondary={deliverer == 'aucun' ? 'aucun' : employee.find(el => el.id === deliverer).surname} />
                                </ListItem>
                            </List>
                        </div>
                        <div class='col-12 col-lg-6 col-md-12 py-2 d-flex justify-content-center align-items-start'>
                            <div style={{ width: '100%', height: 'auto' }}>
                                <DataGrid
                                    rows={rows}
                                    columns={columns}
                                    onRowSelectionModelChange={(newRowSelectionModel) => {
                                        setRowSelectionModel(newRowSelectionModel)
                                        handleSelect(newRowSelectionModel)
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
                        <div class='col-md-12 col-12 col-lg-3 p-2'>
                            {
                                modified.length >= 1 && (
                                    <>
                                        {
                                            modified.map(el => (
                                                <div class='row'>
                                                    <div class='col-5'>
                                                        <TextField
                                                            fullWidth
                                                            required
                                                            margin='dense'
                                                            id="outlined-required"
                                                            value={el.nom}
                                                            label="Nom du produit"
                                                        />
                                                    </div>
                                                    <div class='col-5'>
                                                        <TextField
                                                            fullWidth
                                                            label="Quantité"
                                                            required
                                                            margin='dense'
                                                            autoComplete='off'
                                                            id="outlined-required"
                                                            onChange={(e) => {
                                                                if (onlyNumberTest(e.target.value)) {
                                                                    setModifiedQty({
                                                                        ...modifieQty,
                                                                        [`qty-${el.id}`]: e.target.value
                                                                    })
                                                                }
                                                            }}
                                                            value={modifieQty[`qty${el.id}`]}
                                                            defaultValue={el.qty}
                                                        />
                                                    </div>
                                                    <div class='col-1 d-flex justify-content-center align-items-center'>
                                                        <IconButton
                                                            data-toggle="dropdown"
                                                            aria-haspopup="true" aria-expanded="false"
                                                            class='text-info'
                                                            aria-label="delete"
                                                        >
                                                            <RemoveCircleOutline color='error' />
                                                        </IconButton>
                                                        <div class="dropdown-menu">
                                                            <div style={{ fontSize: 14 }} class="dropdown-title text-lowercase ">
                                                                Retirer ce produit de la facture ?
                                                                <Stack direction="row" spacing={1}>
                                                                    <Chip
                                                                        sx={{ width: '100%' }}
                                                                        variant='outlined'
                                                                        label="Oui"
                                                                        color="success"
                                                                        onClick={() => handleRemoveProduct(el)}
                                                                        size='small'
                                                                    />
                                                                    <Chip
                                                                        size='small'
                                                                        label="Non"
                                                                        variant='outlined'
                                                                        color="error"
                                                                        sx={{ width: '100%' }}
                                                                    />
                                                                </Stack>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                        <Stack direction="row" mt={3} spacing={1}>
                                            <Chip
                                                sx={{ width: '100%' }}
                                                onClick={handleModifyQTy}
                                                variant='outlined'
                                                label="Modifier"
                                                color="primary"
                                                icon={<CheckOutlined />}
                                            />
                                            <Chip
                                                onClick={() => { setModified([]); setRowSelectionModel([]) }}
                                                label="Annuler"
                                                variant='outlined'
                                                color="error"
                                                sx={{ width: '100%' }}
                                                icon={<ClearOutlined />}
                                            />
                                        </Stack>
                                    </>
                                )
                            }
                        </div>
                    </div>
                </Dialog>
                <td>{i + 1}</td>
                <th scope="row">{item.invoiceNum}</th>
                <th class='text-capitalize'>{item.customerId == 'client divers' ? item.customerName ? item.customerName : 'Client divers' : customer.find(el => el.id == item.customerId).nom}</th>
                <td>{productOfArray(arrayProduct)}</td>
                <td>{moment(item.createdAt).format("DD-MM-YYYY • HH:mm")}</td>
                {user.accountType === 'admin' && (
                    <td>
                        {
                            arrayProduct.reduce((acc, val) => {
                                const product = products.find(el => el.id === val.productId);
                                return acc + ((val.price - product.pu) * val.qty)
                            }, 0)
                        }
                    </td>)
                }
                <td scope="col" >
                    {
                        item.delivered ?
                            item.amountToPaid == item.paid ?
                                <Chip
                                    label='Livrée'
                                    color='success'
                                    size='small'
                                />
                                :
                                <Chip
                                    label={`Livrée (reste:${item.amountToPaid - item.paid})`}
                                    color='error'
                                    size='small'
                                />
                            :
                            <Chip
                                label='Non Livrée'
                                color='secondary'
                                size='small'
                            />
                    }
                </td>
                <td scope='col' class='text-center'>
                    {
                        item.delivered ?
                            <IconButton color='primary' disabled aria-label="delete" size="small">
                                <ModeEditOutlineIcon fontSize='inherit' />
                            </IconButton>
                            :
                            <IconButton color='primary' onClick={handleClickModalOpen} aria-label="delete" size="small">
                                <ModeEditOutlineIcon color='primary' fontSize='inherit' />
                            </IconButton>
                    }

                    {
                        item.delivered ?
                            item.amountToPaid == item.paid ?
                                <IconButton color='primary' disabled aria-label="delete" size="small">
                                    <CheckOutlined fontSize="inherit" />
                                </IconButton>
                                :
                                <IconButton color='primary' onClick={handleClickOpen1} aria-label="delete" size="small">
                                    <CheckOutlined fontSize="inherit" />
                                </IconButton>
                            :
                            <>
                                <IconButton color='primary' onClick={handleClickOpen1} aria-label="delete" size="small">
                                    <CheckOutlined fontSize="inherit" />
                                </IconButton>
                            </>
                    }
                    <IconButton href={`orders/orderdetails/${item.id}`} color='primary' aria-label="delete" size="small">
                        <VisibilityIcon fontSize="inherit" />
                    </IconButton>
                </td>
                <Dialog
                    open={open1}
                    TransitionComponent={Transition}
                    keepMounted
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogTitle>{item.delivered ? "solder cette facture ?" : "Receptionner cette facture ?"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            {
                                !item.delivered ?
                                    'selectionnez un livreur et entrez le montant versé puis enregistrez'
                                    :
                                    'entrez le montant puis enregister'
                            }
                        </DialogContentText>

                        <FormControl margin='dense' fullWidth>
                            {
                                !item.delivered &&
                                <>
                                    <InputLabel id="demo-simple-select-label">Livreur</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        fullWidth
                                        id="demo-simple-select"
                                        label="Livreur"
                                        onChange={(e) => setDeliverer(e.target.value)}
                                    >

                                        <MenuItem value={'aucun'} selected>aucun</MenuItem>
                                        {
                                            employee.filter(it => it.job === 'driver' && it.cat == '1').map((el) => (
                                                <MenuItem value={el.id}>{el.surname}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                </>
                            }
                        </FormControl>
                        <TextField
                            autoComplete='off'
                            fullWidth
                            autoFocus
                            onChange={(e) => {
                                if (onlyNumberTest(e.target.value)) {
                                    setAllPaid(e.target.value)
                                }
                            }}
                            margin="dense"
                            type='number'
                            id="outlined-basic"
                            label="Avance de paiement"
                            variant="outlined"
                            value={allPaid}
                        />
                    </DialogContent>
                    {
                        errorP &&
                        <p class='text-danger px-4 h6' id="alert-dialog-slide-description">
                            {errorP}
                        </p>
                    }
                    <DialogActions>
                        <Button color='error' onClick={handleClose1}>Annuler</Button>
                        {
                            load ?
                                <Button disabled>
                                    Veuillez patienter {' '}
                                    <CircularProgress color='inherit' size={15} />{' '}
                                </Button>
                                :
                                item.amountToPaid !== item.paid ?
                                    <Button onClick={handleClickSold}>Enregistrer</Button>
                                    :
                                    <Button onClick={handleClickReceipt}>Receptionner</Button>
                        }
                    </DialogActions>
                </Dialog>
            </tr >
        )
    }

    useEffect(() => {
        const getData = async () => {
            const q = query(collection(db, "invoicesProduct"));
            const querySnapshot = await getDocs(q);
            let array = []
            querySnapshot.forEach((doc) => {
                const data = doc.data()
                const id = doc.id
                array.push({ id, ...data })
            });
            setInvoicesProducts(array)
        }
        getData()
    }, [])

    const handleSearchInvoice = (e) => {
        const newData = invoices.filter(item => {
            const itemData = `${item.invoiceNum} ${item.customerName.toUpperCase()}`;
            const textData = e.target.value.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        setInvoicesSearch(newData)
    }

    useEffect(() => {
        const getData = async () => {
            const q = query(collection(db, "invoices"), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            let array = []
            querySnapshot.forEach((doc) => {
                const data = doc.data()
                const id = doc.id
                const createdAt = moment(data.createdAt.toDate()).format()
                array.push({ id, ...data, createdAt })
            });
            const splitedUrl = window.location.href.split('?')
            if (splitedUrl[1]) {
                setInvoices(array)
                setInvoicesSearch(array)
            } else {
                setInvoices(array.filter((obj) => moment(obj.createdAt).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')))
                setInvoicesSearch(array.filter((obj) => moment(obj.createdAt).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')))
            }
        }
        getData()
    }, [])

    React.useEffect(() => {
        if (open) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open]);

    const handleChangeFilter = (el) => {
        setFilter(el)
        if (el == 'tout') {
            return setInvoicesSearch(invoices)
        }
        if (el == 'non livrée') {
            return setInvoicesSearch(invoices.filter(item => item.delivered === false))
        }
        if (el == 'livrée') {
            return setInvoicesSearch(invoices.filter(item => item.delivered === true))
        }
        if (el == 'avancée') {
            return setInvoicesSearch(invoices.filter(item => item.amountToPaid !== item.paid))
        }
    }

    const handleClickContinue = () => {
        if (inputsStates.nom !== '') {
            let customer = { ...inputsStates, type: 'client divers' }
            dispatch({
                type: 'SET_CUSTOMER',
                customer: customer
            })
            sessionStorage.setItem('customerInfoKilombo', JSON.stringify({ ...inputsStates, type: 'client divers' }))
            let location = window.location.href
            window.location.assign(`/orders/neworder?form=order&custom=false&order=true&onafter=${location}`)
        }
        if (!value, value.nom == '') {
            return
        }
        if (value.nom == 'Client divers') {
            let customer = { ...inputsStates, type: 'client divers' }
            dispatch({
                type: 'SET_CUSTOMER',
                customer: customer
            })
            sessionStorage.setItem('customerInfoKilombo', JSON.stringify({ ...inputsStates, type: 'client divers' }))
            let location = window.location.href
            window.location.assign(`/orders/neworder?form=order&custom=false&order=true&onafter=${location}`)
        } else {
            dispatch({
                type: 'SET_CUSTOMER',
                customer: value
            })
            sessionStorage.setItem('customerInfoKilombo', JSON.stringify(value))
            let location = window.location.href
            window.location.assign(`/orders/neworder?form=order&custom=false&order=true&onafter=${location}`)
        }
    }

    useEffect(() => {
        document.title = 'Factures'
    }, [])

    if (!invoices || !invoicesSearch) {
        return <div class="loader"></div>
    }


    return (
        <div>
            <div id="app">
                <div class="main-wrapper main-wrapper-1">
                    <div class="navbar-bg"></div>
                    <Sidebar />
                    <div class="main-content">
                        <section class="section">
                            <div class='row'>
                                <div class='col-12'>
                                    <div class='card'>
                                        <div class="card-header">
                                            <h4>Gestion de factures</h4>
                                            <div class="card-header-action d-flex">
                                                <IconButton href='orders?q=all&type=1&filter=all' color='info' aria-label="delete">
                                                    <HistoryIcon />
                                                </IconButton>
                                                <IconButton variant='contained' onClick={handleClickOpen('paper')} data-toggle="tooltip" data-placement="top" title='Nouvelle facture'
                                                    class="btn btn-icon btn-success ml-sm-2"><i class="fas fa-plus"></i></IconButton>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-12">
                                    <div class="card">
                                        <div class="card-header justify-content-between">
                                            <div class="input">
                                                <input
                                                    type="text"
                                                    autoComplete='off'
                                                    name="search"
                                                    class="form-control"
                                                    onChange={handleSearchInvoice}
                                                    placeholder="Nom du client ou numero de facture"
                                                />
                                            </div>
                                            <div class='card-header-action'>
                                                <div class="dropdown">
                                                    <IconButton data-toggle="dropdown" aria-label="delete">
                                                        <FilterListIcon />
                                                    </IconButton>
                                                    <div class="dropdown-menu">
                                                        {

                                                            ['tout', 'non livrée', 'avancée', 'livrée'].map((el, i) => {
                                                                if (window.location.href.split('?')[1]) {
                                                                    return (

                                                                        <Link href="#"
                                                                            style={filter == el ? { background: '#dff9fb' } : {}}
                                                                            onClick={() => handleChangeFilter(el)}
                                                                            class="dropdown-item text-capitalize has-icon"
                                                                        >{el}</Link>
                                                                    )
                                                                } else {
                                                                    return (
                                                                        <Link href="#"
                                                                            style={filter == el ? { background: '#dff9fb' } : {}}
                                                                            onClick={() => handleChangeFilter(el)}
                                                                            class="dropdown-item text-capitalize has-icon"
                                                                        >{el}</Link>
                                                                    )
                                                                }
                                                            })

                                                        }

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="card-body">
                                            <div class="table-responsive">
                                                <table class="table table-striped    table-md table-hover" id="save-stage">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col">#</th>
                                                            <th scope="col">N° de facture</th>
                                                            <th scope="col">Client</th>
                                                            <th scope="col"> Montant(FCFA)</th>
                                                            <th scope="col">Date</th>
                                                            {user.accountType === 'admin' &&
                                                                <th scope="col">Marge directe</th>
                                                            }
                                                            <th scope="col">Statut</th>
                                                            <th scope="col" class='text-center'>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            invoicesSearch.length > 0 ?
                                                                invoicesSearch.slice((page - 1) * numberPerPage, page * numberPerPage).map((item, i) => (
                                                                    <InvoiceCard key={i} item={item} i={i} />
                                                                ))
                                                                :
                                                                <div class='text-center h5 w-100'>Aucune donnée à afficher</div>
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div class='card-footer'>
                                            <nav aria-label="..." class='float-right'>
                                                <Pagination
                                                    count={Math.ceil(invoicesSearch.length / numberPerPage)}
                                                    variant="outlined"
                                                    page={parseInt(page)}
                                                    color="secondary"
                                                    onChange={handleChange}
                                                />
                                            </nav>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Dialog
                                open={open}
                                scroll={scroll}
                                aria-labelledby="scroll-dialog-title"
                                aria-describedby="scroll-dialog-description"
                            >
                                <DialogTitle id="scroll-dialog-title">Veuillez choisir un client</DialogTitle>
                                <DialogContent dividers={scroll === 'paper'}>
                                    <div class="form-group">
                                        <Autocomplete
                                            getOptionLabel={(option) => option.nom}
                                            onChange={(event, newValue) => {
                                                setInputsStates({
                                                    nom: '',
                                                    tel: '',
                                                    location: ''
                                                })
                                                setValue(newValue);
                                            }}
                                            inputValue={inputValue}
                                            onInputChange={(event, newInputValue) => {
                                                setInputValue(newInputValue);
                                            }}
                                            fullWidth
                                            id="controllable-states-demo"
                                            options={[{ nom: 'Client divers' }, ...customer]}
                                            renderInput={(params) => <TextField {...params} value={params.nom} label="client" />}
                                        />
                                    </div>
                                    {
                                        value && value.nom != 'Client divers' ?

                                            <>
                                                <div class="form-group">
                                                    <TextField id="outlined-basic" disabled label='Nom du client' fullWidth variant="outlined" />
                                                </div>
                                                <div class="form-group">
                                                    <TextField id="outlined-basic" disabled label="Numero du client" fullWidth variant="outlined" />
                                                </div>
                                                <div class="form-group">
                                                    <TextField id="outlined-basic" disabled label='localistion du client' variant="outlined" />
                                                </div>
                                            </>
                                            :
                                            <>
                                                <div class="form-group">
                                                    <TextField
                                                        autoComplete='off'
                                                        value={inputsStates.nom}
                                                        onChange={e => setInputsStates({
                                                            ...inputsStates,
                                                            ['nom']: e.target.value
                                                        })}
                                                        fullWidth
                                                        label="Nom du client"
                                                        variant="outlined"
                                                    />
                                                </div>
                                                <div class="form-group">
                                                    <TextField
                                                        autoComplete='off'
                                                        value={inputsStates.tel}
                                                        onChange={e => setInputsStates({
                                                            ...inputsStates,
                                                            ['tel']: e.target.value
                                                        })}
                                                        fullWidth label="Numero du client" variant="outlined" />
                                                </div>
                                                <div class="form-group">
                                                    <TextField
                                                        autoComplete='off'
                                                        value={inputsStates.location}
                                                        onChange={e => setInputsStates({
                                                            ...inputsStates,
                                                            ['location']: e.target.value
                                                        })}
                                                        fullWidth label="Localisation du client" variant="outlined" />
                                                </div>
                                            </>
                                    }
                                </DialogContent>
                                <DialogActions>
                                    <Button color='error' onClick={handleClose}>Annuler</Button>
                                    <Button onClick={handleClickContinue}>Continuer</Button>
                                </DialogActions>
                            </Dialog>
                        </section>
                        <Settings />
                    </div>
                </div>
            </div >
        </div >
    )
}