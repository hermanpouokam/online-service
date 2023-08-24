import React, { useEffect, useState } from 'react'
import Sidebar from '../sidebar/sidebar'
import Settings from '../settings/settings'
import { collection, getDocs, orderBy, where } from 'firebase/firestore';
import { db } from '../../firebase';
import moment from 'moment';
import { Skeleton } from '@mui/material';
import { useStateValue } from '../../components/stateProvider';
import { useParams } from 'react-router-dom';

export default function InventDetails() {

    const [data, setData] = useState(null);
    const [date, setDate] = useState(moment().format('YYYY-MM-DD'))
    const [inventdata, setInventdata] = useState(null);
    const params = useParams()
    const [{ products }, dispatch] = useStateValue()

    useEffect(() => {
        let url = window.location.href
        let param = url.split('?')[1]
        let paramVal = param?.split('=')[1]

        const getData = async () => {
            const querySnapshot = await getDocs(collection(db, "history"), where('type', '==', 'inventory'))
            let result = querySnapshot.docs.map((obj) => {
                const data = obj.data()
                const id = obj.id
                return { ...data, id }
            })

            setInventdata(result)

            if (params.id) {
                const res = result.find(el => el.id == params.id)
                setDate(moment(res.createdAt.toDate()).format('YYYY-MM-DD'))
                const querySnapshotInvents = await getDocs(collection(db, "inventoryHistory"), where('inventId', '==', res.id))
                let resultInvents = querySnapshotInvents.docs.map((obj) => {
                    const data = obj.data()
                    const id = obj.id
                    return { ...data, id }
                })
                setData(resultInvents)
            } else if (paramVal) {
                setDate(paramVal)
                const res = result.find(el => moment(el.createdAt.toDate()).format('YYYY-MM-DD') == paramVal)
                const querySnapshotInvents = await getDocs(collection(db, "inventoryHistory"), where('inventId', '==', res.id))
                let resultInvents = querySnapshotInvents.docs.map((obj) => {
                    const data = obj.data()
                    const id = obj.id
                    return { ...data, id }
                })
                setData(resultInvents)
            }
        }
        getData()
    }, []);


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
                                                <h4>Inventaire du {date}</h4>
                                                <div class="card-header-action row">
                                                    <form class="card-header-form" action='stock/inventory/history/details/'>
                                                        <div class="input-group">
                                                            {
                                                                <input
                                                                    type="date" class="form-control"
                                                                    name='date'
                                                                    max={moment(inventdata[0].createdAt.toDate()).format('YYYY-MM-DD')}
                                                                    min={moment(inventdata[inventdata.length - 1].createdAt.toDate()).format('YYYY-MM-DD')}
                                                                    value={date}
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
                                                                <th>Article</th>
                                                                <th>Stock Initial</th>
                                                                <th>Stock final</th>
                                                                <th>Différence</th>
                                                                <th>Montant</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                data.map((el, i) => (
                                                                    <tr>
                                                                        <td>{i + 1}</td>
                                                                        <td>{el.article}</td>
                                                                        <td>{el.initialStock}</td>
                                                                        <td>{el.finalStock}</td>
                                                                        <td>{el.finalStock - el.initialStock}</td>
                                                                        <td>{products.find(it => it.code == el.articleId).pu * (el.finalStock - el.initialStock)}</td>
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
