import React from "react";
import { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthenticationContext } from "../context/Authentication";
function Navbar() {
    const { user } = useContext(AuthenticationContext);
    const [activeMenu, setActiveMenu] = useState('/');

    return (
        <nav className="side-menu">
            {/* <input className="form-control" type="text" id="search-option" name="search-option" placeholder="Pesquisar" /> */}

            <ul>
                <li className={activeMenu === 'prestadores' ? 'active' : ''} onClick={() => { setActiveMenu('prestadores') }}>
                    <NavLink id="prestadores" to="/prestadores"><i className="fa-regular fa-circle-user"></i> Prestadores</NavLink>
                </li>
                <li className={activeMenu === 'processos' ? 'active' : ''} onClick={() => { setActiveMenu('processos') }}>
                    <NavLink id="processos" to="/processos"><i className="fa-regular fa-file-lines"></i> Processos</NavLink>
                </li>

                <li className={activeMenu === 'instituicoes' ? 'active' : ''} onClick={() => { setActiveMenu('instituicoes') }}>
                    <NavLink id="entidades" to="/entidades"><i className="fa-solid fa-archway"></i> Entidades</NavLink>
                </li>

                <li className={activeMenu === 'agendamentos' ? 'active' : ''} onClick={() => { setActiveMenu('agendamentos') }}>
                    <NavLink id="agendamentos" to="/agendamentos"><i className="fa-solid fa-clipboard-user"></i> Agendamentos</NavLink>
                </li>

                <li className={activeMenu === 'agendamentosEntidade' ? 'active' : ''} onClick={() => { setActiveMenu('agendamentosEntidade') }}>
                    <NavLink id="agendamentosEntidade" to="/agendamentosEntidade"><i className="fa-solid fa-clipboard-user"></i> Agendamentos</NavLink>
                </li>

                <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false">Outros</a>
                    <ul className="dropdown-menu">

                        <li className={activeMenu === 'sincronizacao' ? 'active' : ''} onClick={() => { setActiveMenu('sincronizacao') }}>
                            <NavLink id="sincronizacao" to="/"><i className="fa-solid fa-file-export"></i> Exportar Dados</NavLink>
                        </li>




                       


                        <li className={activeMenu === 'usuarios' ? 'active' : ''} onClick={() => { setActiveMenu('login') }}>
                            <NavLink id="usuarios" to="/usuarios"><i className="fa-solid fa-user"></i> Usuários</NavLink>
                        </li>


                        {/* <li className={activeMenu === 'atividades' ? 'active' : ''} onClick={() => { setActiveMenu('login') }}>
                                        <NavLink id="atividades" to="/atividades"><i className="fa-solid fa-clipboard-user"></i> Atividades</NavLink>
                                    </li> */}

                    </ul>
                </li>
            </ul>
            

            <div className="modo-aplicacao">
                modo apliação: <b>{user.MODO_APLICACAO === 0 ? "central" : user.MODO_APLICACAO === 1 ? "entidade" : "não definido" }</b>
            </div>

        </nav>
    );
}

export default Navbar;