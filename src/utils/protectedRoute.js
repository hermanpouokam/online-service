import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function ProtectedRoute(props) {

    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const checkUserToken = () => {
        const userToken = sessionStorage.getItem('userKilombo');
        if (!userToken || userToken === 'undefined') {
            setIsLoggedIn(false);
            const url = window.location.href
            return navigate(`/auth/login?onSuccess=${url}`);
        }
        setIsLoggedIn(true);
    }

    useEffect(() => {
        checkUserToken();
    }, [isLoggedIn]);

    return (
        <React.Fragment>
            {
                isLoggedIn ? props.children : null
            }
        </React.Fragment>
    );

}
