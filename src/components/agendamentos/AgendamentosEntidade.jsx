import { useNavigate, NavLink } from 'react-router-dom'
import { useState, useEffect } from "react";
// import Label from "../../shared/Label";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Title from "../layout/Title";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export default function AgendamentosEntidades(props) {
    const date = new Date();
    const [show, setShow] = useState(false);
    const [modalModel, setModalModel] = useState(null);

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



    const navigate = useNavigate();
    const [agendamentos, setAgendamentos] = useState([]);
    const [agendamentosHoje, setAgendamentosHoje] = useState([]);

    const [search, setSearch] = useState({
        processo: ''
    });
    const fetchData = async () => {
        const data = await window.api.Action({ controller: "Agendamentos", action: "GetAgendamentos", params: search });
   

        setAgendamentos(data.filter(s => s.processo.horas_cumpridas < s.processo.horas_cumprir));
       

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
        const postResult = await window.api.Action({ controller: "Agendamentos", action: "Registrar", params: { id_agendamento: id_agendamento, registro: registro } });
        window.api.Alert({ status: postResult.status, text: postResult.text, title: postResult.status ? "Sucesso!" : "Erro!" });

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

    return (

        <>
            <Title title={"Tarefas Agendadas"} />



            <div className='row table-container'>
                <div className='col-md-12'>


                    {/* <Label nameLabel="Tarefas Gerais" /> */}
                    <table className='table table-bordered'>
                        <thead>
                            <tr>
                                <th>Processo</th>
                                <th>Prestador</th>
                                <th>Data de Inicio</th>
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
                                        <td>{new Date(r.agendamento_data_inicial.replace('-0', "-")).toLocaleDateString('pt-BR')}</td>


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

                                        <td>{r.tarefa.dataValues.titulo}</td>
                                        <td>

                                            <div className="btn-group" role="group">
                                                <button className="btn btn-primary" onClick={() => { handleShow(r.id) }}><i className="fas fa-regular fa-clock"></i> registrar</button>

                                            </div>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>


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
                                        <p><b>Tarefa:</b> {modalModel.tarefa.dataValues.titulo}</p>
                                        <p><b>Descrição:</b> {modalModel.tarefa.dataValues.descricao}</p>
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
        </>

    )

}