import React, { useEffect, useState } from 'react'
import Sidebar from '../sidebar/sidebar'
import Settings from '../settings/settings'
import ProductCard from './productCard'
import { styled } from '@mui/material/styles';
import { Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Typography } from '@mui/material'
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

    return (
        <div>
            {/* <div class="loader"></div> */}
            <div id="app">
                <div class="main-wrapper main-wrapper-1">
                    <div class="navbar-bg"></div>
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
                                                        <ProductCard supplier={supplier} />
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
