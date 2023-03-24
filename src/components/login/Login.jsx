import { useState, useContext } from 'react';
import { AuthenticationContext } from "../context/Authentication";
import imageLogo from '../../contents/images/logo.png'
import ModalConfig from '../config/ModalConfig';

const Login = () => {
    const { authenticated, login } = useContext(AuthenticationContext);
    const [auth, setAuth] = useState({
        username: "",
        password: ""
    })
    const [seePassword, setSeePassword] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const handleModal = (show) => {
        setShowModal(show);
    }
    const handleSeePassword = () => {
        setSeePassword(!seePassword);
    }

    const handleUser = (evt, name = null) => {

        const value = evt.value ?? evt.target?.value;

        setAuth({
            ...auth,
            [name ? name : evt.target.name]: value
        })

    }

    const handleLogin = () => {
        login(auth.username, auth.password);
    }

    return (

        <>

            <div id='login-logo'>
                <img src={imageLogo} alt="Logo" />
                <span id='logo-text'>CIAPP</span>
            </div>
            <form className="form-control" id="form-login">

                <div className="form-group">
                    <label htmlFor="username">usuário</label>
                    <input className="form-control shadow-none input-custom" type="text" name="username" id="username" onChange={handleUser} />
                </div>

                <div className="form-group">
                    <label htmlFor="password">senha</label>
                    <input className="form-control shadow-none input-custom" type={seePassword ? "text" : "password"} name="password" id="password" onChange={handleUser} />

                </div>
                <div className="form-group form-checkbox">
                    <input type="checkbox" name="showPassword" id="showPassword" checked={seePassword} onChange={handleSeePassword} />
                    <label htmlFor="showPassword">ver senha</label>
                </div>
                <br />
                <button className='btn btn-blue' type='button' onClick={() => { handleLogin() }}><i className="fa-solid fa-right-to-bracket"></i> entrar</button>

            </form>

            <button className='btn' id='btn-config-login' alt="Configurações" onClick={() => { handleModal(true) }}><i className="fa-solid fa-gear"></i> <small>configurações</small></button>
            <ModalConfig show={showModal} onHide={() => { handleModal(false) }} />



        </>





    )
}

export default Login;