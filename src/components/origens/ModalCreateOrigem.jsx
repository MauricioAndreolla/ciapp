import { useState, useRef } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { toast } from "react-toastify";
import Load from "../layout/Load";

const ModalOrigem = ({ show, onHide }) => {
    const modalRef = useRef(null);

    const [origem, setOrigem] = useState({
        descricao: "",
        observacao: "",
    });

    const [load, setLoad] = useState(false);
    const handleOrigem = (evt, prop_name = null) => {
        const value = evt.value ?? evt.target.value;
     

        setOrigem({
            ...origem,
            [prop_name ? prop_name : evt.target.name]: value
        })
    }

    const handleHide = (status = false) => {
        onHide(status);
        setOrigem({
            descricao: "",
            observacao: "",
        })
    };


    const createOrigem = async () => {

        if(!origem.descricao){
            toast.error(`Necessário informar uma descrição.`);
            return;
        }
        setLoad(true);
        const data = await await window.api.Action({ controller: "Origem", action: "CreateOrigem", params: origem });
        setLoad(false);
        if(!data.status){
            toast.error(`Erro: ${data.text}`, { autoClose: false });
        }
        else{
            toast.success(data.text);
            handleHide(true);
        }
    }

    return (
        <>
            <Modal ref={modalRef} show={show}>
                <Modal.Header closeButton>
                    <Modal.Title><i className="fa-solid fa-users"></i> <small> Cadastrar nova origem</small></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group">
                        <div className="col-md-12">
                            <label htmlFor="origem">Descrição</label>
                            <input
                                className="form-control shadow-none input-custom"
                                id="descricao"
                                name="descricao"
                                type="text"
                                placeholder="Descrição"
                                value={origem.descricao}
                                onChange={handleOrigem} />
                            <br />
                            <label htmlFor="observacao">Observação</label>
                            <textarea
                                className="form-control shadow-none input-custom"
                                id="observacao"
                                name="observacao"
                                type="text"
                                placeholder=""
                                value={origem.observacao}
                                onChange={handleOrigem} />
                        </div>
                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <Button className='btn btn-sm' variant="secondary" onClick={()=>{handleHide(false)}}>
                        <i className="fa-solid fa-times"></i> <small>Fechar</small>
                    </Button>
                    <Button className='btn btn-sm btn-blue' type="submit" variant="primary" onClick={createOrigem}>
                        <i className="fa-solid fa-save"></i>  <small>Salvar</small>
                    </Button>

                </Modal.Footer>
            </Modal>
            <Load show={load} />
        </>
    );


}


export default ModalOrigem;