import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom'
import Title from "../layout/Title";


export default function Edit(props) {
    const { id } = useParams();

    const [userName, setUserName] = useState('');
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();


    useEffect(() => {

        const fetchData = async () => {
            let data = await window.api.Action({ controller: "Usuarios", action: "GetUsuarios", params: { id: id } });
            data = data[0];

            setUserName(data.nome);
            setUser(data.usuario);
            setPassword(data.senha);
        
        }

        fetchData();

    }, []);

    const handleSubmit = async () => {

        const payload = {
            id: id,
            nome: userName,
            usuario: user,
            senha: password,
        }

        const postResult = await window.api.Action({ controller: "Usuarios", action: "Edit", params: payload });

        window.api.Alert({ status: postResult.status, text: postResult.text, title: postResult.status ? "Sucesso!" : "Erro!" });

        if (postResult.status)
            navigate("/usuarios");
    }

    return (
        <div>
            <Title title="Novo usuário" />
            <div className="row justify-content-center">
                <div className="col-md-12">


                    <div className="input-form">
                        <label htmlFor="userName">Nome do usuário</label>
                        <input
                            id="userName"
                            className="form-control input rounded-2"
                            type="text"
                            value={userName}
                            required={true}
                            onChange={(e) => { setUserName(e.target.value) }}
                        />
                    </div>

                    <div className="input-form">
                        <label htmlFor="user">Usuário</label>
                        <input
                            id="user"
                            className="form-control input rounded-2"
                            type="text"
                            value={user}
                            required={true}
                            onChange={(e) => { setUser(e.target.value) }}
                        />
                    </div>

                    <div className="input-form">
                        <label htmlFor="password">Senha</label>
                        <input
                            id="password"
                            className="form-control input rounded-2"
                            type="password"
                            value={password}
                            required={true}
                            onChange={(e) => { setPassword(e.target.value) }}
                        />
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-md-10 mt-5">
                    <div className="mt-5 d-flex justify-content-center">
                        <button type='submit' className="btn btn-custom m-2" onClick={handleSubmit}>Confirmar</button>
                        <button type='reset' className="btn btn-custom m-2" >Limpar</button>
                    </div>
                </div>
            </div>
        </div>
    )

}
