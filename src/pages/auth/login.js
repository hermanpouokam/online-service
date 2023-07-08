import { LinearProgress } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { auth, db } from '../../firebase'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Navigate, useNavigate } from 'react-router-dom';
import { useStateValue } from '../../components/stateProvider';
import { collection, doc, getDoc, getDocs, onSnapshot, query, serverTimestamp, setDoc, where } from 'firebase/firestore'
import moment from 'moment'

export default function Login() {

    const [step, setStep] = useState('')
    const [loading, setloading] = useState(false)
    const [errorUser, setErrorUser] = useState(null)
    const [errorPass, setErrorPass] = useState(null)
    const [username, setUsername] = useState('')
    const [user, setUser] = useState(null)
    const [errorUsername, setErrorUsername] = useState(null)
    const [password, setPassword] = useState('')
    const [checked, setChecked] = useState(false)
    const navigate = useNavigate()
    const [show, setShow] = useState(false)
    const [{ enterprise }, dispatch] = useStateValue()

    const inputPasswordRef = useRef()

    const getUser = async (e) => {
        e.preventDefault()
        setloading(true)
        try {
            const q = query(collection(db, "users"), where("username", "==", username));
            const querySnapshot = await getDocs(q);
            if (querySnapshot.empty) {
                setloading(false)
                return setErrorUser("Nom d'utilisateur introuvable")
            }
            querySnapshot.forEach((doc) => {
                setUser({
                    id: doc.id,
                    ...doc.data()
                })
                setErrorUser(null)
                setStep('step')
                setTimeout(() => {
                    inputPasswordRef.current.focus()
                }, 500);
                setloading(false)
            });
        } catch (e) {
            console.log('erreur de mot de passe', e);
        }
    }

    const firstFunction = async () => {
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

        // get articles from firebase
        const qA = query(collection(db, "articles"));
        const querySnapshot = await getDocs(qA);
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

        dispatch({
            type: 'REFRESH',
            payload: false
        })
    }

    const secondFunction = async () => {
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
            return
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

    const thirdFunction = async () => {
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
    const fourthFunction = async () => {
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
    }
    async function handleLogin(e) {

        e.preventDefault()
        setloading(true)
        signInWithEmailAndPassword(auth, user.email, password)
            .then(async (userCredential) => {
                const userCred = userCredential.user;
                sessionStorage.setItem('userKilombo', JSON.stringify(user))
                dispatch({
                    type: 'SIGN_IN',
                    user: user
                })
                dispatch({
                    type: 'SET_USER',
                    user: userCred
                })
                if (checked) {
                    localStorage.setItem('userKilombo', JSON.stringify({ mail: user.email, passord: user.password }))
                }
                await firstFunction()
                await thirdFunction()
                await fourthFunction()
                await secondFunction()

                window.location.assign('/?from=auth&klm=user&to=dashboard&rt=1&tk=Hxjq8i9iJ9uh1hdnkl')
            })
            .catch((error) => {
                setloading(false)
                setErrorPass(error.message)
            });

    }

    function onlyLettersAndNumbers(str) {
        return /^[A-Za-z0-9]*$/.test(str);
    }

    return (
        <div class='login-page'>
            <div class='form-container '>
                <div class='page-container'>
                    <div class={`page ${step}`}>
                        {
                            errorUser &&
                            <div class='text-center'>
                                <span class="badge bg-danger mt-2 text-light">{errorUser}</span>
                            </div>
                        }
                        <form class='login-form'>
                            <div
                                class='col-12 mb-3'
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}
                            >
                                <img
                                    src='assets/img/logo1.png'
                                    class='logo-img'
                                    style={{
                                        width: '50px'
                                    }}
                                />
                            </div>
                            <div class='text-center text-light'>
                                <h2>
                                    Connectez-vous
                                </h2>
                            </div>
                            <div class='p-2 mt-3 text-center'>
                                <span class='h6 text-light'>Bienvenu sur la plateforme de gestion commerciale Online Service.</span>{' '}
                                <span class='h6 text-light'>
                                    Entrez votre nom d'utilisateur pour vous connectez
                                </span>
                            </div>
                            <div class='input col-12 mt-4'>
                                <input
                                    onChange={evt => setUsername(evt.target.value)}
                                    value={username}
                                    class='form-control form-control-md'
                                    type='text'
                                    placeholder="Nom d'utilisateur"
                                    name='username'
                                    autoComplete='off'
                                />
                                {!onlyLettersAndNumbers(username) && <p class='text-danger'>Format invalid</p>}
                            </div>
                            <div
                                class='col-12 mt-3 mb-4'
                            >
                                {username.length >= 8 && !errorUsername && onlyLettersAndNumbers(username) ?
                                    <button
                                        class='form-control col-12 btn-icon icon-right form-control-md btn btn-info'
                                        onClick={getUser}
                                    >
                                        Continuer
                                        <i class="fas fa-arrow-right"></i>
                                    </button>
                                    :
                                    <button
                                        class='form-control col-12 btn-icon disabled icon-right form-control-md btn btn-dark pe-none'
                                        onClick={(e) => {
                                            e.preventDefault()
                                        }}
                                    >
                                        Continuer
                                        <i class="fas fa-arrow-right"></i>
                                    </button>}
                            </div>
                            <div class="mt-5 text-light text-center">
                                Pas de nom d'utilisateur ? <a href="auth-register.html">Contacter l'administrateur</a>
                            </div>
                        </form >
                    </div >
                    <div class={`page ${step} ${step == 'step' ? '' : 'hidden'}`}>
                        {
                            errorPass &&
                            <div class='text-center'>
                                <span class="badge bg-danger mt-2 text-light">{errorPass}</span>
                            </div>
                        }
                        <form class='login-form' onSubmit={handleLogin}>
                            <div
                                class='col-12 mb-2'
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}
                            >
                                <img
                                    src='assets/img/user.png'
                                    class='logo-img'
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        borderRadius: '50%'
                                    }}
                                />
                            </div>
                            <div class='text-center text-light'>
                                <h2>
                                    {
                                        user &&
                                        `${user.name} ${user.surname}`
                                    }
                                </h2>
                            </div>
                            <div class='mt-1 text-center'>
                                <p class='h6 text-muted text-light'>
                                    {
                                        user &&
                                        user.email
                                    }
                                </p> <br />
                                <p class='h6 mt-2 text-light'>Entrez le mot de passe correspondant à ce compte.</p>
                            </div>
                            <div class="form-group">
                                <div class="input-group mb-2">
                                    <input
                                        ref={inputPasswordRef}
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        type={show ? "text" : 'password'}
                                        class="form-control"
                                        id="inlineFormInputGroup"
                                        placeholder="Mot de passe"
                                    />
                                    <div class="input-group-prepend" onClick={() => setShow(!show)} style={{ cursor: 'pointer' }}>
                                        <div class="input-group-text">
                                            <i class={`fas fa-eye${show ? '-slash' : ''}`}></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="custom-control custom-checkbox">
                                    <input
                                        onClick={() => setChecked(!checked)}
                                        type="checkbox"
                                        value={checked}
                                        name="remember"
                                        class="custom-control-input"
                                        tabindex="3" id="remember-me"
                                    />
                                    <label class="custom-control-label" for="remember-me">Se souvenir de moi</label>
                                </div>
                            </div>
                            <div
                                class='mt-3 mb-4 row'
                                style={{ justifyContent: 'space-around' }}
                            >
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setloading(true)
                                        setTimeout(() => {
                                            setStep('')
                                            setPassword('');
                                            setUser(null)
                                            setloading(false)
                                        }, 500);
                                    }}
                                    class='form-control col-lg-5 col-md-5 col-sm-12 btn-icon icon-left form-control-md btn btn-danger'
                                >
                                    <i class="fas fa-times"></i>
                                    Annuler
                                </button>
                                {user && password.length >= 8 ?
                                    <button
                                        class='form-control col-lg-5 col-md-5 col-sm-12 btn-icon icon-right form-control-md btn btn-info'
                                        onClick={handleLogin}
                                    >
                                        Continuer
                                        <i class="fas fa-arrow-right"></i>
                                    </button>
                                    :
                                    <button
                                        class='form-control col-lg-5 col-md-5 disable pe-none col-sm-12 btn-icon icon-right form-control-md btn btn-secondary'
                                    >
                                        Continuer
                                        <i class="fas fa-arrow-right"></i>
                                    </button>
                                }

                            </div>
                            <div class="mt-5 text-light text-center">
                                Mot de passe oublié ? <a href="auth-register.html">Cliquez ici</a>
                            </div>
                        </form>
                    </div>
                    {loading && (
                        <div class='loading'>
                            <LinearProgress
                                color='primary'
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
