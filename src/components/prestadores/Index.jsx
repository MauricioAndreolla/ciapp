import { useNavigate, NavLink } from 'react-router-dom'
import { useState, useEffect, useContext } from "react";
import Title from "../layout/Title";

const Index = () => {

    const [prestadores, setPrestadores] = useState([]);

    const navigate = useNavigate();
    const novoPrestador = () => {
        navigate('create');
    }

    const fetchData = async () => {

        const data = await window.api.Action({ controller: "Prestador", action: "GetPrestadores", params: null });
     
        setPrestadores(data);
    }
    useEffect(() => {


        fetchData();

    }, []);

    return (
        <>
            <Title title={"Cadastro de Prestadores"} />

            <div className='menu'>

                <button className='menu-button button-green' onClick={() => { novoPrestador() }}>
                    <i className='fa-solid fa-plus'></i> Novo
                </button>
            </div>


            <div className='row table-container'>
                <div className='col-md-12'>
                    <table className='table table-bordered table-hover'>
                        <thead>
                            <tr>
                                <th></th>
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

                                <tr key={r.id} style={{verticalAlign:"middle"}}>
                                    <td>{r.id}</td>
                                    <td style={{display:"flex"}}> <img style={{width: "56px", margin: "auto"}} src={r.image} alt="" srcSet="" /> </td>
                                    <td>{r.nome}</td>
                                    <td>{r.cpf}</td>
                                    <td>ULTIMO PROCESSO</td>
                                    <td>HORAS CUMPRIR</td>

                                    <td>HORAS CUMPRIDAS</td>
                                    <td>
                                        <div className="btn-group" role="group">

                                            <span id="btnGroupDrop1" type="button" className="btn btn-custom dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                                <i className='fa fa-cog'></i> opções
                                            </span>
                                            <ul className="dropdown-menu" aria-labelledby="btnGroupDrop1">
                                                
                                                <li> <NavLink className="dropdown-item" id="edit" to={`/prestadores/edit/${r.id}`}> <i className='fa fa-edit'></i> Editar</NavLink></li>
                                                <li> <NavLink className="dropdown-item" id="novoProcesso" to={`/processos/create/${r.id}`}> <i className='fa fa-plus'></i> Novo Processo</NavLink></li>
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
        </>
    );
}

export default Index;