import { useNavigate } from 'react-router-dom'
import React, { useState, useEffect, useContext } from "react";
import Title from "../layout/Title";
import { confirmAlert } from 'react-confirm-alert'; // Import
import { Nav, NavItem, Tab, TabContainer, TabContent, TabPane } from 'react-bootstrap';
import Table from '../layout/Table';
import ModalUsuario from './ModalUsuario';
import { toast } from "react-toastify";
import Load from "../layout/Load";

import { AuthenticationContext } from "../context/Authentication";

export default function Usuarios() {
    const { user } = useContext(AuthenticationContext);
    const navigate = useNavigate();
    const [search, setSearch] = useState({ name: '', user: '' });
    const [users, setUsers] = useState([]);
    const [load, setLoad] = useState(false);
    const columnsUsuario = [
        { Header: 'Id', accessor: 'id' },
        { Header: 'Nome', accessor: 'nome' },
        { Header: 'Usuário', accessor: 'usuario' },
        { Header: 'Tipo Usuário', accessor: 'tipo_usuario_desc' },
    ];

    const [modelUsuario, setModelUsuario] = useState({
        id: null,
        userName: '',
        user: '',
        password: '',
        tipo_usuario: 0
    });

    const [showModalUsuario, setShowModalUsuario] = useState(false);

    useEffect(() => {
        fetchData();
    }, [search]);

    const fetchData = async () => {
        setLoad(true);
        const data = await window.api.Action({ controller: "Usuarios", action: "GetUsuarios", params: search });
        setLoad(false);
        setUsers(data);
    }

    const createUser = async (object) => {
        const payload = {
            userName: object.userName,
            user: object.user,
            password: object.password,
            tipo_usuario: object.tipo_usuario,
        }
        setLoad(true);
        const postResult = await window.api.Action({ controller: "Usuarios", action: "Create", params: payload });
        setLoad(false);
        if (!postResult.status) {
            toast.error(postResult.text, { autoClose: 3000 });
        } else {
            toast.success(postResult.text, { autoClose: 3000 });
        }

        handleModalUsuario(false, null);
        await fetchData();

    }



    const editUsuario = async (object) => {
        const payload = {
            id: object.id,
            userName: object.userName,
            user: object.user,
            password: object.password,
            tipo_usuario: object.tipo_usuario,
        }

        setLoad(true);
        const postResult = await window.api.Action({ controller: "Usuarios", action: "Edit", params: payload });
        setLoad(false);
        if (!postResult.status) {
            toast.error(postResult.text, { autoClose: 3000 });
        } else {
            toast.success(postResult.text, { autoClose: 3000 });
        }
        handleModalUsuario(false, null);
        await fetchData();
    }

    function DeleteUser({ id, nome }) {

        const handleClickDelete = async (id) => {
            setLoad(true);
            const result = await window.api.Action({ controller: "Usuarios", action: "Delete", params: id });
            setLoad(false);
            if (result.status) {
                toast.success(result.text, { autoClose: 3000 });
                await fetchData();
            } else {
                toast.error(result.text, { autoClose: 3000 });
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

                                                {
                                                    user.tipo_usuario !== 0 ?
                                                        <div className='menu'>
                                                            <button className='menu-button button-blue' onClick={ModalAddUsuario}>
                                                                <i className='fa-solid fa-plus'></i> Adicionar Usuario
                                                            </button>
                                                        </div>
                                                        : null
                                                }


                                                {
                                                    user.tipo_usuario !== 0 ?
                                                        <Table columns={columnsUsuario} data={users} onEdit={ModalEditUsuario} onDelete={DeleteUser} />
                                                        :
                                                        <Table columns={columnsUsuario} data={users} />
                                                }




                                            </div>
                                        </div>
                                    </Tab.Pane>
                                </Tab.Content>
                            </Tab.Container>

                            <ModalUsuario Model={modelUsuario} show={showModalUsuario} onHide={() => { handleModalUsuario(false) }} onAdd={createUser} onEdit={editUsuario} />
                        </div>

                        : <div className="col-md-12 zero-count">Nenhum registro localizado.</div>}

                </div>
            </div>
            <Load show={load} />
        </>




    )



}