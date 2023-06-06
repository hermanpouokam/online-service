import React, { useState } from 'react'
import Sidebar from '../sidebar/sidebar'
import Settings from '../settings/settings'
import moment from 'moment'

export default function FinancesHistory() {

    const [date, setDate] = useState(moment().format('YYYY-MM-DD'))

    const handleDateChanged = (e) => {
        setDate(e.target.value)
    }

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
                                            <h4>Historique de dépenses</h4>
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
                                        <div class='card-body'>
                                            <div class="table-responsive">
                                                <table class="table table-striped table-md table-hover" id="save-stage">
                                                    <thead>
                                                        <tr>
                                                            <th>#</th>
                                                            <th>Utilisateur</th>
                                                            <th>Montant</th>
                                                            <th>Commentaire</th>
                                                            <th>Date</th>
                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>Tiger Nixon</td>
                                                            <td>System Architect</td>
                                                            <td>Edinburgh</td>
                                                            <td>61</td>
                                                            <td>2011/04/25</td>
                                                            <td>$320,800</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Sonya Frost</td>
                                                            <td>Software Engineer</td>
                                                            <td>Edinburgh</td>
                                                            <td>23</td>
                                                            <td>2008/12/13</td>
                                                            <td>$103,600</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Jena Gaines</td>
                                                            <td>Office Manager</td>
                                                            <td>London</td>
                                                            <td>30</td>
                                                            <td>2008/12/19</td>
                                                            <td>$90,560</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Quinn Flynn</td>
                                                            <td>Support Lead</td>
                                                            <td>Edinburgh</td>
                                                            <td>22</td>
                                                            <td>2013/03/03</td>
                                                            <td>$342,000</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Charde Marshall</td>
                                                            <td>Regional Director</td>
                                                            <td>San Francisco</td>
                                                            <td>36</td>
                                                            <td>2008/10/16</td>
                                                            <td>$470,600</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Haley Kennedy</td>
                                                            <td>Senior Marketing Designer</td>
                                                            <td>London</td>
                                                            <td>43</td>
                                                            <td>2012/12/18</td>
                                                            <td>$313,500</td>
                                                        </tr>
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
        </div>
    )
}
