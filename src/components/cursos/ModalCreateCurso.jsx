import { useState, useRef } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { toast } from "react-toastify";
import Load from "../layout/Load";
const ModalCreateCurso = ({ show, onHide }) => {
    const modalRef = useRef(null);

    const [curso, setCurso] = useState({
        descricao: "",
        observacao: "",
        instituicao: ""
    });

    const [load, setLoad] = useState(false);
    const handleCurso = (evt, prop_name = null) => {
        const value = evt.value ?? evt.target.value;

        setCurso({
            ...curso,
            [prop_name ? prop_name : evt.target.name]: value
        })
    }

    const handleHide = (status = false) => {
        onHide(status);
    };


    const creatCurso= async () => {

        if (!curso.descricao) {
            toast.error(`Necessário informar uma descrição.`);
            return;
        }
        setLoad(true);
        const data = await await window.api.Action({ controller: "Curso", action: "CreateCurso", params: curso });
        setLoad(false);
        if (!data.status) {
            toast.error(`Erro: ${data.text}`, { autoClose: false });
        }
        else {
            toast.success(data.text);
            handleHide(true);
        }
    }

    return (
        <>
            <Modal ref={modalRef} show={show}>
                <Modal.Header closeButton>
                    <Modal.Title><i className="fa-solid fa-users"></i> <small> Cadastrar novo curso / especialização</small></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group">
                        <div className="col-md-12">
                            <label htmlFor="descricao">Descrição</label>
                            <input
                                className="form-control shadow-none input-custom"
                                id="descricao"
                                name="descricao"
                                type="text"
                                placeholder="Descrição"
                                value={curso.descricao}
                                onChange={handleCurso} />
                            <br />
                            <label htmlFor="observacao">Observação</label>
                            <textarea
                                className="form-control shadow-none input-custom"
                                id="observacao"
                                name="observacao"
                                type="text"
                                placeholder=""
                                value={curso.observacao}
                                onChange={handleCurso} />
                        </div>
                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <Button className='btn btn-sm' variant="secondary" onClick={() => { handleHide(false) }}>
                        <i className="fa-solid fa-times"></i> <small>Fechar</small>
                    </Button>
                    <Button className='btn btn-sm btn-blue' type="submit" variant="primary" onClick={creatCurso}>
                        <i className="fa-solid fa-save"></i>  <small>Salvar</small>
                    </Button>

                </Modal.Footer>
            </Modal>
            <Load show={load} />
        </>
    );


}


export default ModalCreateCurso;