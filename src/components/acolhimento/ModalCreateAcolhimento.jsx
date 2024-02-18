import { useState, useEffect, useRef } from 'react';
import { Button, Modal } from 'react-bootstrap';
import Select from 'react-select';

const ModalCreateAcolhimento = ({ Model, show, onHide, onAdd, onEdit }) => {
 
    const modalRef = useRef(null);
    const [prestadores, setPrestadores] = useState([{ value: -1, label: "Digite uma prestador" }]);

    const [acolhimento, setAcolhimento] = useState({
        dt_agendada:  new Date(new Date().getTime() - 3 * 60 * 60 * 1000).toISOString().substring(0,16),
    });


    const handleHide = async () => {
        onHide(acolhimento);
        await resetAcolhimento();
    };

    const handleAcolhimento = (evt, name = null) => {
        const value = evt.value ?? evt.target.value;

        setAcolhimento({
            ...acolhimento,
            [name ? name : evt.target.name]: value
        })

    }

    const resetAcolhimento = async () => {
        const currentDate =  new Date(new Date().getTime() - 3 * 60 * 60 * 1000);
        setAcolhimento({
            id: null,
            dt_agendada: currentDate.toISOString().substring(0,16),
            observacao: ''
        })
    }

    const handleAdd = async () => {
        onAdd(acolhimento);
        await resetAcolhimento();
    }


    return (
        <>
            <Modal ref={modalRef} show={show} onHide={handleHide}>
                <Modal.Header closeButton>
                    {
                        acolhimento.id ?
                            <Modal.Title><i className="fa-solid fa-users"></i> <small> Editar Acolhimento</small></Modal.Title>
                            :
                            <Modal.Title><i className="fa-solid fa-users"></i> <small> Adicionar Novo</small></Modal.Title>

                    }

                </Modal.Header>
                <Modal.Body>

                    <form className="form-control">

                        <div className="form-group">
                            <label htmlFor="dt_agendada">Data do Acolhimento <small className="campo-obrigatorio"></small></label>
                            <input
                                required={true}
                                id="dt_agendada"
                                name="dt_agendada"
                                className="form-control input rounded-2"
                                type="datetime-local"
                                min={new Date(new Date().getTime() - 3 * 60 * 60 * 1000).toISOString().substring(0,16)}
                                value={acolhimento.dt_agendada ?? new Date(new Date().getTime() - 3 * 60 * 60 * 1000).toISOString().substring(0,16).toISOString().substring(0,16)}
                                onChange={handleAcolhimento}
                            />
                        </div>

                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button className='btn btn-sm' variant="secondary" onClick={handleHide}>
                        <i className="fa-solid fa-times"></i> <small>Fechar</small>
                    </Button>
                    <Button className='btn btn-sm btn-blue' type="submit" variant="primary" onClick={handleAdd} disabled={!(acolhimento.dt_agendada)}>
                        <i className="fa-solid fa-plus"></i>  <small>Adicionar</small>
                    </Button>



                </Modal.Footer>
            </Modal>
        </>
    );


}


export default ModalCreateAcolhimento;