import React, { useEffect } from 'react'
import Settings from '../settings/settings'
import Sidebar from '../sidebar/sidebar'
import { LineChart, Line, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { useStateValue } from '../../components/stateProvider';
import { collection, getDocs, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { getInvoices, getSpends } from '../../components/functions/fetchData';
import moment from 'moment';
import { useTheme } from '@emotion/react';
import { Avatar, Divider, List, ListItem, ListItemAvatar, ListItemText, useMediaQuery } from '@mui/material';
import { Link } from 'react-router-dom';
import { weekData } from '../../components/functions/getHomeChart';
import { abbDay } from '../../const';
import ChartWiget from './chartWidget';

export default function Home() {

  const theme = useTheme()

  const [{ enterprise, stock, customer, products, user }, dispatch] = useStateValue()

  const [orders, setOrders] = React.useState([])
  const [spends, setSpends] = React.useState([])

  const [weekDatas, setWeekDatas] = React.useState([])


  const capital = stock?.reduce((acc, currentValue) => {
    const amount = products.find(el => el.id == currentValue.id).pu
    let sum = 0
    sum = acc + (parseInt(amount) * currentValue.stock)
    return sum
  }, 0)

  useEffect(() => {
    getInvoices().then(data => {
      setOrders(data)
    })
    getSpends().then(data => setSpends(data))
  }, [])

  const dettes = orders?.filter(el => el.amountToPaid !== el.paid).reduce((acc, currentVal) => acc + (currentVal.amountToPaid - currentVal.paid), 0)
  const benef = orders?.reduce((acc, curVal) => acc + curVal.directProfit, 0)

  const dash = [
    {
      'id': '1',
      'text': 'Valeur du stock',
      'icon': 'fas fa-box',
      'bgColor': 'l-bg-cyan',
      'number': capital ? capital : 0,
      'lastUpdated': '2 jours',
      'numberColor': 'red',
      'increase': '0'
    },
    {
      'id': '2',
      'text': 'Montant en caisse',
      'icon': 'fas fa-dollar-sign',
      'bgColor': 'l-bg-green',
      'number': enterprise?.caisse,
      'lastUpdated': 'last month',
      'numberColor': 'red',
      'increase': '0',
    },
    {
      'id': '8',
      'text': 'Dettes chez clients',
      'icon': 'fas fa-dollar-sign',
      'bgColor': 'l-bg-purple',
      'number': dettes,
      'lastUpdated': 'last month',
      'numberColor': 'red',
      'increase': '0',
    },
    {
      'id': '3',
      'text': 'Valeur totale du capital',
      'icon': 'far fa-money-bill-alt',
      'bgColor': 'l-bg-orange',
      'number': capital ? (capital + enterprise?.caisse + dettes) : 0,
      'lastUpdated': 'last month',
      'numberColor': 'red',
      'increase': '0',
    },
    {
      'id': '7',
      'text': 'Listing de clients',
      'icon': 'fas fa-user',
      'bgColor': 'l-bg-purple',
      'number': customer?.length,
      'lastUpdated': '1 semaine',
      'numberColor': 'red',
      'increase': '0',
    },
    {
      'id': '4',
      'text': 'Benefice mensuel',
      'icon': 'fas fa-chart-line',
      'bgColor': 'l-bg-orange',
      'number': benef,
      'lastUpdated': 'last month',
      'numberColor': 'red',
      'increase': '0',
    },
    {
      'id': '6',
      'text': 'Depenses mensuelles',
      'icon': 'fas fa-dollar-sign',
      'bgColor': 'l-bg-cyan',
      'number': spends?.filter(el => moment(el.createdAt.toDate()).format('MM') === moment().format('MM')).reduce((acc, curVal) => acc + curVal.amount, 0),
      'lastUpdated': 'last month',
      'numberColor': 'red',
      'increase': '0',
    },
    {
      'id': '9',
      'text': 'Ristournes estimées du mois',
      'icon': 'fas fa-box',
      'bgColor': 'l-bg-green',
      'number': '0',
      'lastUpdated': 'last month',
      'numberColor': 'red',
      'increase': '0',
    },
  ]


  return (
    <div>
      <div id="app">
        <div class="main-wrapper main-wrapper-1">
          <div class="navbar-bg"></div>
          <Sidebar />
          <div class="main-content">
            <section class="section">
              <div class="section-body">
                <div class="row">
                  {
                    dash.map((item, index) => (
                      user.accountType === 'admin' ?
                        <div div class="col-xl-3 col-lg-6" key={index} >
                          <div class="card">
                            <div class="card-body card-type-3">
                              <div class="row">
                                <div class="col">
                                  <h6 class="text-muted mb-0">{item.text}</h6>
                                  <span class="font-weight-bold mb-0">{item.number}</span>
                                </div>
                                <div class="col-auto">
                                  <div class={`card-circle ${item.bgColor} text-white`}>
                                    <i class={item.icon}></i>
                                  </div>
                                </div>
                              </div>
                              <p class="mt-3 mb-0 text-muted text-sm">
                                <span class="text-success mr-2"><i class={`fa fa-arrow-${'up'}`}></i>{item.increase}</span>
                                <span class="text-nowrap">Depuis {item.lastUpdated}</span>
                              </p>
                            </div>
                          </div>
                        </div>
                        :
                        item.id != '2' && item.id != '4' && item.id != '9' && item.id != '6' && item.id != '3' &&
                        <div div class="col-xl-3 col-lg-6" key={index} >
                          <div class="card">
                            <div class="card-body card-type-3">
                              <div class="row">
                                <div class="col">
                                  <h6 class="text-muted mb-0">{item.text}</h6>
                                  <span class="font-weight-bold mb-0">{item.number}</span>
                                </div>
                                <div class="col-auto">
                                  <div class={`card-circle ${item.bgColor} text-white`}>
                                    <i class={item.icon}></i>
                                  </div>
                                </div>
                              </div>
                              <p class="mt-3 mb-0 text-muted text-sm">
                                <span class="text-success mr-2"><i class={`fa fa-arrow-${'up'}`}></i>{item.increase}</span>
                                <span class="text-nowrap">Depuis {item.lastUpdated}</span>
                              </p>
                            </div>
                          </div>
                        </div>
                    ))
                  }
                </div>
              </div>
              <div class='row'>
                <div class="col-12 col-sm-12 col-lg-8">
                  <ChartWiget orders={orders} />
                </div>
                <div class='col-12 col-sm-12 col-lg-4'>

                  {/* <div class=''>
                    <div class="card">
                      <div class="card-header">
                        <h4>Clients</h4>
                        <div class="card-header-action">
                          <div class=" mb-2">
                            <button class="btn btn-info dropdown-toggle" type="button" data-toggle="dropdown"
                              aria-haspopup="true" aria-expanded="false">
                              Cette semaine
                            </button>
                            <div class="dropdown-menu">
                              <Link class="dropdown-item" onClick={() => alert('clicked')}>Cette semaine</Link>
                              <Link class="dropdown-item" >Ce mois</Link>
                              <Link class="dropdown-item" >Cette année</Link>
                              <Link class="dropdown-item" >Tout</Link>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="card-body" style={{ padding: 0 }}>
                        <List
                          sx={{
                            width: '100%',
                            margin: 0,
                            bgcolor: 'background.paper',
                            paddingRight: 2
                          }}
                        >
                          <ListItem onClick={() => alert('clicked')}>
                            <ListItemAvatar>
                              <Avatar>
                                <ImageIcon /> 
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Photos" secondary="Jan 9, 2014" />
                          </ListItem>
                          <Divider variant="inset" component="li" />
                          <ListItem>
                            <ListItemAvatar>
                              <Avatar>
                                 <WorkIcon /> 
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Work" secondary="Jan 7, 2014" />
                          </ListItem>
                          <Divider variant="inset" component="li" />
                          <ListItem>
                            <ListItemAvatar>
                              <Avatar>
                                 <BeachAccessIcon /> 
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Vacation" secondary="July 20, 2014" />
                          </ListItem>
                          <Divider variant="inset" component="li" />
                          <ListItem>
                            <ListItemAvatar>
                              <Avatar>
                                {/* <BeachAccessIcon /> 
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Vacation" secondary="July 20, 2014" />
                          </ListItem>
                          <Divider variant="inset" component="li" />
                          <ListItem>
                            <ListItemAvatar>
                              <Avatar>
                                <BeachAccessIcon /> 
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Vacation" secondary="July 20, 2014" />
                          </ListItem>
                        </List>
                      </div>
                      <div class='card-footer text-center'>
                        <Link>
                          Tout voir
                        </Link>
                      </div>
                    </div>
                    <div class="card">
                      <div class="card-body">

                      </div>
                    </div>
                  </div> */}
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
