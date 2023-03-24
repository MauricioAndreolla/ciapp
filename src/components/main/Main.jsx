
import { useState, useEffect } from "react";
import Sidebar from '../layout/Sidebar';
import '../../contents/app.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';

const Main = () => {

    const [modoAplicacao, setModoAplicacao] = useState(null);



    // useEffect(() => {
    //     async function fetchData() {
    //         let modo = await window.api.Action({ controller: "Login", action: "teste" });
    //         setModoAplicacao(modo);
    //     }
    //     fetchData();
    // }, []);

    return (
        <div className="app">
            {/* <Sidebar /> */}
            <div className="content">
                <h1>Modo de aplicação: {modoAplicacao}</h1>
                <button className="btn btn-danger">aaa</button>
            </div>
        </div>

    )
}

export default Main;