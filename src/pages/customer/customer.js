import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Settings from '../settings/settings'
import Sidebar from '../sidebar/sidebar'
import CustomerCard from './CustomerCard'
import { useStateValue } from '../../components/stateProvider'
import CustomerCardList from './customerCardList'
import { List } from '@mui/material'

export default function Customer() {

    const [{ customer }, dispatch] = useStateValue()
    const [display, setDisplay] = useState()
    const [customers, setCustomers] = useState(customer)

    let location = useLocation()
    let href = window.location.href

    useLayoutEffect(() => {
        const hrefArray = href.split('?')
        if (hrefArray[1]) {
            const display = hrefArray[1].split('=')[1]
            if (display != 'list' && display != 'grid') {
                window.location.assign('customer?display=grid')
            }
            setDisplay(display)
        }
    }, [href])

    const handleChange = (e) => {
        // console.log(customer)
        const newData = customer.filter(item => {
            const itemData = `${item.nom.toUpperCase()}}`;
            const textData = e.target.value.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        setCustomers(newData)
    }

    useEffect(() => {
        document.title = 'CLients'
    }, [])

    function CustomerList() {
        return (
            <div class='card'>
                <div class="card-body">
                    <ul class="list-unstyled user-progress list-unstyled-border list-unstyled-noborder">
                        {
                            customers.map((item, i) => (
                                <CustomerCardList item={item} i={i} />
                            ))
                        }
                    </ul>
                </div>

            </div>
        )
    }
    function CustomerGrid() {
        return (
            <div class='row'>
                {
                    customers.map((item, i) => (
                        <CustomerCard item={item} i={i} />
                    ))
                }
            </div>
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
                                <div class='row'>
                                    <div class='col-12'>
                                        <div class='card'>
                                            <div class="card-header">
                                                <h4>Gestion de client</h4>
                                                <div class="card-header-action d-flex">
                                                    <form class="card-header-form">
                                                        <div class="input">
                                                            <input type="text" name="search" onChange={handleChange} autoComplete='off' class="form-control" placeholder="Recherche" />
                                                        </div>
                                                    </form>
                                                    <div class="dropdown d-inline ml-sm-2">
                                                        <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton2"
                                                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                            Type d'affichage
                                                        </button>
                                                        <div class="dropdown-menu">
                                                            <Link class="dropdown-item has-icon"
                                                                to={`${location.pathname}?display=grid`}
                                                                style={{ background: display == 'grid' ? 'rgba(56, 182, 255, 0.178)' : '' }}
                                                            >

                                                                <i class="fas fa-th"></i> Grille
                                                            </Link>
                                                            <Link class="dropdown-item has-icon"
                                                                style={{ background: display == 'list' ? 'rgba(56, 182, 255, 0.178)' : '' }}

                                                                to={`${location.pathname}?display=list`}><i class="fas fa-th-list"></i> Liste</Link>
                                                        </div>
                                                    </div>
                                                    <a href="/customer/addCustomer?crp=true&from=sidebar&onAfter=customer" data-toggle="tooltip" data-placement="top" title='Ajouter un client' class="btn btn-icon btn-success ml-sm-2"><i class="fas fa-plus"></i></a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {
                                    display == 'grid' ?
                                        < CustomerGrid />
                                        :
                                        <CustomerList />
                                }
                            </div>
                        </section>
                        <Settings />
                    </div>
                </div>
            </div>
        </div>
    )
}
