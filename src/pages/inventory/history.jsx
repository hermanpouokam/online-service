import React, { useEffect, useState } from 'react'
import Sidebar from '../sidebar/sidebar'
import Settings from '../settings/settings'
import { collection, getDocs, orderBy, where } from 'firebase/firestore';
import { db } from '../../firebase';
import moment from 'moment';
import { Skeleton } from '@mui/material';
import { useStateValue } from '../../components/stateProvider';

export default function InventHistory() {

    const [data, setData] = useState(null);
    const [{ users }, dispatch] = useStateValue()
    const [date, setDate] = useState(moment().format('YYYY-MM-DD'))

    useEffect(() => {
        const getData = async () => {
            const querySnapshot = await getDocs(collection(db, "history"), where('type', '==', 'inventory'), orderBy('createdAt', 'desc'),)
            let result = querySnapshot.docs.map((obj, i) => {
                const data = obj.data()
                const id = obj.id
                return { ...data, id }
            })
            setData(result)
        }
        getData()
    }, []);

    const handleDateChanged = (e) => {
        setDate(e.target.value)
    }

    if (!data) return <div class="loader"></div>

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
                                                <h4>Historique d'inventaire</h4>
                                                <div class="card-header-action row">
                                                    <form class="card-header-form" action='stock/inventory/history/details/'>
                                                        <div class="input-group">
                                                            {
                                                                <input
                                                                    type="date" class="form-control"
                                                                    name='date'
                                                                    max={moment(data[0].createdAt.toDate()).format('YYYY-MM-DD')}
                                                                    min={moment(data[data.length - 1].createdAt.toDate()).format('YYYY-MM-DD')}
                                                                    value={date}
                                                                    onChange={handleDateChanged}
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
                                                                <th>Date</th>
                                                                <th>details</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                data === null ?
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
                                                                    data.map((el, i) => (
                                                                        <tr>
                                                                            <td>{i + 1}</td>
                                                                            <td>{users.find(item => item.userId === el.userId).name}</td>
                                                                            <td>{moment(el.createdAt.toDate()).format('YYYY/MM/DD • HH:mm')}</td>
                                                                            <td><a href={`stock/inventory/history/details/${el.id}`}>Voir plus de détails</a></td>
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
        </div>
    )
}
