import { useNavigate, NavLink } from 'react-router-dom'
import { useState, useEffect } from "react";

import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Title from "../layout/Title";
import { toast } from 'react-toastify';
import { Alert, Nav, NavItem, Tab, TabContainer, TabContent, TabPane } from 'react-bootstrap';
import Table from '../layout/Table';


export default function Index(props) {

    const navigate = useNavigate();
    const [agendamentos, setAgendamentos] = useState({});


    const fetchData = async () => {
        const data = await window.api.Action({ controller: "Agendamentos", action: "GetAgendamentos", params: null });
        setAgendamentos(data);
        console.log(data);
    }

    useEffect(() => {
        fetchData();
    }, []);

    const columnsAgendamento = [
        { Header: 'Data e hora inicial', accessor: 'inicial' },
        { Header: 'Data e hora final', accessor: 'final' },
        { Header: 'Tarefa', accessor: 'tarefa' },
    ]

    const CreateAgendamento = () => {
        navigate('create');
    }

    const EditAgendamento = (evt) => {
        navigate(`/Edit:${evt}`);
    }

    const DeleteAgendamento = (id) => {

        const handleClickDelete = async (id) => {

            const result = await window.api.Action({ controller: "Agendamentos", action: "Delete", params: id });
            window.api.Alert({ status: result.status, text: result.text, title: result.status ? "Sucesso!" : "Erro!" });
            if (result.status) {
                fetchData();
            }
        }

        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className='custom-ui'>
                        <h3>Excluir registro</h3>
                        <p>Deseja excluir o agendamento?</p>

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

    return (

        <>
            <Title title={"Agendamentos"} />


            <div className='menu'>

                <button className='menu-button button-green' onClick={() => { CreateAgendamento() }}>
                    <i className='fa-solid fa-plus'></i> Novo
                </button>
            </div>

            <div className='row table-container mt-5'>
                <div className='col-md-12'>
                    {agendamentos.length > 0 ?
                        <div className="tabs-agendamentos">
                            <Tab.Container defaultActiveKey="agendamentos">
                                <Nav variant="pills">
                                    <Nav.Item>
                                        <Nav.Link eventKey="agendamentos">
                                            Agendamentos
                                        </Nav.Link>
                                    </Nav.Item>
                                </Nav>

                                <Tab.Content>

                                    <Tab.Pane eventKey="agendamentos">

                                        <Title title={"Agendamentos Cadastrados"} />
                                        <div className="row">
                                            <div className="col-md-12 no-padding">
                                                <Table
                                                    columns={columnsAgendamento}
                                                    data={agendamentos}
                                                    onEdit={EditAgendamento}
                                                    onDelete={DeleteAgendamento}
                                                />
                                            </div>
                                        </div>
                                    </Tab.Pane>
                                </Tab.Content>
                            </Tab.Container>
                        </div>
                        : "Agendamentos não encontrados"}

                </div>
            </div>


        </>


    );
}