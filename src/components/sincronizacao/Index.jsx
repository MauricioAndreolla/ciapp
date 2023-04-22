
import Title from "../layout/Title";
import { Nav, Tab, } from 'react-bootstrap';

import Exportar from './Exportar';
import Importar from './Importar';



const Sincronizacao = () => {


    return (
        <>
            <Title title={"Sincronização de Dados"} />

            <div className='row table-container'>
                <div className='col-md-12'>
                    <div className="tabs-prestador">
                        <Tab.Container defaultActiveKey="exportar">
                            <Nav variant="pills">
                                <Nav.Item>
                                    <Nav.Link eventKey="exportar">
                                        <i className="fa-solid fa-file-export"></i> Exportar arquivo
                                    </Nav.Link>
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
                                            <Exportar />
                                        </div>
                                    </div>
                                </Tab.Pane>

                                <Tab.Pane eventKey="importar">
                                    <div className="row">
                                        <div className="col-md-12 no-padding">
                                            <Importar />
                                        </div>
                                    </div>
                                </Tab.Pane>
                            </Tab.Content>
                        </Tab.Container>
                    </div>


                </div>
            </div>

        </>




    )




};
export default Sincronizacao;