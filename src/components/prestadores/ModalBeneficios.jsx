import { useState, useEffect, useRef } from 'react';
import { Button, Modal } from 'react-bootstrap';

import Select from 'react-select';
import ModalCreateBeneficio from '../beneficios/ModalCreateBeneficio';


const ModalBeneficios = ({ show, onHide, onAdd }) => {
    const modalRef = useRef(null);

    const [beneficios, setBeneficios] = useState([]);
    const [beneficiosAdicionadas, setBeneficiosAdicionadas] = useState([]);

    const getBeneficios = async () => {
        const data = await await window.api.Action({ controller: "Beneficio", action: "GetBeneficios" });
        setBeneficios(data.map(s => { return { value: s.id, label: s.nome } }))
    }
    const [showModalCreateBeneficio, setShowModalCreateBeneficio] = useState(false);

    const handleModalBeneficio = (show) => {
        setShowModalCreateBeneficio(show)
    }

    const hideCreateModal = (status) => {
        if (status)
            getBeneficios();
        handleModalBeneficio(false);
    }

    const handleHide = (status = false) => {
        onHide(status);
    };

    const handleAdd = () => {
        onAdd(beneficiosAdicionadas);
    };

    const handleAddBeneficios = (value) => {
        setBeneficiosAdicionadas(value);
    }

    useEffect(() => {


        getBeneficios();

    }, []);

    return (
        <>
            <Modal ref={modalRef} show={show} className="modal-lg">
                <Modal.Header closeButton>
                    <Modal.Title><i className="fa-solid fa-users"></i> <small> Beneficios</small></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Selecione as beneficios ou cadastre novos</p>
                    <button className="btn btn-sm btn-blue" onClick={() => { handleModalBeneficio(true) }}><i className='fa fa-plus'></i> Cadastrar novo beneficio</button>
                    <hr />
                    <Select
                        options={beneficios}
                        id="id_beneficio"
                        name="id_beneficio"
                        placeholder="Beneficios Cadastradas"
                        isMulti
                        onChange={handleAddBeneficios}
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

            <ModalCreateBeneficio show={showModalCreateBeneficio} onHide={hideCreateModal} />
        </>
    );


}


export default ModalBeneficios;