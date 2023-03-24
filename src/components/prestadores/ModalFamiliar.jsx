import { useState, useEffect, useRef } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { toast } from "react-toastify";

const ModalFamiliar = ({ Model, show, onHide, onAdd, onEdit }) => {

    const modalRef = useRef(null);

    const [familiar, setFamiliar] = useState({
        id: null,
        familiar_nome: '',
        familiar_parentesco: '',
        familiar_idade: '',
        familiar_profissao: '',
        novo_registro: true
    });

    useEffect(() => {
        if (Model != null) {
            setFamiliar(Model);
        }
    }, [Model]);

    const handleHide = () => {
        onHide();
    };

    const handleFamilia = (evt, name = null) => {
        const value = evt.value ?? evt.target.value;

        setFamiliar({
            ...familiar,
            [name ? name : evt.target.name]: value
        })

    }

    const resetFamiliar = async () => {
        setFamiliar({
            id: null,
            familiar_nome: '',
            familiar_parentesco: '',
            familiar_idade: '',
            familiar_profissao: '',
            novo_registro: true
        })
    }

    const handleAdd = async () => {
        onAdd(familiar);
        await resetFamiliar();
    }

    const handleEdit = async () => {
        onEdit(familiar);
        await resetFamiliar();
    }

    return (
        <>
            <Modal ref={modalRef} show={show} onHide={handleHide}>
                <Modal.Header closeButton>
                    <Modal.Title><i className="fa-solid fa-users"></i> <small> Adicionar Familiar</small></Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <form className="form-control">

                        <div className="form-group">
                            <label htmlFor="familiar_nome">Nome</label>
                            <input
                                id="familiar_nome"
                                name="familiar_nome"
                                className="form-control shadow-none input-custom"
                                type="text"
                                placeholder="Nome do Familiar"
                                value={familiar.familiar_nome}
                                onChange={handleFamilia}
                            />

                        </div>

                        <div className="form-group">
                            <label htmlFor="familiar_parentesco">Parentesco</label>
                            <input
                                id="familiar_parentesco"
                                name="familiar_parentesco"
                                className="form-control shadow-none input-custom"
                                type="text"
                                placeholder="Parentesco"
                                value={familiar.familiar_parentesco}
                                onChange={handleFamilia}

                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="familiar_idade">Idade (opcional)</label>
                            <input
                                id="familiar_idade"
                                name="familiar_idade"
                                className="form-control shadow-none input-custom"
                                type="number"
                                placeholder="Idade do Familiar"
                                value={familiar.familiar_idade}
                                onChange={handleFamilia}

                            />
                        </div>


                        <div className="form-group">
                            <label htmlFor="familiar_profissao">Profissão (opcional)</label>
                            <input
                                id="familiar_profissao"
                                name="familiar_profissao"
                                className="form-control shadow-none input-custom"
                                type="text"
                                placeholder="Profissão do Familiar"
                                value={familiar.familiar_profissao}
                                onChange={handleFamilia}

                            />
                        </div>

                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button className='btn btn-sm' variant="secondary" onClick={handleHide}>
                        <i className="fa-solid fa-times"></i> <small>Fechar</small>
                    </Button>
                    {
                        familiar.id ?

                            <Button className='btn btn-sm btn-blue' type="submit" variant="primary" onClick={handleEdit} disabled={!(familiar.familiar_nome && familiar.familiar_parentesco)}>
                                <i className="fa-solid fa-save"></i>  <small>Salvar</small>
                            </Button>
                            :
                            <Button className='btn btn-sm btn-blue' type="submit" variant="primary" onClick={handleAdd} disabled={!(familiar.familiar_nome && familiar.familiar_parentesco)}>
                                <i className="fa-solid fa-plus"></i>  <small>Adicionar</small>
                            </Button>

                    }

                </Modal.Footer>
            </Modal>
        </>
    );


}


export default ModalFamiliar;