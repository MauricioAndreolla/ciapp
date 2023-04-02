import { useState, useEffect, useRef } from 'react';
import { Button, Modal } from 'react-bootstrap';

import Select from 'react-select';
import ModalCreateDroga from '../drogas/ModalCreateDroga';


const ModalUsoDroga = ({ show, onHide, onAdd }) => {
    const modalRef = useRef(null);

    const [drogas, setDrogas] = useState([]);

    const [drogaAdicionada, setDrogaAdicionada] = useState({
        id: null,
        frequencia: 0,
    });



    const getDrogas = async () => {
        const data = await await window.api.Action({ controller: "Droga", action: "GetDrogas" });
        setDrogas(data.map(s => { return { value: s.id, label: s.nome } }))
    }
    const [showModalCreateDroga, setShowModalCreateDroga] = useState(false);

    const handleModalDroga = (show) => {
        setShowModalCreateDroga(show)
    }

    const hideCreateModal = (status) => {
        if (status)
            getDrogas();
        handleModalDroga(false);
    }

    const handleHide = (status = false) => {
        onHide(status);
    };

    const handleAdd = () => {
        onAdd(drogaAdicionada);
    };

    const handleDroga = (evt, name = null) => {

        const value = evt.value ?? evt.target.value;

        if(name && name.name){
            setDrogaAdicionada
            ({
                ...drogaAdicionada,
                [name.name ?? evt.target.name]: value
            });

        }
        else{
            setDrogaAdicionada
            ({
                ...drogaAdicionada,
                [name ? name : evt.target.name]: value
            });

        }

    }

    useEffect(() => {


        getDrogas();

    }, []);

    return (
        <>
            <Modal ref={modalRef} show={show} className="modal-lg">
                <Modal.Header closeButton>
                    <Modal.Title><i className="fa-solid fa-users"></i> <small> Uso de Drogas</small></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Selecione qual a droga utilizada ou cadastre novas</p>
                    <button className="btn btn-sm btn-blue" onClick={() => { handleModalDroga(true) }}><i className='fa fa-plus'></i> Cadastrar nova droga</button>
                    <hr />

                    <div className="input-form">
                        <label htmlFor="id">Droga</label>
                        <div className="input-group-append">
                            <Select
                                options={drogas}
                                id="id"
                                name="id"
                                placeholder="Drogas Cadastradas"
                                onChange={handleDroga}
                            />
                        </div>
                    </div>



                    <div className="input-form">
                        <label htmlFor="frequencia">Frequência de Uso</label>
                        <div className="input-group-append">
                            <select className="select-custom w-10 form-select form-select-md" id="frequencia" name="frequencia"
                                value={drogaAdicionada.frequencia}
                                required={true}
                                onChange={handleDroga}>
                                <option defaultValue={true} value='0'>Eventualmente</option>
                                <option value='1'>Com Frequência</option>
                                <option value='2'>Não usa mais</option>
                            </select>
                        </div>
                    </div>



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

            <ModalCreateDroga show={showModalCreateDroga} onHide={hideCreateModal} />
        </>
    );


}


export default ModalUsoDroga;