import React, { useEffect, useRef, useState } from 'react'
import Sidebar from '../sidebar/sidebar'
import Settings from '../settings/settings'
import { useReactToPrint } from 'react-to-print'
import { stock } from '../../database'
import moment from 'moment/moment'
import { useParams } from 'react-router-dom'
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../firebase'
import CurrencyFormat from 'react-currency-format'
import { useStateValue } from '../../components/stateProvider'
import { Skeleton } from '@mui/material'

export default function Invoice() {

    const [{ customer, employee, stock }, dispatch] = useStateValue()

    const contentRef = useRef()
    const [show, setShow] = useState(true)
    const [data, setData] = useState(null)
    const [invoicesProduct, setInvoicesProduct] = useState(null)
    const [groupedArray, setGroupedArray] = useState(null)

    const params = useParams()

    const handlePrint = useReactToPrint({
        content: () => contentRef.current,
        documentTitle: data ? `facture${data.InvoiceNum}` : 'facture',
        onAfterPrint: () => setShow(true)
    })

    function productOfArray(array) {
        let sum = 0
        for (let i = 0; i < array.length; i += 1) {
            sum += (array[i].qty * array[i].price)
        }
        return sum
    }
    function sumArray(array) {
        let sum = 0
        for (let i = 0; i < array.length; i += 1) {
            sum += parseInt(array[i].qty)
        }
        return sum
    }

    useEffect(() => {
        const getData = async () => {
            const docRef = doc(db, 'invoices', params.id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const docData = docSnap.data()
                let id = docSnap.id
                setData({ ...docData, id })

                const q = query(collection(db, "invoicesProduct"), where("invoiceId", "==", id));
                const querySnapshot = await getDocs(q);
                let array = []
                querySnapshot.forEach((doc) => {
                    const data = doc.data()
                    const id = doc.id
                    array.push({ id, ...data })
                });

                const groupedData = array.reduce((acc, obj) => {
                    const key = obj.productId;
                    if (!acc[key]) {
                        acc[key] = [];
                    }
                    acc[key].push(obj);
                    return acc;
                }, {});

                setGroupedArray(groupedData)

                setInvoicesProduct(array)

            } else {
                alert("cette fature n'existe pas")
                window.history.back()
            }
        }
        getData()
    }, [])
    useEffect(() => {
        document.title = data ? `Facture - ${params.id}` : 'Facture'
    }, [data])

    // if (!data, !invoicesProduct, !groupedArray) {
    //     return <div class="loader"></div>
    // }

    return (
        <div>
            <div id="app">
                <div class="main-wrapper main-wrapper-1">
                    <div class="navbar-bg"></div>
                    <Sidebar />
                    <div class="main-content">
                        {
                            !data || !invoicesProduct || !groupedArray ?
                                <div class='card'>
                                    <div class='card-body'>
                                        <Skeleton variant="rounded" animation='wave' sx={{ width: '73vw', height: '83vh' }} />
                                    </div>
                                </div>
                                :
                                <section class="section">
                                    <div class="section-body">
                                        <div class="invoice" ref={contentRef}>
                                            <div class="invoice-print">
                                                <div class="row">
                                                    <div class="col-lg-12 text-dark">
                                                        <div class="invoice-title">
                                                            <h4 class="text-center text-uppercase">Le kilombo depot</h4>
                                                            <p class='text-center'>TEL: 677788899 / Ngodi-bakoko, Ari, Village</p>
                                                        </div>
                                                        <hr />
                                                        <div class="row">
                                                            <div class="col-md-6">
                                                                <address>
                                                                    <strong>Facture N°{data.invoiceNum}</strong><br />
                                                                    <strong>Date</strong>: {moment(data.createdAt.toDate()).format('DD/MM/YYYY • HH:mm')}<br />
                                                                    {/* <strong>Livrée</strong>: {data.delivered == true ? 'oui' : 'non'}<br />
                                                            <strong>Livreur</strong>: {data.delivered == true ? employee.find(item => item.id == data.deliverer).surname : 'NaN'}<br /> */}
                                                                </address>
                                                            </div>
                                                            <div class="col-md-6 text-md-right">
                                                                <address>
                                                                    Nom du client: <strong>{data.customerName}</strong><br />
                                                                    Contact: <strong>{data.customerId == 'client divers' ? data.customerNum : customer.find(item => item.id == data.customerId).tel.map((el, index) => { return `${el} ${index == 0 ? ' / ' : ''}` })}</strong><br />
                                                                    <strong>Ngodi-bakoko, Douala</strong><br />
                                                                </address>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-md-12">
                                                        <div class="table-responsive">
                                                            <table class="table table-bordered table-striped table-hover table-sm" id="save-stage">
                                                                <tbody>
                                                                    <tr>
                                                                        <th class='text-center' data-width="40">#</th>
                                                                        <th class="text-center">Désignations</th>
                                                                        <th class="text-center">P.U</th>
                                                                        <th class="text-center">Quantity</th>
                                                                        <th class="text-right">Total</th>
                                                                    </tr>
                                                                    {/* {
                                                                invoicesProduct.map((_, i) => (
                                                                    <tr>
                                                                        <td class='text-center'>{i + 1}</td>
                                                                        <td class="text-center">{_.nom}</td>
                                                                        <td class="text-center">{_.price}</td>
                                                                        <td class="text-center">{_.qty}</td>
                                                                        <td class="text-right">{_.qty * _.price}</td>
                                                                    </tr>
                                                                ))
                                                            } */}

                                                                    {
                                                                        Object.keys(groupedArray).map((group) => (
                                                                            <tr>
                                                                                <td class='text-center'>{1}</td>
                                                                                <td class="text-center">{stock.find(it => it.id == group).nom}</td>
                                                                                <td class="text-center">{groupedArray[group][0].price}</td>
                                                                                <td class="text-center">{sumArray(groupedArray[group])}</td>
                                                                                <td class="text-right">{groupedArray[group][0].price * sumArray(groupedArray[group])}</td>
                                                                            </tr>
                                                                        ))
                                                                    }

                                                                    <tr>
                                                                        <td></td>
                                                                        <td></td>
                                                                        <td class="h6 text-center">Total</td>
                                                                        <td class="text-center">{sumArray(invoicesProduct)}</td>
                                                                        <td class="text-right h6"><CurrencyFormat CurrencyFormat value={productOfArray(invoicesProduct)} displayType={'text'} thousandSeparator={true} /></td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class='row'>
                                                    <div class='col-6 mt-4' style={{ marginBottom: '85px' }}>
                                                        <p class='text-center'>Client: <span class='h6 ml-1 text-capitalize' style={{ fontWeight: 'bold' }}>{data.customerName}</span></p>
                                                    </div>
                                                    <div class='col-6 mt-4' style={{ marginBottom: '85px' }}>
                                                        <p class='text-center'>Opérateur: <span class='h6 ml-1 text-capitalize' style={{ fontWeight: 'bold' }}>Nadine</span></p>
                                                    </div>
                                                </div>
                                                <hr />
                                                <div class='row'>
                                                    <span class='col-5 text-left' style={{ fontSize: 12 }}>
                                                        Nb:les produits vendus ne sont ni échangés ni remboursés
                                                    </span>
                                                    <span class='col-4 text-center' style={{ fontSize: 12 }}>
                                                        <strong>Online Service</strong> powered by <strong>Interact &copy;</strong>,
                                                    </span>
                                                    <span class='col-3 text-right' style={{ fontSize: 12 }}>
                                                        <strong>{!show && moment().format('DD/MM/YYYY • HH:mm')}</strong>
                                                    </span>
                                                </div>
                                            </div>
                                            {
                                                show &&
                                                <div class="text-md-right" id='printBtn'>
                                                    <button
                                                        onClick={() => {
                                                            setShow(false);
                                                            setTimeout(() => {
                                                                handlePrint()
                                                            }, 2);
                                                        }}
                                                        class="btn btn-warning btn-icon icon-left"><i class="fas fa-print"></i> Imprimer</button>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </section>
                        }
                        <Settings />
                    </div>
                </div>
            </div>
        </div>
    )
}
