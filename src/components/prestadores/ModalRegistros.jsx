import { useState, useEffect, useRef } from "react";
import { Button, Modal } from 'react-bootstrap';
import Load from "../layout/Load";


const ModalRegistros = ({ id, show, onHide }) => {
    const modalRef = useRef(null);
    const [registros, setRegistros] = useState(null);
    const [load, setLoad] = useState(false);

    const handleHide = () => {
        onHide();
    };
    const formatDate = (agendamento_dia_inicial) => {
        if (!agendamento_dia_inicial) return '-';
        const [year, month, day] = agendamento_dia_inicial.split('-');
        return `${day}/${month}/${year}`;
    }

    useEffect(() => {

        if (id) {
            const fetchData = async () => {
                setLoad(true);
                const data = await window.api.Action({ controller: "Processo", action: "GetRegistros", params: { id: id } });
                setRegistros(data.data);
                setLoad(false);
            }

            fetchData();
        }

    }, [id]);

    return <>
        <Modal ref={modalRef} show={show} onHide={handleHide} className='modal-lg'>
            <Modal.Header closeButton>
                <Modal.Title><i className="fa-solid fa-user"></i> <small> Registros</small></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <>
                    <div className="row">

                        {
                            registros === null ?
                                <div className="col-md-12">
                                    <h5><i className="fas fa-spinner fa-spin"></i> carregando...</h5>
                                </div>
                                :

                                registros.length === 0 ?
                                <div className="col-md-12 zero-count">Nenhum registro localizado.</div>
                                :

                                <>
                                    <table className='table table-bordered'>
                                        <thead>
                                            <tr>
                                                <th>Tarefa</th>
                                                <th>Data de entrada</th>
                                                <th>Data de saída</th>
                                                <th>Horas cumpridas</th>
                                                <th>Observação</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {registros.map(r => (

                                                <tr key={r.id}>
                                                    <td><small>{r.tarefa}</small></td>
                                                    <td><small>{r.dt_entrada}</small></td>
                                                    <td><small>{r.dt_saida}</small></td>
                                                    <td><small>{r.total_horas}</small></td>
                                                    <td><small>{r.observacao}</small></td>


                                                </tr>

                                            ))}
                                        </tbody>

                                    </table>
                                </>
                        }


                    </div>

                </>
            </Modal.Body>
            <Modal.Footer>
                <Button className='btn btn-sm' variant="secondary" onClick={handleHide}>
                    <i className="fa-solid fa-times"></i> <small>Fechar</small>
                </Button>
            </Modal.Footer>
        </Modal>
        <Load show={load} />
    </>
}


export default ModalRegistros;