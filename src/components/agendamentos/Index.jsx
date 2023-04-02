import { useNavigate, NavLink } from 'react-router-dom'
import { useState, useEffect } from "react";

import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Title from "../layout/Title";



export default function Index(props) {

    const navigate = useNavigate();
    const [agendamentos, setAgendamentos] = useState([]);
    const [search, setSearch] = useState({
        processo: ''
    });

    const fetchData = async () => {
        const data = await window.api.Action({ controller: "Agendamentos", action: "GetAgendamentos", params: search });
        setAgendamentos(data);

    }

    useEffect(() => {
        fetchData();
    }, [search]);

    const CreateAgendamento = () => {
        navigate('create');
    }

    const handleSearch = async (evt) => {
        const value = evt.target.value;
        console.log(value)
        setSearch({
            ...search,
            [evt.target.name]: value
        });
    }

    const DeleteAgendamento = (id) => {

        const handleClickDelete = async (id) => {

            const result = await window.api.Action({ controller: "Agendamentos", action: "Delete", params: id });
            window.api.Alert({ status: result.status, text: result.text, title: result.status ? "Sucesso!" : "Erro!" });
            if (result.status) {
                fetchData();
            }
        }
        
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className='custom-ui'>
                        <h3>Excluir registro</h3>
                        <p>Deseja excluir o agendamento?</p>

                        <button className='btn btn-confirm modal-btn'
                            onClick={() => {
                                handleClickDelete(id);
                                onClose();
                            }}
                        >
                            Confirmar
                        </button>

                        <button className='btn btn-cancel modal-btn' onClick={onClose}>Cancelar</button>
                    </div>
                );
            }
        });
    }

    return (

        <>
            <Title title={"Agendamentos"} />

            <div className="row search-container">
             
                <div className="input-form col-md-3">
                    <input
                        id="processo"
                        name="processo"
                        className="form-control input rounded-2"
                        type="text"
                        placeholder="Processo"
                        required={true}
                        value={search.processo}
                        onChange={handleSearch}
                    />
                </div>
            </div>

            <button type="button" className='btn btn-custom' onClick={() => { CreateAgendamento() }}><i className='fa fa-plus'></i> Novo</button>

            <div className='row table-container'>
                <div className='col-md-12'>
                    <table className='table table-small'>
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Processo</th>
                                <th>Hora inicial</th>
                                <th>Hora final</th>
                                <th>Opções</th>
                            </tr>
                        </thead>
                        <tbody>
                            { agendamentos.length ? agendamentos.map(r => (

                                <tr key={r.id}>
                                    <td>{r.id}</td>
                                    <td>{r.processo.nro_processo }</td>
                                    <td>{r.agendamento_horario_inicio}</td>
                                    <td>{r.agendamento_horario_fim}</td>
                                    <td>
                                        <div className="btn-group" role="group">

                                            <span id="btnGroupDrop1" type="button" className="btn btn-custom dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                                <i className='fa fa-cog'></i> opções
                                            </span>
                                            <ul className="dropdown-menu" aria-labelledby="btnGroupDrop1">
                                                <li> <NavLink className="dropdown-item" id="edit" to={`/agendamentos/edit/${r.id}`}> <i className='fa fa-edit'></i> Editar</NavLink></li>
                                                <li> <a className="dropdown-item" onClick={() => { DeleteAgendamento(r.id) }} to="#"><i className="fa-solid fa-trash"></i> Excluir</a></li>
                                               
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                            )): "Nenhum Agendamento encontrado"}
                        </tbody>
                    </table>
                </div>
            </div>

        </>


    );
}