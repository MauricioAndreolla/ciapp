import { useState, useEffect, useRef } from 'react';
import { Button, Modal } from 'react-bootstrap';

import Select from 'react-select';
import ModalCreateHabilidade from '../habilidades/ModalCreateHabilidade';


const ModalHabilidade = ({ show, onHide, onAdd }) => {
    const modalRef = useRef(null);

    const [habilidades, setHabilidades] = useState([]);
    const [habilidadesAdicionadas, setHabilidadesAdicionadas] = useState([]);

    const getHabilidades = async () => {
        const data = await await window.api.Action({ controller: "Habilidade", action: "GetHabilidades" });
        setHabilidades(data.map(s => { return { value: s.id, label: s.descricao } }))
    }
    const [showModalCreateHabilidade, setShowModalCreateHabilidade] = useState(false);

    const handleModalHabilidade = (show) => {
        setShowModalCreateHabilidade(show)
    }

    const hideCreateModal = (status) => {
        if (status)
            getHabilidades();
        handleModalHabilidade(false);
    }

    const handleHide = (status = false) => {
        onHide(status);
    };

    const handleAdd = () => {
        onAdd(habilidadesAdicionadas);
    };

    const handleAddHabilidades = (value) => {
        setHabilidadesAdicionadas(value);
    }

    useEffect(() => {


        getHabilidades();

    }, []);

    return (
        <>
            <Modal ref={modalRef} show={show} className="modal-lg">
                <Modal.Header closeButton>
                    <Modal.Title><i className="fa-solid fa-users"></i> <small> Habilidades</small></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Selecione as habilidades ou cadastre novas</p>
                    <button className="btn btn-sm btn-blue" onClick={() => { handleModalHabilidade(true) }}><i className='fa fa-plus'></i> Cadastrar nova habilidade</button>
                    <hr />
                    <Select
                        options={habilidades}
                        id="id_habilidade"
                        name="id_habilidade"
                        placeholder="Habilidades Cadastradas"
                        isMulti
                        onChange={handleAddHabilidades}
                    />


                </Modal.Body>
                <Modal.Footer>
                    <Button className='btn btn-sm' variant="secondary" onClick={() => { handleHide(false) }}>
                        <i className="fa-solid fa-times"></i> <small>Fechar</small>
                    </Button>
                    <Button className='btn btn-sm btn-blue' type="submit" variant="primary" onClick={() => { handleAdd() }}>
                        <i className="fa-solid fa-save"></i>  <small>Salvar</small>
                    </Button>

                </Modal.Footer>
            </Modal>

            <ModalCreateHabilidade show={showModalCreateHabilidade} onHide={hideCreateModal} />
        </>
    );


}


export default ModalHabilidade;