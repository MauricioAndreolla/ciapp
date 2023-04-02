import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom'
import Title from "../layout/Title";

// import Endereco from "../../shared/Endereco";
// import Label from "../../shared/Label";


const Descredenciar = (props) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [entidade, setEntidade] = useState('');
    const [motivo, setMotivo] = useState('');

    const fetchData = async () => {

        const data = await window.api.Action({ controller: "Entidades", action: "GetEntidade", params: id });
        setEntidade(data);
    }

    useEffect(() => {


        fetchData();

    }, []);

    const handleMotivo = (evt) => {
        const value = evt.value ?? evt.target.value;

        setMotivo(value);
    }

    const submitForm = async (e) => {
        e.preventDefault();

        const postResult = await window.api.Action({ controller: "Entidades", action: "Descredenciar", params: { id: id, motivo: motivo }});

        window.api.Alert({ status: postResult.status, text: postResult.text, title: postResult.status ? "Sucesso!" : "Erro!" });

        if (postResult.status) {
            navigate("/entidades")

        }

    }

    return (
        <div className="row" onSubmit={submitForm}>
            <Title title={"Descredenciamento"} />
            <div className="col-md-12">
                <br />
                <h4>Deseja descredenciar a entidade <b>{entidade}</b>?</h4>

                <form>

                    <div className="input-form">

                        <label htmlFor="motivo">Motivo</label>
                        <textarea
                            id="motivo"
                            name="motivo"
                            className="form-control input rounded-2"
                            placeholder=""
                            value={motivo}
                            required={true}
                            onChange={handleMotivo}
                            rows={5}
                        />
                    </div>

                    <div className="col-md-12 btn-inline" style={{ 'marginTop': '2rem' }}>
                        <button type="submit" className="btn btn-dark-blue" ><i className="fa fa-save"></i> Confirmar</button>
                        <button type="button" onClick={() => { navigate("/entidades"); }} className="btn btn-danger"><i className="fa fa-trash"></i> Cancelar</button>
                    </div>
                </form>
            </div>
        </div >

    )


};

export default Descredenciar
