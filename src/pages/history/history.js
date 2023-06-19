import React, { useEffect, useState } from 'react'
import Settings from '../settings/settings'
import Sidebar from '../sidebar/sidebar'
import { collection, getDocs, query } from "firebase/firestore";
import { db } from '../../firebase';
import { useStateValue } from '../../components/stateProvider';
import moment from 'moment';
import { Pagination } from '@mui/material';
import { useParams } from 'react-router-dom';

export default function History() {

  const params = useParams()

  const [{ users, stock, products }, dispatch] = useStateValue()

  const [data, setData] = useState(null)
  const [page, setPage] = useState(params.page ? params.page : 1)
  const [dataSearch, setDataSearch] = useState([])

  let itemsPerPage = 10
  const startIndex = (page - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage

  useEffect(() => {
    document.title = 'Historique'
  }, [])

  const handleChange = (event, value) => {
    window.location.assign(`history/page/${value}`);
  };

  useEffect(() => {

    const getData = async () => {
      const ref = query(collection(db, "history"))
      const querySnapshot = await getDocs(ref);
      let array = []
      querySnapshot.forEach((doc) => {
        let docs = doc.data()
        let id = doc.id
        array.push({ id, ...docs })
      });
      setDataSearch(array)
      setData(array)
    }

    return () => {
      getData()
    }

  }, [])

  if (!data) {
    return <div class='loader'></div>
  }

  return (
    <div>
      <div id="app">
        <div class="main-wrapper main-wrapper-1">
          <div class="navbar-bg"></div>
          <Sidebar />
          <div class="main-content">
            <section class="section">
              <div class="section-body">
                <div class='card'>
                  <div class='card-header'>
                    <h4>Historique</h4>
                    <form class="card-header-form">
                      <div class="input-group">
                        <input type="text" name="search" autoComplete='off' class="form-control" placeholder="Operateur ou type" />
                        <div class="input-group-btn">
                          <button class="btn btn-primary btn-icon"><i class="fas fa-search"></i></button>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div class='card-body'>
                    <div class="table-responsive">
                      <table class="table table-striped table-md table-hover" id="save-stage">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Operateur</th>
                            <th>Date</th>
                            <th>type</th>
                            <th>Montant</th>
                            <th>commentaire</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            dataSearch.slice(startIndex, endIndex).map((el, i) => (
                              <tr>
                                <td>{i + 1}</td>
                                <td class='text-uppercase h6 text-bold'><strong>{users.find(_ => _.id == el.user)?.name}</strong></td>
                                <td>{moment(el.created.toDate()).format("DD-MM-YYYY • HH:mm")}</td>
                                <td>{el.type == 'supply' ? "Approvisionement" : "autre"}</td>
                                <td>{el.amount}</td>
                                <td>{el.comment ? el.comment : 'NONE'}</td>
                              </tr>
                            ))
                          }
                        </tbody>
                      </table>
                      <div class='card-footer float-right'>
                        <Pagination
                          count={Math.ceil(dataSearch.length / itemsPerPage)}
                          page={page}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <Settings />
          </div>
        </div>
      </div>
    </div>
  )
}

