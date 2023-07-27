import React, { useEffect, useState } from 'react'
import Sidebar from '../sidebar/sidebar'
import Settings from '../settings/settings'
import moment from 'moment'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '../../firebase'
import { Skeleton } from '@mui/material'
import { useStateValue } from '../../components/stateProvider'

export default function FinancesHistory() {

    const [date, setDate] = useState(moment().format('YYYY-MM-DD'))
    const [spendDoc, setSpendDoc] = React.useState(null)
    const [spendDoc1, setSpendDoc1] = React.useState(null)


    const [{ users }, dispatch] = useStateValue()

    useEffect(() => {

        let url = window.location.href
        let param = url.split('?')[1]
        let paramVal = param?.split('=')[1]
        const _getSpendHistory = async () => {
            const q = query(collection(db, "spends"), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            let array = querySnapshot.docs.map((doc) => {
                const id = doc.id
                const data = doc.data()
                return { id, ...data }
            });

            setSpendDoc1(array)
            
            if (param) {
                array = array.filter(el => {
                    const date = moment(el.createdAt.toDate()).format('YYYY-MM-DD')
                    return date == paramVal
                })

            }
            setSpendDoc(array)
        }

        _getSpendHistory()

    }, [])

    const _handleClick = (e) => {
        e.preventDefault()

    }

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
                                                <form class="card-header-form" >
                                                    <div class="input-group">
                                                        {
                                                            spendDoc !== null ?
                                                                <input
                                                                    type="date" class="form-control"
                                                                    name='date'
                                                                    min={moment(spendDoc[0]?.createdAt.toDate()).format('YYYY-MM-DD')}
                                                                    max={moment(spendDoc[spendDoc.length - 1]?.createdAt.toDate()).format('YYYY-MM-DD')}
                                                                    value={date}
                                                                    onChange={handleDateChanged}
                                                                />
                                                                :
                                                                <input
                                                                    type="text" class="form-control"
                                                                    readOnly
                                                                    value={'Veuillez patienter'}
                                                                />
                                                        }
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
                                                            <th>Operateur</th>
                                                            <th>Montant</th>
                                                            <th>Commentaire</th>
                                                            <th>Date</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            spendDoc === null ?
                                                                [...Array(5).fill(0)].map(() => (
                                                                    <tr>
                                                                        <td><Skeleton animation="wave" /></td>
                                                                        <td><Skeleton animation="wave" /></td>
                                                                        <td><Skeleton animation="wave" /></td>
                                                                        <td><Skeleton animation="wave" /></td>
                                                                        <td><Skeleton animation="wave" /></td>
                                                                    </tr>
                                                                ))
                                                                :
                                                                spendDoc.map((el, i) => (
                                                                    <tr>
                                                                        <td>{i + 1}</td>
                                                                        <td>{users.find(item => item.userId === el.userId).name}</td>
                                                                        <td>{el.amount}</td>
                                                                        <td>{el.comment}</td>
                                                                        <td>{moment(el.createdAt.toDate()).format('YYYY/MM/DD')}</td>
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
        </div>
    )
}
