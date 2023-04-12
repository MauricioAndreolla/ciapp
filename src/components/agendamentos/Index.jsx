import { useNavigate, NavLink } from 'react-router-dom'
import React, { useState, useEffect, useRef } from "react";
import InputDiasSemana from '../layout/InputDiasSemana';
import { Button, Modal } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Title from "../layout/Title";
import { toast } from 'react-toastify';
import { Alert, Nav, NavItem, Tab, TabContainer, TabContent, TabPane } from 'react-bootstrap';
import Table from '../layout/Table';
import ModalAgendamento from './ModalAgendamento';


export default function Index(props) {
    const navigate = useNavigate();
    const [showModalAgendamento, setShowModalAgendamento] = useState(false);
    const [tempID, setempID] = useState(0);
    

    const [agendamento, setAgendamento] = useState([]);
    const [agendamentos, setAgendamentos] = useState({
        entidade: '',
        processo: '',
        prestador: '',
        agendamento: []
    });

    const [modelAgendamento, setModelAgendamento] = useState({
        id: null,
        agendamento_dia_inicial: '',
        agendamento_horario_inicio: '08:00',
        agendamento_horario_fim: '18:00',
        agendamento_dias_semana: [],
        novo_registro: true
    });


    const fetchData = async () => {
        const data = await window.api.Action({ controller: "Agendamentos", action: "GetAgendamentos", params: null });
        setAgendamentos(data);
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
        handleModalAgendamento(true);
        // navigate(`/Create`);

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

    const getTempID = async () => {
        setempID(tempID - 1);
        return tempID - 1;
    }

    const handleModalAgendamento = (show = true, model = null) => {
        setModelAgendamento(model);
        setShowModalAgendamento(show);
    }

    const createAgendamento = async (object) => {
        if (object) {
            var agendamentos = agendamento;

            var exist = agendamentos.find(s => s.agendamento_dia_inicial == object.agendamento_dia_inicial);
            if (exist) {
                toast.error(`Agendamento já informado`, { autoClose: false });
                handleModalAgendamento(false);
                return;
            }
            if (object.novo_registro) {
                object.id = await getTempID();
            }

            agendamentos.push(object);

            setAgendamento([
                ...agendamentos,
            ]);
        }
        handleModalAgendamento(false, null);
    }

    const editAgendamento = (object) => {
        if (object) {
            var agendamentos = agendamento;

            const index = agendamentos.findIndex(s => s.id == object.id);
            agendamentos.splice(index, 1, object);

            setAgendamento([
                ...agendamentos
            ]);
        }
        handleModalAgendamento(false, null);
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

            <ModalAgendamento Model={modelAgendamento} show={showModalAgendamento} onHide={() => { handleModalAgendamento(false) }} onAdd={createAgendamento} onEdit={editAgendamento} />
        </>


    );
}