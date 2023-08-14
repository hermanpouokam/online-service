import moment from 'moment';
import React, { useEffect, useState } from 'react'
import IdleTimeOutModal from './IdleTimeOutModal';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useStateValue } from '../components/stateProvider';

export default function IdleTimeOutHandler(props) {

    const [showModal, setShowModal] = useState(false)
    const [isLogout, setLogout] = useState(false)
    const [error, setError] = useState(null);

    let timer = undefined;
    const events = ['click', 'load', 'keydown']
    const locked = localStorage.getItem('locked')
    const [{ user, users }, dispatch] = useStateValue()

    const eventHandler = () => {
        if (locked == true) {
            return
        }
        if (user) {
            localStorage.setItem('lastInteractionTime', moment())
            if (timer) {
                props.onActive();
                startTimer();
            }
        }
    };

    useEffect(() => {
        addEvents();
        return (() => {
            removeEvents();
            clearTimeout(timer);
        })
    }, [])

    const startTimer = () => {
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            let lastInteractionTime = localStorage.getItem('lastInteractionTime')
            const diff = moment.duration(moment().diff(moment(lastInteractionTime)));
            let timeOutInterval = props.timeOutInterval ? props.timeOutInterval : 1800000;
            if (!user) {
                clearTimeout(timer)
            } else {
                if (diff._milliseconds < timeOutInterval) {
                    startTimer();
                    props.onActive();
                } else {
                    localStorage.setItem('locked', true)
                    props.onIdle();
                    setShowModal(true)
                }
            }
        }, props.timeOutInterval ? props.timeOutInterval : 10)
    }

    const addEvents = () => {
        events.forEach(eventName => {
            window.addEventListener(eventName, eventHandler)
        })
        startTimer();
    }

    const removeEvents = () => {
        events.forEach(eventName => {
            window.removeEventListener(eventName, eventHandler)
        })
    };

    const handleContinueSession = (txt) => {
        try {
            if (txt === '') {
                return setError('Veuillez remplir le champ')
            }
            if (user?.password === txt) {
                return setTimeout(() => {
                    localStorage.setItem('locked', false)
                    localStorage.setItem('lastInteractionTime', moment())
                    setError(null)
                    startTimer()
                    setShowModal(false)
                    setLogout(false)
                }, 200);
            } else {
                setError('Mot de passe incorrect')
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleLogout = () => {
        logout()
        removeEvents();
        clearTimeout(timer);
        setLogout(true)
        props.onLogout();
        setShowModal(false)

    }

    const logout = () => {
        signOut(auth).then(() => {
            sessionStorage.clear()
            dispatch({
                type: 'SET_USER',
                user: null
            })
            window.location.assign('/auth/login')
        }).catch((e) => console.log(e))
    }

    return (
        <div>
            <IdleTimeOutModal
                showModal={showModal}
                handleContinue={(txt) => handleContinueSession(txt)}
                handleLogout={handleLogout}
                error={error}
            />
        </div>
    )
}
