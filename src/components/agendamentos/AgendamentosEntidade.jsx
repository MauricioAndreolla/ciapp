import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from "react";
// import Label from "../../shared/Label";
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import Title from "../layout/Title";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { toast } from 'react-toastify';
import { Nav, Tab } from 'react-bootstrap';
import Load from "../layout/Load";
import moment from 'moment';
import 'moment/locale/pt-br';
import 'moment-timezone';


export default function AgendamentosEntidades() {
    moment.locale('pt-br');
    const date = new Date();
    const [show, setShow] = useState(false);
    const [modalModel, setModalModel] = useState(null);
    const [load, setLoad] = useState(false);

    const [registro, setRegistro] = useState({
        horario_entrada: null,
        horario_saida: null,
        observacao: "",
        data: date.toISOString().substring(0, 10)
    });


    const handleClose = () => setShow(false);
    const handleShow = (id) => {
        var agendamento = agendamentos.find(s => s.id === id);
        setModalModel(agendamento);
        setShow(true);

    }


    const handleEvents = async (data) => {

        if (data.length > 0) {

            var mappedData = data.map(s => {
                return {
                    data_inicio: s.agendamento_dia_inicial,
                    data_fim: s.agendamento_dia_final,
                    horario_inicial: s.agendamento_horario_inicio,
                    horario_final: s.agendamento_horario_fim,
                    titulo_tarefa: s.tarefa.titulo,
                    nome_prestador: s.processo.nome_prestador,
                    dias_semana: [
                        s.agendamento_dias_semana.domingo ? 0 : null,
                        s.agendamento_dias_semana.segunda ? 1 : null,
                        s.agendamento_dias_semana.terca ? 2 : null,
                        s.agendamento_dias_semana.quarta ? 3 : null,
                        s.agendamento_dias_semana.quinta ? 4 : null,
                        s.agendamento_dias_semana.sexta ? 5 : null,
                        s.agendamento_dias_semana.sabado ? 6 : null,
                    ].filter(s => s !== null)
                }
            })

            var repeatedEvents = await generateRepeatedEvents(mappedData);


            SetEvents(repeatedEvents);




        }




    }


    const getEventProp = (event) => {
        return {
            className: 'event'
        };
    }

    const formatEventTitle = (event) => {
        return (
            <div>
                <span>{event.title.split('\n')[0]}</span>
                <br />
                <span>{event.title.split('\n')[1]}</span>
            </div>
        );
    }


    const generateRepeatedEvents = (events) => {
        const repeatedEvents = [];

        events.forEach(event => {
            const startTime = moment(event.horario_inicial, 'HH:mm');
            const endTime = moment(event.horario_final, 'HH:mm');

            const startDate = moment(event.data_inicio);
            let endDate;
            if (event.data_fim) {
                endDate = moment(event.data_fim);
            } else {
                endDate = moment().add(10, 'years');
            }

            let date = startDate.clone();
            while (date.isSameOrBefore(endDate, 'day')) {
                if (event.dias_semana.includes(date.day())) {
                    const start = date.clone().set({
                        hour: startTime.get('hour'),
                        minute: startTime.get('minute')
                    });

                    const end = date.clone().set({
                        hour: endTime.get('hour'),
                        minute: endTime.get('minute')
                    });

                    const newEvent = {
                        title: `${event.nome_prestador} \n - ${event.titulo_tarefa}`,
                        start: new Date(Date.parse(start)),
                        end: new Date(Date.parse(end)),
                        allDay: false
                    };

                    repeatedEvents.push(newEvent);
                }

                date.add(1, 'day');
            }
        });

        return repeatedEvents;
    };


    const navigate = useNavigate();
    const [agendamentos, setAgendamentos] = useState([]);
    const [agendamentosHoje, setAgendamentosHoje] = useState([]);

    const [events, SetEvents] = useState([]);

    const [search, setSearch] = useState({
        processo: ''
    });
    const fetchData = async () => {
        setLoad(true);
        const data = await window.api.Action({ controller: "Agendamentos", action: "GetAgendamentosEntidade", params: search });
        setLoad(false);
        setAgendamentos(data);
        handleEvents(data);




    }
    useEffect(() => {
        fetchData();
    }, [search]);


    const day = date.getDay();

    const week = {
        domingo: day === 0,
        segunda: day === 1,
        terca: day === 2,
        quarta: day === 3,
        quinta: day === 4,
        sexta: day === 5,
        sabado: day === 6,
    }

    const handleRegistro = (evt, prop_name = null) => {
        const value = evt.value ?? evt.target.value;
        setRegistro({
            ...registro,
            [prop_name ? prop_name : evt.target.name]: value
        })
    }

    const submitRegistro = async () => {
        var id_agendamento = modalModel.id;
        setLoad(true);
        const postResult = await window.api.Action({ controller: "Agendamentos", action: "Registrar", params: { id_agendamento: id_agendamento, registro: registro } });
        setLoad(false);
        if (!postResult.status) {
            toast.error(postResult.text, { autoClose: false });
        } else {
            toast.success(postResult.text, { autoClose: 3000 });
        }


        if (postResult.status) {
            setShow(false);
            setRegistro({
                horario_entrada: null,
                horario_saida: null,
                observacao: "",
                data: date.toISOString().substring(0, 10)
            });
            fetchData();
        }

    }

    const formatDate = (agendamento_dia_inicial) => {
        const [year, month, day] = agendamento_dia_inicial.split('-');
        return `${day}/${month}/${year}`;
    }

    const GerarListagem = async (r) => {
        const search = {
            agendamento: r.id,
        }
        
        const data = await window.api.Action({ controller: "Agendamentos", action: "GetAgendamentosEntidade", params: search });
        const atestados = data.map((e) => {
            return ({
                "Número Processo": e.processo.nro_processo,
                "Prestador": e.processo.nome_prestador,
                "Tarefa": e.tarefa.titulo,
                "Entidade": e.entidade.nome,
                "Hora de entrada": e.atestadoFrequencia[0].dt_entrada,
                "Hora de saída": e.atestadoFrequencia[0].dt_saida,
                "Horas Cumpridas": e.processo.horas_cumpridas,
                "Observação": e.atestadoFrequencia[0].observacao,
            })

        });

        pdfMake.vfs = pdfFonts.pdfMake.vfs;
        var dd = {
            content: [
                { text: `Relatório de comparecimento`, style: 'header1' },
                { text: `Nome: ${atestados[0].Prestador ?? 'Prestador'}`, style: 'header2' },
                { text: `Data: ${new Date().toLocaleDateString('pt-BR')}`, style: 'header3' },
                table(atestados,
                    ['Número Processo', 'Prestador', 'Tarefa', 'Entidade', 'Hora de entrada', 'Hora de saída', 'Horas Cumpridas', 'Observação'],
                )
            ],
            styles: {
                header1: {
                    fontSize: 22,
                    lineHeight: 1,
                    bold: true
                },
                header2: {
                    fontSize: 16,
                    lineHeight: 1
                },
                header3: {
                    fontSize: 10,
                    lineHeight: 2
                },
                tableFont: {
                    fontSize: 8
                }
            }
        }
        pdfMake.createPdf(dd).open({}, window.open('', '_blank'));

    }

    function table(data, columns) {

        return {
            table: {
                headerRows: 1,
                body: buildTableBody(data, columns)
            }
        };

    }

    function buildTableBody(data, columns) {
        let body = [];

        body.push(columns);

        data.forEach(function (row) {
            let dataRow = [];

            columns.forEach(function (columns) {
                let colData = row[columns] !== undefined ? row[columns] : "";
                dataRow.push(String(colData))
            })

            body.push(dataRow);
        });

        return body;
    }


    const localizer = momentLocalizer(moment);
    return (

        <>
            <Title title={"Tarefas Agendadas"} />



            <Tab.Container defaultActiveKey="agendamentos">
                <Nav variant="pills">

                    <Nav.Item>
                        <Nav.Link eventKey="agendamentos">
                            <i className="fas fa-address-card"></i>  Lista Agendamentos
                        </Nav.Link>
                    </Nav.Item>

                    <Nav.Item>
                        <Nav.Link eventKey="calendario">
                            <i className="fas fa-calendar"></i>  Calendário
                        </Nav.Link>
                    </Nav.Item>

                </Nav>


                <Tab.Content>

                    <Tab.Pane eventKey="agendamentos">
                        <div className="row">
                            <div className="col-md-12 no-padding">

                                {
                                    agendamentos.length === 0 ?
                                        <div className="col-md-12 zero-count">Nenhum registro localizado.</div>

                                        :

                                        <div className='row table-container mt-5'>
                                            <div className='col-md-12'>
                                                <table className='table table-bordered table-hover'>
                                                    <thead>
                                                        <tr>
                                                            <th>Processo</th>
                                                            <th>Prestador</th>
                                                            <th>Data de Inicio</th>
                                                            <th>Data de Fim</th>
                                                            <th>Dias da Semana</th>
                                                            <th>Hora inicial planejada</th>
                                                            <th>Hora final planejada</th>
                                                            <th>Tarefa</th>
                                                            <th></th>

                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {

                                                            agendamentos.map(r => (

                                                                <tr key={r.id}>
                                                                    <td>{r.processo.nro_processo}</td>
                                                                    <td>{r.processo.nome_prestador}</td>
                                                                    <td>{formatDate(r.agendamento_dia_inicial)}</td>
                                                                    <td>{r.agendamento_dia_final ? formatDate(r.agendamento_dia_final) : "--"}</td>


                                                                    <td>
                                                                        {r.agendamento_dias_semana.domingo == true ? <>Domingo </> : null}
                                                                        {r.agendamento_dias_semana.segunda == true ? <>Segunda </> : null}
                                                                        {r.agendamento_dias_semana.terca == true ? <>Terça </> : null}
                                                                        {r.agendamento_dias_semana.quarta == true ? <>Quarta </> : null}
                                                                        {r.agendamento_dias_semana.quinta == true ? <>Quinta </> : null}
                                                                        {r.agendamento_dias_semana.sexta == true ? <>Sexta </> : null}
                                                                        {r.agendamento_dias_semana.sabado == true ? <>Sábado </> : null}

                                                                    </td>

                                                                    <td>{r.agendamento_horario_inicio}</td>
                                                                    <td>{r.agendamento_horario_fim}</td>

                                                                    <td>{r.tarefa.titulo}</td>
                                                                    <td>
                                                                        <div>
                                                                            <button className="btn btn-sm btn-primary" onClick={() => { handleShow(r.id) }}><i className="fas fa-regular fa-clock"></i> Registrar</button>

                                                                            <button className="btn btn-sm btn-primary mx-1" onClick={() => { GerarListagem(r) }}><i className="fas fa-solid fa-file"></i> Atestado</button>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                }
                            </div>
                        </div>
                    </Tab.Pane>

                    <Tab.Pane eventKey="calendario">
                        <div className='calendar-tab'>
                            <Calendar
                                localizer={localizer}
                                events={events}
                                startAccessor="start"
                                endAccessor="end"
                                eventPropGetter={getEventProp}
                                titleAccessor={formatEventTitle}
                            />
                        </div>

                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>









            <Modal className='modal-lg' show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Registrar Horário</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    {
                        modalModel ?

                            <>
                                <div className="row">
                                    <p><b>Número do processo:</b> {modalModel.processo.nro_processo}</p>
                                    <div className="col-md-3" >

                                        <img src={modalModel.processo.imagem_prestador} style={{ maxWidth: "150px" }} />
                                    </div>

                                    <div className="col-md-8" style={{ padding: "0" }}>


                                        <p><b>Prestador:</b> {modalModel.processo.nome_prestador}</p>
                                        <p><b>Tarefa:</b> {modalModel.tarefa.titulo}</p>
                                        <p><b>Descrição:</b> {modalModel.tarefa.descricao}</p>
                                    </div>

                                </div>

                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="input-form">
                                            <label htmlFor="data">Data</label>
                                            <input
                                                id="data"
                                                name="data"
                                                className="form-control input rounded-2"
                                                type="date"
                                                value={registro.data}
                                                onChange={handleRegistro}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="input-form">
                                            <label htmlFor="horario_entrada">Horário de Entrada</label>
                                            <input
                                                id="horario_entrada"
                                                name="horario_entrada"
                                                className="form-control input rounded-2"
                                                type="time"
                                                value={registro.horario_entrada}
                                                onChange={handleRegistro}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="input-form">
                                            <label htmlFor="horario_saida">Horário de Saída</label>
                                            <input
                                                id="horario_saida"
                                                name="horario_saida"
                                                className="form-control input rounded-2"
                                                type="time"
                                                value={registro.horario_saida}
                                                onChange={handleRegistro}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-12">
                                        <div className="input-form">
                                            <label htmlFor="observacao">Observação</label>
                                            <textarea
                                                id="observacao"
                                                name="observacao"
                                                className="form-control input rounded-2"
                                                type="text"
                                                rows={4}
                                                value={registro.observacao}
                                                onChange={handleRegistro}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </>
                            : null
                    }



                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={submitRegistro}>
                        Salvar
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
                        Fechar
                    </Button>

                </Modal.Footer>
            </Modal>

            <Load show={load} />
        </>

    )

}