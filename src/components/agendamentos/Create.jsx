import React, { useState, useEffect } from "react";
// import Label from "../../shared/Label";
import Title from "../layout/Title";
import { useNavigate } from "react-router-dom";
import Select from 'react-select';
import ModalAgendamento from "./ModalAgendamento";
import { Nav, NavItem, Tab, TabContainer, TabContent, TabPane } from 'react-bootstrap';
import Table from '../layout/Table';
import { confirmAlert } from "react-confirm-alert";
import { toast } from 'react-toastify';
import makeAnimated from 'react-select/animated';



export default function Create() {
    const navigate = useNavigate();
    const animatedComponents = makeAnimated();

    const [tempID, setempID] = useState(0);
    const [tarefas, setTarefas] = useState([]);
    const [entidades, setEntidades] = useState([]);
    const [processos, setProcessos] = useState([]);
    const [prestadores, setPrestadores] = useState([]);
    const [agendamento, setAgendamento] = useState([]);

    const [modelAgendamento, setModelAgendamento] = useState({
        id: null,
        agendamento_dia_inicial: '',
        agendamento_horario_inicio: '08:00',
        agendamento_horario_fim: '18:00',
        agendamento_dias_semana: [],
        novo_registro: true
    });


    useEffect(() => {
        fetchDataPrestadores();
        fetchDataEntidades();
    }, []);

    const fetchDataPrestadores = async () => {
        let data = await window.api.Action({ controller: "Prestador", action: "GetPrestadores" });
        let prestador;

        let values = data.map((element) => {
            return prestador = {
                value: element.id,
                label: `${element.nome} - ${element.cpf}`
            }
        });

        setPrestadores(values);
    }

    const fetchDataEntidades = async () => {
        let data = await window.api.Action({ controller: "Entidades", action: "GetEntidades" });
        let entidade;

        let values = data.map((element) => {
            return entidade = {
                value: element.id,
                label: `${element.nome} - ${element.cnpj}`
            }
        });

        setEntidades(values);

        // let data = tarefas.map((e) => {

        //     if (value.instituicaoTarefaId == e.instituicoes.id && e.instituicoes.dt_descredenciamento == null) {
        //         let entidadeLabel = {
        //             value: e.instituicoes.id,
        //             label: e.instituicoes.nome
        //         }
        //         return entidadeLabel;
        //     }
        // })
        // data = data.filter((e) => { return e != undefined });

        // var distinct = []
        // for (var i = 0; i < data.length; i++) {
        //     if (distinct.filter(s => s.value == data[i].value).length == 0) {
        //         distinct.push(data[i])
        //     }
        // }

        // setEntidades(distinct);
    }

    const handleSearchDropPrestador = async (evt) => {
        let search = {
            id_prestador: {
                value: evt.value
            }
        };

        let data = await window.api.Action({ controller: "Processo", action: "GetProcessos", params: search });
        let processos;

        let value = data.map((element) => {
            return processos = {
                value: element.id,
                label: element.nro_processo
            }
        });

        setProcessos(value);
    }


    const handleSearchDropEntidades = async (evt) => {
        let search = {
            id: evt.value
        }

        let data = await window.api.Action({ controller: "Entidades", action: "GetEntidades", params: search });
        const tarefa = data[0].tarefa;
 
        let value = tarefa.map((element) => {
            if (element.status == true) {
                return { value: element.id, label: element.titulo }
            }
        });

        setTarefas(value);
    }

    const handleSubmit = async (object) => {

        const payload = {
            agendamento: object
        }

        // if (verificaDatas() == true) {
        //     window.api.Alert({ status: false, text: "Horário inicial inferior ou igual ao horário final", title: "Erro!" });
        //     return;
        // }

        const postResult = await window.api.Action({ controller: "Agendamentos", action: "Create", params: payload });
        window.api.Alert({ status: postResult.status, text: postResult.text, title: postResult.status ? "Sucesso!" : "Erro!" });

        if (postResult.status)
            navigate("/agendamentos");

    }

    const formatDate = ({ agendamento_dia_inicial }) => {
        const [year, month, day] = agendamento_dia_inicial.split('-');
        return `${day}/${month}/${year}`;
    }

    const columnsAgendamento = [
        { id: e => e.agendamento_dia_inicial, Header: 'Data inicial', accessor: e => formatDate(e) },
        { Header: 'Horário inicial', accessor: 'agendamento_horario_inicio' },
        { Header: 'Horário fim', accessor: 'agendamento_horario_fim' },

    ];

    const [showModalAgendamento, setShowModalAgendamento] = useState(false);

    const handleModalAgendamento = (show = true, model = null) => {
        setModelAgendamento(model);
        setShowModalAgendamento(show);
    }

    const modalEditAgendamento = (object) => {
        handleModalAgendamento(true, object);
    }

    const getTempID = async () => {
        setempID(tempID - 1);
        return tempID - 1;
    }

    const deleteAgendamento = (object) => {
        if (object) {
            confirmAlert({
                title: 'Confirmação',
                message: 'Tem certeza que deseja excluir este item?',
                buttons: [
                    {
                        label: 'Sim',
                        onClick: () => {
                            let agendamentos = agendamento.filter(s => s.id !== object.id);
                            setAgendamento([
                                ...agendamentos,
                            ]);
                        }
                    },
                    {
                        className: 'btn-blue',
                        label: 'Não',
                        onClick: () => {
                        }
                    }
                ]
            });
        }
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
            <Title title="Novo Agendamento" />

            <div className='menu'>
                <button className='menu-button button-green' onClick={Create}>
                    <i className='fa-solid fa-save'></i> Salvar
                </button>
                <button className='menu-button button-red' onClick={() => { navigate('/agendamentos') }}>
                    <i className='fa-solid fa-times'></i> Cancelar
                </button>
            </div>

            <div className="row">
                <Title title="Seleção do Agendamento" />
                <div className="col-md-12 px-5 mb-5">
                    <div className="row">
                        <div className="col-md-4">
                            <div className="input-form">
                                <label htmlFor="prestador">Prestadores</label>
                                <Select
                                    options={prestadores}
                                    id="prestador"
                                    name="prestador"
                                    placeholder="Prestador"
                                    onChange={handleSearchDropPrestador}
                                />
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="input-form">
                                <label htmlFor="processo">Processo</label>
                                <Select
                                    options={processos}
                                    id="processo"
                                    name="processo"
                                    placeholder="Processo"
                                />

                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-4">
                                <div className="input-form">
                                    <label htmlFor="entidade">Entidade</label>
                                    <Select
                                        options={entidades}
                                        id="entidade"
                                        name="entidade"
                                        placeholder="Entidade"
                                        onChange={handleSearchDropEntidades}
                                    />
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="input-form">
                                    <label htmlFor="tarefa">Tarefa</label>
                                    <Select
                                        options={tarefas}
                                        id="tarefa"
                                        name="tarefa"
                                        placeholder="Tarefa"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='row table-container'>
                <div className='col-md-12'>

                    <div className="tabs-agendamento">
                        <Tab.Container defaultActiveKey="agendamento">
                            <Nav variant="pills">
                                <Nav.Item>
                                    <Nav.Link eventKey="agendamento">
                                        <i className="fas fa-address-card"></i>  Agendamento
                                    </Nav.Link>
                                </Nav.Item>
                            </Nav>

                            <Tab.Content>
                                <Tab.Pane eventKey="agendamento">
                                    <Title title={"Dados do agendamento"} />
                                    <div className="row">
                                        <div className="col-md-12 no-padding">
                                            <div className='menu'>
                                                <button className='menu-button button-blue'
                                                    onClick={() => { handleModalAgendamento(true) }}>
                                                    <i className='fa-solid fa-plus'></i> Adicionar Agendamento
                                                </button>
                                            </div>
                                            <Table columns={columnsAgendamento} data={agendamento} onEdit={modalEditAgendamento} onDelete={deleteAgendamento} />
                                        </div>
                                    </div>
                                </Tab.Pane>
                            </Tab.Content>
                        </Tab.Container>
                    </div>
                </div>
            </div>

            <ModalAgendamento Model={modelAgendamento} show={showModalAgendamento} onHide={() => { handleModalAgendamento(false) }} onAdd={createAgendamento} onEdit={editAgendamento} />


        </>
    )



}