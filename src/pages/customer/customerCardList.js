import { Avatar, Divider, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'
import DataSaverOnIcon from '@mui/icons-material/DataSaverOn';

export default function CustomerCardList({ item, i }) {
    return (
        <>
            <li class="media">
                <div class="media-body">
                    <div class="media-title">{item.nom}</div>
                    <div class="text-job text-muted"><i class="fas fa-server"></i> {item.cat}</div>
                </div>
                <div class="media-progressbar row">
                    <p class='col-5'><i class="fas fa-map-marker-alt"></i><span style={{ marginLeft: 5 }}>{item.location}</span></p>
                    <p class='col-7'>
                        <i class="fas fa-phone"></i>{' '}
                        {
                            item.tel.map((i, _) => (
                                <span style={{ marginLeft: 5 }}>
                                    {_ >= 1 && "/ "} {i}
                                </span>
                            ))
                        }
                    </p>
                </div>
                <div class="media-cta row">
                    <a href="#" class=" btn btn-outline-primary has-icon"><i class="fas fa-eye"></i> Details</a>{' '}
                    <a href="#" class="btn btn-outline-success has-icon"><DataSaverOnIcon sx={{fontSize:'18px'}}  /> Creer une facture</a>{' '}
                    <div class="dropdown">
                        <a href="#" data-toggle="dropdown" class="btn btn-info dropdown-toggle">Plus</a>
                        <div class="dropdown-menu">
                            <a href="#" class="dropdown-item has-icon"><i class="far fa-edit"></i> Editer</a>
                            <div class="dropdown-divider"></div>
                            <a href="#" class="dropdown-item has-icon text-danger"><i class="far fa-trash-alt"></i>
                                Supprimer</a>
                        </div>
                    </div>
                </div>
            </li>
        </>
    )
}
