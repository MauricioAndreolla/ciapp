import { useNavigate, NavLink } from 'react-router-dom'
import { useState, useEffect, useContext } from "react";
import Title from "../layout/Title";

const Index = () => {

    const navigate = useNavigate();
    const novoPrestador = () => {
        navigate('create');
    }
    return (
        <>
            <Title title={"Cadastro de Prestadores"} />

            <div className='menu'>

                <button className='menu-button button-green' onClick={() => { novoPrestador() }}>
                    <i className='fa-solid fa-plus'></i> Novo
                </button>
            </div>
        </>
    );
}

export default Index;