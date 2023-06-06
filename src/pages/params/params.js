import React, { useEffect } from 'react'
import Settings from '../settings/settings'
import Sidebar from '../sidebar/sidebar'

export default function Params() {
  useEffect(() => {
    document.title = 'Online service - parametres'
  }, [])

  return (
    <div>
      <div class="loader"></div>
      <div id="app">
        <div class="main-wrapper main-wrapper-1">
          <div class="navbar-bg"></div>
          <Sidebar />
          <div class="main-content">
            <section class="section">
              <div class="section-body"></div>
            </section>
            <Settings />
          </div>
        </div>
      </div>
    </div>
  )
}
