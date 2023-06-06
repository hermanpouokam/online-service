import React from 'react'
import DataSaverOnIcon from '@mui/icons-material/DataSaverOn';

export default function CustomerCard({ item, i }) {
    return (
        <div class="col-12 col-md-4 col-lg-4" key={i}>
            <div class="card card-success">
                <div class="card-header">
                    <h4>{item.nom}</h4>
                    <div class="card-header-action">
                        <div class="dropdown">
                            <a href="#" data-toggle="dropdown" class="btn btn-info dropdown-toggle">Options</a>
                            <div class="dropdown-menu">
                                <a href="#" class="dropdown-item has-icon"><i class="fas fa-eye"></i> Details</a>
                                <a href="#" class="dropdown-item has-icon"><i class="far fa-edit"></i> Editer</a>
                                <a href="#" class="dropdown-item has-icon"><DataSaverOnIcon sx={{fontSize:'18px'}} /> Creer une facture</a>
                                <div class="dropdown-divider"></div>
                                <a href="#" class="dropdown-item has-icon text-danger"><i class="far fa-trash-alt"></i>
                                    Supprimer</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <p>
                        <i class="fas fa-phone"></i>{' '}
                        {
                            item.tel.map((i, _) => (
                                <span style={{ marginLeft: 5 }}>
                                    {_ >= 1 && "/ "} {i}
                                </span>
                            ))
                        }
                    </p>
                    <p><i class="fas fa-map-marker-alt"></i><span style={{ marginLeft: 5 }}>{item.location}</span> </p>
                    <p><i class="fas fa-server"></i> <span style={{ marginLeft: 5 }}>{item.cat}</span></p>
                </div>
            </div>
        </div>
    )
}
