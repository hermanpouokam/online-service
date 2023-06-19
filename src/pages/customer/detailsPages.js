import React, { useEffect } from 'react'
import Sidebar from '../sidebar/sidebar'
import Settings from '../settings/settings'
import { useParams } from 'react-router-dom'

export default function DetailsPage() {

    const params = useParams()

    useEffect(() => {
        document.title = 'Details clients'
    }, [])


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

                            </div>
                        </section>
                        <Settings />
                    </div>
                </div>
            </div>
        </div>
    )
}
