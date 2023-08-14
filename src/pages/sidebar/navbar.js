import React, { } from 'react'
import { useStateValue } from '../../components/stateProvider'
import { signOut } from 'firebase/auth'
import { auth } from '../../firebase'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'

export default function Navbar() {

    const [{ user, users }, dispatch] = useStateValue()

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


    return (
        <nav class="navbar navbar-expand-lg main-navbar sticky">
            <div class="form-inline mr-auto">
                <ul class="navbar-nav mr-3">
                    <li><a data-toggle="sidebar" class="nav-link nav-link-lg collapse-btn" id='sidebar'>
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
                    <span class="badge headerBadge1"> 1</span> </a>
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
                                <span class="dropdown-item-desc">
                                    <span class="message-user">Online Service</span>
                                    <span class="time messege-text">Bienvenue {user.surname} decouvrez ce que vous pouvez faire </span>
                                    <span class="time">{moment(user?.createdAt).format('DD/MM/YYYY')}</span>
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
