import React, { useEffect, useState } from 'react'
import Sidebar from '../sidebar/sidebar'
import Settings from '../settings/settings'
import { stock } from '../../database'
import moment from 'moment/moment'

export default function Daily() {

    const [date, setDate] = useState(moment().format('YYYY-MM-DD'))

    useEffect(() => {
        document.title = 'Online service - Bouclage journalier'
    }, [])

    const handleDateChanged = (e) => {
        setDate(e.target.value)
    }

    const dash = [
        {
            'id': '1',
            'text': 'Recette journalière',
            'icon': 'fas fa-box',
            'bgColor': 'l-bg-cyan',
            'number': `450`,
            'lastUpdated': '2 jours',
            'numberColor': 'red',
            'increase': '10'
        },
        {
            'id': '2',
            'text': 'Despense journalière',
            'icon': 'fas fa-dollar-sign',
            'bgColor': 'l-bg-red-dark',
            'number': '1,562',
            'lastUpdated': 'last month',
            'numberColor': 'red',
            'increase': '10',
        },
        {
            'id': '8',
            'text': 'Bénéfice journalier',
            'icon': 'fas fa-coins',
            'bgColor': 'l-bg-green-dark',
            'number': '1,562',
            'lastUpdated': 'last month',
            'numberColor': 'red',
            'increase': '10',
        },
        {
            'id': '3',
            'text': 'Montant en caisse',
            'icon': 'far fa-money-bill-alt',
            'bgColor': 'l-bg-orange',
            'number': '1,562',
            'lastUpdated': 'last month',
            'numberColor': 'red',
            'increase': '10',
        }
    ]
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
                                                <h4>Bouclage journalier</h4>
                                                <div class="card-header-action row">
                                                    <button data-toggle="tooltip" data-placement="top" title='cloturer la journée' class="btn btn-icon btn-success mr-sm-2"><i class="fas fa-check"></i></button>
                                                    <form class="card-header-form">
                                                        <div class="input-group">
                                                            <input
                                                                type="date" class="form-control"
                                                                min={moment().subtract(10, 'days').format('YYYY-MM-DD')}
                                                                max={moment().format('YYYY-MM-DD')}
                                                                value={date}
                                                                onChange={handleDateChanged}
                                                            />
                                                            <div class="input-group-btn">
                                                                <button class="btn btn-primary btn-icon"><i class="fas fa-search"></i></button>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    {
                                        dash.map((item, index) => (
                                            <div class="col-xl-3 col-lg-6" key={index}>
                                                <div class="card">
                                                    <div class="card-body card-type-3">
                                                        <div class="row">
                                                            <div class="col">
                                                                <h6 class="text-muted mb-0">{item.text}</h6>
                                                                <span class="font-weight-bold mb-0">{item.number}</span>
                                                            </div>
                                                            <div class="col-auto">
                                                                <div class={`card-circle ${item.bgColor} text-white`}>
                                                                    <i class={item.icon}></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <p class="mt-3 mb-0 text-muted text-sm">
                                                            <span class="text-success mr-2"><i class={`fa fa-arrow-${'up'}`}></i>10%</span>
                                                            <span class="text-nowrap">Depuis {item.lastUpdated}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }

                                </div>
                                <div class="row">
                                    <div class="col-lg-8 col-md-12 col-12 col-sm-12">
                                        <div class="card">
                                            <div class="card-header">
                                                <h4>Ventes journalières</h4>
                                            </div>
                                            <div class="card-body" id="top-5-scroll">
                                                <div class="table-responsive">
                                                    <table class="table table-md table-hover">
                                                        <thead>
                                                            <tr>
                                                                <th>#</th>
                                                                <th>Article</th>
                                                                <th class='text-right'>Quantite initiale</th>
                                                                <th class='text-right'>Quantite vendu</th>
                                                                <th class='text-right'>Quantite finale</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                stock.map((_, i) => (
                                                                    <tr key={i}>
                                                                        <td>{i + 1}</td>
                                                                        <td>{_.item}</td>
                                                                        <td class='text-right'>
                                                                            {_.already}
                                                                        </td>
                                                                        <td class='text-right'>
                                                                            {_.in}
                                                                        </td>
                                                                        <td class='text-right'>
                                                                            {_.already - _.in}
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                            }
                                                        </tbody>

                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-4 col-md-12 col-12 col-sm-12">
                                        <div class="card">
                                            <div class="card-header">
                                                <h4>Recettes des vendeurs</h4>
                                            </div>
                                            <div class="card-body overflow" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                                <ul class="list-unstyled list-unstyled-border user-list">
                                                    {
                                                        [...Array(10).fill('')].map(() => (
                                                            <li class="media hoverable">
                                                                <img alt="image" src="assets/img/users/user-1.png"
                                                                    class="mr-3 user-img-radious-style user-list-img" />
                                                                <div class="media-body">
                                                                    <div class="mt-0 font-weight-bold">Kemmogne Herman</div>
                                                                    <div class="text-small">567,800XAF</div>
                                                                </div>
                                                            </li>
                                                        ))
                                                    }
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class='row'>
                                    <div class="col-lg-12 col-md-12 col-12 col-sm-12">
                                        <div class="card">
                                            <div class="card-header">
                                                <h4>Ventes journalières</h4>
                                            </div>
                                            <div class="card-body" id="top-5-scroll">
                                                <div class="table-responsive">
                                                    <table class="table table-md table-hover table-striped">
                                                        <thead>
                                                            <tr>
                                                                <th>#</th>
                                                                <th >N° de facture</th>
                                                                <th class=''>Client</th>
                                                                <th >Montant</th>
                                                                <th>Date</th>
                                                                <th class='text-center'>Statut</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                stock.map((_, i) => (
                                                                    <tr key={i}>
                                                                        <td>{i + 1}</td>
                                                                        <td >
                                                                            {_.already}
                                                                        </td>
                                                                        <td>{_.item}</td>
                                                                        <td>
                                                                            {_.in}
                                                                        </td>
                                                                        <td>
                                                                            {moment().format('LT')}
                                                                        </td>
                                                                        <td class='text-center'>
                                                                            <div class="badge badge-success">Active</div>
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                            }
                                                        </tbody>

                                                    </table>
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
            </div >
        </div >
    )
}
