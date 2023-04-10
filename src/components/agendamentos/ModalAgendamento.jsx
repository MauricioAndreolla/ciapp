import React, { useState, useEffect, useRef } from "react";
import InputDiasSemana from '../layout/InputDiasSemana';
import { Button, Modal } from 'react-bootstrap';


const ModalAgendamento = ({ Model, show, onHide, onAdd, onEdit }) => {

    const modalRef = useRef(null);

    const [agendamento, setAgendamento] = useState([]);

    useEffect(() => {
        if (Model != null) {
            setAgendamento({
                id: Model.id,
                agendamento_dia_inicial: Model.agendamento_dia_inicial,
                agendamento_horario_inicio: Model.agendamento_horario_inicio,
                agendamento_horario_fim: Model.agendamento_horario_fim,
                agendamento_dias_semana: Model.agendamento_dias_semana,
                novo_registro: Model.novo_registro
            });
        }
    }, [Model]);


    const handleHide = () => {
        onHide();
    };

    const handleAgendamento = (evt, name = null) => {
        let value = evt.value ?? evt.target.value;
       
        setAgendamento({
            ...agendamento,
            [name ? name : evt.target.name]: value
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
            agendamento_horario_inicio: '',
            agendamento_horario_fim: '',
            agendamento_dias_semana: [],
            novo_registro: true
        })
    }


    const handleAdd = async () => {
        onAdd(agendamento);
        await resetAgendamento();
    }

    const handleEdit = async () => {
        onEdit(agendamento);
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

    return (
        <>
            <Modal ref={modalRef} show={show} onHide={handleHide}>
                <Modal.Header closeButton>
                    <Modal.Title><i className="fa-solid fa-clipboard-user"></i> <small> Cadastrar Agendamento</small></Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <form className="form-control">

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

                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button className='btn btn-sm' variant="secondary" onClick={handleHide}>
                        <i className="fa-solid fa-times"></i> <small>Fechar</small>
                    </Button>
                    {
                        agendamento.id != null ?

                            <Button
                                className='btn btn-sm btn-blue'
                                type="submit"
                                variant="primary"
                                onClick={handleEdit}
                                disabled={!(agendamento.agendamento_dia_inicial)}
                            >
                                <i className="fa-solid fa-save"></i>  <small>Salvar</small>
                            </Button>
                            :
                            <Button
                                className='btn btn-sm btn-blue'
                                type="submit"
                                variant="primary"
                                onClick={handleAdd}
                                disabled={!(agendamento.agendamento_dia_inicial)}
                            >
                                <i className="fa-solid fa-plus"></i>  <small>Adicionar</small>
                            </Button>


                    }

                </Modal.Footer>
            </Modal>
        </>
    )
}


export default ModalAgendamento;