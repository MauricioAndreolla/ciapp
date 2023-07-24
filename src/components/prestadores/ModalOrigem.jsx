import { useState, useEffect, useRef } from 'react';
import { Button, Modal } from 'react-bootstrap';
import Load from "../layout/Load";
import Select from 'react-select';
import ModalCreateOrigem from '../origens/ModalCreateOrigem';

const ModalOrigem = ({ show, onHide, onAdd }) => {
    const modalRef = useRef(null);
    const [load, setLoad] = useState(false);
    const [origens, setOrigens] = useState([]);
    const [origensAdicionadas, setOrigensAdicionadas] = useState([]);

    const getOrigens = async () => {
        setLoad(true);
        const data = await await window.api.Action({ controller: "Origem", action: "GetOrigens" });
        setLoad(false);
        setOrigens(data.map(s => { return { value: s.id, label: s.descricao } }))
    }
    const [showModalCreateOrigem, setShowModalCreateOrigem] = useState(false);

    const handleModalOrigem = (show) => {
        setShowModalCreateOrigem(show)
    }

    const hideCreateModal = (status) => {
        if (status)
            getOrigens();
        handleModalOrigem(false);
    }

    const handleHide = (status = false) => {
        onHide(status);
    };

    const handleAdd = () => {
        onAdd(origensAdicionadas);
    };

    const handleAddOrigens = (value) => {
        setOrigensAdicionadas(value);
    }

    useEffect(() => {

        getOrigens();

    }, []);

    return (
        <>
            <Modal ref={modalRef} show={show} className="modal-lg">
                <Modal.Header closeButton>
                    <Modal.Title><i className="fa-solid fa-users"></i> <small> Origens</small></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Selecione a origem ou cadastre novas</p>
                    <button className="btn btn-sm btn-blue" onClick={() => { handleModalOrigem(true) }}><i className='fa fa-plus'></i> Cadastrar nova Origem</button>
                    <hr />
                    <Select
                        options={origens}
                        id="id_origem"
                        name="id_origem"
                        placeholder="Origens Cadastradas"
                        isMulti
                        onChange={handleAddOrigens}
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

            <ModalCreateOrigem show={showModalCreateOrigem} onHide={hideCreateModal} />
            <Load show={load} />
        </>
    );


}


export default ModalOrigem;