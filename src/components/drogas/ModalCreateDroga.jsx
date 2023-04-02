import { useState, useRef } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { toast } from "react-toastify";

const ModalCreateDroga = ({ show, onHide }) => {
    const modalRef = useRef(null);

    const [droga, setDroga] = useState({
        nome: "",
        observacao: "",
    });


    const handleDroga = (evt, prop_name = null) => {
        const value = evt.value ?? evt.target.value;

        setDroga({
            ...droga,
            [prop_name ? prop_name : evt.target.name]: value
        })
    }

    const handleHide = (status = false) => {
        onHide(status);
    };


    const createDroga = async () => {

        if(!droga.nome){
            toast.error(`Necessário informar um nome.`);
            return;
        }

        const data = await await window.api.Action({ controller: "Droga", action: "CreateDroga", params: droga });
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
                    <Modal.Title><i className="fa-solid fa-users"></i> <small> Cadastrar nova droga</small></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group">
                        <div className="col-md-12">
                            <label htmlFor="nome">Nome</label>
                            <input
                                className="form-control shadow-none input-custom"
                                id="nome"
                                name="nome"
                                type="text"
                                placeholder="Nome"
                                value={droga.nome}
                                onChange={handleDroga} />
                            <br />
                            <label htmlFor="observacao">Observação</label>
                            <textarea
                                className="form-control shadow-none input-custom"
                                id="observacao"
                                name="observacao"
                                type="text"
                                placeholder=""
                                value={droga.observacao}
                                onChange={handleDroga} />
                        </div>
                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <Button className='btn btn-sm' variant="secondary" onClick={()=>{handleHide(false)}}>
                        <i className="fa-solid fa-times"></i> <small>Fechar</small>
                    </Button>
                    <Button className='btn btn-sm btn-blue' type="submit" variant="primary" onClick={createDroga}>
                        <i className="fa-solid fa-save"></i>  <small>Salvar</small>
                    </Button>

                </Modal.Footer>
            </Modal>
        </>
    );


}


export default ModalCreateDroga;