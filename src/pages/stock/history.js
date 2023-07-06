import React, { useEffect, useState } from 'react'
import Sidebar from '../sidebar/sidebar'
import Settings from '../settings/settings'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../firebase'
import { useStateValue } from '../../components/stateProvider'
import moment from 'moment'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Pagination } from '@mui/material'
import { useParams } from 'react-router-dom'

export default function SupplyHistory() {

  const params = useParams()

  const [{ users, products }, dispatch] = useStateValue()
  const [data, setData] = useState([])
  const [dataSearch, setDataSearch] = useState(null)
  const [supplyDocs, setSupplyDocs] = useState([])
  const [open, setOpen] = React.useState(false);
  const [page, setPage] = useState(params.page ? params.page : 1)

  let itemsPerPage = 10
  const startIndex = (page - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleChange = (event, value) => {
    window.location.assign(`/stock/supply/history/page/${value}`);
  };

  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    const getAll = async () => {
      const q = query(collection(db, "history"));
      const querySnapshot = await getDocs(q);
      let array = []
      querySnapshot.forEach((doc) => {
        const id = doc.id
        const el = doc.data()
        array.push({ id, ...el })
      });
      setData(array.filter(el => el.type == 'supply'))
      setDataSearch(array.filter(el => el.type == 'supply'))
    }

    const getSupplyDocs = async () => {
      const q = query(collection(db, "supplyHistory"));
      const querySnapshot = await getDocs(q);
      let array = []
      querySnapshot.forEach((doc) => {
        const id = doc.id
        const el = doc.data()
        array.push({ id, ...el })
      });
      setSupplyDocs(array)
    }

    getAll()
    getSupplyDocs()

  }, [])

  const getAllColis = (id) => {
    const docs = supplyDocs.filter(el => el.docId == id)
    let sum = 0
    for (let i = 0; i < docs.length; i++) {
      const element = docs[i];
      sum += element.qty
    }
    return sum
  }

  if (!dataSearch) {
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
                <div class="card">
                  <div class="card-header">
                    <h4>Historique d'approvisionement</h4>
                    {/* <form class="card-header-form">
                      <div class="input-group">
                        <input type="text" name="search" class="form-control" placeholder="Search" />
                        <div class="input-group-btn">
                          <button class="btn btn-primary btn-icon"><i class="fas fa-search"></i></button>
                        </div>
                      </div>
                    </form> */}
                  </div>
                  <div class="card-body">
                    <table class="table table-md table-hover table-striped">
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Opérateur</th>
                          <th scope="col">Date</th>
                          <th scope="col">Montant</th>
                          <th scope="col">Total de colis</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          dataSearch.slice(startIndex, endIndex).map((item, i) => (
                            <React.Fragment>
                              <tr onClick={handleClickOpen} style={{ cursor: 'pointer' }} >
                                <th scope="row">{i + 1}</th>
                                <td class='text-uppercase'><strong>{users.find(el => el.id == item.user)?.name}</strong></td>
                                <td>{moment(item.created.toDate()).format("DD-MM-YYYY • HH:mm")}</td>
                                <td>{item.amount}</td>
                                <td>{getAllColis(item.id)}</td>
                              </tr>
                              <Dialog
                                open={open}
                                maxWidth={'lg'}
                                aria-labelledby="responsive-dialog-title"
                              >
                                <DialogTitle>Approvisionement</DialogTitle>
                                <DialogContent>
                                  <DialogContentText>Opérateur: <strong>{users.find(el => el.id == item.user)?.name}</strong></DialogContentText>
                                  <DialogContentText>Date: {moment(item.created.toDate()).format("DD-MM-YYYY • HH:mm")}</DialogContentText>
                                  <DialogContentText>Total: {item.amount} FCFA</DialogContentText>
                                  <table class="table table-striped" style={{ minWidth: 200 }}>
                                    <thead>
                                      <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Produit</th>
                                        <th scope="col">Montant</th>
                                        <th scope="col">Quantité</th>
                                        <th scope="col">Total</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {
                                        supplyDocs.filter(el => el.docId == item.id).map((el, i) => (
                                          <tr>
                                            <th scope="row">{i + 1}</th>
                                            <td>{el.name}</td>
                                            <td>{products.find(ele => ele.nom == el.name)?.pu}</td>
                                            <td>{el.qty}</td>
                                            <td>{products.find(ele => ele.nom == el.name)?.pu * el.qty}</td>
                                          </tr>
                                        ))
                                      }
                                    </tbody>
                                  </table>
                                </DialogContent>
                                <DialogActions>
                                  <Button onClick={handleClose}>Fermer</Button>
                                </DialogActions>
                              </Dialog>
                            </React.Fragment>
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
            </section>
            <Settings />
          </div>
        </div>
      </div >
    </div >
  )
}
