import { useState } from "react";
import { useNavigate } from 'react-router-dom'
import Title from "../layout/Title";
import { Nav, NavItem, Tab, TabContainer, TabContent, TabPane } from 'react-bootstrap';
import { NavLink } from "react-router-dom";
import Table from '../layout/Table';
import ModalFamiliar from './ModalFamiliar';
import { toast } from "react-toastify";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const Create = () => {
    const navigate = useNavigate();
    const [tempID, setempID] = useState(0);
    const [image, setImage] = useState('');
    const [prestador, setPrestador] = useState({
        nome: '',
        cpf: '',
        nome_mae: '',
        dt_nascimento: '',
        estado_civil: 0,
        etnia: 0,
        escolaridade: 0,
        renda_familiar: 0,
        telefone1: '',
        telefone2: '',
        religiao: '',
        possui_beneficios: false,
        beneficios: [],
        familiares: [],
        habilidades: [],
        cursos: []
    });

    const getTempID = async () => {
        setempID(tempID - 1);
        return tempID - 1;
    }



    const handleImage = async (e) => {
        let file = e.target.files[0];
        if (file) {
            const base64 = await convertBase64(file);
            setImage(base64);
        }
    }

    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file)
            fileReader.onload = () => {
                resolve(fileReader.result);
            }
            fileReader.onerror = (error) => {
                reject(error);
            }
        })
    }
    const removeImage = () => {
        setImage('');
    }

    const handlePrestador = (evt, prop_name = null) => {
        const value = evt.value ?? evt.target.value;

        setPrestador({
            ...prestador,
            [prop_name ? prop_name : evt.target.name]: value
        })
    }



    const [showModalFamiliar, setShowModalFamiliar] = useState(false);
    const [modelFamiliar, setModelFamiliar] = useState({
        id: null,
        familiar_nome: '',
        familiar_parentesco: '',
        familiar_idade: '',
        familiar_profissao: '',
        novo_registro: true
    });

    const handleModalFamiliar = (show = true, model = null) => {
        setModelFamiliar(model);
        setShowModalFamiliar(show);
    }

    const ModalEditFamiliar = (object) => {
        handleModalFamiliar(true, object);
    }
    const addnewFamiliar = async (object) => {
        if (object) {
            var familiares = prestador.familiares;

            var exist = familiares.find(s => s.familiar_nome == object.familiar_nome);
            if (exist) {
                toast.error(`Familiar "${object.familiar_nome}" já informado`, { autoClose: false });
                handleModalFamiliar(false);
                return;
            }
            if (object.novo_registro) {
                object.id = await getTempID();
            }

            familiares.push(object)
            setPrestador({
                ...prestador,
                ["familiares"]: familiares
            })
        }
        handleModalFamiliar(false, null);

    }
    const editFamiliar = async (object) => {
        if (object) {
            var familiares = prestador.familiares;

            var exist = familiares.find(s => s.familiar_nome == object.familiar_nome && s.id != object.id);
            if (exist) {
                toast.error(`Familiar "${object.familiar_nome}" já informado`, { autoClose: false });
                handleModalFamiliar(false);
                return;
            }

            const index = familiares.findIndex(s => s.id === object.id);
            familiares.splice(index, 1, object);

            setPrestador({
                ...prestador,
                ["familiares"]: familiares
            })
        }
        handleModalFamiliar(false, null);

    }

    const deleteFamiliar = async (object) => {
        if (object) {


            confirmAlert({
                title: 'Confirmação',
                message: 'Tem certeza que deseja excluir este item?',
                buttons: [
                    {
                        label: 'Sim',
                        onClick: () => {
                            var familiares = prestador.familiares.filter(s => s.id !== object.id);
                            setPrestador({
                                ...prestador,
                                ["familiares"]: familiares
                            })
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

    }



    const columnsFamiliar = [
        { Header: 'Nome', accessor: 'familiar_nome' },
        { Header: 'Parentesco', accessor: 'familiar_parentesco' },
        { Header: 'Idade', accessor: 'familiar_idade' },
        { Header: 'Profissão', accessor: 'familiar_profissao' },
    ];

    return (
        <>
            <Title title={"Novo Prestador"} />

            <div className='menu'>

                <button className='menu-button button-green' onClick={() => { }}>
                    <i className='fa-solid fa-save'></i> Salvar
                </button>
                <button className='menu-button button-red' onClick={() => { navigate('/prestadores') }}>
                    <i className='fa-solid fa-times'></i> Cancelar
                </button>
            </div>

            <Title title={"Dados do Prestador"} />
            <div className="row">

                <div className="col-md-2 col-sm-12">
                    <div className="input-group mb-2 mt-2">
                        <label className="file-input-custom" htmlFor="inputGroupFile04" id="upload-file-layout">

                            {
                                image ?
                                    <img src={image} alt="" srcSet="" />
                                    :
                                    <span id="empty-image">
                                        <i className="fa fa-image"></i> <br />
                                        Foto
                                    </span>
                            }
                        </label>
                        <input type="file" className="file-select-custom" id="inputGroupFile04" aria-describedby="inputGroupFileAddon04" aria-label="Upload" onChange={handleImage} />
                    </div>
                    {
                        image ?
                            <div style={{ display: "flex" }}>
                                <button className="btn btn-danger btn-remove-img" onClick={removeImage}><i className="fa-solid fa-trash"></i> remover imagem</button>
                            </div>

                            : null
                    }

                </div>

                <div className="col-md-10 col-sm-12">

                    <div className="form-group row">

                        <div className="col-md-6">
                            <label htmlFor="nome">Nome</label>
                            <input
                                className="form-control shadow-none input-custom"
                                id="nome"
                                name="nome"
                                type="text"
                                placeholder="Nome do prestador"
                                value={prestador.nome}
                                required={true}
                                onChange={handlePrestador} />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="nome_mae">Nome da mãe</label>
                            <input
                                className="form-control shadow-none input-custom"
                                id="nome_mae"
                                name="nome_mae"
                                type="text"
                                placeholder="Nome da Mãe"
                                value={prestador.nome_mae}
                                required={true}
                                onChange={handlePrestador} />
                        </div>

                    </div>


                    <div className="form-group row">

                        <div className="col-md-3">
                            <label htmlFor="cpf">CPF</label>
                            <input
                                className="form-control shadow-none input-custom"
                                id="cpf"
                                name="cpf"
                                type="text"
                                placeholder="CPF"
                                value={prestador.cpf}
                                required={true}
                                onChange={handlePrestador} />
                        </div>

                        <div className="col-md-3">
                            <label htmlFor="dt_nascimento">Data de Nascimento</label>
                            <input
                                className="form-control shadow-none input-custom"
                                id="dt_nascimento"
                                name="dt_nascimento"
                                type="date"
                                placeholder="Data de Nascimento"
                                value={prestador.dt_nascimento}
                                required={true}
                                onChange={handlePrestador} />
                        </div>

                        <div className="col-md-3">
                            <label htmlFor="telefone1">Telefone</label>
                            <input
                                className="form-control shadow-none input-custom"
                                id="telefone1"
                                name="telefone1"
                                type="text"
                                placeholder="Telefone"
                                value={prestador.telefone1}
                                required={true}
                                onChange={handlePrestador} />
                        </div>

                        <div className="col-md-3">
                            <label htmlFor="telefone2">Telefone 2 (opcional)</label>
                            <input
                                className="form-control shadow-none input-custom"
                                id="telefone2"
                                name="telefone2"
                                type="text"
                                placeholder="Telefone 2 (opcional)"
                                value={prestador.telefone2}
                                required={true}
                                onChange={handlePrestador} />
                        </div>



                    </div>


                    <div className="form-group row">

                        <div className="col-md-3">
                            <label htmlFor="estado_civil">Estado Civil</label>
                            <select className="select-custom w-10 form-select form-select-md" id="estado_civil" name="estado_civil"
                                value={prestador.estado_civil}
                                required={true}
                                onChange={handlePrestador}>
                                <option defaultValue={true} value={0}>Solteiro</option>
                                <option value={1}>Casado</option>
                                <option value={2}>Separado</option>
                                <option value={3}>Divorciado</option>
                                <option value={4}>Viúvo</option>
                            </select>
                        </div>

                        <div className="col-md-3">
                            <label htmlFor="nome">Etnia</label>
                            <select className="select-custom w-10 form-select form-select-md" id="etnia" name="etnia"
                                value={prestador.etnia}
                                required={true}
                                onChange={handlePrestador}>
                                <option defaultValue={true} value={0}>Branco</option>
                                <option value={1}>Preto</option>
                                <option value={2}>Pardo</option>
                                <option value={3}>Pardo</option>
                                <option value={4}>Amarela</option>
                                <option value={5}>Indigena</option>
                            </select>
                        </div>

                        <div className="col-md-3">
                            <label htmlFor="nome">Escolaridade</label>
                            <select className="select-custom w-10 form-select form-select-md" id="escolaridade" name="escolaridade"
                                value={prestador.escolaridade}
                                required={true}
                                onChange={handlePrestador}>
                                <option defaultValue={true} value={0}>Analfabeto</option>
                                <option value={1}>Fundamental Incompleto</option>
                                <option value={2}>Fundamental Completo</option>
                                <option value={3}>Médio Incompleto</option>
                                <option value={4}>Médio Completo</option>
                                <option value={5}>Superior Incompleto</option>
                                <option value={6}>Superior Completo</option>
                            </select>
                        </div>


                        <div className="col-md-3">
                            <label htmlFor="religiao">Religião</label>
                            <input
                                id="religiao"
                                name='religiao'
                                className="form-control shadow-none input-custom"
                                type="text"
                                placeholder="Religião"
                                value={prestador.religiao}
                                onChange={handlePrestador}
                            />
                        </div>

                    </div>


                </div>

            </div>

            <div className="row">

                <div className="col-md-12">
                    <div className="form-group row">

                        <div className="col-md-6">
                            <div className="input-form inline">
                                <form>
                                    <div>
                                        <label htmlFor="possui_beneficios">Possuí Beneficios do Governo?</label>

                                        <label className="label-radio">
                                            Não
                                            <input
                                                className="radio"
                                                type="radio"
                                                name="possui_beneficios"
                                                value="false"
                                                checked={!prestador.possui_beneficios}
                                            />
                                        </label>

                                        <label className="label-radio">
                                            Sim
                                            <input
                                                className="radio"
                                                type="radio"
                                                name="possui_beneficios"
                                                value="true"
                                                checked={prestador.possui_beneficios}
                                            />
                                        </label>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <div className="col-md-6">
                            ENDERECO
                        </div>

                    </div>
                </div>

            </div>



            <div className="tabs-prestador">
                <Tab.Container defaultActiveKey="familiares">
                    <Nav variant="pills">
                        <Nav.Item>
                            <Nav.Link eventKey="familiares">
                                Familiares
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>

                    <Tab.Content>

                        <Tab.Pane eventKey="familiares">

                            <Title title={"Dados de Familiares"} />
                            <div className="row">
                                <div className="col-md-12 no-padding">
                                    <div className='menu'>

                                        <button className='menu-button button-blue' onClick={() => { handleModalFamiliar(true) }}>
                                            <i className='fa-solid fa-plus'></i> Adicionar Familiar
                                        </button>
                                    </div>
                                    <Table columns={columnsFamiliar} data={prestador.familiares} onEdit={ModalEditFamiliar} onDelete={deleteFamiliar} />
                                </div>
                            </div>
                        </Tab.Pane>
                    </Tab.Content>
                </Tab.Container>
            </div>



            <ModalFamiliar Model={modelFamiliar} show={showModalFamiliar} onHide={() => { handleModalFamiliar(false) }} onAdd={addnewFamiliar} onEdit={editFamiliar} />
        </>
    );
}

export default Create;