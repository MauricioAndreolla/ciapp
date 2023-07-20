import { useState, useEffect, useRef } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { toast } from "react-toastify";
import { Nav, Tab } from 'react-bootstrap';
import Importar from '../sincronizacao/Importar';
const ModalConfig = ({ show, onHide }) => {

    const modalRef = useRef(null);
    const [config, setConfig] = useState({
        dialet: 0,
        host: "",
        port: 3306,
        username: "",
        password: ""
    });

    const handleHide = () => {
        onHide();
    };

    useEffect(() => {
        setConfig({
            dialet: 0,
            host: "",
            port: 3306,
            username: "",
            password: ""
        });
        const fetchConfig = async () => {
            let data = await window.api.Action({ controller: "Config", action: "GetConfig" });

            if (data) setConfig(data);
        }

        fetchConfig();

    }, []);

    const handleConfig = (evt, name = null) => {

        const value = evt.value ?? evt.target?.value;

        setConfig({
            ...config,
            [name ? name : evt.target.name]: value
        })

    }


    const handleSaveConnection = async () => {

        let postResult = await window.api.Action({ controller: "Config", action: "SetConfig", params: config });
   
        postResult.status ? toast.success(postResult.text) : toast.error(postResult.text, { autoClose: false });

    }


    return (
        <>
            <Modal ref={modalRef} show={show} onHide={handleHide}>
                <Modal.Header closeButton>
                    <Modal.Title><i className="fa-solid fa-gear"></i> <small>configurações</small></Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Tab.Container defaultActiveKey="exportar">
                        <Nav variant="pills" style={{zoom:'0.7'}}>
                            <Nav.Item>
                                <Nav.Link eventKey="exportar">
                                    <i className="fa-solid fa-database"></i> Banco de Dados                                </Nav.Link>
                            </Nav.Item>

                            <Nav.Item>
                                <Nav.Link eventKey="importar">
                                    <i className="fa-solid fa-file-import"></i> Importar arquivo
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>

                        <Tab.Content>

                            <Tab.Pane eventKey="exportar">
                                <div className="row">
                                    <div className="col-md-12 no-padding">
                                        <form className="form-control">

                                            <div className="form-group">
                                                <label htmlFor="dialet">Dialeto</label>
                                                <select className="form-control shadow-none input-custom" value={config.dialet} onChange={handleConfig} name="dialet" id='dialet'>
                                                    <option></option>
                                                    <option value="0">MySQL</option>
                                                    <option value="1">SQLite</option>
                                                </select>
                                            </div>
                                            {
                                                config.dialet == 0 ?
                                                    <>
                                                        <div className="form-group">
                                                            <label htmlFor="host">Host</label>
                                                            <input className="form-control shadow-none input-custom" type="text" name="host" id="host" value={config.host} onChange={handleConfig} required={true} />
                                                        </div>

                                                        <div className="form-group">
                                                            <label htmlFor="port">Porta</label>
                                                            <input className="form-control shadow-none input-custom" type="number" name="port" id="port" value={config.port} onChange={handleConfig} required={true} />
                                                        </div>

                                                        <div className="form-group">
                                                            <label htmlFor="username">Usuário</label>
                                                            <input className="form-control shadow-none input-custom" type="text" name="username" id="username" value={config.username} onChange={handleConfig} required />
                                                        </div>

                                                        <div className="form-group">
                                                            <label htmlFor="password">Senha</label>
                                                            <input className="form-control shadow-none input-custom" type="password" name="password" id="password" value={config.password} onChange={handleConfig} required />
                                                        </div>
                                                    </>
                                                    : null
                                            }


                                        </form>
                                    </div>
                                </div>
                            </Tab.Pane>

                            <Tab.Pane eventKey="importar">
                                <div className="row">
                                    <div className="col-md-12 no-padding" style={{zoom:'0.8'}}>
                                        <Importar />
                                    </div>
                                </div>
                            </Tab.Pane>
                        </Tab.Content>
                    </Tab.Container>


                </Modal.Body>
                <Modal.Footer>
                    <Button className='btn btn-sm' variant="secondary" onClick={handleHide}>
                        <i className="fa-solid fa-times"></i> <small>Fechar</small>
                    </Button>
                    <Button className='btn btn-sm btn-blue' type="submit" variant="primary" onClick={handleSaveConnection} disabled={!(config.dialet == 1 || (config.host && config.username && config.password && config.port))}>
                        <i className="fa-solid fa-save"></i>  <small>Salvar</small>
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );


}


export default ModalConfig;