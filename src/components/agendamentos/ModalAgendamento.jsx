import { Nav, NavItem, Tab, TabContainer, TabContent, TabPane } from 'react-bootstrap';
import Table from '../layout/Table';
import Title from "../layout/Title";
import React, { useState, useEffect, useRef } from "react";
import InputDiasSemana from '../layout/InputDiasSemana';
import { Button, Modal } from 'react-bootstrap';
import Select from 'react-select';
import { confirmAlert } from "react-confirm-alert";


const ModalAgendamento = ({ Model, show, onHide, onAdd, onEdit }) => {

    const modalRef = useRef(null);

    const [agendamento, setAgendamento] = useState([]);
    const [agendamentos, setAgendamentos] = useState([]);
    const [tarefas, setTarefas] = useState([]);
    const [entidades, setEntidades] = useState([]);
    const [processos, setProcessos] = useState([]);

    useEffect(() => {
        if (Model != null) {


            setAgendamento({
                id: Model.id,
                agendamento_dia_inicial: Model.agendamento_dia_inicial,
                agendamento_horario_inicio: Model.agendamento_horario_inicio,
                agendamento_horario_fim: Model.agendamento_horario_fim,
                agendamento_dias_semana: Model.agendamento_dias_semana,
                processo: Model.processo,
                entidade: Model.entidade,
                tarefa: Model.tarefa,
                novo_registro: Model.novo_registro
            });

            setAgendamentos([agendamento]);
        }

        fetchProcessos();
        fetchEntidades();

        console.log(Model);
    }, [Model]);


    const defaultProcesso = () => {
        return { label: agendamento.processo.nro_processo, value: agendamento.processo.id }
    }

    const defaultEntidade = () => {
        let value = `${agendamento.entidade.nome} - ${agendamento.entidade.cnpj}`
        return { label: value, value: agendamento.entidade.id }
    }

    const defaultTarefa = () => {
        return { label: agendamento.tarefa.titulo, value: agendamento.tarefa.id }
    }

    const fetchProcessos = async () => {
        let data = await window.api.Action({ controller: "Processo", action: "GetProcessos" });
        let processo;

        let values = data.map((element) => {
            return processo = {
                value: element.id,
                label: `${element.nro_processo} - ${element.prestador}`,
                name: 'processo'
            }
        });

        setProcessos(values);
    }

    const fetchEntidades = async () => {
        let data = await window.api.Action({ controller: "Entidades", action: "GetEntidades" });
        let entidade;

        let values = data.map((element) => {
            return entidade = {
                value: element.id,
                label: `${element.nome} - ${element.cnpj}`,
                name: 'entidade'
            }
        });

        setEntidades(values);
    }

    const searchTarefa = async (evt) => {
        let search = {
            id: evt.value
        }

        let data = await window.api.Action({ controller: "Entidades", action: "GetEntidades", params: search });
        const tarefa = data[0].tarefa;

        if (!tarefa) {
            value = { value: null, label: "Sem tarefa cadastrada" };
            return;
        }

        let value = tarefa.map((element) => {
            if (element.status == true) {
                return { value: element.id, label: element.titulo, name: 'tarefa' }
            }
        });

        setTarefas(value);
    }


    const handleHide = () => {
        // resetAgendamento();
        onHide();
    };


    const handleAgendamento = (evt, name = null) => {
        let value = evt.value ?? evt.target.value;

        if (evt.name == 'entidade') {
            searchTarefa(evt);
        }

        setAgendamento({
            ...agendamento,
            [name ? evt.name : evt.target.name]: value
        })
    }


    const handleDiasSemana = (value) => {
        console.log(value);
        setAgendamento({
            ...agendamento,
            ["agendamento_dias_semana"]: value.sort((a, b) => (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0))
        });
    }


    const resetAgendamento = async () => {
        setAgendamento({
            id: null,
            agendamento_dia_inicial: '',
            agendamento_horario_inicio: '08:00',
            agendamento_horario_fim: '18:00',
            agendamento_dias_semana: [],
            processo: '',
            entidade: '',
            tarefa: '',
            novo_registro: true
        });

        setAgendamentos([]);
    }

    const handleAdd = async () => {
        onAdd(agendamentos);
        await resetAgendamento();
    }

    const handleEdit = async () => {
        onEdit(agendamentos);
        await resetAgendamento();
    }

    // function verificaDatas() {
    //     let horasInicial = agendamento_horario_inicio.slice(0, 2);
    //     let minutosInicial = agendamento_horario_inicio.slice(3, 5);

    //     let horasFinal = agendamento_horario_fim.slice(0, 2);
    //     let minutosFinal = agendamento_horario_fim.slice(3, 5);

    //     let horasInicialSegundos = parseInt(horasInicial) * 3600;
    //     let minutosInicialSegundos = parseInt(minutosInicial) * 60;

    //     let horasFinalSegundos = parseInt(horasFinal) * 3600;
    //     let minutosFinalSegundos = parseInt(minutosFinal) * 60;

    //     const segundosIniciais = horasInicialSegundos + minutosInicialSegundos;
    //     const segundosFinais = horasFinalSegundos + minutosFinalSegundos;

    //     const result = segundosFinais - segundosIniciais;

    //     if (result <= 0) {
    //         return true;
    //     }

    // }

    const columnsAgendamento = [
        // { id: e => e.agendamento_dia_inicial, Header: 'Data inicial', accessor: e => formatDate(e) },
        { Header: 'Horário inicial', accessor: 'agendamento_horario_inicio' },
        { Header: 'Horário fim', accessor: 'agendamento_horario_fim' },

    ];

    // const formatDate = ({ agendamento_dia_inicial }) => {
    //     const [year, month, day] = agendamento_dia_inicial.split('-');
    //     return `${day}/${month}/${year}`;
    // }

    const deleteAgendamentoModal = (object) => {
        console.log(object)
        // if (object) {
        //     confirmAlert({
        //         title: 'Confirmação',
        //         message: 'Tem certeza que deseja excluir este item?',
        //         buttons: [
        //             {
        //                 label: 'Sim',
        //                 onClick: () => {
        //                     let agendamentos = agendamento.filter(s => s.id !== object.id);
        //                     setAgendamento([
        //                         ...agendamentos,
        //                     ]);
        //                 }
        //             },
        //             {
        //                 className: 'btn-blue',
        //                 label: 'Não',
        //                 onClick: () => {
        //                 }
        //             }
        //         ]
        //     });
        // }
    }

    const handleAddTable = () => {
        setAgendamentos([...agendamentos, agendamento]);
    }

    return (
        <>
            <Modal ref={modalRef} show={show} onHide={handleHide} size={'xl'}>
                <Modal.Header closeButton>
                    <Modal.Title><i className="fa-solid fa-clipboard-user"></i> <small> Novo Agendamento</small></Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <form className="form-control">
                        <div className="row">
                            <div className="col-md-4">

                                <div className="form-group">
                                    <div className="input-form">
                                        <label htmlFor="processo">Processo</label>
                                        <Select
                                            options={processos}
                                            id="processo"
                                            name="processo"
                                            placeholder="Processo"
                                            onChange={handleAgendamento}
                                            defaultValue={agendamento.id != null ? defaultProcesso : null}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="input-form">
                                        <label htmlFor="entidade">Entidade</label>
                                        <Select
                                            options={entidades}
                                            id="entidade"
                                            name="entidade"
                                            placeholder="Entidade"
                                            onChange={handleAgendamento}
                                            defaultValue={agendamento.id != null ? defaultEntidade : null}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="input-form">
                                        <label htmlFor="tarefa">Tarefa</label>
                                        <Select
                                            options={tarefas}
                                            id="tarefa"
                                            name="tarefa"
                                            placeholder="Tarefa"
                                            onChange={handleAgendamento}
                                            defaultValue={agendamento.id != null ? defaultTarefa : null}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-7">
                                <div className="row">

                                    <span>Tarefa: xxxxx</span>

                                    <div className="form-group">
                                        <label htmlFor="trabalho_horario_inicio">Horário de Entrada</label>
                                        <input
                                            required={true}
                                            id="agendamento_horario_inicio"
                                            name="agendamento_horario_inicio"
                                            className="form-control input rounded-2"
                                            type="time"
                                            value={agendamento.agendamento_horario_inicio}
                                            onChange={handleAgendamento}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="agendamento_horario_fim">Horário de Saída</label>
                                        <input
                                            required={true}
                                            id="agendamento_horario_fim"
                                            name="agendamento_horario_fim"
                                            className="form-control input rounded-2"
                                            type="time"
                                            value={agendamento.agendamento_horario_fim}
                                            onChange={handleAgendamento}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="agendamento_dia_inicial">Data inicial</label>
                                        <input
                                            required={true}
                                            id="agendamento_dia_inicial"
                                            name="agendamento_dia_inicial"
                                            className="form-control input rounded-2"
                                            type="date"
                                            min={new Date().toISOString().split('T')[0]}
                                            value={agendamento.agendamento_dia_inicial}
                                            onChange={handleAgendamento}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <div className="input-form">
                                            <label htmlFor="agendamento_dias_semana">Dias Semana</label>
                                            <InputDiasSemana
                                                id="agendamento_dias_semana"
                                                name="agendamento_dias_semana"
                                                handleChange={handleDiasSemana}
                                                value={agendamento.agendamento_dias_semana}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-1 align-self-center">
                                        <Button
                                            className='btn btn-sm btn-blue mt-2'
                                            type="button"
                                            onClick={handleAddTable}
                                            disabled={!(agendamento.agendamento_dia_inicial)}
                                        >
                                            Adicionar
                                        </Button>

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
                                                {agendamentos.length > 0 ?
                                                    <div className="row">
                                                        <div className="col-md-12 no-padding">
                                                            <div className='menu'>
                                                                {/* <button className='menu-button button-blue'
                                                                onClick={() => { handleModalAgendamento(true) }}>
                                                                <i className='fa-solid fa-plus'></i> Adicionar Agendamento
                                                            </button> */}
                                                            </div>
                                                            <Table columns={columnsAgendamento} data={agendamentos} onEdit={deleteAgendamentoModal}
                                                                onDelete={deleteAgendamentoModal} />
                                                        </div>
                                                    </div>
                                                    : 'Sem dados'}
                                            </Tab.Pane>
                                        </Tab.Content>
                                    </Tab.Container>
                                </div>
                            </div>
                        </div>


                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button className='btn btn-sm' variant="secondary" onClick={handleHide}>
                        <i className="fa-solid fa-times"></i> <small>Fechar</small>
                    </Button>
                    {
                        agendamento.id == null ?
                            <Button
                                className='btn btn-sm btn-blue'
                                type="submit"
                                variant="primary"
                                onClick={handleAdd}
                                disabled={!(agendamento.agendamento_dia_inicial)}
                            >
                                <i className="fa-solid fa-plus"></i>  <small>Agendar</small>
                            </Button>
                            :
                            <Button
                                className='btn btn-sm btn-blue'
                                type="submit"
                                variant="primary"
                                onClick={handleEdit}
                                disabled={!(agendamento.agendamento_dia_inicial)}
                            >
                                <i className="fa-solid fa-save"></i>  <small>Salvar</small>
                            </Button>



                    }

                </Modal.Footer>
            </Modal>
        </>
    )
}


export default ModalAgendamento;