
import { useState, useEffect, useContext } from "react";
import { confirmAlert } from 'react-confirm-alert';
import { toast } from "react-toastify";
import { AuthenticationContext } from "../context/Authentication";
import Select from 'react-select';
import Load from "../layout/Load";
const Exportar = () => {
    const [load, setLoad] = useState(false);
    const { user } = useContext(AuthenticationContext);

    const [entidades, setEntidades] = useState([]);
    const [entidade, setEntidade] = useState({});


    const fetchData = async () => {
        setLoad(true);
        const data = await window.api.Action({ controller: "Entidades", action: "GetEntidadesSelect" });
        setLoad(false);
        setEntidades(data);
    }

    useEffect(() => {

        fetchData();

    }, []);


    const confirmDownload = async () => {

        confirmAlert({
            size: 'big',
            title: 'Confirmação',
            message: <div dangerouslySetInnerHTML={{
                __html: `
                <h4><b>Atenção!</b></h4>
                <p>Para proteger a integridade dos dados, algumas ações serão desabilitadas após gerar o arquivo:</p>
                <ul>
                    <li><small><b>Exclusão</b> da entidade ${entidade.label}</small></li>
                    <li><small><b>Alteração</b> dos agendamentos da entidade ${entidade.label} (apenas inativação)</small></li>
                    <li><small><b>Exclusão</b> dos agendamentos da entidade ${entidade.label}</small></li>
                    <li><small><b>Alteração</b> das tarefas da entidade ${entidade.label} (apenas inativação)</small></li>
                    <li><small><b>Exclusão</b> das tarefas da entidade ${entidade.label}</small></li>
                    <li><small><b>Exclusão</b> de Processos e Prestadores cujo tarefas estejam vinculados a entidade ${entidade.label}</small></li>
                </ul>
            
            `}} />,
            buttons: [
                {
                    label: 'Continuar',
                    onClick: async () => {
                        return await downloadTxtFile();

                    }
                },
                {
                    className: 'btn-blue',
                    label: 'Cancelar',
                    onClick: () => {
                    }
                }
            ]
        });

    }

    const downloadTxtFile = async () => {

        // if (!entidade) {
        //     toast.error('Informe uma Entidade');
        //     return;
        // }
        setLoad(true);
        const result = await window.api.Action({ controller: "Sincronizacao", action: "GetFile", params: { entidade: entidade } });
        setLoad(false);

        if (!result.status) {
            toast.error(result.text, { autoClose: false });
            return;
        } else {
            toast.success(result.text);
        }

        const element = document.createElement("a");
        const file = new Blob([result.data], { type: 'application/octet-stream' });
        element.href = URL.createObjectURL(file);
        element.download = result.fileName;
        document.body.appendChild(element);
        element.click();
    }


    const handleEntidades = async (evt) => {
        const value = evt;
        setEntidade(value);
    }


    return (
        <>
            <input id="inputFile" style={{ display: 'none' }} type="file" />

            {
                user.MODO_APLICACAO === 0 ?

                    <>
                        <div className="input-form col-md-12">
                            <label htmlFor="id_entidade">Selecione uma Entidade e clique em "Baixar Arquivo"</label>
                            <Select
                                options={entidades}
                                id="id_entidade"
                                name="id_entidade"
                                placeholder="Entidade"
                                onChange={handleEntidades}
                            />
                        </div>

                        <div className="input-form" style={{ marginTop: "1rem" }}>

                            <button className="btn btn-blue" onClick={confirmDownload}><i className="fa-solid fa-download"></i> Baixar Arquivo</button>

                        </div>

                    </>

                    :

                    <>
                        <div className="input-form" style={{ marginTop: "1rem" }}>

                            <button className="btn btn-blue" onClick={downloadTxtFile}><i className="fa-solid fa-download"></i> Baixar Arquivo</button>

                        </div>

                    </>


            }


            <Load show={load} />
        </>
    )



}



export default Exportar;