import { useContext } from "react";
import { AuthenticationContext } from '../context/Authentication';
import imageLogo from '../../contents/images/logo.png'
const Topbar = () => {
    const { user, logout } = useContext(AuthenticationContext);
    return (
        <>
            <div className="top-menu">
                <div className="pull-left">
                    <div className="brand">
                    <img src={imageLogo} alt="Logo" />
                    <span>Central Integrada de Alternativas Penais</span>
                    </div>
                  
                </div>


                <div className="pull-right" id="user-info">
                 
                    <span> <i className="icon fa-regular fa-user"></i> {user.user}</span>
                    <button type="button" className="btn btn-logout" onClick={() => { logout() }}> <i className="icon fa-solid fa-arrow-right-from-bracket"></i> sair</button>
                </div>
            </div>
        </>
    );
}

export default Topbar;