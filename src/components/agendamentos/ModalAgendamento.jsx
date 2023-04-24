import { Nav, Tab} from 'react-bootstrap';
import Table from '../layout/Table';
import Title from "../layout/Title";
import React, { useState, useEffect, useRef } from "react";
import InputDiasSemana from '../layout/InputDiasSemana';
import { Button, Modal } from 'react-bootstrap';
import Select from 'react-select';
import { toast } from 'react-toastify';



const ModalAgendamento = ({ Model, show, onHide, onAdd, onEdit }) => {

    const modalRef = useRef(null);

    const [agendamento, setAgendamento] = useState([]);
    const [agendamentos, setAgendamentos] = useState([]);
    const [tarefas, setTarefas] = useState([]);
    const [entidades, setEntidades] = useState([]);
    const [processos, setProcessos] = useState([]);
    const [idTemp, setIdTemp] = useState(0);


    useEffect(() => {

        if (Model != null && Model.id != null) {
            setAgendamento({
                id: Model.id,
                agendamento_dia_inicial: Model.agendamento_dia_inicial,
                agendamento_dia_final: Model.agendamento_dia_final,
                agendamento_horario_inicio: Model.agendamento_horario_inicio,
                agendamento_horario_fim: Model.agendamento_horario_fim,
                agendamento_dias_semana: Model.agendamento_dias_semana,
                processo: Model.processo,
                entidade: Model.entidade,
                tarefa: Model.tarefa,
                novo_registro: Model.novo_registro
            });

            setAgendamentos([Model]);
        } else {
            setAgendamento(
                {
                    id: null,
                    agendamento_dia_inicial: '',
                    agendamento_dia_final: '',
                    agendamento_horario_inicio: '09:00',
                    agendamento_horario_fim: '17:00',
                    agendamento_dias_semana: [],
                    processo: '',
                    entidade: '',
                    tarefa: '',
                    novo_registro: true,
                    idTemp: idTemp
                }
            );
            setAgendamentos([]);
        }

        fetchProcessos();
        fetchEntidades();
    }, [Model]);


    const defaultProcesso = () => {
        if (Model != null) {
            return { label: Model.processo.nro_processo, value: Model.processo.id }
        } else {
            return false;
        }
    }

    const defaultEntidade = () => {
        if (Model != null) {
            let value = `${Model.entidade.nome} - ${Model.entidade.cnpj}`
            return { label: value, value: Model.entidade.id }
        } else {
            return false;
        }
    }

    const defaultTarefa = () => {
        if (Model != null) {
            return { label: Model.tarefa.titulo, value: Model.tarefa.id }
        } else {
            return false;
        }
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
        let data = await window.api.Action({ controller: "Entidades", action: "GetEntidades", params: { tipo_instituicao: 1, dt_descredenciamento: 0 } });

        
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
        value = value.filter( (e) => e != undefined  );
       
        setTarefas(value);
    }

    const handleHide = () => {
        onHide();
    };

    const handleAgendamentoOptions = (evt, name = null) => {
        let value = evt.value ?? evt.target.value;

        if (evt.name == 'entidade') {
            searchTarefa(evt);
        }

        setAgendamento({
            ...agendamento,
            [name ? evt.name : evt.target.name]: value
        })
    }

    const handleAgendamento = (evt, name = null) => {
        let value = evt.value ?? evt.target.value;
        if (evt.target.name == 'agendamento_dia_inicial' && checkIfChangeDay() == true) {
            let date = new Date(evt.target.value);
            date.setDate(date.getDate() + 1);
            evt.target.value = date.toISOString().slice(0, 10);
            value = evt.target.value;
            toast.warning(`Virada do dia adicao de 1 dia na data inicial`, { autoClose: 4000 });
        }


        if (evt.target.name == 'agendamento_horario_fim' && checkMoreThanEightHours(value) == true) {
            toast.warning(`Aviso:Agendamento acima de 8 horas`, { autoClose: 4000 });
        }

        setAgendamento({
            ...agendamento,
            [name ? evt.name : evt.target.name]: value
        })

    }

    const handleDiasSemana = (value) => {
        setAgendamento({
            ...agendamento,
            ["agendamento_dias_semana"]: value.sort((a, b) => (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0))
        });
    }

    const resetAgendamento = async () => {
        setAgendamento({
            id: null,
            agendamento_dia_inicial: '',
            agendamento_dia_final: '',
            agendamento_horario_inicio: '09:00',
            agendamento_horario_fim: '17:00',
            agendamento_dias_semana: [],
            processo: '',
            entidade: '',
            tarefa: '',
            novo_registro: true
        });

        setAgendamentos([]);
        setIdTemp(0);
    }

    const handleAdd = async () => {
        onAdd(agendamentos);
        await resetAgendamento();
    }

    const handleEdit = async () => {
        onEdit(agendamentos);
        await resetAgendamento();
    }

    const formatDateInitial = ({ agendamento_dia_inicial  }) => {
        const [year, month, day] = agendamento_dia_inicial?.split('-');
        return `${day}/${month}/${year}`;
    }

    const formatDateFinally = ({ agendamento_dia_final  }) => {
        const [year, month, day] = agendamento_dia_final?.split('-');
        return `${day}/${month}/${year}`;
    }

    const columnsAgendamento = [
        { id: e => e.agendamento_dia_inicial, Header: 'Data inicial', accessor: e => formatDateInitial(e) },
        { id: e => e.agendamento_dia_final, Header: 'Data final', accessor: e => e.agendamento_dia_final == '' ? "Sem data definida" : formatDateFinally(e)   },
        { Header: 'Horário inicial', accessor: 'agendamento_horario_inicio' },
        { Header: 'Horário fim', accessor: 'agendamento_horario_fim' },
    ];

    const addTempId = () => {
        setIdTemp(idTemp + 1);
    }

    const checkIfChangeDay = () => {
        const [inicioHora, inicioMinuto] = agendamento.agendamento_horario_inicio.split(':').map(Number);
        const [fimHora, fimMinuto] = agendamento.agendamento_horario_fim.split(':').map(Number);

        const inicio = new Date(0, 0, 0, inicioHora, inicioMinuto);
        const fim = new Date(0, 0, 0, fimHora, fimMinuto);

        return fim < inicio || (fim.getDate() !== inicio.getDate());
    }

    const checkMoreThanEightHours = (horarioFim) => {
        const [inicioHora, inicioMinuto] = agendamento.agendamento_horario_inicio.split(':').map(Number);
        const [fimHora, fimMinuto] = horarioFim.split(':').map(Number);

        const horaInicialDate = new Date(0, 0, 0, inicioHora, inicioMinuto);
        const horaFinalDate = new Date(0, 0, 0, fimHora, fimMinuto);

        const diferencaHoras = (horaFinalDate - horaInicialDate) / (1000 * 60 * 60)

        return diferencaHoras > 8;
    }


    const checkPeriod = () => {
        const [inicioHora, inicioMinuto] = agendamento.agendamento_horario_inicio.split(':').map(Number);
        const [fimHora, fimMinuto] = agendamento.agendamento_horario_fim.split(':').map(Number);
        const dataInicial = agendamento.agendamento_dia_inicial;
        let result = false;

        let tempoInicial1 = new Date(2023, 3, 17, inicioHora, inicioMinuto, 0);
        let tempoFinal1 = new Date(2023, 3, 17, fimHora, fimMinuto, 0);
       
        const minutosInicio1 = tempoInicial1.getHours() * 60 + tempoInicial1.getMinutes();
        const minutosFim1 = tempoFinal1.getHours() * 60 + tempoFinal1.getMinutes();


        agendamentos.forEach((e) => {
            if (e.agendamento_dia_inicial != dataInicial){
                return;
            }
            const [inicioHoraAgendado, inicioMinutoAgendado] = e.agendamento_horario_inicio.split(':').map(Number);
            const [fimHoraAgendado, fimMinutoAgendado] = e.agendamento_horario_fim.split(':').map(Number);


            let tempoInicial2 = new Date(2023, 3, 17, inicioHoraAgendado, inicioMinutoAgendado, 0);
            let tempoFinal2 = new Date(2023, 3, 17, fimHoraAgendado, fimMinutoAgendado, 0);


            const minutosInicio2 = tempoInicial2.getHours() * 60 + tempoInicial2.getMinutes();
            const minutosFim2 = tempoFinal2.getHours() * 60 + tempoFinal2.getMinutes();

            if (minutosInicio1 >= minutosInicio2 && minutosFim1 <= minutosFim2) {
                result = true;
                return result;
            } else {
                if (minutosInicio1 <= minutosInicio2 && minutosFim1 <= minutosFim2) {
                    result = true;
                    return result;
                }
            }
        })
        return result;
    }

    const deleteAgendamentoModal = (object) => {
        if (object) {
            let agendamentosTable = agendamentos.filter(s => s.idTemp != object.idTemp);
            setAgendamentos([
                ...agendamentosTable,
            ]);
        }
    }

    const handleAddTable = () => {
        agendamento.idTemp = idTemp;
        addTempId();

        setAgendamento({
            ...agendamento,
            agendamento
        })

        if (checkPeriod() == true) {
            toast.error(`Verifique o horário inicial e final, pois haverá conflito na agenda`, { autoClose: 4000 });
            return;
        } else {
            setAgendamentos([...agendamentos, agendamento]);
        }
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
                                        <label htmlFor="processo">Processo <small className="campo-obrigatorio"></small></label>
                                        <Select
                                            options={processos}
                                            id="processo"
                                            name="processo"
                                            placeholder="Processo"
                                            onChange={handleAgendamentoOptions}
                                            defaultValue={defaultProcesso}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="input-form">
                                        <label htmlFor="entidade">Entidade <small className="campo-obrigatorio"></small></label>
                                        <Select
                                            options={entidades}
                                            id="entidade"
                                            name="entidade"
                                            placeholder="Entidade"
                                            onChange={handleAgendamentoOptions}
                                            defaultValue={defaultEntidade}

                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="input-form">
                                        <label htmlFor="tarefa">Tarefa <small className="campo-obrigatorio"></small></label>
                                        <Select
                                            options={tarefas}
                                            id="tarefa"
                                            name="tarefa"
                                            placeholder="Tarefa"
                                            onChange={handleAgendamentoOptions}
                                            defaultValue={defaultTarefa}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-7">
                                <div className="row">

                                    <span>Tarefa: { }</span>

                                    <div className="form-group">
                                        <label htmlFor="trabalho_horario_inicio">Horário de Entrada <small className="campo-obrigatorio"></small></label>
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
                                        <label htmlFor="agendamento_horario_fim">Horário de Saída <small className="campo-obrigatorio"></small></label>
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
                                        <label htmlFor="agendamento_dia_inicial">Data inicial <small className="campo-obrigatorio"></small></label>
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
                                        <label htmlFor="agendamento_dia_final">Data final</label>
                                        <input
                                            id="agendamento_dia_final"
                                            name="agendamento_dia_final"
                                            className="form-control input rounded-2"
                                            type="date"
                                            min={new Date().toISOString().split('T')[0]}
                                            value={agendamento.agendamento_dia_final}
                                            onChange={handleAgendamento}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <div className="input-form">
                                            <label htmlFor="agendamento_dias_semana">Dias Semana <small className="campo-obrigatorio"></small></label>
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


                    </form>
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
                                                        <Table
                                                            columns={columnsAgendamento}
                                                            data={agendamentos}
                                                            onDelete={deleteAgendamentoModal}
                                                        />
                                                    </div>
                                                </div>
                                                : 'Sem dados'}
                                        </Tab.Pane>
                                    </Tab.Content>
                                </Tab.Container>
                            </div>
                        </div>
                    </div>


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
                                disabled={!(agendamentos.length > 0)}
                            >
                                <i className="fa-solid fa-plus"></i>  <small>Agendar</small>
                            </Button>
                            :
                            <Button
                                className='btn btn-sm btn-blue'
                                type="submit"
                                variant="primary"
                                onClick={handleEdit}
                                disabled={!(agendamentos.length > 0)}
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