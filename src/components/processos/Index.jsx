import { useNavigate, NavLink } from 'react-router-dom'
import { useState, useEffect, useContext } from "react";
import Title from "../layout/Title";

const Index = () => {

    const [processos, setProcessos] = useState([]);

    const navigate = useNavigate();
    const novoProcesso = () => {
        navigate('create');
    }

    const fetchData = async () => {

        const data = await window.api.Action({ controller: "Processo", action: "GetProcessos", params: null });

        setProcessos(data);
    }
    useEffect(() => {


        fetchData();

    }, []);

    return (
        <>
            <Title title={"Cadastro de Processos"} />

            {/* <div className='menu'>

                <button className='menu-button button-green' onClick={() => { novoProcesso() }}>
                    <i className='fa-solid fa-plus'></i> Novo
                </button>
            </div> */}
            <div className='row table-container'>
                <div className='col-md-12'>
                <table className='table table-bordered table-hover'>
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

                                <tr key={r.id}>
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
                                                <li> <NavLink className="dropdown-item" id="edit" to={`/processos/edit/${r.id}`}> <i className='fa fa-edit'></i> Editar</NavLink></li>
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

        </>
    );
}

export default Index;