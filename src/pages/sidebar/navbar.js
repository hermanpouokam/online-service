import React, { useEffect, useState } from 'react'
import { useStateValue } from '../../components/stateProvider'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth, db } from '../../firebase'
import { useNavigate } from 'react-router-dom'
import { product } from '../../database'
import { collection, doc, getDoc, getDocs, onSnapshot, query, serverTimestamp, setDoc, where } from 'firebase/firestore'
import moment from 'moment'

export default function Navbar() {

    const [{ user, refresh }, dispatch] = useStateValue()
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {

            } else {
                dispatch({
                    type: 'SIGN_OUT',
                    user: null
                })
                window.location.assign('/auth/login')
            }
        });
    }, [user])

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

    useEffect(() =>
        async () => {
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

            const q1 = query(collection(db, "employee"));
            const unsubscribe1 = onSnapshot(q1, (querySnapshot) => {
                let employee = []
                querySnapshot.forEach((doc) => {
                    const id = doc.id
                    const data = doc.data()
                    employee.push({ id, ...data });
                });
                sessionStorage.setItem("employeeKilombo", JSON.stringify(employee))
                dispatch({
                    type: 'SET_EMPLOYEE',
                    employees: employee
                });
            })

            dispatch({
                type: 'REFRESH',
                payload: false
            })
        }, [refresh])

    const handleLogout = () => {
        signOut(auth).then(() => {
            sessionStorage.clear()
            dispatch({
                type: 'SIGN_OUT',
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
                return setLoading(false)
            }
            await setDoc(doc(db, "dailyclosure", moment().format('DDMMYYYY')), {
                createdAt: serverTimestamp(),
                closed: false,
                caisse: 0
            });
            const q = query(collection(db, "stock"));
            const querySnapshot = await getDocs(q);
            let array = []
            querySnapshot.forEach((doc) => {
                const data = doc.data()
                const id = doc.id
                
            });
        }

        return () => {
            startDay()
            setLoading(false)
        }
    }, [])


    if (!user, loading) {
        return (
            <div class="loader"></div>
        )
    }

    return (
        <nav class="navbar navbar-expand-lg main-navbar sticky">
            <div class="form-inline mr-auto">
                <ul class="navbar-nav mr-3">
                    <li>
                        <a data-toggle="sidebar" class="nav-link nav-link-lg collapse-btn text-dark"> <i class="material-icons">menu</i>
                        </a>
                    </li>
                    <li>
                        <a class="nav-link nav-link-lg fullscreen-btn">
                            <i class="material-icons">fullscreen</i>
                        </a>
                    </li>
                    <li class='ml-3'>
                        <form class="form-inline mr-auto">
                            <div class="search-element">
                                <input class="form-control " type="search" placeholder="Rechercher" aria-label="search" data-width="200" />
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
                                <span class="dropdown-item-desc"> Welcome to Otika template! <span class="time">Yesterday</span></span>
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
                        <div class="dropdown-title">Hello {user.name} {user.surname}</div>
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
