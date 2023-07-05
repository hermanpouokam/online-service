import React, { useEffect, useState } from 'react'
import Sidebar from '../sidebar/sidebar'
import Settings from '../settings/settings'
import { AlertTitle, Backdrop, Box, Button, CircularProgress, Divider, FormControl, InputLabel, MenuItem, OutlinedInput, Snackbar, TextField } from '@mui/material'
import PropTypes from 'prop-types';
import { IMaskInput } from 'react-imask';
import { useStateValue } from '../../components/stateProvider';
import { styled } from '@mui/material/styles';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import MuiAlert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import { db } from '../../firebase';
import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';

const TextMaskCustom = React.forwardRef(function TextMaskCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
        <IMaskInput
            {...other}
            mask="#00-000-000"
            definitions={{
                '#': /[1-9]/,
            }}
            inputRef={ref}
            onAccept={(value) => onChange({ target: { name: props.name, value } })}
            overwrite
        />
    );
});


const Root = styled('div')(({ theme }) => ({
    width: '100%',
    ...theme.typography.body2,
    '& > :not(style) + :not(style)': {
        marginTop: theme.spacing(2),
    },
}));

TextMaskCustom.propTypes = {
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function SlideTransition(props) {
    return <Slide {...props} direction="left" />;
}

export default function NewCustomer() {

    const [inputsStates, setInputsStates] = useState(
        {
            cat: '',
            nom: '',
            num1: '',
            num2: '',
            quartier: '',
            secteur: '',
            priceCat: 0
        }
    )
    const [{ stock, products }, dispatch] = useStateValue()
    const [stocks, setStocks] = useState(stock)
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false);
    const [productsPrice, setProductsPrice] = useState({})
    const [loading1, setLoading1] = useState(false)

    const [states, setStates] = useState({
        variant: '',
        message: '',
        title: '',
    })
    const findInProduct = item => {
        return products.find(el => el.id == item)
    }

    const handleClick = async () => {
        setLoading1(true)
        const { cat, nom, num1, num2, quartier, secteur, priceCat } = inputsStates
        // if (!cat || !nom || !num1 || !quartier || !secteur || !priceCat) {
        //     setLoading1(false)
        //     return handleClickAlert('error', 'Erreur', 'Veuillez remplir toutes les infomations du client')
        // }
        if (cat != '' && nom != '' && num1 != '' && quartier != '' && secteur != '') {
            const docRef = await addDoc(collection(db, "customer"), {
                nom,
                location: `${secteur},${quartier}`,
                createdAt: serverTimestamp(),
                tel: !num2 ? [num1] : [num1, num2],
                cat,
                priceCat
            }).catch(e => {
                console.log("error catched: ", e);
                setLoading1(false)
                return handleClickAlert('error', 'Erreur', `Erreur inconnue veuillez réessayer plus tard`)
            })
            if (productsPrice !== {}) {
                const priceRef = await setDoc(doc(db, "customerPrice", docRef.id), {
                    ...productsPrice,
                })
            }
            setLoading1(false)
            setTimeout(() => {
                window.location.reload()
            }, 3000);
            return handleClickAlert('success', 'Succès', `${nom} a été ajouté à vos clients avec succès`)
        } else {
            setLoading1(false)
            return handleClickAlert('error', 'Erreur', 'Veuillez remplir tous les champs')
        }
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


    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const pv = (i) => {
        if (stocks[i].pv[inputsStates['priceCat']]) {
            return stocks[i].pv[inputsStates['priceCat']]
        } else if (stocks[i].pv[inputsStates['priceCat'] - 1]) {
            return stocks[i].pv[inputsStates['priceCat'] - 1]
        } else if (stocks[i].pv[inputsStates['priceCat'] - 2]) {
            return stocks[i].pv[inputsStates['priceCat'] - 2]
        } else {
            return 'price do not exist'
        }
    }

    const handleChangeCat = (e) => {
        setProductsPrice({})
        setInputsStates({
            ...inputsStates,
            ['priceCat']: parseInt(e.target.value)
        })
    }

    const handleChange = (e) => {
        setLoading(true)
        setTimeout(() => {
            const newData = stock.filter(item => {
                const itemData = `${findInProduct(item.id).nom.toUpperCase()}`;
                const textData = e.target.value.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            setStocks(newData)
            setLoading(false)
        }, 300);
    }


    useEffect(() => {
        document.title = 'Ajouter un client'
    }, [])

    useEffect(() => {
        console.log(inputsStates);
        console.log(productsPrice)
    }, [inputsStates, productsPrice])

    const inputs = [
        {
            input: 'Nom complet',
            value: 'nom',
            type: 'text',
            placeholder: 'ex: jon doe',
        },
        {
            input: 'Numero 1',
            value: 'num1',
            type: 'phoneNumber',
            placeholder: 'ex: 677 000 000',
        },
        {
            input: 'Numero 2',
            value: 'num2',
            type: 'phoneNumber',
            placeholder: 'ex: 677 000 000',
        },
        {
            input: 'Quartier',
            value: 'quartier',
            type: 'text',
            placeholder: 'ex: Ngodi-bakoko',
        },
        {
            input: 'secteur',
            value: 'secteur',
            type: 'text',
            placeholder: 'ex: Vatican',
        },
        {
            input: 'cat',
            value: 'cat',
            type: 'select',
            placeholder: 'ex: Vatican',
        },
    ]
    const prices = [
        {
            value: '0',
            label: '1',
        },
        {
            value: '1',
            label: '2',
        },
        {
            value: '2',
            label: '3',
        },
        {
            value: '3',
            label: '4',
        },
    ];
    return (
        <div>
            <div id="app">
                <div class="main-wrapper main-wrapper-1">
                    <div class="navbar-bg"></div>
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
                    <Sidebar />
                    <div class="main-content">
                        <section class="section">
                            <div class="section-body">
                                <form>
                                    <div class='card'>
                                        <div class='card-body'>
                                            <Divider><span class='h5 text-uppercase'>Informations du client</span></Divider>

                                            <div class='row my-4'>
                                                {
                                                    inputs.map((input, index) => (
                                                        <div class='col-lg-4 col-md-6 col-sm-12'>
                                                            {
                                                                input.type == 'phoneNumber' ?

                                                                    <FormControl fullWidth margin='dense'>
                                                                        <InputLabel htmlFor="component-outlined">{input.input}</InputLabel>
                                                                        <OutlinedInput
                                                                            value={inputsStates[`${input.value}`]}
                                                                            onChange={(e) => setInputsStates({
                                                                                ...inputsStates,
                                                                                [`${input.value}`]: e.target.value
                                                                            })}
                                                                            id="component-outlined"
                                                                            label='numero'
                                                                            placeholder={input.placeholder}
                                                                            inputComponent={TextMaskCustom}
                                                                        />
                                                                    </FormControl>
                                                                    :
                                                                    input.type == 'select' ?
                                                                        <TextField
                                                                            id="outlined-select-currency"
                                                                            select
                                                                            label="catégorie"
                                                                            fullWidth
                                                                            margin='dense'
                                                                            onChange={(e) => setInputsStates({
                                                                                ...inputsStates,
                                                                                [`${input.value}`]: e.target.value
                                                                            })}
                                                                        >
                                                                            <MenuItem value={'boutique'}>
                                                                                boutique
                                                                            </MenuItem>
                                                                            <MenuItem value={'depot'}>
                                                                                depot
                                                                            </MenuItem>
                                                                        </TextField>
                                                                        :
                                                                        <TextField
                                                                            onChange={(e) => setInputsStates({
                                                                                ...inputsStates,
                                                                                [`${input.value}`]: e.target.value
                                                                            })}
                                                                            value={inputsStates[`${input.value}`]}
                                                                            key={index}
                                                                            autoComplete='off'
                                                                            fullWidth
                                                                            placeholder={input.placeholder}
                                                                            required
                                                                            id="outlined-required"
                                                                            margin="dense"
                                                                            label={input.input}
                                                                        />
                                                            }
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                            <Divider><span class='h5 text-uppercase'>Prix de facturation</span></Divider>
                                            <div className='d-flex align-items-center mt-4'>
                                                <TextField
                                                    onChange={handleChange}
                                                    required
                                                    id="outlined-select-currency"
                                                    margin='dense'
                                                    sx={{ width: '70%' }}
                                                    label="Recherche"
                                                    placeholder="entrez votre recherche"
                                                />
                                                <TextField
                                                    id="outlined-select-currency"
                                                    onChange={handleChangeCat}
                                                    select
                                                    required
                                                    margin='dense'
                                                    sx={{ width: '30%' }}
                                                    label="catégorie de prix"
                                                >
                                                    {prices.map((option) => (
                                                        <MenuItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </div>
                                            <div class='mt-3 row col-12'>
                                                {!loading ?
                                                    stocks.length > 0 ?
                                                        stocks.map((item, i) => (
                                                            <div class='col-lg-4 col-md-4 col-sm-6 w-100 d-flex align-items-center justify-content-center'>
                                                                <div class='d-flex'>
                                                                    <TextField
                                                                        value={findInProduct(item.id).nom}
                                                                        required
                                                                        sx={{ width: '100%' }}
                                                                        id="outlined-required"
                                                                        margin="dense"
                                                                        label={'Product'}
                                                                    />
                                                                    <TextField
                                                                        id="outlined-select-currency"
                                                                        select
                                                                        margin='dense'
                                                                        required
                                                                        fullWidth
                                                                        sx={{ width: '100%' }}
                                                                        label="price"
                                                                        onChange={(e) => setProductsPrice({
                                                                            ...productsPrice,
                                                                            ['price' + item.id]: e.target.value
                                                                        })}
                                                                        value={
                                                                            productsPrice['price' + item.id] ?
                                                                                productsPrice['price' + item.id]
                                                                                :
                                                                                inputsStates['priceCat'] ?
                                                                                    pv(i).pv
                                                                                    :
                                                                                    item.pv[0].pv
                                                                        }
                                                                        defaultValue={'0'}
                                                                    >
                                                                        {item.pv.map((option) => (
                                                                            <MenuItem key={option} value={option.pv}>
                                                                                {option.pv}
                                                                            </MenuItem>
                                                                        ))}
                                                                    </TextField>
                                                                </div>
                                                            </div>
                                                        ))
                                                        :
                                                        <div class='w-100 h4 text-center'>Aucun resultat</div>
                                                    :
                                                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                        <CircularProgress />
                                                    </Box>
                                                }
                                            </div>
                                        </div>
                                        <div class='card-footer'>
                                            <div class='card-footer-action float-right'>
                                                <Button onClick={handleClick} variant="outlined" sx={{ paddingLeft: 10, paddingRight: 10 }} endIcon={<PersonAddAltIcon />}>
                                                    Ajouter
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </section>
                        <Settings />
                        <Backdrop
                            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                            open={loading1}
                        >
                            <CircularProgress color="primary" />
                        </Backdrop>
                    </div>
                </div>
            </div >
        </div >
    )
}
