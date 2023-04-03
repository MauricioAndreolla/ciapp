import { useNavigate, NavLink } from 'react-router-dom'
import { useState, useEffect } from "react";

import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Title from "../layout/Title";


const Index = () => {
    const navigate = useNavigate();

    const [entidades, setEntidades] = useState([]);

    const fetchData = async () => {
        const data = await window.api.Action({ controller: "Entidades", action: "GetEntidades", params: null });
        setEntidades(data);
    }

    useEffect(() => {
        fetchData();
    }, []);

    const novaEntidade = () => {
        navigate('create');
    }


    const Credenciar = (id, nome) => {

        const handleClick = async (id) => {

            const result = await window.api.Action({ controller: "Entidades", action: "Credenciar", params: id });
            window.api.Alert({ status: result.status, text: result.text, title: result.status ? "Sucesso!" : "Erro!" });
            if (result.status) {
                fetchData();
            }
        }

        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className='custom-ui'>
                        <h3>Credenciar novamente</h3>
                        <p>Deseja credenciar novamente a entidade <b>{nome}</b>?</p>

                        <button className='btn btn-confirm modal-btn'
                            onClick={() => {
                                handleClick(id);
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

    const DeleteEntidade = (id, nome) => {

        const handleClickDelete = async (id) => {

            const result = await window.api.Action({ controller: "Entidades", action: "Delete", params: id });
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
                        <p>Deseja excluir a entidade <b>{nome}</b>?</p>

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
            <div>
                <Title title={"Cadastro de Entidades"} />

                <div className='menu'>

                    <button className='menu-button button-green' onClick={() => { novaEntidade() }}>
                        <i className='fa-solid fa-plus'></i> Novo
                    </button>
                </div>
            </div>


            <div>
                Tabela se houver para seleção e edicao
            </div>


        </>


    );


}

export default Index