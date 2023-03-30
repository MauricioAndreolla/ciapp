import { useNavigate, NavLink } from 'react-router-dom'
import React, { useState, useEffect } from "react";
import Title from "../layout/Title";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { Nav, NavItem, Tab, TabContainer, TabContent, TabPane } from 'react-bootstrap';
import Table from '../layout/Table';
import ModalUsuario from './ModalUsuario';



export default function Usuarios() {

    const navigate = useNavigate();
    const [search, setSearch] = useState({ name: '', user: '' });
    const [users, setUsers] = useState([]);

    const columnsUsuario = [
        { Header: 'Id', accessor: 'id' },
        { Header: 'Nome', accessor: 'nome' },
        { Header: 'Usuário', accessor: 'usuario' },
    ];

    const [modelUsuario, setModelUsuario] = useState({
        id: null,
        userName: '',
        user: '',
        password: ''
    });

    const [showModalUsuario, setShowModalUsuario] = useState(false);

    useEffect(() => {
        fetchData();
    }, [search]);

    const fetchData = async () => {
        const data = await window.api.Action({ controller: "Usuarios", action: "GetUsuarios", params: search });
        setUsers(data);
    }

    const createUser = async (object) => {
        const payload = {
            userName: object.userName,
            user: object.user,
            password: object.password,
        }
      
        const postResult = await window.api.Action({ controller: "Usuarios", action: "Create", params: payload });
        // console.log(postResult); // TOAST
        handleModalUsuario(false, null);
        await fetchData();
    
    }



    const editUsuario = async (object) => {
        const payload = {
            id: object.id,
            userName: object.userName,
            user: object.user,
            password: object.password,
        }
        console.log(payload)

        const postResult = await window.api.Action({ controller: "Usuarios", action: "Edit", params: payload });
        console.log(postResult); // TOAST
        handleModalUsuario(false, null);
        await fetchData();
    }

    function DeleteUser({ id, nome }) {

        const handleClickDelete = async (id) => {

            const result = await window.api.Action({ controller: "Usuarios", action: "Delete", params: id });
            window.api.Alert({ status: result.status, text: result.text, title: result.status ? "Sucesso!" : "Erro!" });
            if (result.status) {
                await fetchData();
            } else {
                console.log("Erro")
            }
        }

        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className='custom-ui'>
                        <h3>Excluir registro</h3>
                        <p>Deseja excluir o usuario <b>{nome}</b>?</p>

                        <button className='btn btn-confirm modal-btn'
                            onClick={() => {
                                handleClickDelete(id);
                                onClose();
                            }}
                        >
                            Confirmar
                        </button>

                        <button className='btn btn-cancel modal-btn' onClick={onClose}>Cancelar</button>
                    </div>
                );
            }
        });
    }


    const handleModalUsuario = (show = true, model = null) => {
        setModelUsuario(model);
        setShowModalUsuario(show);
    }

    const ModalEditUsuario = (object) => {
        handleModalUsuario(true, object);
    }

    const ModalAddUsuario = (object) => {
        handleModalUsuario(true, object);
    }


    return (
        <>
            <Title title={"Usuários"} />

            <div className='row table-container'>
                <div className='col-md-12'>
                    {users.length > 0 ?
                        <div className="tabs-prestador">
                            <Tab.Container defaultActiveKey="usuarios">
                                <Nav variant="pills">
                                    <Nav.Item>
                                        <Nav.Link eventKey="usuarios">
                                            Usuarios
                                        </Nav.Link>
                                    </Nav.Item>
                                </Nav>

                                <Tab.Content>

                                    <Tab.Pane eventKey="usuarios">

                                        <Title title={"Usuários Cadastrados"} />
                                        <div className="row">
                                            <div className="col-md-12 no-padding">
                                                <div className='menu'>
                                                    <button className='menu-button button-blue' onClick={ModalAddUsuario}>
                                                        <i className='fa-solid fa-plus'></i> Adicionar Usuario
                                                    </button>
                                                </div>
                                                <Table columns={columnsUsuario} data={users} onEdit={ModalEditUsuario} onDelete={DeleteUser} />
                                            </div>
                                        </div>
                                    </Tab.Pane>
                                </Tab.Content>
                            </Tab.Container>

                            <ModalUsuario Model={modelUsuario} show={showModalUsuario} onHide={() => { handleModalUsuario(false) }} onAdd={createUser} onEdit={editUsuario} />
                        </div>

                        : "Usuários não encontrados"}

                </div>
            </div>

        </>




    )



}