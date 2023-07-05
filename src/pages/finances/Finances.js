import React, { useEffect, useState } from 'react'
import Settings from '../settings/settings'
import Sidebar from '../sidebar/sidebar'
import { Link } from 'react-router-dom'
import { LineChart, Line, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { db } from '../../firebase';
import { addDoc, collection, doc, increment, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { useStateValue } from '../../components/stateProvider';

export default function Finances() {

  useEffect(() => {
    document.title = 'Online service - finances'
  }, [])

  const [{ user, users }, dispatch] = useStateValue()


  const [inputs, setInputs] = useState({
    amt: '',
    comment: '',
  })

  const handleAddSpend = async () => {
    const docRef = await addDoc(collection(db, "spends"), {
      createdAt: serverTimestamp(),
      userId: user.uid,
      amount: parseInt(inputs.amt),
      comment: inputs.comment
    });
    const userData = users.find(el => el.userId == user.uid)
    const washingtonRef = doc(db, 'entreprise', userData.enterprise);
    await updateDoc(washingtonRef, {
      caisse: increment(-inputs.amt)
    });

    console.log('All done !!!');
  }

  const data = [
    { name: 'Lun', uv: 330, amt: 2400 },
    { name: 'Mar', uv: 350, amt: 2300 },
    { name: 'Mer', uv: 0, amt: 2100 },
    { name: 'Jeu', uv: 239, amt: 2879 },
    { name: 'Ven', uv: 321, amt: 2100 },
    { name: 'Sam', uv: 400, amt: 2100 },
  ];

  return (
    <div id="app">
      <div class="main-wrapper main-wrapper-1">
        <div class="navbar-bg"></div>
        <Sidebar />
        <div class="main-content">
          <section class="section">
            <div class="section-body">
              <div class='row'>
                <div class='col-12'>
                  <div class='card'>
                    <div class="card-header">
                      <h4>Gestion des finances</h4>
                    </div>
                  </div>
                </div>
              </div>
              <div class='row'>
                <div class='col-12 col-sm-12 col-md-12 col-lg-6'>
                  <div class='card'>
                    <div class="card-header">
                      <h4 class=''>Depenses</h4>
                      <div class="card-header-action">
                        <div class=" mb-2">
                          <button class="btn btn-info dropdown-toggle" type="button" data-toggle="dropdown"
                            aria-haspopup="true" aria-expanded="false">
                            Cette semaine
                          </button>
                          <div class="dropdown-menu">
                            <Link class="dropdown-item" onClick={() => alert('clicked')}>Aujourd'hui</Link>
                            <Link class="dropdown-item" >Cette semaine</Link>
                            <Link class="dropdown-item" >Ce mois</Link>
                            <Link class="dropdown-item" >Cette année</Link>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="card-body">
                      <div class="row">
                        <div class="col-7">
                          <LineChart
                            width={280}
                            height={140}
                            data={data}
                            margin={{
                              top: 5,
                              right: -5,
                              left: -5,
                              bottom: 0,
                            }}
                          >
                            <CartesianGrid strokeDasharray="1 1" />
                            {/* <XAxis dataKey="name" />
                            <YAxis /> */}
                            <Tooltip />
                            {/* <Legend /> */}
                            <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                          </LineChart>
                        </div>
                        <div class="col-5 text-right">
                          <div>
                            <h5 class='changed-green'>16300 XAF</h5>
                            <p class="mt-0 mb-0 text-muted">
                              <span class="text-success mr-2"><i class={`fa fa-arrow-${'up'}`}></i>5%</span>
                              <span class="text-nowrap">De plus qu'hier</span>
                            </p>
                            <hr />
                            <a href='/finance/spend/history' class='btn btn-icon mr-2 btn-secondary'>
                              <i class="fa fa-history"></i>
                            </a>
                            <button data-toggle="modal" data-target="#exampleModal" class='btn btn-icon btn-primary'>
                              <i class="fa fa-plus"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="formModal"
            aria-hidden="true">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="formModal">Ajouter une depense</h5>
                  <button

                    type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span
                      onClick={() => setInputs({
                        ['comment']: '',
                        ['amt']: 0
                      })}
                      aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <form class="">
                    <div class="form-group">
                      <label>Montant <span class='text-danger'>*</span></label>
                      <div class="input-group">
                        <div class="input-group-prepend">
                          <div class="input-group-text">
                            {/* <i class="fas fa-dollar-sign"></i> */}
                            XAF
                          </div>
                        </div>
                        <input
                          value={inputs.amt}
                          onChange={(e) => setInputs({ ...inputs, ['amt']: e.target.value })}
                          type="number"
                          class="form-control"
                          placeholder="montant"
                          name="email"
                        />
                      </div>
                    </div>
                    <div class="form">
                      <label>Commentaire <span class='text-danger'>*</span></label>
                      <div class="input-group">
                        <div class="input-group-prepend">
                        </div>
                        <textarea
                          value={inputs.comment}
                          onChange={(e) => setInputs({ ...inputs, ['comment']: e.target.value })}
                          class="form-control"
                          placeholder="ex: carburant moto" name="comment"
                        />
                      </div>
                    </div>
                    <button onClick={handleAddSpend} type="button" class="btn btn-primary m-t-15 waves-effect">Ajouter</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <Settings />
        </div>
      </div>
    </div>
  )
}
