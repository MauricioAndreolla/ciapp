import { useNavigate, NavLink } from 'react-router-dom'
import { useState, useEffect, useContext } from "react";
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Title from "../layout/Title";
import { Button } from 'react-bootstrap';
import Table from '../layout/Table';
import ModalDescredenciar from './ModalDescredenciar';
import { AuthenticationContext } from "../context/Authentication";
import { toast } from 'react-toastify';
import Load from "../layout/Load";
import { confirmAlert } from 'react-confirm-alert';


const Index = () => {
    const navigate = useNavigate();
    const [entidades, setEntidades] = useState({});
    const [load, setLoad] = useState(false);
    const { user } = useContext(AuthenticationContext);
    const [search, setSearch] = useState({
        id: '',
        nome: '',
    });

    useEffect(() => {
        fetchData();
    }, [search]);

    const fetchData = async () => {
        setLoad(true);
        const data = await window.api.Action({ controller: "Entidades", action: "GetEntidades", params: search });
        setLoad(false);
        setEntidades(data);
    }

    const handleSearch = async (evt) => {
        let value = evt.target.value;
        setSearch({
            ...search,
            [evt.target.name]: value
        });
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

    const Delete = async (id, nome) => {

        confirmAlert({
            title: 'Confirmação',
            message: `Deseja deletar a entidade ${nome}`,
            buttons: [
                {
                    label: 'Sim',
                    onClick: async () => {
                        setLoad(true);
                        const postResult = await window.api.Action({ controller: "Entidades", action: "Delete", params: id });
                        fetchData();
                        setLoad(false);
                        if (!postResult.status) {
                            toast.error(postResult.text, { autoClose: false });
                        } else {
                            toast.success(postResult.text, { autoClose: 3000 });
                        }
                    }
                },
                {
                    className: 'btn-blue',
                    label: 'Não',
                    onClick: () => {
                    }
                }
            ]
        });
    }

    const Credenciar = async (object) => {

        const postResult = await window.api.Action({ controller: "Entidades", action: "Credenciar", params: object.id });

        if (!postResult.status) {
            toast.error(postResult.text, { autoClose: false });
        } else {
            toast.success(postResult.text, { autoClose: 3000 });
        }
        setLoad(true);
        await fetchData();
        setLoad(false);
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

        setLoad(true);
        await fetchData();
        setLoad(false);
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

                <div className="row search-container form-group">
                    <div className='search-title'>
                        <i className='fas fa-search'></i> Pesquisa
                    </div>
                    <div className="input-form col-md-3">
                        <label htmlFor="id">Código</label>
                        <input
                            id="id"
                            name="id"
                            className="form-control shadow-none input-custom"
                            type="number"
                            placeholder="Ex: 1"
                            value={search.id}
                            onChange={handleSearch}
                        />
                    </div>


                    <div className="input-form col-md-3">
                        <label htmlFor="nome">Nome</label>
                        <input
                            id="nome"
                            name="nome"
                            className="form-control shadow-none input-custom"
                            type="text"
                            placeholder="Ex: CIAP"
                            value={search.nome}
                            onChange={handleSearch}
                        />
                    </div>

                </div>
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

                                                                                    {
                                                                                        r.somente_leitura == true ?
                                                                                        null
                                                                                        :
                                                                                        <li> <Button className="dropdown-item" id="delete"
                                                                                            onClick={(_) => { Delete(r.id, r.nome) }}> <i className='fa fa-trash'></i> Excluir</Button>
                                                                                        </li>
                                                                                    }
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