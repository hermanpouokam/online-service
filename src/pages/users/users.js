import React, { useEffect, useState } from 'react'
import Sidebar from '../sidebar/sidebar'
import Settings from '../settings/settings'
import { Backdrop, Box, Button, Fade, Modal, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { BlockOutlined, ModeEditOutlineTwoTone } from '@mui/icons-material'

export default function Users() {

    useEffect(() => {
        document.title = 'Factures'
    }, [])
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

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
                                            <h4>Gestion des employés</h4>
                                            <div class="card-header-action">
                                                <a
                                                    href='/users/newUser'
                                                    data-toggle="tooltip"
                                                    data-placement="top"
                                                    title='Ajouter un employé'
                                                    class="btn btn-icon btn-success"
                                                >
                                                    <i class="fas fa-user-plus"></i>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card">
                                        <div class='card-body'>
                                            {[...Array(3)].map((_, i) => (
                                                <div class='user-card'>
                                                    <div class='row'>
                                                        <div class='col-lg-1 col-12 col-md-1 col-sm-12 col-xs-12'>
                                                            <figure class="avatar mr-2 avatar-lg">
                                                                <img src="assets/img/users/user-2.png" alt="..." />
                                                                <i class="avatar-presence busy"></i>
                                                            </figure>
                                                        </div>
                                                        <div class='col-lg-10 col-12 col-md-10 col-sm-12 col-xs-12'>
                                                            <h6 class='text-'><strong>Herman steve</strong></h6>
                                                            <span class='text-muted'>CEO / devellopeur</span>
                                                            <p>Lorem ipsum dolor sit amet, consectetur
                                                                adipiscing elit. Suspendisse velit libero,
                                                                sollicitudin vitae urna ut, </p>
                                                        </div>
                                                    </div>
                                                    <div class='row'>
                                                        <div class='col-12 col-lg-6'>
                                                            <div class='row'>
                                                                <div class='col-6 col-lg-6 col-xs-12'>
                                                                    <span class='text-muted'>
                                                                        Email
                                                                    </span>
                                                                    <p class='h6'><strong>hermanpouokam1@gmail.com</strong></p>
                                                                </div>
                                                                <div class='col-6 col-lg-6 col-xs-12'>
                                                                    <span class='text-muted'>
                                                                        Numero
                                                                    </span>
                                                                    <p class='h6'><strong>677880856</strong></p>
                                                                </div>
                                                                <div class='col-6 col-lg-6 col-xs-12'>
                                                                    <span class='text-muted'>
                                                                        Localisation
                                                                    </span>
                                                                    <p class='h6'><strong>Ngodi-bakoko</strong></p>
                                                                </div>
                                                                <div class='col-6 col-lg-6 col-xs-12'>
                                                                    <span class='text-muted'>
                                                                        Salaire
                                                                    </span>
                                                                    <p class='h6'><strong>50,000XAF</strong></p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class='col-12 col-lg-6'>
                                                            <div class='row d-flex justify-content-around'>
                                                                <Button
                                                                    color='error'
                                                                    onClick={handleOpen}
                                                                    variant="outlined"
                                                                    size='small' startIcon={<BlockOutlined />}
                                                                >
                                                                    Désactiver l'utilisateur
                                                                </Button>
                                                                <Modal
                                                                    keepMounted
                                                                    open={open}
                                                                    onClose={handleClose}
                                                                    aria-labelledby="transition-modal-title"
                                                                    aria-describedby="transition-modal-description"
                                                                    closeAfterTransition
                                                                    slots={{ backdrop: Backdrop }}
                                                                    slotProps={{
                                                                        backdrop: {
                                                                            timeout: 250,
                                                                        },
                                                                    }}
                                                                >
                                                                    <Fade in={open}>

                                                                        <Box sx={style}>
                                                                            <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
                                                                                Etes vous sûr de vouloir desactiver cet utilisateur ?
                                                                            </Typography>
                                                                            <Typography id="keep-mounted-modal-description" sx={{ mt: 2 }}>
                                                                                En faisant cette action il ne pourra plus avoir accès à son compte. <br />
                                                                                Vous pourrez réactiver ce compte a tout moment.
                                                                            </Typography>
                                                                        </Box>
                                                                    </Fade>
                                                                </Modal>
                                                                <Button
                                                                    color='info'
                                                                    // style={}
                                                                    variant="outlined" size='small' startIcon={<ModeEditOutlineTwoTone />}
                                                                >
                                                                    Editer l'utilisateur
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <hr />
                                                </div>
                                            ))}
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
    )
}
