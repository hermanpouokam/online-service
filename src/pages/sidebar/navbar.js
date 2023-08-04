import React, { useEffect, useState } from 'react'
import { useStateValue } from '../../components/stateProvider'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth, db } from '../../firebase'
import { Link, useNavigate } from 'react-router-dom'
import { product } from '../../database'
import { collection, doc, getDoc, getDocs, onSnapshot, query, serverTimestamp, setDoc, where } from 'firebase/firestore'
import moment from 'moment'

export default function Navbar() {

    const [{ user, refresh, enterprise, users }, dispatch] = useStateValue()
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                dispatch({
                    type: 'SET_USER',
                    user: user
                })
            } else {
                dispatch({
                    type: 'SIGN_OUT',
                    user: null
                })
                window.location.assign('/auth/login')
            }
        });
    }, [user])
    useEffect(() => {
        if (user) {
            return
        }
        window.location.assign('/auth/login')
    }, [])

    useEffect(() =>
        async () => {
            const q = query(collection(db, "articles"));
            const querySnapshot = await getDocs(q);
            let array = []
            querySnapshot.forEach((doc) => {
                const data = doc.data()
                const id = doc.id
                array.push({ id, ...data })
            });
            if (array.length > 0) {
                sessionStorage.setItem('productsKilombo', JSON.stringify(array))
                dispatch({
                    type: "SET_PRODUCTS",
                    products: array
                })
            }
            dispatch({
                type: 'REFRESH',
                payload: false
            })
        }, [refresh])

    useEffect(() =>
        async () => {
            const q = query(collection(db, "stock"));
            const querySnapshot = await getDocs(q);
            let array = []
            querySnapshot.forEach((doc) => {
                const data = doc.data()
                const id = doc.id
                array.push({ id, ...data })
            });
            if (array.length > 0) {
                let parfum = []
                for (let i = 0; i < array.length; i++) {
                    const el = array[i];
                    const q = query(collection(db, "parfum"), where("productCode", "==", el.productCode));
                    const querySnapshot = await getDocs(q);
                    querySnapshot.forEach((doc) => {
                        const data = doc.data()
                        const id = doc.id
                        parfum.push({ id, ...data })
                    });

                }
                sessionStorage.setItem('parfumKilombo', JSON.stringify(parfum))
                dispatch({
                    type: "SET_PARFUM",
                    parfum: parfum
                })
                sessionStorage.setItem('stockKilombo', JSON.stringify(array))
                dispatch({
                    type: "SET_STOCK",
                    stock: array
                })
            }
            dispatch({
                type: 'REFRESH',
                payload: false
            })
        }, [refresh])

    useEffect(() => {
        const getData = async () => {
            const q = query(collection(db, "customer"));
            let customers = [];
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const id = doc.id
                    const data = doc.data()
                    customers.push({ id, ...data });
                });
                sessionStorage.setItem("customerKilombo", JSON.stringify(customers))
                dispatch({
                    type: 'ADD_CUSTOMER',
                    customers: customers
                });
            })

            const q2 = query(collection(db, "users"));
            let users = [];
            const unsubscribe2 = onSnapshot(q2, (querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const id = doc.id
                    const data = doc.data()
                    users.push({ id, ...data });
                });
                sessionStorage.setItem("usersKilombo", JSON.stringify(users))
                dispatch({
                    type: 'SET_USERS',
                    users: users
                });
            })

            const docRef = doc(db, "entreprise", user.enterprise);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data()
                sessionStorage.setItem("enterprise", JSON.stringify(data))
                dispatch({
                    type: 'SET_ENTERPRISE',
                    payload: data
                });
            }

            const q1 = query(collection(db, "employee"));
            const unsubscribe1 = onSnapshot(q1, (querySnapshot) => {
                let employee = []
                querySnapshot.forEach((doc) => {
                    const id = doc.id
                    const data = doc.data()
                    employee.push({ id, ...data });
                });
                sessionStorage.setItem("employeeKilombo", JSON.stringify(employee))
            })

            dispatch({
                type: 'REFRESH',
                payload: false
            })
        }
        getData()
    }, [refresh])

    const handleLogout = () => {
        signOut(auth).then(() => {
            sessionStorage.clear()
            dispatch({
                type: 'SET_USER',
                user: null
            })
            window.location.assign('/auth/login')
        }).catch((e) => console.log(e))
    }

    useEffect(() => {
        const startDay = async () => {
            const docRef = doc(db, "dailyclosure", moment().format('DDMMYYYY'));
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const check = async () => {
                    let stock = []
                    const q = query(collection(db, "stock"));
                    const querySnapshot = await getDocs(q);
                    querySnapshot.forEach((doc) => {
                        const data = doc.data()
                        const id = doc.id
                        stock.push({ id, ...data })
                    });

                    let dailyStock = []
                    const subColRef = collection(db, "dailyclosure", moment().format('DDMMYYYY'), 'dailyStock');
                    const qSnap = await getDocs(subColRef)
                    dailyStock = qSnap.docs.map(d => ({ id: d.id, ...d.data() }))

                    const uniqueResultArrayObjOne = stock.filter(function (objOne) {
                        return !dailyStock.some(function (objTwo) {
                            return objOne.id == objTwo.id;
                        });
                    });
                    uniqueResultArrayObjOne.forEach(async function (docData) {
                        await setDoc(doc(db, `dailyclosure`, `${moment().format('DDMMYYYY')}`, `dailyStock`, `${docData.id}`,), {
                            stock: docData.stock,
                            appro: 0,
                            finalStock: 0
                        });
                    })

                }
                check()
                return setLoading(false)
            }
            await setDoc(doc(db, "dailyclosure", moment().format('DDMMYYYY')), {
                createdAt: serverTimestamp(),
                closed: false,
                caisse: parseInt(enterprise.caisse),
                marge: 0,
                depense: 0
            });
            const q = query(collection(db, "stock"));
            const querySnapshot = await getDocs(q);
            let array = []
            querySnapshot.forEach(async function (docData) {
                const data = docData.data()
                const id = docData.id
                await setDoc(doc(db, `dailyclosure`, `${moment().format('DDMMYYYY')}`, `dailyStock`, `${id}`,), {
                    stock: data.stock,
                    appro: 0,
                    finalStock: 0
                });
            });
        }
        startDay()
        setLoading(false)

    }, [refresh])


    // if (!user, loading) {
    //     return (
    //         <div class="loader"></div>
    //     )
    // }

    return (
        <nav class="navbar navbar-expand-lg main-navbar sticky">
            <div class="form-inline mr-auto">
                <ul class="navbar-nav mr-3">
                    <li><a data-toggle="sidebar" class="nav-link nav-link-lg collapse-btn" id='sidebar' >
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 20 20"><path fill="gray" d="M2 4.25a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.25Zm0 5a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 9.25Zm.75 4.25a.75.75 0 0 0 0 1.5h14.5a.75.75 0 0 0 0-1.5H2.75Z" /></svg>
                    </a></li>
                    <li><a href="#" class="nav-link nav-link-lg fullscreen-btn">
                        <i data-feather="maximize"></i>
                    </a></li>
                    <li>
                        <form class="form-inline mr-auto">
                            <div class="search-element">
                                <input class="form-control" type="search" placeholder="Search" aria-label="Search" data-width="200" />
                                <button class="btn" type="submit">
                                    <i class="fas fa-search"></i>
                                </button>
                            </div>
                        </form>
                    </li>
                </ul>
            </div>
            <ul class="navbar-nav navbar-right">
                <li class="dropdown dropdown-list-toggle"><a href="#" data-toggle="dropdown"
                    class="nav-link nav-link-lg message-toggle"><i class="fas fa-comments  text-secondary"></i>
                    <span class="badge headerBadge1"> 6 </span> </a>
                    <div class="dropdown-menu dropdown-list dropdown-menu-right pullDown">
                        <div class="dropdown-header">
                            Messages
                            <div class="float-right">
                                <a href="#">Mark All As Read</a>
                            </div>
                        </div>
                        <div class="dropdown-list-content dropdown-list-message">
                            <a href="#" class="dropdown-item">
                                <span class="dropdown-item-avatar text-white">
                                    <img alt="image" src="assets/img/users/user-2.png" class="rounded-circle" />
                                </span>
                                <span class="dropdown-item-desc"> <span class="message-user">{user.name} {user.surname}</span>
                                    <span class="time messege-text">Client Requirements</span>
                                    <span class="time">2 Days Ago</span>
                                </span>
                            </a>
                        </div>
                        <div class="dropdown-footer text-center">
                            <a href="#">View All <i class="fas fa-chevron-right"></i></a>
                        </div>
                    </div>
                </li>
                <li class="dropdown dropdown-list-toggle">
                    <a href="#" data-toggle="dropdown" class="nav-link notification-toggle nav-link-lg">
                        <i class="fas fa-bell  text-secondary"></i>
                    </a>
                    <div class="dropdown-menu dropdown-list dropdown-menu-right pullDown">
                        <div class="dropdown-header">
                            Notifications
                            <div class="float-right">
                                <a href="#">Mark All As Read</a>
                            </div>
                        </div>
                        <div class="dropdown-list-content dropdown-list-icons">
                            <a href="#" class="dropdown-item">
                                <span class="dropdown-item-icon bg-info text-white"> <i class="fas fa-bell"></i></span>
                                <span class="dropdown-item-desc">Bienvenu sur Online Service ! <span class="time">{moment(users.find(element => element.id === user.uid)?.createdAt).format('L')}</span></span>
                            </a>
                        </div>
                        <div class="dropdown-footer text-center">
                            <a href="#">View All <i class="fas fa-chevron-right"></i></a>
                        </div>
                    </div>
                </li>
                <li class="dropdown"><a href="#" data-toggle="dropdown"
                    class="nav-link dropdown-toggle nav-link-lg nav-link-user"> <img alt="image" src="assets/img/user.png"
                        class="user-img-radious-style" /> <span class="d-sm-none d-lg-inline-block"></span></a>
                    <div class="dropdown-menu dropdown-menu-right pullDown">
                        <div class="dropdown-title">Hello {users.find(element => element.id === user.uid)?.name} {users.find(element => element.id === user.uid)?.surname}</div>
                        <a href="profile.html" class="dropdown-item has-icon"> <i class="far
										fa-user"></i> Profil
                        </a>
                        <a href="timeline.html" class="dropdown-item has-icon"> <i class="fas fa-bolt"></i>
                            Activités
                        </a>
                        {/* <a href="#" class="dropdown-item has-icon"> <i class="fas fa-cog"></i>
                            Settings
                        </a> */}
                        <div class="dropdown-divider"></div>
                        <a onClick={handleLogout} class="dropdown-item has-icon text-danger"> <i class="fas fa-sign-out-alt"></i>
                            Déconnexion
                        </a>
                    </div>
                </li>
            </ul>
        </nav>
    )
}
