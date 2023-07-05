import React, { useEffect, useState } from 'react'
import { AlertTitle, Box, Button, Container, Dialog, DialogActions, DialogContent, Fade, Grid, Slide, Snackbar, TextField, Typography, } from '@mui/material'
import { useStateValue } from '../../components/stateProvider'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { useDropzone } from 'react-dropzone';
import { addDoc, collection, doc, increment, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db, storage } from '../../firebase';
import MuiAlert from '@mui/material/Alert';
import moment from 'moment';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getRandomNumber } from '../../components/functions/randomNumber';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Fade ref={ref} {...props} />;
});

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function SlideTransition(props) {
    return <Slide {...props} direction="left" />;
}


export default function ProductCard(props) {


    const supplier = props.supplier
    const [open, setOpen] = React.useState(false);
    const [openAlert, setOpenAlert] = useState(false)
    const [image, setImage] = useState(null)
    const [{ stock, products, parfum, user, enterprise }, dispatch] = useStateValue()
    const [stocks, setStocks] = useState([])
    const [inputsValue, setInputsValue] = useState({})
    const [states, setStates] = useState({
        variant: '',
        message: '',
        title: ''
    })


    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClickAlert = (variant, title, msg) => {
        setOpenAlert(true);
        setStates({
            ...states,
            ['variant']: variant,
            ['message']: msg,
            ['title']: title
        })
    };

    const handleClose = () => {
        setOpen(false);
    };

    const onDrop = acceptedFiles => {
        const file = acceptedFiles[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setImage(reader.result);
            console.log(reader.result)
        };

        reader.readAsDataURL(file);
    };

    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({ onDrop });


    const handleCloseSnack = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlert(false);
    };




    const handleAddStock = async () => {
        const checkValue = Object.values(inputsValue).some(value => value > 0)

        if (inputsValue !== {} && checkValue) {
            let amountToPaid = 0

            for (let i = 0; i < stocks.length; i++) {
                const element = stocks[i];
                if (inputsValue[`${element.nom}`] > 0) {
                    amountToPaid += (inputsValue[`${element.nom}`] * products.find(el => el.id == element.id).pu)
                }
            }
            if (amountToPaid > enterprise.caisse) {
                return handleClickAlert('error', 'Erreur', "vous n'avez pas assez d'argent en caisse pour executer cette entrée, veuillez effectuer une entrée de caisse et reéssayez ")
            }
            let imageRef = null
            if (image) {

                const metadata = {
                    contentType: 'image/jpeg'
                };

                const storageRef = ref(storage, 'supply yapictures/' + `${acceptedFiles[0].name}${getRandomNumber(8)}`);
                const uploadTask = uploadBytesResumable(storageRef, acceptedFiles[0], metadata);
                uploadTask.on('state_changed',
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Upload is ' + progress + '% done');
                        switch (snapshot.state) {
                            case 'paused':
                                console.log('Upload is paused');
                                break;
                            case 'running':
                                console.log('Upload is running');
                                break;
                        }
                    },
                    (error) => {
                        switch (error.code) {
                            case 'storage/unauthorized':
                                console.log('unauthorized')
                                break;
                            case 'storage/canceled':
                                console.log('canceled')
                                break;

                            case 'storage/unknown':
                                console.log('unknown error')
                                break;
                        }
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            console.log('File available at', downloadURL);
                            imageRef = downloadURL
                        });
                    }
                );

            }
            const docRef = await addDoc(collection(db, "history"), {
                type: 'supply',
                amount: amountToPaid,
                user: user.uid,
                created: serverTimestamp(),
                imageRef,
            });
            for (let i = 0; i < stocks.length; i++) {
                const element = stocks[i];
                if (inputsValue[`${element.nom}`] > 0) {
                    if (element.hasParfum) {
                        const productRef = doc(db, "stock", `${element.id}`);
                        await updateDoc(productRef, {
                            stock: increment(inputsValue[`${element.nom}`])
                        });
                        const parfumRef = doc(db, "parfum", `${element.id}-${element.productParfum}`);
                        await updateDoc(parfumRef, {
                            stock: increment(inputsValue[`${element.nom}`])
                        });
                        await addDoc(collection(db, "supplyHistory"), {
                            docId: docRef.id,
                            qty: inputsValue[`${element.nom}`],
                            name: element.nom,
                        });
                    } else {
                        const productRef = doc(db, "stock", `${element.id}`);
                        await updateDoc(productRef, {
                            stock: increment(inputsValue[`${element.nom}`])
                        });
                        await addDoc(collection(db, "supplyHistory"), {
                            docId: docRef.id,
                            qty: inputsValue[`${element.nom}`],
                            name: element.nom,
                        });
                    }
                    await updateDoc(doc(db, `dailyclosure`, `${moment().format('DDMMYYYY')}`, `dailyStock`, `${element.id}`,), {
                        appro: inputsValue[`${element.nom}`]
                    });
                }
            }
            const enterRef = doc(db, "entreprise", `zta23TYCfjPSlR9wZf7r`);
            await updateDoc(enterRef, {
                caisse: increment(-amountToPaid)
            });
            handleClickAlert('success', 'Succès', 'Votre stock a été mis à jour avec succès')

            return setTimeout(() => {
                window.location.reload()
            }, 3000);
        } else {
            return handleClickAlert('error', 'Erreur', 'Veuillez ajouter une quantite de produit')
        }
    }

    const handleChangeQty = (qty, item) => {
        const regex = /^[0-9\b]+$/;
        if (qty === "" || regex.test(qty)) {
            setInputsValue({
                ...inputsValue,
                [item]: parseInt(qty)
            })
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
        if (supplier) {
            const suppliers = products.filter(el => el.fournisseur == supplier.id.toLowerCase()).map(el => { return el.id })
            setStocks([
                ...data,
                ...parfumModified
            ].filter(product => suppliers.includes(product.id)))
        }
    }, [supplier])

    return (
        <React.Fragment>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogContent>
                    {
                        !image ?
                            <Box {...getRootProps()} component="div" sx={{ p: 2, border: '1px dashed grey', width: '33vw', height: '40vh', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
                                <div class='text-center'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><path fill="#7f8c8d" d="M5 21q-.825 0-1.413-.588T3 19V5q0-.825.588-1.413T5 3h9v5h2v2h5v9q0 .825-.588 1.413T19 21H5Zm1-4h12l-3.75-5l-3 4L9 13l-3 4Zm11-8V7h-2V5h2V3h2v2h2v2h-2v2h-2Z" /></svg>
                                    <Typography component={'p'} variant='h6' sx={{ fontWeight: '700', color: '#7f8c8d' }}>Selectionnez ou glissez une image ici </Typography>
                                    <Typography component={'p'} variant='h6' sx={{ fontWeight: '500', color: '#7f8c8d', fontSize: 14 }}>L'image de la facture correspondante à cet approvisionement</Typography>
                                </div>
                            </Box>
                            :
                            <Box {...getRootProps()} component="div" sx={{ border: '1px dashed grey', width: '33vw', height: '40vh', cursor: 'pointer' }}>
                                <input {...getInputProps()} />
                                <img src={image} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'fill' }} />
                            </Box>
                    }
                </DialogContent>
                <DialogActions>
                    <Button color='error' onClick={handleClose}>Annuler</Button>
                    <Button color='secondary' onClick={handleClose}>Continuer</Button>
                </DialogActions>
            </Dialog>


            <div class='card-header d-flex justify-content-between'>
                <h5>{supplier?.def}</h5>
                <div class='card-header-action' >
                    <Button variant='contained' margin='dense' onClick={handleClickOpen} color='secondary' startIcon={<AddPhotoAlternateIcon />}>Ajouter une image</Button>
                    {
                        stocks.length > 0 ?
                            <Button margin='dense' onClick={handleAddStock} startIcon={<SaveAltIcon />}>Enregistrer</Button>
                            :
                            <Button margin='dense' disabled startIcon={<SaveAltIcon />}>Enregistrer</Button>

                    }
                </div>
            </div>
            <div class='card-body'>
                <Container fixed sx={{ padding: 0 }}>
                    <Box sx={{ height: '74vh', overflow: 'auto', padding: 1 }} >
                        <Grid container spacing={2} columns={12}>
                            {
                                stocks.length > 0 ?
                                    stocks.map(item => (
                                        <Grid item xs={12} md={4} lg={4} >
                                            <TextField
                                                type='number'
                                                fullWidth
                                                autoComplete='off'
                                                value={inputsValue[`${item.nom}`]}
                                                id="outlined-basic"
                                                onChange={(e) => handleChangeQty(e.target.value, item.nom)}
                                                label={item.nom}
                                                variant="outlined"
                                            />
                                        </Grid>
                                    ))
                                    :

                                    <div class='text-center mt-5 ml-4'>
                                        <Typography variant='h6' component={'h6'}>
                                            Vous n'avez pas de produit correspondant à ce fournisseur dans votre stock
                                        </Typography>
                                    </div>
                            }
                        </Grid>
                    </Box>
                </Container>
            </div>
            <Snackbar
                TransitionComponent={SlideTransition}
                transitionDuration={200}

                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                open={openAlert} autoHideDuration={3000} onClose={handleClose}
            >
                <Alert onClose={handleCloseSnack} severity={states.variant} sx={{ maxWidth: '400px' }}>
                    <AlertTitle>{states.title}</AlertTitle>
                    {states.message}
                </Alert>
            </Snackbar>
        </React.Fragment >
    )
}
