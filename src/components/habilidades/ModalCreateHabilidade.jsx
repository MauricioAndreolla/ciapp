import { useState, useRef } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { toast } from "react-toastify";

const ModalHabilidade = ({ show, onHide }) => {
    const modalRef = useRef(null);

    const [habilidade, setHabilidade] = useState({
        descricao: "",
        observacao: "",
    });


    const handleHabilidade = (evt, prop_name = null) => {
        const value = evt.value ?? evt.target.value;

        setHabilidade({
            ...habilidade,
            [prop_name ? prop_name : evt.target.name]: value
        })
    }

    const handleHide = (status = false) => {
        onHide(status);
    };


    const createHabilidade = async () => {

        if(!habilidade.descricao){
            toast.error(`Necessário informar uma descrição.`);
            return;
        }

        const data = await await window.api.Action({ controller: "Habilidade", action: "CreateHabilidade", params: habilidade });
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
                    <Modal.Title><i className="fa-solid fa-users"></i> <small> Cadastrar nova habilidade</small></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group">
                        <div className="col-md-12">
                            <label htmlFor="habilidade">Descrição</label>
                            <input
                                className="form-control shadow-none input-custom"
                                id="descricao"
                                name="descricao"
                                type="text"
                                placeholder="Descrição"
                                value={habilidade.descricao}
                                onChange={handleHabilidade} />
                            <br />
                            <label htmlFor="observacao">Observação</label>
                            <textarea
                                className="form-control shadow-none input-custom"
                                id="observacao"
                                name="observacao"
                                type="text"
                                placeholder=""
                                value={habilidade.observacao}
                                onChange={handleHabilidade} />
                        </div>
                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <Button className='btn btn-sm' variant="secondary" onClick={()=>{handleHide(false)}}>
                        <i className="fa-solid fa-times"></i> <small>Fechar</small>
                    </Button>
                    <Button className='btn btn-sm btn-blue' type="submit" variant="primary" onClick={createHabilidade}>
                        <i className="fa-solid fa-save"></i>  <small>Salvar</small>
                    </Button>

                </Modal.Footer>
            </Modal>
        </>
    );


}


export default ModalHabilidade;