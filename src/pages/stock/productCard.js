import React, { useEffect, useState } from 'react'
import { Box, Container, Grid, TextField, Typography } from '@mui/material'
import { useStateValue } from '../../components/stateProvider'
import { onlyNumberTest } from '../../components/functions/regex'

export default function ProductCard(props) {

    const supplier = props.supplier

    const [{ stock, products, parfum }, dispatch] = useStateValue()
    const [stocks, setStocks] = useState([])
    const [inputsValue, setInputsValue] = useState({})

    const handleChangeQty = (qty, item) => {
        if (onlyNumberTest(qty)) {
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
            console.log([
                ...data,
                ...parfumModified
            ].filter(product => suppliers.includes(product.id)))
        }
    }, [supplier])

    return (
        <React.Fragment>
            <div class='card-header'>
                <h5>{supplier?.def}</h5>
                <div class='card-header-action'>

                </div>
            </div>
            <div class='card-body'>
                <Container fixed>
                    <Box sx={{ height: '74vh' }} >
                        <Grid container spacing={2} columns={12}>
                            {
                                stocks.length ?
                                    stocks.map(item => (
                                        <Grid item xs={12} md={4} lg={4} >
                                            <TextField
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

                                    <div>
                                        <Typography>
                                            Vous n'avez de produit correspondant à ce fournisseur dans votre stock
                                        </Typography>
                                    </div>
                            }
                        </Grid>
                    </Box>
                </Container>
            </div>
        </React.Fragment >
    )
}
