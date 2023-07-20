import { useState, useEffect, useRef } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { toast } from "react-toastify";

const ModalCreateAtendimento = ({ Model, show, onHide, onAdd, onEdit }) => {

    const modalRef = useRef(null);

    const [atendimento, setAtendimento] = useState({
        id: null,
        dt_registro: new Date().toISOString().split('T')[0],
        descricao: ''
    });

    useEffect(() => {
        if (Model != null) {
            setAtendimento(Model);
        }
        else{
            setAtendimento({
                id: null,
                dt_registro: new Date().toISOString().split('T')[0],
                descricao: ''
            });
        }
    }, [Model]);

    const handleHide = async () => {
        onHide();
        await resetAtendimento();
    };

    const handleAtendimento = (evt, name = null) => {
        const value = evt.value ?? evt.target.value;

        setAtendimento({
            ...atendimento,
            [name ? name : evt.target.name]: value
        })

    }

    const resetAtendimento = async () => {
        setAtendimento({
            id: null,
            dt_registro:  new Date().toISOString().split('T')[0],
            observacao: ''
        })
    }

    const handleAdd = async () => {
        onAdd(atendimento);
        await resetAtendimento();
    }

    const handleEdit = async () => {
        onEdit(atendimento);
        await resetAtendimento();
    }

    return (
        <>
            <Modal ref={modalRef} show={show} onHide={handleHide}>
                <Modal.Header closeButton>
                    {
                        atendimento.id ?
                            <Modal.Title><i className="fa-solid fa-users"></i> <small> Editar Atendimento</small></Modal.Title>
                            :
                            <Modal.Title><i className="fa-solid fa-users"></i> <small> Adicionar Atendimento</small></Modal.Title>

                    }

                </Modal.Header>
                <Modal.Body>

                    <form className="form-control">

                        <div className="form-group">
                            <label htmlFor="dt_registro">Data do Atendimento <small className="campo-obrigatorio"></small></label>
                            <input
                                required={true}
                                id="dt_registro"
                                name="dt_registro"
                                className="form-control input rounded-2"
                                type="date"
                                min={new Date().toISOString().split('T')[0]}
                                value={atendimento.dt_registro ?? new Date().toISOString().split('T')[0]}
                                onChange={handleAtendimento}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="descricao">Descricao <small className="campo-obrigatorio"></small></label>
                            <textarea
                                id="descricao"
                                name="descricao"
                                className="form-control input rounded-2"
                                type="text"
                                rows={4}
                                value={atendimento.descricao}
                                onChange={handleAtendimento}
                            />

                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button className='btn btn-sm' variant="secondary" onClick={handleHide}>
                        <i className="fa-solid fa-times"></i> <small>Fechar</small>
                    </Button>

                    {
                        atendimento.id ?
                            <Button className='btn btn-sm btn-blue' type="submit" variant="primary" onClick={handleEdit} disabled={!(atendimento.dt_registro && atendimento.descricao)}>
                                <i className="fa-solid fa-save"></i>  <small>Salvar</small>
                            </Button>
                            :
                            <Button className='btn btn-sm btn-blue' type="submit" variant="primary" onClick={handleAdd} disabled={!(atendimento.dt_registro && atendimento.descricao)}>
                                <i className="fa-solid fa-plus"></i>  <small>Adicionar</small>
                            </Button>
                    }


                </Modal.Footer>
            </Modal>
        </>
    );


}


export default ModalCreateAtendimento;