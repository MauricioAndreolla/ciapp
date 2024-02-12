import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from 'react-router-dom'
import Select from 'react-select';
import Title from "../layout/Title";
import ModalCreateHabilidade from '../vara/ModalCreateVara';

import { toast } from "react-toastify";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Load from "../layout/Load";
import { AuthenticationContext } from "../context/Authentication";

const Create = () => {
    const navigate = useNavigate();
    const [load, setLoad] = useState(false);
    const { user } = useContext(AuthenticationContext);
    const { id, id_prestador } = useParams();

    const [prestador, setPrestador] = useState('');

    const [centrais, setCentrais] = useState([]);


    const [processo, setProcesso] = useState({
        id_central: { value: -1, label: "" },
        nro_processo: '',
        nro_artigo_penal: '',
        pena_originaria_regime: '0',
        inciso: '',
        detalhamento: '',
        prd: false,
        prd_descricao: '',
        horas_cumprir: 0,
        possui_multa: false,
        valor_a_pagar: 0,
        qtd_penas_anteriores: 0,
        id_vara: { value: -1, label: "" },
    });
    const [varas, setVaras] = useState([]);

    const [showModalCreateVara, setShowModalCreateVara] = useState(false);

    const handleModaCreateVara = (status = false) => {
        setShowModalCreateVara(status)
    }


    const handleCreate = () => {
        confirmAlert({
            title: 'Confirmação',
            message: `Confirma a criação de processo para o prestador ${prestador}`,
            buttons: [
                {
                    label: 'Sim',
                    onClick: async () => {
                        setLoad(true);
                        const postResult = await window.api.Action({
                            controller: "Processo", action: "Create", params: {
                                processo: processo,
                                id_prestador: id_prestador,
                            }
                        });
                        setLoad(false);
                        if (postResult.status) {
                            toast.success(postResult.text);
                            navigate("/processos");
                        }
                        else {
                            toast.error(postResult.text, { autoClose: false });
                        }

                    }
                },
                {
                    className: 'btn-blue',
                    label: 'Não',
                    onClick: () => {
                    }
                }
            ]
        });
    }
    const handleEdit = () => {
        confirmAlert({
            title: 'Confirmação',
            message: `Confirma a alteração de processo para o prestador ${prestador}`,
            buttons: [
                {
                    label: 'Sim',
                    onClick: async () => {
                        setLoad(true);
                        const postResult = await window.api.Action({
                            controller: "Processo", action: "Edit", params: {
                                processo: processo,
                                id: id,
                            }
                        });
                        setLoad(false);
                        if (postResult.status) {
                            toast.success(postResult.text);
                            navigate("/processos");
                        }
                        else {
                            toast.error(postResult.text, { autoClose: false });
                        }

                    }
                },
                {
                    className: 'btn-blue',
                    label: 'Não',
                    onClick: () => {
                    }
                }
            ]
        });
    }



    const handleProcesso = (evt, name = null) => {

        const value = evt.value ?? evt.target.value;

        setProcesso({
            ...processo,
            [name ? name : evt.target.name]: value
        })

    }

    const handleCentral = (evt) => {
        setProcesso({
            ...processo,
            ['id_central']: evt
        })
    }


    const handleVara = (evt) => {
        setProcesso({
            ...processo,
            ['id_vara']: evt
        })
    }

    const handleRadio = (evt, name = null) => {
        const value = evt.value ?? evt.target.value;
        let booleanValue = false;
        if (value && typeof value === "string") {
            if (value.toLowerCase() === "true") booleanValue = true;
            if (value.toLowerCase() === "false") booleanValue = false;
        }

        setProcesso({
            ...processo,
            [name ? name : evt.target.name]: booleanValue
        })
    }

    function handleInputChange(event) {
        const inputValue = event.target.value;
        const formattedValue = formatCurrency(inputValue);
        setProcesso({
            ...processo,
            ["valor_a_pagar"]: formattedValue
        })
    }

    function formatCurrency(value) {
        // remove tudo que não for dígito
        let inputValue = value.replace(/\D/g, '');
        // adiciona o ponto e o separador de milhar
        inputValue = (inputValue / 100).toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
        return inputValue;
    }


    const getVaras = async () => {
        handleModaCreateVara(false);
        let data = await window.api.Action({ controller: "Vara", action: "GetVaras" });
        setVaras(data.map(s => { return { value: s.id, label: s.descricao } }))
    }

    const getCentrais = async () => {
        let data = await window.api.Action({ controller: "Entidades", action: "GetCentraisSelect" });
        setCentrais(data);
        setProcesso({
            ...processo,
            ["id_central"]: data[0]
        })
    }

    const getPrestador = async () => {

        let data = await window.api.Action({ controller: "Prestador", action: "GetPrestadorSimple", params: id_prestador });

        setPrestador(data.nome);
    }

    const getProcesso = async () => {

        let data = await window.api.Action({ controller: "Processo", action: "GetProcesso", params: id });
        setProcesso(data);
        setPrestador(data.nome_prestador);
    }




    useEffect(() => {

        const fetchAllData = async () => {
            setLoad(true);

            await getVaras();
            await getCentrais();

            if (id)
                await getProcesso();
            else
                await getPrestador();

            setLoad(false);
        }

        fetchAllData();





    },[]);

    return (
        <>

            <div className="top-page">
                {
                    id ? <Title title={"Editar Processo"} /> : <Title title={"Novo Processo"} />
                }

                {
                    user.MODO_APLICACAO === 0 ?

                        <div className='menu'>

                            {
                                id ?
                                    <button className='menu-button button-dark-blue ' onClick={() => { handleEdit() }}>
                                        <i className='fa-solid fa-save'></i> Salvar
                                    </button>
                                    :
                                    <button className='menu-button button-dark-blue ' onClick={() => { handleCreate() }}>
                                        <i className='fa-solid fa-save'></i> Salvar
                                    </button>
                            }
                            <button className='menu-button button-grey' onClick={() => { navigate('/processos') }}>
                                <i className='fa-solid fa-times'></i> Cancelar
                            </button>
                        </div>

                        :

                        <div className='menu'>


                            <button className='menu-button button-blue' onClick={() => { navigate('/processos') }}>
                                <i className='fa-solid fa-arrow-left'></i> voltar
                            </button>
                        </div>

                }

            </div>

            <div className="content-page">
                <div className="col-md-12 form-group" style={{ padding: "1rem" }}>

                    <div className="row">






                        <div className="col-md-6">

                            <h5 className="nome-prestador">Prestador: <b>{prestador}</b></h5>

                            <div className="input-form">

                                <label htmlFor="id_central">Central responsável
                                    <small className="campo-obrigatorio"></small>
                                </label>
                                <Select
                                    options={centrais}
                                    id="id_central"
                                    name="id_central"
                                    isDisabled={user.MODO_APLICACAO === 1}
                                    value={processo.id_central}
                                    onChange={handleCentral}
                                />

                            </div>

                            <div className="input-form">

                                <label htmlFor="nro_processo">Número do processo
                                    <small className="campo-obrigatorio"></small>
                                </label>
                                <input
                                    id="nro_processo"
                                    name="nro_processo"
                                    className="form-control shadow-none input-custom"
                                    type="number"
                                    placeholder=""
                                    value={processo.nro_processo}
                                    required={true}
                                    disabled={user.MODO_APLICACAO === 1}
                                    onChange={handleProcesso}
                                />
                            </div>
                            <div className="input-form">

                                <label htmlFor="vara">Nome da Vara Judicial
                                    <small className="campo-obrigatorio"></small>
                                </label>

                                <Select
                                    options={varas}
                                    id="id_vara"
                                    name="id_vara"
                                    value={processo.id_vara}
                                    isDisabled={user.MODO_APLICACAO === 1}
                                    onChange={handleVara}
                                />

                                {
                                    user.MODO_APLICACAO === 0

                                        ?
                                        <button className="btn btn-sm btn-blue" onClick={() => { handleModaCreateVara(true) }}><i className="fas fa-plus"></i> Criar nova Vara Judicial</button>

                                        : null

                                }



                            </div>

                            <div className='row'>
                                <div className="input-form col-md-6">

                                    <label htmlFor="qtd_penas_anteriores">Qtd. penas anteriores</label>
                                    <input
                                        id="qtd_penas_anteriores"
                                        name="qtd_penas_anteriores"
                                        className="form-control shadow-none input-custom"
                                        type="number"
                                        placeholder=""
                                        value={processo.qtd_penas_anteriores}
                                        required={true}
                                        disabled={user.MODO_APLICACAO === 1}
                                        onChange={handleProcesso}
                                    />
                                </div>

                                <div className="input-form col-md-6">

                                    <label htmlFor="horas_cumprir">Horas a cumprir
                                        <small className="campo-obrigatorio"></small>
                                    </label>
                                    <input
                                        id="horas_cumprir"
                                        name="horas_cumprir"
                                        className="form-control shadow-none input-custom"
                                        type="number"
                                        placeholder=""
                                        value={processo.horas_cumprir}
                                        required={true}
                                        disabled={user.MODO_APLICACAO === 1}
                                        onChange={handleProcesso}
                                    />
                                </div>
                            </div>


                        </div>

                        <div className="col-md-6">
                            <br />
                            <div className="input-form">

                                <label htmlFor="nro_artigo_penal">Artigo penal</label>
                                <input
                                    id="nro_artigo_penal"
                                    name="nro_artigo_penal"
                                    className="form-control shadow-none input-custom"
                                    type="number"
                                    placeholder=""
                                    value={processo.nro_artigo_penal}
                                    required={true}
                                    disabled={user.MODO_APLICACAO === 1}
                                    onChange={handleProcesso}
                                />
                            </div>

                            <div className="input-form">
                                <label htmlFor="pena_originaria_regime">Tipo de Regime</label>
                                <select className="select-custom w-10 form-select form-select-md" id="pena_originaria_regime" name="pena_originaria_regime"
                                    value={processo.pena_originaria_regime}
                                    required={true}
                                    disabled={user.MODO_APLICACAO === 1}
                                    onChange={handleProcesso}>
                                    <option defaultValue={true} value={0}>Aberto</option>
                                    <option value={1}>Semi Aberto</option>
                                    <option value={2}>Fechado</option>
                                </select>
                            </div>


                        </div>


                        <div className="col-md-12">
                            <div className="input-form">
                                <label htmlFor="detalhamento">Detalhamento</label>
                                <div className="input-group">
                                    <textarea
                                        id="detalhamento"
                                        name="detalhamento"
                                        disabled={user.MODO_APLICACAO === 1}
                                        className="form-control shadow-none input-custom"
                                        type="text"
                                        value={processo.detalhamento}
                                        rows={4}
                                        onChange={handleProcesso}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-12">
                            <div className="input-form">
                                <label htmlFor="inciso">Inciso</label>
                                <div className="input-group">
                                    <textarea
                                        id="inciso"
                                        name="inciso"
                                        className="form-control shadow-none input-custom"
                                        type="text"
                                        value={processo.inciso}
                                        rows={4}
                                        disabled={user.MODO_APLICACAO === 1}
                                        onChange={handleProcesso}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-12">

                            <div className="input-form inline">
                                <form>
                                    <div>
                                        <label htmlFor="prd">Possuí PRD?</label>

                                        <label className="label-radio">
                                            Não
                                            <input
                                                className="radio"
                                                type="radio"
                                                name="prd"
                                                value="false"
                                                disabled={user.MODO_APLICACAO === 1}
                                                checked={!processo.prd}
                                                onChange={handleRadio}
                                            />
                                        </label>

                                        <label className="label-radio">
                                            Sim
                                            <input
                                                className="radio"
                                                type="radio"
                                                name="prd"
                                                value="true"
                                                disabled={user.MODO_APLICACAO === 1}
                                                checked={processo.prd}
                                                onChange={handleRadio}
                                            />
                                        </label>
                                    </div>
                                </form>
                            </div>
                            <div className="row">
                                {
                                    processo.prd ?

                                        <div className="col-md-9 input-form">
                                            <label htmlFor="prd_descricao">Descrição PRD</label>
                                            <div className="input-group">
                                                <textarea
                                                    id="prd_descricao"
                                                    name="prd_descricao"
                                                    className="form-control shadow-none input-custom"
                                                    type="text"
                                                    value={processo.prd_descricao}
                                                    disabled={user.MODO_APLICACAO === 1}
                                                    rows={4}
                                                    onChange={handleProcesso}
                                                />
                                            </div>
                                        </div>
                                        : null
                                }

                                {
                                    processo.prd ?
                                        <div className="col-md-3 input-form inline">
                                            <form>
                                                <div>
                                                    <label htmlFor="possui_multa">Possuí multa?</label>

                                                    <label className="label-radio">
                                                        Não
                                                        <input
                                                            className="radio"
                                                            type="radio"
                                                            name="possui_multa"
                                                            value="false"
                                                            disabled={user.MODO_APLICACAO === 1}
                                                            checked={!processo.possui_multa}
                                                            onChange={handleRadio}
                                                        />
                                                    </label>

                                                    <label className="label-radio">
                                                        Sim
                                                        <input
                                                            className="radio"
                                                            type="radio"
                                                            name="possui_multa"
                                                            value="true"
                                                            disabled={user.MODO_APLICACAO === 1}
                                                            checked={processo.possui_multa}
                                                            onChange={handleRadio}
                                                        />
                                                    </label>
                                                </div>
                                                {
                                                    processo.possui_multa ?
                                                        <div className="input-form">

                                                            <label htmlFor="valor_a_pagar">Valor a pagar</label>
                                                            <input
                                                                id="valor_a_pagar"
                                                                name="valor_a_pagar"
                                                                className="form-control shadow-none input-custom"
                                                                type="text"
                                                                placeholder=""
                                                                value={processo.valor_a_pagar}
                                                                required={true}
                                                                disabled={user.MODO_APLICACAO === 1}
                                                                onInput={handleInputChange}
                                                                onChange={handleInputChange}
                                                            />
                                                        </div>
                                                        : null
                                                }


                                            </form>
                                        </div>




                                        : null
                                }
                            </div>




                        </div>
                    </div>


                </div>

            </div>



            <ModalCreateHabilidade show={showModalCreateVara} onHide={getVaras} />
            <Load show={load} />
        </>
    );
}

export default Create;