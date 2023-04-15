import { useNavigate, NavLink } from 'react-router-dom'
import { useState, useEffect, useContext } from "react";
import Title from "../layout/Title";
import { AuthenticationContext } from "../context/Authentication";

const Index = () => {
    const { user } = useContext(AuthenticationContext);
    const [processos, setProcessos] = useState([]);
    const [search, setSearch] = useState({
        id: '',
        nro_processo: '',
        nome: '',
    });

    const navigate = useNavigate();
    const novoProcesso = () => {
        navigate('create');
    }

    const fetchData = async () => {

        const data = await window.api.Action({ controller: "Processo", action: "GetProcessos", params: null });

        setProcessos(data);
    }



    const handleSearch = async (evt) => {
        let value = evt.target.value;
        setSearch({
            ...search,
            [evt.target.name]: value
        });


    }


    useEffect(() => {


        fetchData();

    }, []);

    return (
        <>
            <Title title={"Cadastro de Processos"} />

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
                    <label htmlFor="nro_processo">Número Processo</label>
                    <input
                        id="nro_processo"
                        name="nro_processo"
                        className="form-control shadow-none input-custom"
                        type="text"
                        placeholder="Ex: 50001"
                        value={search.nro_processo}
                        onChange={handleSearch}
                    />
                </div>

                {/* <div className="input-form col-md-3">
                    <label htmlFor="nome">Nome Prestador</label>
                    <input
                        id="nome"
                        name="nome"
                        className="form-control shadow-none input-custom"
                        type="text"
                        placeholder="Ex: João da Silva"
                        value={search.nome}
                        onChange={handleSearch}
                    />
                </div> */}



            </div>

            {
                processos.length === 0 ?

                    <div className="col-md-12 zero-count">Nenhum registro localizado.</div>

                    :

                    <div className='row table-container'>
                        <div className='col-md-12'>
                            <table className='table table-small table-bordered table-hover'>
                                <thead>
                                    <tr>
                                        <th>Código</th>
                                        <th>Número Processo</th>
                                        <th>Prestador</th>
                                        <th>Horas a Cumprir</th>
                                        <th>Horas Cumpridas</th>
                                        <th>Vara</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {processos.map(r => (

                                        <tr key={r.id} style={{ verticalAlign: "middle" }}>
                                            <td>{r.id}</td>
                                            <td>{r.nro_processo}</td>
                                            <td>{r.prestador}</td>
                                            <td>{r.horas_cumprir}</td>
                                            <td>{r.horas_cumpridas}</td>
                                            <td>{r.vara}</td>

                                            <td>
                                                <div className="btn-group" role="group">

                                                    <span id="btnGroupDrop1" type="button" className="btn btn-custom dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                                        <i className='fa fa-cog'></i> opções
                                                    </span>
                                                    <ul className="dropdown-menu" aria-labelledby="btnGroupDrop1">
                                                        {
                                                            user.MODO_APLICACAO === 0 ?

                                                            <>
                                                                 <li> <NavLink className="dropdown-item" id="edit" to={`/processos/edit/${r.id}`}> <i className='fa fa-edit'></i> Editar</NavLink></li>
                                                            </>

                                                            :

                                                            <li> <NavLink className="dropdown-item" id="edit" to={`/processos/edit/${r.id}`}> <i className='fa fa-eye'></i> Visualizar</NavLink></li>
                                                        }
                                                   
                                                        {/* <li> <a className="dropdown-item" onClick={() => { showRegistros(r.id) }} to="#"><i className="fa-solid fa-list-check"></i> Ver registros</a></li>
                                                        <li> <a className="dropdown-item" onClick={() => { DeleteProcesso(r.id, r.nro_processo) }} to="#"><i className="fa-solid fa-trash"></i> Excluir </a></li> */}
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