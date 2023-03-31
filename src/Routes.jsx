import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from 'react';
import { ToastContainer } from "react-toastify";
import { AuthenticationProvider, AuthenticationContext } from './components/context/Authentication';

import Login from './components/login/Login';
import Layout from './components/layout/Layout';

import Prestadores from './components/prestadores/Index';
import PrestadoresCreate from './components/prestadores/Create';

import Usuarios from "./components/usuarios/Index";


const Main = () => {

    const Private = ({ children }) => {
        const { authenticated, loading } = useContext(AuthenticationContext);

        if (loading) {
            return <div>Carregando Informações de Usuário...</div>
        }
        if (!authenticated) {
            return <Navigate to="/login" />
        }

        return children;
    }

    return (
        <Router>
            <AuthenticationProvider>
                <Routes>
                    <Route exact path="login" element={<Login />} />
                    <Route exact path='/' element={<Private><Layout /></Private>}>

                        <Route path="prestadores" element={<Private><Prestadores /></Private>} />
                        <Route path="prestadores/create" element={<Private><PrestadoresCreate /></Private>} />

                        <Route path="usuarios" element={<Private><Usuarios /></Private>} />
                       
                        
                    </Route>
                </Routes>
            </AuthenticationProvider>
            <ToastContainer autoClose={500} />
        </Router>
    )


}

export default Main;