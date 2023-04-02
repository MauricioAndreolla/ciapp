import { useState, useRef } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { toast } from "react-toastify";

const ModalBeneficio = ({ show, onHide }) => {
    const modalRef = useRef(null);

    const [beneficio, setBeneficio] = useState({
        nome: "",
        observacao: "",
    });


    const handleBeneficio = (evt, prop_name = null) => {
        const value = evt.value ?? evt.target.value;

        setBeneficio({
            ...beneficio,
            [prop_name ? prop_name : evt.target.name]: value
        })
    }

    const handleHide = (status = false) => {
        onHide(status);
    };


    const createBeneficio = async () => {

        if(!beneficio.nome){
            toast.error(`Necessário informar um nome.`);
            return;
        }

        const data = await await window.api.Action({ controller: "Beneficio", action: "CreateBeneficio", params: beneficio });
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
                    <Modal.Title><i className="fa-solid fa-users"></i> <small> Cadastrar nova beneficio</small></Modal.Title>
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
                                value={beneficio.nome}
                                onChange={handleBeneficio} />
                            <br />
                            <label htmlFor="observacao">Observação</label>
                            <textarea
                                className="form-control shadow-none input-custom"
                                id="observacao"
                                name="observacao"
                                type="text"
                                placeholder=""
                                value={beneficio.observacao}
                                onChange={handleBeneficio} />
                        </div>
                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <Button className='btn btn-sm' variant="secondary" onClick={()=>{handleHide(false)}}>
                        <i className="fa-solid fa-times"></i> <small>Fechar</small>
                    </Button>
                    <Button className='btn btn-sm btn-blue' type="submit" variant="primary" onClick={createBeneficio}>
                        <i className="fa-solid fa-save"></i>  <small>Salvar</small>
                    </Button>

                </Modal.Footer>
            </Modal>
        </>
    );


}


export default ModalBeneficio;