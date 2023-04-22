import { useState, useEffect, useRef } from "react";
import { Button, Modal } from 'react-bootstrap';
import Load from "../layout/Load";


const ModalDetalhes = ({ id, show, onHide }) => {
    const modalRef = useRef(null);
    const [image, setImage] = useState('');
    const [prestador, setPrestador] = useState({});
    const [load, setLoad] = useState(false);

    const handleHide = () => {
        onHide();
    };
    const formatDate = (agendamento_dia_inicial) => {
        if (!agendamento_dia_inicial) return '-';
        const [year, month, day] = agendamento_dia_inicial.split('-');
        return `${day}/${month}/${year}`;
    }

    useEffect(() => {

        if (id) {
            const fetchData = async () => {
                setLoad(true);
                let data = await window.api.Action({ controller: "Prestador", action: "GetPrestadorSimple", params: id });
                setImage(data.image);
                setPrestador({
                    id: data.id,
                    nome: data.nome,
                    dt_nascimento: data.dt_nascimento.toISOString().slice(0, 10),
                    telefone1: data.telefone1,
                });
                setLoad(false);
            }

            fetchData();
        }

    }, [id]);

    return <>
        <Modal ref={modalRef} show={show} onHide={handleHide}>
            <Modal.Header closeButton>
                <Modal.Title><i className="fa-solid fa-user"></i> <small> Detalhes</small></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <>
                    <div className="row">

                        {
                            !prestador.id ?
                                <div className="col-md-12">
                                    <h5><i className="fas fa-spinner fa-spin"></i> carregando...</h5>
                                </div>
                                :

                                <>
                                    <div className="col-md-4" >

                                        <img src={image} style={{ maxWidth: "150px" }} />
                                    </div>

                                    <div className="col-md-8">

                                        <p><small><b>Nome:</b> {prestador.nome}</small></p>
                                        <p><small><b>Data Nascimento:</b> {formatDate(prestador.dt_nascimento)}</small></p>
                                        <p><small><b>Contato:</b> {prestador.telefone1}</small></p>
                                    </div>
                                </>
                        }


                    </div>

                </>
            </Modal.Body>
            <Modal.Footer>
                <Button className='btn btn-sm' variant="secondary" onClick={handleHide}>
                    <i className="fa-solid fa-times"></i> <small>Fechar</small>
                </Button>
            </Modal.Footer>
        </Modal>
        <Load show={load} />
    </>
}


export default ModalDetalhes;