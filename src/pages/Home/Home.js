import React from 'react'
import Settings from '../settings/settings'
import Sidebar from '../sidebar/sidebar'
import { LineChart, Line, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export default function Home() {


  const data = [
    { name: 'Page A', uv: 330, pv: 2400, amt: 2400 },
    { name: 'Page B', uv: 350, pv: 2450, amt: 2300 },
    { name: 'Page B', uv: 250, pv: 2300, amt: 2100 },
    { name: 'Page B', uv: 239, pv: 879, amt: 2879 },
    { name: 'Page B', uv: 321, pv: 2300, amt: 2100 },
    { name: 'Page B', uv: 400, pv: 2300, amt: 2100 },
    { name: 'Page B', uv: 388, pv: 2300, amt: 2100 },
    { name: 'Page B', uv: 250, pv: 2300, amt: 2100 },
    { name: 'Page B', uv: 234, pv: 2300, amt: 2100 },
    { name: 'Page B', uv: 342, pv: 2300, amt: 2100 },
    { name: 'Page B', uv: 532, pv: 2300, amt: 2100 },
    { name: 'Page B', uv: 435, pv: 2300, amt: 2100 },
  ];


  const dash = [
    {
      'id': '1',
      'text': 'Valeur du stock',
      'icon': 'fas fa-box',
      'bgColor': 'l-bg-cyan',
      'number': `450`,
      'lastUpdated': '2 jours',
      'numberColor': 'red',
      'increase': '10'
    },
    {
      'id': '2',
      'text': 'Montant en caisse',
      'icon': 'fas fa-dollar-sign',
      'bgColor': 'l-bg-green',
      'number': '1,562',
      'lastUpdated': 'last month',
      'numberColor': 'red',
      'increase': '10',
    },
    {
      'id': '3',
      'text': 'Valeur totale du capital',
      'icon': 'far fa-money-bill-alt',
      'bgColor': 'l-bg-orange',
      'number': '1,562',
      'lastUpdated': 'last month',
      'numberColor': 'red',
      'increase': '10',
    },
    {
      'id': '4',
      'text': 'Benefice mensuel',
      'icon': 'fas fa-chart-line',
      'bgColor': 'l-bg-purple',
      'number': '1,562',
      'lastUpdated': 'last month',
      'numberColor': 'red',
      'increase': '10',
    },
    {
      'id': '6',
      'text': 'Depenses mensuelles',
      'icon': 'fas fa-box',
      'bgColor': 'l-bg-purple',
      'number': '1,562',
      'lastUpdated': 'last month',
      'numberColor': 'red',
      'increase': '10',
    },
    {
      'id': '7',
      'text': 'Listing de clients',
      'icon': 'fas fa-user',
      'bgColor': 'l-bg-cyan',
      'number': '1,562',
      'lastUpdated': 'last month',
      'numberColor': 'red',
      'increase': '10',
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
                      <div class="col-xl-4 col-lg-6" key={index}>
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
                              <span class="text-success mr-2"><i class={`fa fa-arrow-${'up'}`}></i>10%</span>
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
                <div class="col-12 col-sm-12 col-lg-6">
                  <div class="card">
                    <div class="card-header">
                      <h4>Visitors</h4>
                    </div>
                    <div class="card-body">
                      <LineChart
                        width={450}
                        height={300}
                        data={data}
                        margin={{
                          top: 5,
                          right: 5,
                          left: 5,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                      </LineChart>
                    </div>
                    <div class="card-footer card-footer-grey pt-0">

                    </div>
                  </div>

                </div>
                <div class='col-12 col-sm-12 col-lg-6'>
                  <div class=''>
                    <div class="card">
                      <div class="card-body">

                      </div>
                    </div>
                    <div class="card">
                      <div class="card-body">

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
