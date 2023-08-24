import React, { useEffect } from "react";
import { getInvoices } from "../../components/functions/fetchData";
import moment from "moment";
import { Link } from "react-router-dom";
import { LineChart, Line, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { useMediaQuery } from "@mui/material";
import { abbDay } from "../../const";


export default function ChartWiget({ orders }) {

    const isMobile = useMediaQuery('(min-width:600px)')
    const [currentPeriode, setCurrentPeriode] = React.useState('Cette semaine')
    const [weekDatas, setWeekDatas] = React.useState([])
    const [monthDatas, setMonthDatas] = React.useState([])

    useEffect(() => {
        const getDataWidget = () => {
            const weekData = orders.filter(el => moment(el.createdAt.toDate()).format('w') === moment().format('w') && moment(el.createdAt.toDate()).format('YYYY') === moment().format('YYYY') && el.delivered === true)
            const groupedData = weekData.reduce((acc, item) => {
                const date = moment(item.createdAt.toDate()).format('YYYY-MM-DDTHH:mm').split('T')[0];
                if (!acc[date]) {
                    acc[date] = [];
                }
                acc[date].push(item);
                return acc;
            }, {});
            return groupedData
        }
        const groupedData = getDataWidget()
        let data = []
        for (const day in abbDay) {
            if (Object.hasOwnProperty.call(abbDay, day)) {
                const element = abbDay[day];
                Object.keys(groupedData).forEach((key) => {
                    const day = key
                    let sell = 0
                    let marge = 0
                    if (abbDay[moment(day).day()] === element) {
                        sell = groupedData[key].reduce((acc, curVal) => {
                            return acc + curVal.amountToPaid
                        }, 0);
                        marge = groupedData[key].reduce((acc, curVal) => {
                            return acc + curVal.directProfit
                        }, 0);
                    }
                    data.push({ name: element, recette: sell, marge: marge })
                });
            }
        }
        console.log(data)
        setWeekDatas(data)
    }, [orders])

    return (
        <div class="card">
            <div class="card-header">
                <h4>Details de ventes</h4>
                <div class="card-header-action">
                    <div class=" mb-2">
                        <button class="btn btn-info dropdown-toggle" type="button" data-toggle="dropdown"
                            aria-haspopup="true" aria-expanded="false">
                            Cette semaine
                        </button>
                        <div class="dropdown-menu">
                            <Link class="dropdown-item" onClick={() => alert('')}>Cette semaine</Link>
                            <Link class="dropdown-item" >Ce mois</Link>
                            <Link class="dropdown-item" >Cette année</Link>
                            <Link class="dropdown-item" >Tout</Link>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <ResponsiveContainer width="100%" aspect={!isMobile ? 1.5 : 1.8}>
                    <LineChart
                        data={weekDatas}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="recette" stroke="#8884d8" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="marge" width={30} stroke="#82ca9d" activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div class="card-footer card-footer-grey pt-0">

            </div>
        </div>
    )
}