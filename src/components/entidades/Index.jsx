import { useNavigate, NavLink, useParams } from 'react-router-dom'
import { useState, useEffect, useContext } from "react";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Title from "../layout/Title";
import { Alert, Button, Nav, NavItem, Tab, TabContainer, TabContent, TabPane } from 'react-bootstrap';
import Table from '../layout/Table';
import ModalDescredenciar from './ModalDescredenciar';
import { AuthenticationContext } from "../context/Authentication";
import { toast } from 'react-toastify';
import Load from "../layout/Load";
const Index = () => {
    const navigate = useNavigate();
    const [entidades, setEntidades] = useState({});
    const [load, setLoad] = useState(false);
    const { user } = useContext(AuthenticationContext);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoad(true);
        const data = await window.api.Action({ controller: "Entidades", action: "GetEntidades", params: null });
        setLoad(false);
        setEntidades(data);
    }

    const novaEntidade = () => {
        navigate('create');
    }


    const [modelDescredenciar, setModelDescredenciar] = useState({
        dt_descredenciamento: new Date(),
        motivo: '',
    });

    const [showModalDescredenciar, setShowModalDescredenciar] = useState(false);

    const ModalDescredenciarShow = (object) => {
        HandleModalDescredenciar(true, object);
    }

    const HandleModalDescredenciar = (show = true, model = null) => {
        setModelDescredenciar(model);
        setShowModalDescredenciar(show);
    }

    const Delete = async (id) => {
        const postResult = await window.api.Action({ controller: "Entidades", action: "Delete", params: id });
        if (!postResult.status) {
            toast.error(postResult.text, { autoClose: false });
        } else {
            toast.success(postResult.text, { autoClose: 3000 });
        }
        await fetchData();
    }

    const Credenciar = async (object) => {

        const postResult = await window.api.Action({ controller: "Entidades", action: "Credenciar", params: object.id });

        if (!postResult.status) {
            toast.error(postResult.text, { autoClose: false });
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
            toast.error(postResult.text, { autoClose: false });
        } else {
            toast.success(postResult.text, { autoClose: 3000 });
        }
        HandleModalDescredenciar(false, null);
        await fetchData();
    }


    const columnsEntidades = [
        { Header: 'Id', accessor: 'id' },
        { Header: 'Nome', accessor: 'nome' },
        { Header: 'CNPJ', accessor: 'cnpj' },
    ];

    return (
        <>
            <div>
                <Title title={"Entidades"} />
                {
                    user.MODO_APLICACAO === 0 ?

                        <div className='menu'>

                            <button className='menu-button button-dark-blue ' onClick={() => { novaEntidade() }}>
                                <i className='fa-solid fa-plus'></i> Novo
                            </button>
                        </div>

                        : null
                }

            </div>

            <div className='row table-container'>
                <div className='col-md-12'>
                    {entidades.length > 0 ?
                        <div className="tabs-entidades">
                            <Title title={"Entidades Cadastradas"} />

                            {
                                user.MODO_APLICACAO === 0 ?


                                    <div className='row table-container'>
                                        <div className='col-md-12'>
                                            <table className='table table-small table-bordered table-hover'>
                                                <thead>
                                                    <tr>
                                                        <th>Código</th>
                                                        <th>Nome</th>
                                                        <th>CNPJ</th>
                                                        <th>Tipo</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {entidades.map(r => (

                                                        <tr key={r.id} style={{ verticalAlign: "middle" }}>
                                                            <td>{r.id}</td>
                                                            <td>{r.nome}</td>
                                                            <td>{r.cnpj}</td>
                                                            <td>{r.tipo_instituicao == 0 ? "Central" : "Entidade"}</td>
                                                            <td>
                                                                <div className="btn-group" role="group">

                                                                    <span id="btnGroupDrop1" type="button" className="btn btn-custom dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                                                        <i className='fa fa-cog'></i> Opções
                                                                    </span>
                                                                    <ul className="dropdown-menu" aria-labelledby="btnGroupDrop1">
                                                                        {
                                                                            user.MODO_APLICACAO === 0 ?
                                                                                <>
                                                                                    <li> <NavLink className="dropdown-item" id="edit" to={`/entidades/Edit/${r.id}`}> <i className='fa fa-edit'></i> Editar</NavLink></li>
                                                                                    {r.dt_descredenciamento == null ?
                                                                                        <li> <Button className="dropdown-item" id="descredenciar" onClick={(_) => { ModalDescredenciarShow(r) }}> <i className='fa fa-plus'></i> Descredeciar</Button></li>
                                                                                        :
                                                                                        <li> <Button className="dropdown-item" id="credenciar" onClick={(_) => { Credenciar(r) }}> <i className='fa fa-plus'></i> Credenciar</Button></li>
                                                                                    }
                                                                                    <li> <Button className="dropdown-item" id="delete"
                                                                                        onClick={(_) => { Delete(r.id) }}> <i className='fa fa-trash'></i> Excluir</Button></li>
                                                                                </>
                                                                                :
                                                                                <>
                                                                                    {null}
                                                                                </>
                                                                        }
                                                                    </ul>
                                                                </div>
                                                            </td>

                                                        </tr>

                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    :

                                    <Table
                                        columns={columnsEntidades}
                                        data={entidades}
                                    />

                            }
                        </div>
                        : <div className="col-md-12 zero-count">Nenhum registro localizado.</div>}

                </div>
            </div>

            <ModalDescredenciar
                Model={modelDescredenciar}
                show={showModalDescredenciar}
                onHide={() => { HandleModalDescredenciar(false) }}
                onAdd={Descredenciar}
                onEdit={Descredenciar}
            />
            <Load show={load} />
        </>
    );
}

export default Index;