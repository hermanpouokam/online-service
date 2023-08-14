import React, { useRef, useState } from 'react'
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import {
    Button, Dialog, DialogContent,
    Divider, FormControl, IconButton,
    InputAdornment, InputLabel, OutlinedInput,
} from '@mui/material';

import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useStateValue } from '../components/stateProvider';

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        backgroundColor: '#44b700',
        color: '#44b700',
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            animation: 'ripple 1.2s infinite ease-in-out',
            border: '1px solid currentColor',
            content: '""',
        },
    },
    '@keyframes ripple': {
        '0%': {
            transform: 'scale(.8)',
            opacity: 1,
        },
        '100%': {
            transform: 'scale(2.4)',
            opacity: 0,
        },
    },
}));

const SmallAvatar = styled(Avatar)(({ theme }) => ({
    width: 22,
    height: 22,
    border: `2px solid ${theme.palette.background.paper}`,
}));

export default function IdleTimeOutModal({ showModal, handleContinue, handleLogout, remainingTime, error }) {

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [showPassword, setShowPassword] = useState(false);
    const [{ user, users }, dispatch] = useStateValue()

    const [password, setPassword] = useState('');

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleContinue(password)
        }
    }

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const btnRef = useRef(null)

    return (
        <React.Fragment>
            <Dialog
                open={showModal}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogContent>
                    <div class='modal-timeout modal'>
                        <form class="form">
                            {
                                error &&
                                <p class='text-danger' style={{ fontWeight: '700' }}>{error}</p>
                            }
                            <StyledBadge
                                overlap="circular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                variant="dot"
                                color='error'
                            >
                                <Avatar alt="Herman Pouokam" src="/static/images/avatar/1.jpg" />
                            </StyledBadge>

                            <div class="title text-uppercase" style={{ marginTop: 5 }}>{`${user?.name} ${user?.surname}`}</div>
                            <Divider>VOTRE SESSION A EXPIRER</Divider>
                            <p class="message">Entrez votre mot de passe pour continuer votre session de travail</p>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel htmlFor="outlined-adornment-password">Mot de passe</InputLabel>
                                <OutlinedInput
                                    onKeyDown={handleKeyDown}
                                    onChange={e => setPassword(e.target.value)}
                                    fullWidth
                                    id="outlined-adornment-password"
                                    type={showPassword ? 'text' : 'password'}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    label="Password"
                                />
                            </FormControl>
                            <div class='d-flex flex-row gap-5 justify-content-center align-items-center' style={{ gap: 5 }}>
                                <Button onClick={handleLogout} variant='contained' color='error' startIcon={
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 20 20">
                                        <path fill="currentColor" d="M10.24 0c3.145 0 6.057 1.395 7.988 3.744a.644.644 0 0 1-.103.92a.68.68 0 0 1-.942-.1a8.961 8.961 0 0 0-6.944-3.256c-4.915 0-8.9 3.892-8.9 8.692c0 4.8 3.985 8.692 8.9 8.692a8.962 8.962 0 0 0 7.016-3.343a.68.68 0 0 1 .94-.113a.644.644 0 0 1 .115.918C16.382 18.564 13.431 20 10.24 20C4.583 20 0 15.523 0 10S4.584 0 10.24 0Zm6.858 7.16l2.706 2.707c.262.261.267.68.012.936l-2.644 2.643a.662.662 0 0 1-.936-.01a.662.662 0 0 1-.011-.937l1.547-1.547H7.462a.662.662 0 0 1-.67-.654c0-.362.3-.655.67-.655h10.269l-1.558-1.558a.662.662 0 0 1-.011-.936a.662.662 0 0 1 .936.011Z" />
                                    </svg>
                                }>
                                    Deconnexion
                                </Button>
                                <Button
                                    onClick={() => handleContinue(password)}
                                    color='success'
                                    variant='contained'
                                    endIcon={
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M12 17q.825 0 1.413-.588T14 15q0-.825-.588-1.413T12 13q-.825 0-1.413.588T10 15q0 .825.588 1.413T12 17Zm-6 5q-.825 0-1.413-.588T4 20V10q0-.825.588-1.413T6 8h7V6q0-2.075 1.463-3.538T18 1q2.075 0 3.538 1.463T23 6h-2q0-1.25-.875-2.125T18 3q-1.25 0-2.125.875T15 6v2h3q.825 0 1.413.588T20 10v10q0 .825-.588 1.413T18 22H6Z" /></svg>
                                    }>
                                    Connexion
                                </Button>
                            </div>
                        </form>
                    </div>
                </DialogContent>
            </Dialog>
        </React.Fragment >
    );

}
