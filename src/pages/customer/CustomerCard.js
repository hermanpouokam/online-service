import React from 'react'
import DataSaverOnIcon from '@mui/icons-material/DataSaverOn';
import { useStateValue } from '../../components/stateProvider';
import { Link } from 'react-router-dom';

export default function CustomerCard({ item, i }) {

    const [{ }, dispatch] = useStateValue()
    const newInvoice = item => {
        dispatch({
            type: 'SET_CUSTOMER',
            customer: item
        })
        sessionStorage.setItem('customerInfoKilombo', JSON.stringify(item))
        let location = window.location.href
        window.location.assign(`/orders/neworder?form=order&custom=false&order=true&onafter=${location}`)
    }

    return (
        <div class="col-12 col-md-4 col-lg-4" key={i}>
            <div class="card card-success">
                <div class="card-header">
                    <h4>{item.nom}</h4>
                    <div class="card-header-action">
                        <div class="dropdown">
                            <a href="#" data-toggle="dropdown" class="btn btn-info dropdown-toggle">Options</a>
                            <div class="dropdown-menu">
                                <a href={`customer/${item.id}/details`} class="dropdown-item has-icon"><i class="fas fa-eye"></i> Details</a>
                                <a href={`customer/${item.id}/edit`} class="dropdown-item has-icon"><i class="far fa-edit"></i> Editer</a>
                                <Link onClick={() => newInvoice(item)} class="dropdown-item has-icon"><DataSaverOnIcon sx={{ fontSize: '18px' }} /> Créer une facture</Link>
                                <div class="dropdown-divider"></div>
                                <Link href="#" class="dropdown-item has-icon text-danger"><i class="far fa-trash-alt"></i>
                                    Supprimer</Link>
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
