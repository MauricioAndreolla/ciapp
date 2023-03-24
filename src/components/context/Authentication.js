import React, { useState, useEffect, createContext } from "react";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom'

export const AuthenticationContext = createContext();

export const AuthenticationProvider = ({ children }) => {

    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(false);

    }, [user]);

   
    const login = async (user, password) => {
        const authenticated = await window.api.Action({ controller: "Login", action: "Authenticate", params: { usuario: user, senha: password } });

        if (authenticated.status) {
            console.log(authenticated);
            setUser(authenticated.user);
            await window.api.maximize();
            navigate('/');
        }else{
            toast.error(authenticated.text);
        }

    };

    const logout = async () => {
        setUser(null);
        await window.api.unmaximize();
        navigate('/login');
    };

    return (
        <AuthenticationContext.Provider value={{ authenticated: !!user, user, loading, login, logout }}>
            {children}
        </AuthenticationContext.Provider>
    )
}