import { useState, useEffect, useRef } from 'react';
import { Button, Modal } from 'react-bootstrap';


const ModalTarefa = ({ Model, show, onHide, onAdd, onEdit }) => {
    const modalRef = useRef(null);

    const [tarefa, setTarefa] = useState({
        id: null,
        titulo: '',
        descricao: '',
        status: true,
        novo_registro: true
    });

    useEffect(() => {
        if (Model != null) {
            setTarefa(Model);
        }
    }, [Model]);

    const handleHide = () => {
        onHide();
    };

    const handleTarefa = (evt, name = null) => {
    
        const value = evt.value ?? evt.target.value;

        setTarefa({
            ...tarefa,
            [name ? name : evt.target.name]: value
        })

    }

    const resetTarefa = async () => {
        setTarefa({
            id: null,
            titulo: '',
            descricao: '',
            status: true,
            novo_registro: true

        })
    }

    const handleAdd = async () => {
        onAdd(tarefa);
        await resetTarefa();
    }

    const handleEdit = async () => {
        onEdit(tarefa);
        await resetTarefa();
    }

    return (
        <>
            <Modal ref={modalRef} show={show} onHide={handleHide}>
                <Modal.Header closeButton>
                    <Modal.Title><i className="fa-solid fa-clipboard-list"></i> <small> Adicionar Tarefa</small></Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <form className="form-control">

                        <div className="form-group">
                            <label htmlFor="titulo">Titulo</label>
                            <input
                                id="titulo"
                                name="titulo"
                                className="form-control shadow-none input-custom"
                                type="text"
                                placeholder="Titulo"
                                value={tarefa.titulo}
                                onChange={handleTarefa}
                            />

                        </div>

                        <div className="form-group">
                            <label htmlFor="descricao">Descricao</label>
                            <input
                                id="descricao"
                                name="descricao"
                                className="form-control shadow-none input-custom"
                                type="text"
                                placeholder="Descricao"
                                value={tarefa.descricao}
                                onChange={handleTarefa}

                            />
                        </div>

                        <div className="form-group">
                            <div className="form-check form-check-inline">

                                <input className="form-check-input" type="radio" name="status" id="status1" onChange={handleTarefa} value={true} defaultChecked />
                                <label className="form-check-label" htmlFor="status1">
                                    Ativa
                                </label>
                            </div>

                            <div className="form-check form-check-inline">

                                <input className="form-check-input" type="radio" name="status" id="status2" onChange={handleTarefa} value={false} />
                                <label className="form-check-label" htmlFor="status2">
                                    Inativa
                                </label>

                            </div>

                        </div>



                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button className='btn btn-sm' variant="secondary" onClick={handleHide}>
                        <i className="fa-solid fa-times"></i> <small>Fechar</small>
                    </Button>
                    {
                        tarefa.id ?
                            <Button className='btn btn-sm btn-blue' type="submit" variant="primary" onClick={handleEdit} disabled={!(tarefa.titulo)}>
                                <i className="fa-solid fa-save"></i>  <small>Salvar</small>
                            </Button>
                            :
                            <Button className='btn btn-sm btn-blue' type="submit" variant="primary" onClick={handleAdd} disabled={!(tarefa.titulo)}>
                                <i className="fa-solid fa-plus"></i>  <small>Adicionar</small>
                            </Button>
                    }

                </Modal.Footer>
            </Modal>
        </>
    );


}

export default ModalTarefa;