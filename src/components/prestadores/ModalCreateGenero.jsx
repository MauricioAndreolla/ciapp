import { useState, useEffect, useRef } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { toast } from "react-toastify";

const ModalGenero = ({ Model, show, onHide, onAdd, onEdit }) => {

    const modalRef = useRef(null);

    const [genero, setGenero] = useState({
        descricao: ''
    });


    const handleHide = () => {
        onHide();
    };

    const handleGenero = (evt, name = null) => {
        const value = evt.value ?? evt.target.value;

        setGenero({
            ...genero,
            [name ? name : evt.target.name]: value
        })

    }

    const resetGenero = async () => {
        setGenero({
            descricao: ''
        })
    }

    const handleAdd = async () => {
        onAdd(genero);
        await resetGenero();
    }

    const handleEdit = async () => {
        onEdit(genero);
        await resetGenero();
    }

    return (
        <>
            <Modal ref={modalRef} show={show} onHide={handleHide}>
                <Modal.Header closeButton>
                    <Modal.Title><i className="fa-solid fa-users"></i> <small> Adicionar Gênero</small></Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <form className="form-control">

                        <div className="form-group">
                            <label htmlFor="descricao">Gênero</label>
                            <input
                                id="descricao"
                                name="descricao"
                                className="form-control shadow-none input-custom"
                                type="text"
                                placeholder=""
                                value={genero.descricao}
                                onChange={handleGenero}
                            />

                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button className='btn btn-sm' variant="secondary" onClick={handleHide}>
                        <i className="fa-solid fa-times"></i> <small>Fechar</small>
                    </Button>
                    <Button className='btn btn-sm btn-blue' type="submit" variant="primary" onClick={handleAdd} disabled={!(genero.descricao)}>
                        <i className="fa-solid fa-plus"></i>  <small>Adicionar</small>
                    </Button>

                </Modal.Footer>
            </Modal>
        </>
    );


}


export default ModalGenero;