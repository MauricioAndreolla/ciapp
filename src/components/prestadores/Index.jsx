import { useNavigate, NavLink } from 'react-router-dom'
import { useState, useEffect, useContext } from "react";
import Title from "../layout/Title";
import { AuthenticationContext } from "../context/Authentication";
const Index = () => {
    const { user } = useContext(AuthenticationContext);
    const [prestadores, setPrestadores] = useState([]);
    const [search, setSearch] = useState({
        id: '',
        cpf: '',
        nome: '',
    });

    const navigate = useNavigate();
    const novoPrestador = () => {
        navigate('create');
    }

    const fetchData = async () => {

        const data = await window.api.Action({ controller: "Prestador", action: "GetPrestadores", params: search });

        setPrestadores(data);
    }
    useEffect(() => {


        fetchData();

    }, [search]);

    const handleSearch = async (evt) => {
        let value = evt.target.value;

        switch (evt.target.name) {
            case 'cpf':
                value = formatCpf(value);
                break;
        }
        setSearch({
            ...search,
            [evt.target.name]: value
        });


    }

    function formatCpf(value) {
        value = value.replace(/\D/g, "");
        if (value.replace(/\D/g, "").length > 11) {
            value = value.slice(0, 11);
        }

        return value
            .replace(/\D/g, "") // Remove caracteres não numéricos
            .replace(/(\d{3})(\d)/, "$1.$2") // Adiciona o primeiro ponto
            .replace(/(\d{3})(\d)/, "$1.$2") // Adiciona o segundo ponto
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2"); // Adiciona o hífen
    }


    return (
        <>
            <Title title={"Cadastro de Prestadores"} />
            {
                user.MODO_APLICACAO === 0 ?

                    <div className='menu'>

                        <button className='menu-button button-dark-blue ' onClick={() => { novoPrestador() }}>
                            <i className='fa-solid fa-plus'></i> Novo
                        </button>
                    </div>

                    : null
            }

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
                        placeholder="Ex: João da Silva"
                        value={search.nome}
                        onChange={handleSearch}
                    />
                </div>

                <div className="input-form col-md-3">
                    <label htmlFor="cpf">CPF</label>
                    <input
                        id="cpf"
                        name="cpf"
                        className="form-control shadow-none input-custom"
                        type="text"
                        placeholder="Ex: 000.000.000-00"
                        value={search.cpf}
                        onChange={handleSearch}
                    />
                </div>



            </div>


            {
                prestadores.length === 0 ?
                    <div className="col-md-12 zero-count">Nenhum registro localizado.</div>

                    :

                    <div className='row table-container'>
                        <div className='col-md-12'>
                            <table className='table table-small table-bordered table-hover'>
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Nome</th>
                                        <th>CPF</th>
                                        <th>Último Processo</th>
                                        <th>Horas a Cumprir</th>
                                        <th>Horas Cumpridas</th>
                                        <th></th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {prestadores.map(r => (

                                        <tr key={r.id} style={{ verticalAlign: "middle" }}>
                                            <td>{r.id}</td>
                                            <td>{r.nome}</td>
                                            <td>{r.cpf}</td>
                                            <td>{r.nro_processo ?? "--"}</td>
                                            <td>{r.horas_cumprir > 0 ? r.horas_cumprir : "--"}</td>

                                            <td>HORAS CUMPRIDAS</td>
                                            <td>
                                                <div className="btn-group" role="group">

                                                    <span id="btnGroupDrop1" type="button" className="btn btn-custom dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                                        <i className='fa fa-cog'></i> opções
                                                    </span>
                                                    <ul className="dropdown-menu" aria-labelledby="btnGroupDrop1">
                                                        {
                                                            user.MODO_APLICACAO === 0 ?
                                                                <>
                                                                    <li> <NavLink className="dropdown-item" id="edit" to={`/prestadores/edit/${r.id}`}> <i className='fa fa-edit'></i> Editar</NavLink></li>
                                                                    <li> <NavLink className="dropdown-item" id="novoProcesso" to={`/processos/create/${r.id}`}> <i className='fa fa-plus'></i> Novo Processo</NavLink></li>
                                                                </>
                                                                :
                                                                <>
                                                                    <li> <NavLink className="dropdown-item" id="edit" to={`/prestadores/edit/${r.id}`}> <i className='fa fa-eye'></i> Visualizar</NavLink></li>
                                                                </>
                                                        }

                                                        {/* <li> <a className="dropdown-item" onClick={() => { GerarListagem(r.id, r.ultimo_processo, r.nome) }} to="#"><i className="fa-solid fa-file"></i> Gerar Relatório</a></li>
                                                <li> <a className="dropdown-item" onClick={() => { DeletePrestador(r.id, r.nome) }} to="#"><i className="fa-solid fa-trash"></i> Excluir</a></li> */}
                                                    </ul>
                                                </div>
                                            </td>

                                        </tr>

                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
            }



        </>
    );
}

export default Index;