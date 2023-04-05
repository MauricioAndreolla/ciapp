import { useState, useEffect, useRef } from 'react';
import { Button, Modal } from 'react-bootstrap';


const ModalDescredenciar = ({ Model, show, onHide, onAdd, onEdit }) => {
    const modalRef = useRef(null);

    const [descredenciamento, setDescresdenciamento] = useState({

        dt_descredenciamento: new Date(),
        motivo: '',

    });

    useEffect(() => {
        if (Model != null) {
            setDescresdenciamento(Model);
        }
    }, [Model]);

    const handleHide = () => {
        onHide();
    };

    const handleDescredenciamento = (evt, name = null) => {
        const value = evt.value ?? evt.target.value;

        setDescresdenciamento({
            ...descredenciamento,
            [name ? name : evt.target.name]: value
        })

    }

    const resetDescredenciamento = async () => {
        setDescresdenciamento({

            dt_descredenciamento: new Date(),
            motivo: '',

        })
    }

    const handleAdd = async () => {
        onAdd(descredenciamento);
        await resetDescredenciamento();
    }

    const handleEdit = async () => {
        onEdit(descredenciamento);
        await resetDescredenciamento();
    }

    return (
        <>
            <Modal ref={modalRef} show={show} onHide={handleHide}>
                <Modal.Header closeButton>
                    <Modal.Title><i className="fa-solid fa-users"></i> <small> Descredenciar entidade</small></Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <form className="form-control">

                        <div className="form-group">
                            <label htmlFor="motivo">Motivo</label>
                            <textarea
                                id="motivo"
                                name="motivo"
                                className="form-control shadow-none input-custom"
                                placeholder="Motivo do descredenciamento"
                                rows={5}
                                value={descredenciamento.motivo}
                                onChange={handleDescredenciamento}
                            />
                        </div>

                        <div className="form-group mt-3">
                            <label htmlFor="dt_descredenciamento">Data de descredeciamento</label>
                            <input
                                type="date"
                                id="dt_descredenciamento"
                                name="dt_descredenciamento"
                                className="form-control shadow-none input-custom"
                                placeholder="Data de descredeciamento"
                                value={descredenciamento.dt_descredenciamento}
                                onChange={handleDescredenciamento}
                            />

                        </div>

                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button className='btn btn-sm' variant="secondary" onClick={handleHide}>
                        <i className="fa-solid fa-times"></i> <small>Fechar</small>
                    </Button>
                    {
                        descredenciamento.id != null ?

                            <Button className='btn btn-sm btn-blue' type="submit" variant="primary" onClick={handleEdit} disabled={!(descredenciamento.motivo) && !(descredenciamento.dt_descredenciamento)}>
                                <i className="fa-solid fa-save"></i>  <small>Salvar</small>
                            </Button>
                            :
                            <Button className='btn btn-sm btn-blue' type="submit" variant="primary" onClick={handleAdd} disabled={!(descredenciamento.motivo) && !(descredenciamento.dt_descredenciamento)}>
                                <i className="fa-solid fa-plus"></i>  <small>Adicionar</small>
                            </Button>
                    }

                </Modal.Footer>
            </Modal>
        </>
    );


}

export default ModalDescredenciar;