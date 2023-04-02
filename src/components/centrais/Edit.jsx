import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom'
import Title from "../layout/Title";
// import Endereco from "../../shared/Endereco";
// import Label from "../../shared/Label";


export default function Edit(props) {


    const { id } = useParams();

    const [centralName, setCentralName] = useState('');
    const [cnpj, setCNPJ] = useState();
    const [firstPhone, setFirstPhone] = useState('88');
    const [secondPhone, setSecondPhone] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const [endereco, setEndereco] = useState({
        id: 0,
        rua: '',
        cep: '',
        numero: '',
        bairro: '',
        complemento: '',
        id_cidade: ''
    });


    useEffect(() => {

        const fetchData = async () => {
            let data = await window.api.Action({ controller: "Centrais", action: "GetCentrais", params: { id: id } });
            data = data[0];
            setCentralName(data.nome);
            setCNPJ(data.cnpj);
            setFirstPhone(data.telefone1);
            setSecondPhone(data.telefone2);
            setEmail(data.email);
            setEndereco({
                id: data.endereco.id,
                rua: data.endereco.rua,
                cep: data.endereco.cep,
                numero: data.endereco.numero,
                bairro: data.endereco.bairro,
                complemento: data.endereco.complemento,
                id_cidade: data.endereco.CidadeId
            });
        }

        fetchData();

    }, []);

    const handleEndereco = (evt, name = null) => {
        const value = evt.value ?? evt.target.value;

        setEndereco({
            ...endereco,
            [name ? name : evt.target.name]: value
        })

    }


    const handleSubmit = async () => {

        const payload = {
            id: id,
            nome: centralName,
            cnpj: cnpj,
            telefone1: firstPhone,
            telefone2: secondPhone,
            email: email,
            endereco: endereco
        }

        const postResult = await window.api.Action({ controller: "Centrais", action: "Edit", params: payload });

        window.api.Alert({ status: postResult.status, text: postResult.text, title: postResult.status ? "Sucesso!" : "Erro!" });

        if (postResult.status)
            navigate("/centrais");
    }

    return (
        <div>
            <Title title={"Editar Central"} />

            <div className="row">

                <div className="col-md-4">

                    <div className="col-md-12">
                        {/* <Label nameLabel={"Identificação da central"} /> */}

                        <div className="input-form">

                            <label htmlFor="centralName">Nome</label>
                            <input
                                id="centralName"
                                className="form-control input rounded-2"
                                type="text"
                                placeholder="Nome da central"
                                value={centralName}
                                required={true}
                                onChange={(e) => setCentralName(e.target.value)}
                            />
                        </div>

                        <div className="input-form">
                            <label htmlFor="cnpj">CNPJ</label>
                            <input
                                id="cnpj"
                                className="form-control input rounded-2"
                                type="text"
                                placeholder="000.000.000-00"
                                required={true}
                                value={cnpj}
                                onChange={(e) => setCNPJ(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="col-md-12">

                        {/* <Label nameLabel={"Contatos da central"} /> */}

                        <div className="input-form">
                            <label htmlFor="phone-1">Telefone 1</label>
                            <input
                                id="phone-1"
                                className="form-control input rounded-2"
                                type={"tel"}
                                placeholder="(00) 0000-0000"
                                required={true}
                                value={firstPhone}
                                onChange={(e) => setFirstPhone(e.target.value)}
                            />
                        </div>

                        <div className="input-form">
                            <label htmlFor="phone-2">Telefone 2 (opcional)</label>
                            <input
                                id="phone-2"
                                className="form-control input rounded-2"
                                type="tel"
                                placeholder="(00) 0000-0000"
                                required={false}
                                value={secondPhone}
                                onChange={(e) => setSecondPhone(e.target.value)}
                            />
                        </div>

                        <div className="input-form">
                            <label htmlFor="phone-2">Email</label>
                            <input
                                id="email"
                                className="form-control input rounded-2"
                                type="email"
                                placeholder="****@***.com"
                                required={true}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                </div>

                <div className="col-md-8">
                    {/* <Endereco endereco={endereco} handleChange={handleEndereco} /> */}


                </div>

                <div className="row">
                    <div className="col-md-12 btn-inline" style={{ 'marginTop': '2rem' }}>
                        <button className="btn btn-dark-blue" onClick={handleSubmit}>Confirmar</button>
                        <button type="button" onClick={() => { navigate("/centrais"); }} className="btn btn-danger"><i className="fa fa-trash"></i> Cancelar</button>
                    </div>

                </div>

            </div>
        </div>
    )

}
