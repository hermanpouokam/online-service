import React, { useEffect, useState } from 'react'
import Sidebar from '../sidebar/sidebar'
import Settings from '../settings/settings'
import ProductCard from './productCard'
import { styled } from '@mui/material/styles';
import { Backdrop, Box, CircularProgress, Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Typography } from '@mui/material'
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { useStateValue } from '../../components/stateProvider'

export default function NewStock() {


    const StyledPaper = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        height: '100%',
        maxWidth: 350,
        color: theme.palette.text.primary,
    }));

    const [{ stock, products }, dispatch] = useStateValue()

    const suppliers = [
        {
            'id': 'sp',
            'def': 'Source du Pays'
        },
        {
            'id': 'sabc',
            'def': 'Brasseries du cameroun'
        },
        {
            'id': 'ucb',
            'def': 'Union Camerounaise des Brasseries'
        },
        {
            'id': 'CCGBC',
            'def': 'Coca Cola Gracedom Bottling Company'
        },

    ]

    const [step, setStep] = useState(1)
    const [inputsValues, setInputValues] = useState({})
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [supplier, setSupplier] = useState(suppliers[0])
    const [render, setRender] = useState(1)
    const [label, setLabel] = useState('')
    const [progressBar, setProgressBar] = React.useState(0)
    const [openBackDrop, setOpenBackDrop] = React.useState(false);

    const handleCloseBackDrop = () => {
        setOpenBackDrop(false);
    };
    const handleOpenBackDrop = () => {
        setOpenBackDrop(true);
    };


    useEffect(() => {
        document.title = 'Nouvel approvisionement'
    }, [])

    useEffect(() => {
        stock.map((el, i) => {
            setInputValues({
                [el.item]: 0,
                ...inputsValues,
            })
        })
    }, [])

    const handleClickSupplier = (element) => {
        setSupplier(element)
    }



    const SuppliersCard = () => {

        return (
            <StyledPaper>
                <div class='card-header'>
                    <Typography component='h5' variant='h6' noWrap>Choisissez un fournisseur</Typography>
                </div>
                <div class='card-body'>
                    <List
                        sx={{
                            width: '100%',
                            bgcolor: 'background.paper',
                            position: 'relative',
                            overflow: 'auto',
                            maxHeight: '74vh',
                            '& ul': { padding: 0 },
                        }}
                        aria-label="contacts"
                    >
                        {
                            suppliers.map(element => (
                                <ListItem disablePadding>
                                    <ListItemButton onClick={() => handleClickSupplier(element)}>
                                        <ListItemIcon>
                                            {supplier?.id !== element.id ? <RadioButtonUncheckedIcon /> : <RadioButtonCheckedIcon />}
                                        </ListItemIcon>
                                        <ListItemText primary={element.id.toUpperCase()} secondary={<Typography noWrap>{element.def}</Typography>} />
                                    </ListItemButton>
                                </ListItem>
                            ))
                        }

                    </List>
                </div>
            </StyledPaper>
        )
    }

    function CircularProgressWithLabel(props) {
        return (
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress variant="determinate" {...props} />
                <Box
                    sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        padding: 5,
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Typography variant="caption" component="div" color="text.light">
                        {`${Math.round(props.value)}%`}
                    </Typography>
                </Box>
            </Box>
        );
    }

    return (
        <div>
            {/* <div class="loader"></div> */}
            <div id="app">
                <div class="main-wrapper main-wrapper-1">
                    <div class="navbar-bg"></div>
                    <Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={openBackDrop}
                    >
                        <div>
                            {label}
                        </div>
                        <div>
                            <CircularProgressWithLabel value={progressBar} />
                        </div>
                    </Backdrop>
                    <Sidebar />
                    <div class="main-content">
                        <section class="section">
                            <div class="section-body">
                                <div class='card'>
                                    <Grid container spacing={1}>
                                        <Grid item sm={12} wrap='nowrap' md={4} lg={3}>
                                            <SuppliersCard />
                                        </Grid>
                                        <Grid item sm={12} md={8} lg={9}>
                                            {
                                                !loading ?
                                                    !supplier ?
                                                        <span>Selectionnez un fournisseur</span>
                                                        :
                                                        <ProductCard
                                                            supplier={supplier} setProgress={(e) => setProgressBar(e)}
                                                            setOpenBackDrop={(e) => setOpenBackDrop(e)}
                                                            setLabel={(e) => setLabel(e)}
                                                        />
                                                    :
                                                    <span>Veuillez patienter...</span>
                                            }
                                        </Grid>
                                    </Grid>
                                </div>
                            </div>
                        </section>
                        <Settings />
                    </div>
                </div>
            </div>
        </div>
    )
}
