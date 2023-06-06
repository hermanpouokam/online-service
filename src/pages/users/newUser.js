import React from 'react'
import Sidebar from '../sidebar/sidebar'
import Settings from '../settings/settings'
import { Button } from '@mui/material'

export default function NewUser() {
    
    return (
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
                                            <h4>Ajouter un utilisateur</h4>
                                            <div class="card-header-action">
                                                <Button size={'medium'} variant="contained" startIcon={<i class='fa fa-check'></i>}>
                                                    Ajouter
                                                </Button>
                                            </div>
                                        </div>
                                        <div class="card-body row">
                                            <div class='col-6 col-lg-6 col-md-6 col-12'>
                                                <div class="form-group">
                                                    <label>Nom</label>
                                                    <div class="input-group">
                                                        <div class="input-group-prepend">
                                                            <div class="input-group-text">
                                                                <i class="fas fa-user"></i>
                                                            </div>
                                                        </div>
                                                        <input type="text" class="form-control phone-number" />
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label>Prenom</label>
                                                    <div class="input-group">
                                                        <div class="input-group-prepend">
                                                            <div class="input-group-text">
                                                                <i class="fas fa-user"></i>
                                                            </div>
                                                        </div>
                                                        <input type="text" class="form-control phone-number" />
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label>Adresse e-mail</label>
                                                    <div class="input-group">
                                                        <div class="input-group-prepend">
                                                            <div class="input-group-text">
                                                                <i class="fas fa-at"></i>
                                                            </div>
                                                        </div>
                                                        <input type="text" class="form-control phone-number" />
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label>Numero</label>
                                                    <div class="input-group">
                                                        <div class="input-group-prepend">
                                                            <div class="input-group-text">
                                                                <i class="fas fa-phone"></i>
                                                            </div>
                                                        </div>
                                                        <input type="text" class="form-control phone-number" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div class='col-6 col-lg-6 col-md-6 col-12'>
                                                <div class="form-group">
                                                    <label>Salaire</label>
                                                    <div class="input-group">
                                                        <div class="input-group-prepend">
                                                            <div class="input-group-text">
                                                                <i class="fas fa-dollar-sign"></i>
                                                            </div>
                                                        </div>
                                                        <input type="text" class="form-control phone-number" />
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label>Localisation</label>
                                                    <div class="input-group">
                                                        <div class="input-group-prepend">
                                                            <div class="input-group-text">
                                                                <i class="fas fa-map-pin"></i>
                                                            </div>
                                                        </div>
                                                        <input type="text" class="form-control phone-number" />
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label>Photo</label>
                                                    <div class="input-group">
                                                        <input type="file" class="form-control phone-number" />
                                                    </div>
                                                </div>
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
        </div>
    )
}
