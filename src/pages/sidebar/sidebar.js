import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Navbar from './navbar'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../../firebase'
import { useStateValue } from '../../components/stateProvider'

export default function Sidebar() {

    let getLocation = useLocation()
    let res = getLocation.pathname.split('/')
    let location = `/${res[1]}`
    const [{ }, dispatch] = useStateValue()

    useEffect(() => {
        dispatch({
            type: 'REFRESH',
            payload: true
        })
    }, [])

    const links = [
        {
            'name': 'home',
            'icon': 'desktop_windows',
            'link': '/?from=sidebar&klm=user&to=dashboard&rt=1&tk=Hxjq8i9iJ9uh1hdnkl',
            'text': 'Tableau de bord',
        },
        {
            'name': 'daily',
            'icon': 'donut_large',
            'link': '/dailyclosure',
            'text': 'Bouclage journalier',
        },
        {
            'name': 'stock',
            'icon': 'dashboard',
            'link': '/stock',
            'text': 'Gestion de stock',
        },
        {
            'name': 'orders',
            'icon': 'event_note',
            'link': '/orders',
            'text': 'Factures',
        },
        {
            'name': 'customer',
            'icon': 'people',
            'link': '/customer',
            'text': 'Clients',
        },
        {
            'name': 'Finances',
            'icon': 'account_balance_wallet',
            'link': '/finances',
            'text': 'Finances',
        },
        {
            'name': 'history',
            'icon': 'history',
            'link': '/history',
            'text': 'Historique',
        },
        {
            'name': 'users',
            'icon': 'group',
            'link': '/users',
            'text': 'Employés',
        },
        {
            'name': 'parameter',
            'icon': 'settings',
            'link': '/params',
            'text': 'Parametres',
        }
    ]

    return (
        <div>
            <Navbar />
            <div class="main-sidebar sidebar-style-2" >
                <aside id="sidebar-wrapper">
                    <div class="sidebar-brand">
                        <a href="/?from=auth&klm=user&to=dashboard&rt=1&tk=Hxjq8i9iJ9uh1hdnkl">
                            <img alt="image" src="assets/img/logo.png" class="header-logo" />
                            <span class="logo-name"> Kilombo DEPOT</span>
                        </a>
                    </div>
                    <ul class="sidebar-menu">
                        {
                            links.map((item, i) => (
                                <li key={i} class={` ${location == item.link ? 'active' : null}`}>
                                    <a href={item.link} class={`nav-link `}>
                                        <i class={`material-icons`}>{item.icon}</i>
                                        <span>{item.text}</span>
                                    </a>
                                </li>
                            ))
                        }
                    </ul>
                </aside>
            </div>
        </div>
    )
}
