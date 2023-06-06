import React, { useEffect, useRef, useState } from 'react'
import Sidebar from '../sidebar/sidebar'
import Settings from '../settings/settings'
import CustomInput from './customInput'
import { stock } from '../../database'

export default function NewStock() {


    const [step, setStep] = useState(1)
    const [inputsValues, setInputValues] = useState({})
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState(stock)

    useEffect(() => {
        document.title = 'Online service - Nouvel approvisionement'
    }, [])

    useEffect(() => {
        stock.map((el, i) => {
            setInputValues({
                [el.item]: 0,
                ...inputsValues,
            })
        })
    }, [])

    const handleChange = (e) => {
        console.log(e.target.name);
        console.log(e.target.value);
        console.log(inputsValues);
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
                                <div class='d-flex justify-content-center align-items-center'>
                                    <div style={{ padding: 0 }} class='card col-lg-12  col-md-12 col-sm-12'>
                                        <div class='row-supply'>
                                            <div class={`state state-1  ${step == 2 && 'deactive'}`}>
                                                <div class='card-header'>
                                                    <h4 class='text-center'>
                                                        Choisissez le fournisseur
                                                    </h4>
                                                </div>
                                                <div class='card-body row'>
                                                    {[...Array(4).fill(0)].map((_, i) => (
                                                        <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                                                            <div onClick={() => setTimeout(() => {
                                                                setStep(2)
                                                            }, 500)} class={`scalable card ${i == 0 ? 'l-bg-cyan' : i == 1 ? 'l-bg-red-dark' : i == 2 ? 'l-bg-orange-dark' : 'l-bg-yellow'} `}>
                                                                <div class="card-statistic-3">
                                                                    <div class="card-icon card-icon-large"><i class="fa fa-box"></i></div>
                                                                    <div class="card-content">
                                                                        <h4 class="card-title text-capitalize">
                                                                            {
                                                                                i == 0 ? 'Source Du pays'
                                                                                    : i == 1 ? 'S.A.B.C'
                                                                                        : i == 2 ? 'U.C.B'
                                                                                            : 'En attente...'
                                                                            }
                                                                        </h4>
                                                                        <span>524</span>

                                                                        <p class="mb-0 text-sm">
                                                                            <span class="mr-2"><i class="fa fa-arrow-up"></i> 10%</span>
                                                                            <span class="text-nowrap">Since last month</span>
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div class={`state state-2   ${step == 2 && 'active'}`}>
                                                <div class='card-header'>
                                                    <h4 class='text-center'>
                                                        Entrez les articles
                                                    </h4>
                                                    <div class='card-header-action'>
                                                        <button onClick={() => {
                                                            setTimeout(() => {
                                                                setStep(1)
                                                            }, 500);
                                                        }} class="btn btn-icon text-primary btn-danger icon-left mr-sm-1"><i class="fas fa-times"></i> Annuler</button>
                                                        <button class="btn btn-icon text-primary btn-success icon-left mr-sm-1"><i class="fa fa-check"></i> Terminer</button>
                                                    </div>
                                                </div>
                                                <div class='card-body d-flex justify-content-center align-items-center'>
                                                    <form class='form-inline'>
                                                        {data.map((val, i) => (
                                                            <CustomInput
                                                                onChange={handleChange}
                                                                name={val.item}
                                                            />
                                                        ))}
                                                    </form>
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
