import { useNavigate, NavLink, useParams } from 'react-router-dom'
import { useState, useEffect } from "react";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Title from "../layout/Title";
import { Alert, Nav, NavItem, Tab, TabContainer, TabContent, TabPane } from 'react-bootstrap';
import Table from '../layout/Table';
import ModalDescredenciar from './ModalDescredenciar';
import { toast } from 'react-toastify';

const Index = () => {
    const navigate = useNavigate();
    const [tempID, setempID] = useState(0);
    const [entidades, setEntidades] = useState({});

    const [modelDescredenciar, setModelDescredenciar] = useState({
        dt_descredenciamento: new Date(),
        motivo: '',
    });

    const [showModalDescredenciar, setShowModalDescredenciar] = useState(false);

    const fetchData = async () => {
        const data = await window.api.Action({ controller: "Entidades", action: "GetEntidades", params: null });
        setEntidades(data);
        console.log(entidades)
    }

    useEffect(() => {
        fetchData();
    }, []);

    const novaEntidade = () => {
        navigate('create');
    }

    const editEntidade = (evt) => {
        navigate(`Edit/${evt.id}`);
    }


    const ModalDescredenciarShow = (object) => {
        HandleModalDescredenciar(true, object);
    }

    const HandleModalDescredenciar = (show = true, model = null) => {
        setModelDescredenciar(model);
        setShowModalDescredenciar(show);
    }

    const columnsEntidades = [
        { Header: 'Id', accessor: 'id' },
        { Header: 'Nome', accessor: 'nome' },
        { Header: 'CNPJ', accessor: 'cnpj' },
    ];

    const Credenciar = async (object) => {

        const postResult = await window.api.Action({ controller: "Entidades", action: "Credenciar", params: object.id });

        if (!postResult.status) {
            toast.error(postResult.text, { autoClose: 3000 });
        } else {
            toast.success(postResult.text, { autoClose: 3000 });
        }
        await fetchData();
    }

    const Descredenciar = async (object) => {

        const payload = {
            id: object.id,
            dt_descredenciamento: new Date(object.dt_descredenciamento),
            motivo: object.motivo
        }

        const postResult = await window.api.Action({ controller: "Entidades", action: "Descredenciar", params: payload });

        if (!postResult.status) {
            toast.error(postResult.text, { autoClose: 3000 });
        } else {
            toast.success(postResult.text, { autoClose: 3000 });
        }
        HandleModalDescredenciar(false, null);
        await fetchData();
    }

    return (

        <>

            <div>
                <Title title={"Entidades"} />

                <div className='menu'>

                    <button className='menu-button button-green' onClick={() => { novaEntidade() }}>
                        <i className='fa-solid fa-plus'></i> Novo
                    </button>
                </div>
            </div>



            <div className='row table-container mt-5'>
                <div className='col-md-12'>
                    {entidades.length > 0 ?
                        <div className="tabs-entidades">
                            <Tab.Container defaultActiveKey="entidades">
                                <Nav variant="pills">
                                    <Nav.Item>
                                        <Nav.Link eventKey="entidades">
                                            Entidades
                                        </Nav.Link>
                                    </Nav.Item>
                                </Nav>

                                <Tab.Content>

                                    <Tab.Pane eventKey="entidades">

                                        <Title title={"Entidades Cadastradas"} />
                                        <div className="row">
                                            <div className="col-md-12 no-padding">
                                                <Table
                                                    columns={columnsEntidades}
                                                    data={entidades}
                                                    onEdit={editEntidade}
                                                    onDelete={(e) => e.dt_descredenciamento == null ? ModalDescredenciarShow(e) : Credenciar(e)} />
                                            </div>
                                        </div>
                                    </Tab.Pane>
                                </Tab.Content>
                            </Tab.Container>
                        </div>
                        : "Entidades não encontradas"}

                </div>
            </div>



            <ModalDescredenciar
                Model={modelDescredenciar}
                show={showModalDescredenciar}
                onHide={() => { HandleModalDescredenciar(false) }}
                onAdd={Descredenciar}
                onEdit={Descredenciar}
            />
        </>


    );


}

export default Index