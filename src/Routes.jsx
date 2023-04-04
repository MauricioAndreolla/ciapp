import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from 'react';
import { ToastContainer } from "react-toastify";
import { AuthenticationProvider, AuthenticationContext } from './components/context/Authentication';

import Login from './components/login/Login';
import Layout from './components/layout/Layout';

import Prestadores from './components/prestadores/Index';
import PrestadoresCreate from './components/prestadores/Create';
// import PrestadoresEdit from './components/prestadores/Edit';

import Processos from './components/processos/Index';
import ProcessosCreate from './components/processos/Create';

import Usuarios from "./components/usuarios/Index";

import Centrais from "./components/centrais/Index";
import CentraisCreate from "./components/centrais/Create";
import CentraisEdit from "./components/centrais/Edit";

import Entidades from './components/entidades/Index';
import EntidadesCreate from './components/entidades/Create';
import EntidadesDescredenciar from './components/entidades/Descredenciar';
import EntidadesEdit from './components/entidades/Edit';

import AgendamentosEntidade from './components/agendamentos/AgendamentosEntidade';
import AgendamentosCreate from './components/agendamentos/Create';
import AgendamentosEdit from './components/agendamentos/Edit';
import Agendamentos from './components/agendamentos/Index';

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
                        <Route path="prestadores/edit/:id" element={<Private><PrestadoresCreate /></Private>}/>

                        
                        <Route path="processos" element={<Private><Processos /></Private>} />
                        <Route path="processos/create/:id_prestador" element={<Private><ProcessosCreate /></Private>} />
                        <Route path="processos/edit/:id" element={<Private><ProcessosCreate /></Private>}/>

                        <Route path="usuarios" element={<Private><Usuarios /></Private>} />

                        <Route path="centrais" element={<Private><Centrais /></Private>} />
                        <Route path="centrais/Create" element={<Private><CentraisCreate /></Private>} />
                        <Route path="centrais/Edit" element={<Private><CentraisEdit /></Private>} />
                       
                        <Route path="entidades" element={<Private><Entidades /></Private>} />
                        <Route path="entidades/Create" element={<Private><EntidadesCreate /></Private>} />
                        <Route path="entidades/Edit/:id" element={<Private><EntidadesEdit /></Private>} />
                        <Route path="entidades/Descredenciar" element={<Private><EntidadesDescredenciar /></Private>} />

                        <Route path="agendamentos" element={<Private><Agendamentos /></Private>} />
                        <Route path="agendamentos/Create" element={<Private><AgendamentosCreate /></Private>} />
                        <Route path="agendamentos/Edit/:id" element={<Private><AgendamentosEdit /></Private>} />
                        <Route path="agendamentos/AgendamentoEntidade" element={<Private><AgendamentosEntidade /></Private>} />
                        
                    </Route>
                </Routes>
            </AuthenticationProvider>
            <ToastContainer autoClose={500} />
        </Router>
    )


}

export default Main;