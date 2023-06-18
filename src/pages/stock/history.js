import React, { useEffect, useState } from 'react'
import Sidebar from '../sidebar/sidebar'
import Settings from '../settings/settings'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../firebase'

export default function SupplyHistory() {

  const [data, setData] = useState([])

  useEffect(() => {

    const getAll = async () => {
      const q = query(collection(db, "history"), where("type", "==", 'supply'));
      const querySnapshot = await getDocs(q);
      let array = []
      querySnapshot.forEach((doc) => {
        const id = doc.id
        const el = doc.data()
        array.push({ id, ...el })
      });
      console.log(array)
      setData(array)
    }
    return () => {
      getAll()
    }
  }, [])


  return (
    <div>
      <div id="app">
        <div class="main-wrapper main-wrapper-1">
          <div class="navbar-bg"></div>
          <Sidebar />
          <div class="main-content">
            <section class="section">
              <div class="section-body">
                <div class="card">
                  <div class="card-header">
                    <h4>Historique d'approvisionement</h4>
                    <form class="card-header-form">
                      <div class="input-group">
                        <input type="text" name="search" class="form-control" placeholder="Search" />
                        <div class="input-group-btn">
                          <button class="btn btn-primary btn-icon"><i class="fas fa-search"></i></button>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div class="card-body">
                    <table class="table table-md table-hover table-striped">
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Operateur</th>
                          <th scope="col">Date</th>
                          <th scope="col">Montant</th>
                          <th scope="col">Total de colis</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          data.map((el, i) => (
                            <tr>
                              <th scope="row">{i + 1}</th>
                              <td>Larry</td>
                              <td>the Bird</td>
                              <td>@twitter</td>
                              <td>@twitter</td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
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
