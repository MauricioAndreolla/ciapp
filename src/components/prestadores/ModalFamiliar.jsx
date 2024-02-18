import { useState, useEffect, useRef } from 'react';
import { Button, Modal } from 'react-bootstrap';

const ModalFamiliar = ({ Model, show, onHide, onAdd, onEdit }) => {

    const modalRef = useRef(null);

    const [familiar, setFamiliar] = useState({
        id: null,
        familiar_nome: '',
        familiar_parentesco: 11,
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
            familiar_parentesco: 11,
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
                            <label htmlFor="familiar_parentesco">Parentesco<small className="campo-obrigatorio"></small></label>
                            <select className="select-custom w-10 form-select form-select-md" id="familiar_parentesco" name="familiar_parentesco"
                                value={familiar.familiar_parentesco}
                                required={true}
                                onChange={handleFamilia}>
                                <option value={0}>Pai</option>
                                <option value={1}>Mãe</option>
                                <option value={2}>Filho(a)</option>
                                <option value={3}>Tio(a)</option>
                                <option value={4}>Primo(a)</option>
                                <option value={5}>Avô</option>
                                <option value={6}>Avó</option>
                                <option value={7}>Irmã</option>
                                <option value={8}>Irmão</option>
                                <option value={9}>Esposo(a)</option>
                                <option value={10}>Namorado(a)</option>
                                <option defaultValue={true} value={11}>Outro(a)</option>
                            </select>
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