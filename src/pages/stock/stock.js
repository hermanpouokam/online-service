import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Settings from '../settings/settings'
import Sidebar from '../sidebar/sidebar'
import { stock } from '../../database'

export default function Stock() {

    useEffect(() => {
        document.title = 'Online service - stock'
    }, [])

    return (
        <div>
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
                                                <h4>Gestion de stock</h4>
                                                <div class="card-header-action">
                                                    <a
                                                        href='/stock/newproduct'
                                                        data-toggle="tooltip"
                                                        data-placement="top"
                                                        title='Ajouter un produit'
                                                        class="btn btn-icon btn-success">
                                                        <i class="fas fa-plus"></i>
                                                    </a>
                                                    <a href='/stock/newsupply' data-toggle="tooltip" data-placement="top" title='Nouvel approvisionement' class="btn btn-icon btn-success"><i class="fas fa-plus"></i></a>
                                                    <a href="" data-toggle="tooltip" data-placement="top" title="Historique d'approvisionement" class="btn btn-icon btn-warning ml-2"><i class="fas fa-history"></i></a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class='row'>
                                    <div class='col-12 col-md-12 col-lg-12'>
                                        <div class='float-left'>
                                            <nav aria-label="breadcrumb">
                                                <ol class="breadcrumb bg-primary text-white-all">
                                                    <li class="breadcrumb-item active" aria-current="page">Tous les produits</li>
                                                    <li class="breadcrumb-item"><a href="#"> Source Du Pays</a></li>
                                                    <li class="breadcrumb-item"><a href="#"> Brasserie</a></li>
                                                    <li class="breadcrumb-item"><a href="#"> UCB</a></li>
                                                </ol>
                                            </nav>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    {
                                        stock.length > 0 ?
                                            stock.map((item, i) => (
                                                <div div class="col-xl-3 col-md-6 col-lg-6" key={i} >
                                                    <div style={{ cursor: 'pointer' }} class="card" data-toggle="modal" data-target={`#exampleModalCenter${item.id}`}>
                                                        <div class="card-body card-type-3">
                                                            <div class='card-title font-weight-bold text-center' style={{ fontSize: 16, textTransform: 'capitalize' }}>{item.item}</div>
                                                            <div class="row">
                                                                <div class='text-bold col-5'>Qte</div>
                                                                <div class="mb-0 text-bold ml-1 text-success text-right col-6">{item.in}</div>
                                                            </div>
                                                            <div class="row">
                                                                <div class='text-bold col-5'>P.U</div>
                                                                <div class="mb-0 text-bold ml-1 text-dark text-right col-6">{item.price}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                            :
                                            <div
                                                style={{
                                                    minHeight: '55vh',
                                                    minWidth: '75vw',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <div class='col-12 col-lg-6 col-md-6'>
                                                    <div class='card '>
                                                        <div class='card-body text-center h6 text-danger'>
                                                            Vous n'avez pas d'article en stock
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                    }


                                </div>
                            </div>
                        </section>
                        {
                            stock.map((item, i) => (
                                <div class="modal fade" id={`exampleModalCenter${item.id}`} tabindex="-1" role="dialog"
                                    aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                                    <div class="modal-dialog modal-dialog-centered" role="document">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h4 class="modal-title" id="exampleModalCenterTitle">{item.item}</h4>
                                            </div>
                                            <div class="modal-body">
                                                <div class='row'>
                                                    <div class='col d-flex'>
                                                        <h6>
                                                            Quantité : <span class='text-success ml-5'>{item.in}</span>
                                                        </h6>
                                                    </div>
                                                </div>
                                                <div class='row'>
                                                    <div class='col d-flex'>
                                                        <h6>
                                                            Prix unitaire: <span class='text-dark ml-4'>{item.price} XAF</span>
                                                        </h6>
                                                    </div>
                                                </div>
                                                <div class='row'>
                                                    <div class='col d-flex'>
                                                        <h6>
                                                            Prix total: <span class='text-dark ml-5'>{item.in * item.price} XAF</span>
                                                        </h6>
                                                    </div>
                                                </div>
                                                <hr />
                                                <div class='row'>
                                                    <div class='col-12' style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <h6>
                                                            Quantité écoulée:
                                                        </h6>
                                                        <span class='text-dark h6'>{item.already}</span>
                                                    </div>
                                                </div>
                                                <hr />
                                                <div class='row'>
                                                    <div class='col-12' style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <h6>
                                                            Dernière mis à jour:
                                                        </h6>
                                                        <span class='text-warning'>{item.lastUpdate}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="modal-footer bg-whitesmoke br">
                                                <button type="button" class="btn btn-danger" data-dismiss="modal">Fermer</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                        <Settings />
                    </div>
                </div>
            </div >
        </div >
    )
}
