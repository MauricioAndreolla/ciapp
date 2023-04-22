import { useState, useEffect, useRef } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { toast } from "react-toastify";

const ModalCreateVara = ({ show, onHide, onAdd }) => {
    const modalRef = useRef(null);

    const [descricao, SetDescricao] = useState("");


    const handleHide = (status = false) => {
        onHide(status);
        SetDescricao('');
    };

    const handleAdd = async () => {
        if(!descricao){
            toast.error(`Necessário informar uma descrição.`);
            return;
        }
        const data = await window.api.Action({ controller: "Vara", action: "CreateVara", params: descricao });
        if(!data.status){
            toast.error(`Erro: ${data.text}`, { autoClose: false });
        }
        else{
            toast.success(data.text);
            handleHide(true);
        }
    };

    const handleDescricao = (evt) => {
   
        SetDescricao(evt.target.value)
    };

    return (
        <>
            <Modal ref={modalRef} show={show} className="modal-lg">
                <Modal.Header closeButton>
                    <Modal.Title><i className="fa-solid fa-inbox"></i> <small> Cadastro de Vara judicial</small></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="input-form">

                        <label htmlFor="descricao">Descrição</label>
                        <input
                            id="descricao"
                            name="descricao"
                            className="form-control shadow-none input-custom"
                            placeholder=""
                            value={descricao}
                            required={true}
                            onChange={handleDescricao}
                        />
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

        </>
    );


}


export default ModalCreateVara;