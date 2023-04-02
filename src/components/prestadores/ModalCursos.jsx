import { useState, useEffect, useRef } from 'react';
import { Button, Modal } from 'react-bootstrap';

import Select from 'react-select';
import ModalCreateCurso from '../cursos/ModalCreateCurso';


const ModalCursos = ({ show, onHide, onAdd }) => {
    const modalRef = useRef(null);

    const [cursos, setCursos] = useState([]);
    const [cursosAdicionados, setCursosAdicionados] = useState([]);

    const getCursos = async () => {
        const data = await await window.api.Action({ controller: "Curso", action: "GetCursos" });
        setCursos(data.map(s => { return { value: s.id, label: s.descricao } }))
    }
    const [showModalCreateCurso, setShowModalCreateCurso] = useState(false);

    const handleModalCurso = (show) => {
        setShowModalCreateCurso(show)
    }

    const hideCreateModal = (status) => {
        if (status)
            getCursos();
        handleModalCurso(false);
    }

    const handleHide = (status = false) => {
        onHide(status);
    };

    const handleAdd = () => {
        onAdd(cursosAdicionados);
    };

    const handleAddCurso= (value) => {
        setCursosAdicionados(value);
    }

    useEffect(() => {


        getCursos();

    }, []);

    return (
        <>
            <Modal ref={modalRef} show={show} className="modal-lg">
                <Modal.Header closeButton>
                    <Modal.Title><i className="fa-solid fa-users"></i> <small> Cursos e especialidades</small></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Selecione cursos/ especialidades ou cadastre novas</p>
                    <button className="btn btn-sm btn-blue" onClick={() => { handleModalCurso(true) }}><i className='fa fa-plus'></i> Cadastrar novo</button>
                    <hr />
                    <Select
                        options={cursos}
                        id="id_curso"
                        name="id_curso"
                        placeholder="Cursos / especializações Cadastradas"
                        isMulti
                        onChange={handleAddCurso}
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

            <ModalCreateCurso show={showModalCreateCurso} onHide={hideCreateModal} />
        </>
    );


}


export default ModalCursos;