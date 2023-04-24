
import { useState, useEffect, useContext } from "react";
import { confirmAlert } from 'react-confirm-alert';
import { toast } from "react-toastify";
import { AuthenticationContext } from "../context/Authentication";
import Load from "../layout/Load";



const Importar = () => {

    const [file, setFile] = useState(null);
    const [inpuFile, setinputFile] = useState(null);
    const [load, setLoad] = useState(false);

    const handleFile = async (e) => {
        let sfile = e.target.files[0];

        setFile(sfile);

       
    }

    const submitFile = () =>{
        
        if (file) {

            var fr = new FileReader();
            fr.onload = async () => {
                setLoad(true);
                var result = await window.api.Action({ controller: "Sincronizacao", action: "SetFile", params: { data: fr.result } });
                setLoad(false);
                if (!result.status) {
                    toast.error(result.text, { autoClose: false });
                }
                else{
                    toast.success(result.text);
                    setinputFile(null);
                }
             
            }

            fr.readAsArrayBuffer(file);

        }

    }

    return (

        <>
            <div className="input-form col-md-12">
                <label htmlFor="fileInput">Selecione o arquivo e clique em "Importar Arquivo"</label>
                <input type="file" className="form-control" id="fileInput" aria-describedby="inputGroupFileAddon04" aria-label="Upload" onChange={handleFile} value={inpuFile} />
            </div>

            <div className="input-form" style={{ marginTop: "1rem" }}>

                <button className="btn btn-blue" onClick={submitFile}><i className="fa-solid fa-upload"></i> Importar Arquivo</button>

            </div>
            <Load show={load} />
        </>
    )


}



export default Importar;