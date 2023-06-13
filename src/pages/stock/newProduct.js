import React, { useCallback, useEffect, useState } from 'react'
import Sidebar from '../sidebar/sidebar'
import Settings from '../settings/settings'
import { AlertTitle, Autocomplete, Backdrop, Button, CircularProgress, Snackbar } from '@mui/material'
import { CheckCircle } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { onlyNumberTest } from '../../components/functions/regex';
import { serverTimestamp, setDoc, doc, getDoc, increment, updateDoc } from "firebase/firestore";
import { db } from '../../firebase';
import MuiAlert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import { useStateValue } from '../../components/stateProvider';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function SlideTransition(props) {
    return <Slide {...props} direction="left" />;
}

export default function NewProduct() {

    const [{ products }, dispatch] = useStateValue()

    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false);
    const [articles, setArticles] = useState(products)
    const [filteredArray, setFilteredArray] = useState([])
    const [plus, setPlus] = useState(false)
    const [inputs, setInputs] = useState(1)
    const [inputsValue, setInputsValue] = useState({
        product: '',
        productCode: '',
        supplier: '',
        productCat: '',
        stockInitial: '',
        minStock: '',
        productParfum: '',
        price: ''
    })
    const [inputState, setInputState] = useState({})
    const [inputQtyState, setInputQTyState] = useState({})

    const [states, setStates] = useState({
        variant: '',
        message: '',
        title: '',
        documentExist: false,
        parfumExist: false
    })
    const handleClick = (variant, title, msg) => {
        setOpen(true);
        setStates({
            ...states,
            ['variant']: variant,
            ['message']: msg,
            ['title']: title
        })
    };

    useEffect(() => {
        setArticles(products)
        setFilteredArray(products)
    }, [products])

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };


    const handleAddDoc = async () => {
        const hasParfum = () => {
            return products.find(el => el.nom == inputsValue.product).parfum.length > 0
        }

        if (inputsValue.product == '') {
            return handleClick('error', 'Erreur', 'Veuillez choisir un article')
        } else if (!hasParfum() && inputsValue.product != '') {
            const productCode = products.find(el => el.nom == inputsValue.product).code
            const docRef = doc(db, "stock", productCode);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return handleClick('error', 'Erreur', 'Ce produit existe deja dans votre stock')
            }
        }
        if (hasParfum()) {
            if (inputsValue.productParfum == '') {
                return handleClick('error', 'Erreur', 'Veuillez choisir un parfum pour ce produit')
            } else {
                const productCode = products.find(el => el.nom == inputsValue.product).code
                const docRef = doc(db, "parfum", `${productCode}-${inputsValue.productParfum}`);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    return handleClick('error', 'Erreur', 'Ce parfum existe deja dans votre stock')
                }
            }
        }
        if (inputsValue.stockInitial == '') {
            return handleClick('error', 'Erreur', 'Veuillez enter le stock initial de ce produit')
        }
        if (inputsValue.minStock == '' && plus == false) {
            setPlus(true)
            return handleClick('warning', 'Attention', "Vous n'avez pas entré de stock minimal vous ne recevrez pas d'alerte pour ce produit. cliquez a nouveau pour continuer")
        }
        setLoading(true)
        let pv = []
        for (let i = 1; i <= inputs; i++) {
            if (inputState[`pv${i}`] > 0) {
                pv.push({ pv: parseInt(inputState[`pv${i}`]), qty: parseInt(inputQtyState[`qty${i}`]) })
            }
        }
        pv = pv.sort(function (a, b) { return a.pv - b.pv })
        const productCode = products.find(el => el.nom == inputsValue.product).code
        const categorie = products.find(el => el.nom == inputsValue.product).categorie
        if (products.find(el => el.nom == inputsValue.product).parfum <= 0) {
            await setDoc(doc(db, "stock", productCode), {
                createdAt: serverTimestamp(),
                productCode: productCode,
                pv: [...pv],
                hasParfum: false,
                already: 0,
                nom: inputsValue.product,
                stock: parseInt(inputsValue.stockInitial),
                minStock: inputsValue.minStock != '' ? parseInt(inputsValue.minStock) : 0,
            }).then(() => {
                setLoading(false)
                handleClick('success', 'Success', `${inputsValue.product} a été ajouté avec succès à votre stock`)
                setTimeout(() => {
                    window.location.reload()
                }, 3000);
            }).catch((e) => {
                setLoading(false)
                console.log(e)
            });
            return
        } else {
            const docRef = doc(db, "stock", `${productCode}`);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                await setDoc(doc(db, "parfum", `${productCode}-${inputsValue.productParfum}`), {
                    createdAt: serverTimestamp(),
                    productCode: productCode,
                    categorie: categorie,
                    already: 0,
                    parfumName: inputsValue.productParfum,
                    stock: parseInt(inputsValue.stockInitial),
                    minStock: inputsValue.minStock != '' ? parseInt(inputsValue.minStock) : 0,
                }).then(async () => {
                    const stockRef = doc(db, "stock", `${productCode}`);
                    await updateDoc(stockRef, {
                        stock: increment(Number(inputsValue.stockInitial))
                    });
                    setLoading(false)
                    handleClick('success', 'Success', `${inputsValue.product} ${inputsValue.productParfum} a été ajouté avec succès à votre stock`)
                    setTimeout(() => {
                        window.location.reload()
                    }, 3000);
                }).catch((e) => {
                    setLoading(false)
                });
            } else {
                await setDoc(doc(db, "stock", productCode), {
                    createdAt: serverTimestamp(),
                    productCode: productCode,
                    pv: [...pv],
                    stock: parseInt(inputsValue.stockInitial),
                    hasParfum: true,
                    already: 0,
                    nom: inputsValue.product,
                    categorie,
                    minStock: inputsValue.minStock != '' ? parseInt(inputsValue.minStock) : 0
                }).then(async () => {
                    await setDoc(doc(db, "parfum", `${productCode}-${inputsValue.productParfum}`), {
                        createdAt: serverTimestamp(),
                        productCode: productCode,
                        already: 0,
                        stock: parseInt(inputsValue.stockInitial),
                        parfumName: inputsValue.productParfum,
                        minStock: inputsValue.minStock != '' ? parseInt(inputsValue.minStock) : 0,
                    }).then(() => {
                        setLoading(false)
                        handleClick('success', 'Success', `${inputsValue.product} ${inputsValue.productParfum} a été ajouté avec succès à votre stock`)
                        setTimeout(() => {
                            window.location.reload()
                        }, 3000);
                    }).catch((e) => {
                        setLoading(false)
                    });
                }).catch((e) => {
                    setLoading(false)
                });
            }
        }
    }

    const handleRemoveInput = () => {
        setInputState({
            ...inputState,
            [`pv${inputs}`]: ''
        })
        setInputQTyState({
            ...inputQtyState,
            [`qty${inputs}`]: ''
        })
        setInputs(inputs - 1)
    }

    const handleAddInput = () => {
        setInputs(inputs + 1)
    }

    const handleParfumChanged = async (e) => {
        setLoading(true)
        setInputsValue({
            ...inputsValue,
            ['productParfum']: e.target.value,
        })
        const productCode = products.find(el => el.nom == inputsValue.product).code
        const docRef = doc(db, "parfum", `${productCode}-${e.target.value}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setStates({
                ...states,
                ['parfumExist']: true
            })
            console.log('parfum exist');
        } else {
            setStates({
                ...states,
                ['parfumExist']: false
            })
            console.log('parfum do not exist');
        }
        setLoading(false)
    }

    const handleChangeName = async (e) => {
        setLoading(true)
        setInputsValue({
            ...inputsValue,
            ['product']: e.target.value,
        })
        const productCode = products.find(el => el.nom == e.target.value).code
        const docRef = doc(db, "stock", productCode);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setStates({
                ...states,
                ['documentExist']: true
            })
            console.log('product exist');
        } else {
            setStates({
                ...states,
                ['documentExist']: false
            })
        }
        setLoading(false)
    }

    const onChange = (e, i) => {
        if (!onlyNumberTest(e.target.value) && e.target.value.length == 1 && e.target.value.length != '') {
            setInputState({
                ...inputState,
                [`pv${i + 1}`]: ''
            })
            return
        }
        if (onlyNumberTest(e.target.value)) {
            setInputState({
                ...inputState,
                [`pv${i + 1}`]: e.target.value
            })
        }
    }

    const onQtyChange = (e, i) => {
        if (!onlyNumberTest(e.target.value) && e.target.value.length == 1 && e.target.value.length != '') {
            setInputQTyState({
                ...inputQtyState,
                [`qty${i + 1}`]: ''
            })
            return
        }
        if (onlyNumberTest(e.target.value)) {
            setInputQTyState({
                ...inputQtyState,
                [`qty${i + 1}`]: e.target.value
            })
        }
    }

    if (!products) {
        return (
            <div class="loader"></div>
        )
    }

    return (
        <div>
            <div id="app">
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
                <div class="main-wrapper main-wrapper-1">
                    <div class="navbar-bg"></div>
                    <Sidebar />
                    <div class="main-content">
                        <section class="section">
                            <div class="section-body">
                                <div class='card'>
                                    <div class='card-header'>
                                        <h4>
                                            ajouter un produit
                                        </h4>
                                        <div class='card-header-action'>
                                            {
                                                states.documentExist == false || states.parfumExist == false || inputsValue.product != '' ?
                                                    <Button Button onClick={handleAddDoc} variant="outlined" startIcon={<CheckCircle />}>
                                                        Ajouter
                                                    </Button>
                                                    :
                                                    <Button disabled variant="outlined" startIcon={<CheckCircle />}>
                                                        Ajouter
                                                    </Button>
                                            }
                                        </div>
                                    </div>
                                    <div class='card-body row'>
                                        <div class='col-6 col-lg-6 col-md-6 col-12'>
                                            <div class="form-group">
                                                <label>Categorie du produit</label>
                                                <div class="input-group">
                                                    <div class="input-group-prepend">
                                                        <div class="input-group-text">
                                                            <i class="fas fa-cube"></i>
                                                        </div>
                                                    </div>
                                                    <select
                                                        // disabled={inputsValue.product == 'other' ? false : true}
                                                        onChange={(e) => {
                                                            setInputsValue({
                                                                ...inputsValue,
                                                                ['productCat']: e.target.value,
                                                                ['product']: '',
                                                                ['productParfum']: '',
                                                            })
                                                            if (inputsValue.supplier == '') {
                                                                setArticles(products.filter(el => el.categorie == e.target.value))
                                                                setFilteredArray(products.filter(el => el.categorie == e.target.value))
                                                            } else {
                                                                setArticles(products.filter(el => el.categorie == e.target.value))
                                                                setFilteredArray(products.filter(el => el.categorie == e.target.value && el.fournisseur == inputsValue.supplier))
                                                            }

                                                        }}
                                                        value={inputsValue.productCat}
                                                        type="text" class="form-control phone-number" >
                                                        <option>Sélectionez une categorie</option>
                                                        <option value={'em'}>Eau minerale</option>
                                                        <option value={'bg'}>Boisson gazeuse</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <label>Fournisseur du produit</label>
                                                <div class="input-group">
                                                    <div class="input-group-prepend">
                                                        <div class="input-group-text">
                                                            <i class="fas fa-truck"></i>
                                                        </div>
                                                    </div>
                                                    <select
                                                        onChange={(e) => {
                                                            setInputsValue({
                                                                ...inputsValue,
                                                                ['supplier']: e.target.value,
                                                                ['product']: '',
                                                                ['productParfum']: '',
                                                            })
                                                            inputsValue.productCat == '' ?
                                                                setFilteredArray(articles.filter(el => el.fournisseur == e.target.value))
                                                                :
                                                                setFilteredArray(articles.filter(el => el.fournisseur == e.target.value && el.categorie == inputsValue.productCat))
                                                        }}
                                                        value={inputsValue.supplier}
                                                        type="text" class="form-control phone-number" >
                                                        <option>Sélectionez un fournisseur</option>
                                                        <option value={'sabc'}>Brasserie du cameroun</option>
                                                        <option value={'sp'}>Source du pays</option>
                                                        <option value={'ucb'}>UCB</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <label>Nom du produit</label>
                                                <div class="input-group">
                                                    <div class="input-group-prepend">
                                                        <div class="input-group-text">
                                                            <i class="fas fa-cube"></i>
                                                        </div>
                                                    </div>
                                                    <select
                                                        type="text"
                                                        onChange={handleChangeName}
                                                        value={inputsValue.product}
                                                        class="form-control col-6 phone-number"
                                                    >
                                                        <option class='h6' >Sélectionnez un produit</option>
                                                        {
                                                            products &&
                                                            filteredArray.map((_, i) => (
                                                                <option class='h6' key={i} value={_.nom}>{_.nom}</option>
                                                            ))

                                                        }
                                                    </select>
                                                    <select
                                                        type="text"
                                                        onChange={handleParfumChanged}
                                                        disabled={
                                                            inputsValue.product != '' &&
                                                                products.find(el => el.nom == inputsValue.product).parfum.length > 0 ? false : true
                                                        }
                                                        value={inputsValue.product != '' ? inputsValue.productParfum : ''}
                                                        class="form-control col-6 phone-number"
                                                    >
                                                        <option selected class='h6'>Selectionnez le parfum</option>
                                                        {
                                                            inputsValue.product != '' ?
                                                                products.find(el => el.nom == inputsValue.product).parfum.map((_, i) => (
                                                                    <option class='h6' key={i} value={_}>{_}</option>
                                                                ))
                                                                :
                                                                <></>
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                            {
                                                states.documentExist ?
                                                    products.find(el => el.nom == inputsValue.product).parfum.length <= 0 ?
                                                        states.documentExist ?
                                                            <p p className='h6 text-danger' style={{ marginTop: '-20px' }}>cet article existe déja dans votre stock</p>
                                                            :
                                                            <></>
                                                        :

                                                        <></>
                                                    :
                                                    states.parfumExist ?
                                                        <p className='h6 text-danger' style={{ marginTop: '-20px' }}>cet article existe déja dans votre stock</p>
                                                        :
                                                        <></>
                                            }
                                            <div class="form-group">
                                                <label>Code du produit</label>
                                                <div class="input-group">
                                                    <div class="input-group-prepend">
                                                        <div class="input-group-text">
                                                            <i class="fas fa-cube"></i>
                                                        </div>
                                                    </div>
                                                    <input
                                                        onChange={(e) => setInputsValue({
                                                            ...inputsValue,
                                                            ['productCode']: e.target.value
                                                        })}
                                                        disabled={true}
                                                        value={inputsValue.product != '' ? products.find(el => el.nom == inputsValue.product).code ? products.find(el => el.nom == inputsValue.product).code : '' : ''}
                                                        type="text"
                                                        class="form-control text-uppercase phone-number"
                                                    />
                                                </div>
                                            </div>

                                        </div>
                                        <div class='col-6 col-lg-6 col-md-6 col-12'>
                                            <div class="form-group">
                                                <label>Stock initial</label>
                                                <div class="input-group">
                                                    <div class="input-group-prepend">
                                                        <div class="input-group-text">
                                                            <i class="fas fa-database"></i>
                                                        </div>
                                                    </div>
                                                    <input
                                                        value={inputsValue.stockInitial}
                                                        onChange={(e) => {
                                                            if (onlyNumberTest(e.target.value)) {
                                                                setInputsValue({
                                                                    ...inputsValue,
                                                                    ['stockInitial']: e.target.value
                                                                })
                                                            }
                                                        }}
                                                        type="text"
                                                        class="form-control phone-number"
                                                    />
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <label>Stock minimal</label>
                                                <div class="input-group">
                                                    <div class="input-group-prepend">
                                                        <div class="input-group-text">
                                                            <i class="fas fa-database"></i>
                                                        </div>
                                                    </div>
                                                    <input
                                                        value={inputsValue.minStock}
                                                        onChange={(e) => {
                                                            if (onlyNumberTest(e.target.value)) {
                                                                setInputsValue({
                                                                    ...inputsValue,
                                                                    ['minStock']: e.target.value
                                                                })
                                                            }
                                                        }}
                                                        type="text"
                                                        class="form-control phone-number"
                                                    />
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <label>Prix d'achat</label>
                                                <div class="input-group">
                                                    <div class="input-group-prepend">
                                                        <div class="input-group-text">
                                                            <i class="fas fa-dollar-sign"></i>
                                                        </div>
                                                    </div>
                                                    <input type="text"
                                                        value={inputsValue.product != '' ? products.find(el => el.nom == inputsValue.product).pu ? products.find(el => el.nom == inputsValue.product).pu : '' : ''}
                                                        disabled={inputsValue.product == 'other' ? false : true}
                                                        onChange={(e) => {
                                                            if (onlyNumberTest(e.target.value)) {
                                                                setInputsValue({
                                                                    ...inputsValue,
                                                                    ['price']: e.target.value
                                                                })
                                                            }
                                                        }}
                                                        class="form-control phone-number" />
                                                </div>
                                            </div>
                                            <div class="form-group col-12">
                                                <label>
                                                    Prix de vente
                                                    {
                                                        states.parfumExist == false && states.documentExist == false ?
                                                            inputs < 4 ?
                                                                <Link onClick={handleAddInput} class='text-info'>
                                                                    <strong> Ajouter un champ +</strong>
                                                                </Link>
                                                                :
                                                                <>
                                                                    <Link
                                                                        data-toggle="dropdown"
                                                                        aria-haspopup="true" aria-expanded="false"
                                                                        class='text-info'>
                                                                        <strong> Ajouter un champ +</strong>
                                                                    </Link>
                                                                    <div class="dropdown-menu">
                                                                        <div style={{ fontSize: 14 }} class="dropdown-title text-lowercase ">Vous ne pouvez pas ajoutez plus de 4 prix</div>
                                                                    </div>
                                                                </>
                                                            :
                                                            <Link class='text-secondary disabled pe-none'>
                                                                <strong> Ajouter un champ +</strong>
                                                            </Link>
                                                    }
                                                    {
                                                        inputs > 1 &&
                                                        <Link onClick={handleRemoveInput} class='text-danger'>
                                                            <strong> retirer le dernier champ -</strong>
                                                        </Link>
                                                    }
                                                </label>
                                                <div class='col-12'>
                                                    {
                                                        [...Array(inputs)].map((_, i) => (
                                                            <div class='mb-1 row d-flex justify-content-between'>
                                                                <input
                                                                    disabled={states.parfumExist == false && states.documentExist == false ? false : true}
                                                                    type="text"
                                                                    onChange={(e) => onChange(e, i)}
                                                                    maxLength={5}
                                                                    value={inputState[`pv${i + 1}`]}
                                                                    placeholder={`prix de vente ${i + 1}`}
                                                                    class={`form-control phone-number transition-2 col-lg-5 col-md-6 col-sm-6 col-xs-12`}
                                                                />
                                                                <input
                                                                    disabled={states.parfumExist == false && states.documentExist == false ? false : true}
                                                                    type="text"
                                                                    onChange={(e) => onQtyChange(e, i)}
                                                                    maxLength={5}
                                                                    value={inputQtyState[`qty${i + 1}`]}
                                                                    placeholder={`Qunatité minimal ${i + 1}`}
                                                                    class={`form-control transition-2 col-lg-5 col-md-6 col-sm-6 col-xs-12`}
                                                                />
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                            </div>
                        </section>
                        <Settings />
                        <Backdrop
                            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                            open={loading}
                        >
                            <CircularProgress color="primary" />
                        </Backdrop>
                    </div>
                </div>
            </div >
        </div >
    )
}