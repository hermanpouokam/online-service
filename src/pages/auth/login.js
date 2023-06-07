import { LinearProgress } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from '../../firebase'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Navigate, useNavigate } from 'react-router-dom';
import { useStateValue } from '../../components/stateProvider';

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
    const [{ }, dispatch] = useStateValue()

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

    async function handleLogin(e) {

        e.preventDefault()
        setloading(true)
        signInWithEmailAndPassword(auth, user.email, password)
            .then((userCredential) => {
                const userCred = userCredential.user;
                localStorage.setItem('userKilombo', JSON.stringify(user))
                dispatch({
                    type: 'SIGN_IN',
                    user: user
                })

                if (checked) {
                    localStorage.setItem('userKilombo', JSON.stringify({ mail: user.email, passord: user.password }))
                }
                window.location.assign('/?from=auth&klm=user&to=dashboard')
            })
            .catch((error) => {
                setloading(false)
                setErrorPass(error.message)
                // const errorMessage = error.message;
            });

    }

    function onlyLettersAndNumbers(str) {
        return /^[A-Za-z0-9]*$/.test(str);
    }


    const LoginPage = () => {
        return (
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
                        <span class='h6 text-light'>Bienvenu sur la platforme de gestion comerciale LE KILOMBO DEPOT.</span>{' '}
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
                            autoFocus
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
        )
    }

    const LoginPass = () => {
        return (
            <div class={`page ${step}  transition-3`}>
                {
                    errorPass &&
                    <div class='text-center'>
                        <span class="badge bg-danger mt-2 text-light">{errorPass}</span>
                    </div>
                }
                <form class='login-form'>
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
                                `${user.name} ${user.name}`
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
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                type={show ? "text" : 'password'}
                                class="form-control"
                                id="inlineFormInputGroup"
                                placeholder="Mot de passe"
                                autoFocus={step == 'step' ? true : false}
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
                            onClick={(e) => { e.preventDefault(); setPassword(''); setStep('') }}
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
        )
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
                                <span class='h6 text-light'>Bienvenu sur la platforme de gestion comerciale LE KILOMBO DEPOT.</span>{' '}
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
