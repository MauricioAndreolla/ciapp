import { useState } from "react";
import { useNavigate } from 'react-router-dom'
import Title from "../layout/Title";
import { Nav, NavItem, Tab, TabContainer, TabContent, TabPane } from 'react-bootstrap';
import { NavLink } from "react-router-dom";
import Table from '../layout/Table';
import ModalFamiliar from './ModalFamiliar';
import ModalHabilidade from './ModalHabilidade';
import ModalCurso from './ModalCursos';
import ModalUsoDroga from './ModalUsoDroga';
import ModalBeneficios from './ModalBeneficios';

import { toast } from "react-toastify";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import InputDiasSemana from '../layout/InputDiasSemana';
import Endereco from "../layout/Endereco";

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
        familiares: [],
        beneficios: [],
        habilidades: [],
        cursos: [],
        saude: {
            deficiencia: 0,
            observacao: "",
            drogas: []
        }
    });

    const [endereco, setEndereco] = useState({
        rua: '',
        cep: '',
        numero: '',
        bairro: '',
        complemento: '',
        id_cidade: ''
    });

    const [trabalho, setTrabalho] = useState({
        trabalho_descricao: '',
        trabalho_horario_inicio: '08:00',
        trabalho_horario_fim: '18:00',
        trabalho_dias_semana: []
    });
    const askModal = (id) => {

        confirmAlert({
            title: 'Criar novo processo',
            message: `Deseja associar um processo para o prestador ${prestador.nome}?`,
            buttons: [
                {
                    label: 'Sim',
                    onClick: async () => {
                        navigate(`/processos/create/${id}`);
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
    const handleCreate = async () => {


        confirmAlert({
            title: 'Confirmação',
            message: `Confirma a criação do prestador ${prestador.nome}`,
            buttons: [
                {
                    label: 'Sim',
                    onClick: async () => {

                        const postResult = await window.api.Action({
                            controller: "Prestador", action: "Create", params: {
                                prestador: prestador,
                                endereco: endereco,
                                trabalho: trabalho,
                                image: image
                            }
                        });
                        
                        if (postResult.status) {
                            toast.success(postResult.text);
                            askModal(postResult.id);
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

    const handleEndereco = (evt, name = null) => {
        const value = evt.value ?? evt.target.value;

        setEndereco({
            ...endereco,
            [name ? name : evt.target.name]: value
        })

    }

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

    const handleSaude = (evt, prop_name = null) => {

        const value = evt.value ?? evt.target.value;
        let saude = {
            ...prestador.saude,
            [prop_name ? prop_name : evt.target.name]: value
        }
        setPrestador({
            ...prestador,
            ['saude']: saude
        })

    }
    const handleTrabalho = (evt, prop_name = null) => {

        const value = evt.value ?? evt.target.value;

        setTrabalho({
            ...trabalho,
            [prop_name ? prop_name : evt.target.name]: value
        })
    }

    const handleDias = (value) => {

        setTrabalho({
            ...trabalho,
            ["trabalho_dias_semana"]: value.sort((a, b) => (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0))
        })
    }

    const [showModalUsoDroga, setShowModalUsoDroga] = useState(false);

    const handleModalUsoDroga = (show = true) => {
        setShowModalUsoDroga(show);
    }
    const addNewUsoDroga = async (droga) => {
        if (droga && droga.id) {
            let info = await await window.api.Action({ controller: "Droga", action: "GetDrogaInfo", params: droga.id });
            let checkExistente = prestador.saude.drogas.filter(p => p.id === droga.id).length == 0;
            if (!checkExistente)
                toast.error(`Droga "${info.nome}" já informada`);
            else {


                let saude = prestador.saude;
                saude.drogas.push({
                    id: droga.id,
                    nome: info.nome,
                    observacao: info.observacao,
                    frequencia: droga.frequencia,
                    frequencia_descricao: droga.frequencia === '0' ? "Eventualmente" : droga.frequencia === '1' ? "Com Frequência" : droga.frequencia === '2' ? "Não usa mais" : "--"
                });
                setPrestador({
                    ...prestador,
                    ["saude"]: saude
                })
            }

        }
        handleModalUsoDroga(false);
    }

    const [showModalCurso, setShowModalCurso] = useState(false);

    const handleModalCurso = (show = true) => {
        setShowModalCurso(show);
    }
    const addNewCurso = async (cursos) => {

        if (cursos && cursos.length > 0) {
            const data = await await window.api.Action({ controller: "Curso", action: "GetCursos", params: { filter: cursos.map(s => s.value) } });

            if (data) {
                let adicionar = data.filter(s => prestador.cursos.filter(p => p.id === s.id).length == 0);

                if (adicionar.length > 0) {
                    let novaLista = prestador.cursos
                    novaLista.push(...adicionar);
                    setPrestador({
                        ...prestador,
                        ["cursos"]: novaLista
                    })
                }
            }
        }

        setShowModalCurso(false)
    }

    const [showModalBeneficio, setShowModalBeneficio] = useState(false);
    const handleModalBeneficio = (show = true) => {
        setShowModalBeneficio(show);
    }
    const addNewBeneficio = async (beneficios) => {

        if (beneficios && beneficios.length > 0) {
            const data = await await window.api.Action({ controller: "Beneficio", action: "GetBeneficios", params: { filter: beneficios.map(s => s.value) } });

            if (data) {
                let adicionar = data.filter(s => prestador.beneficios.filter(p => p.id === s.id).length == 0);
                if (adicionar.length > 0) {
                    let novaLista = prestador.beneficios
                    novaLista.push(...adicionar);
                    setPrestador({
                        ...prestador,
                        ["beneficios"]: novaLista
                    })
                }
            }
        }

        setShowModalBeneficio(false)
    }



    const [showModalHabilidade, setShowModalHabilidade] = useState(false);

    const handleModalHabilidade = (show = true) => {
        setShowModalHabilidade(show);
    }

    const addNewHabilidades = async (habilidades) => {

        if (habilidades && habilidades.length > 0) {
            const data = await await window.api.Action({ controller: "Habilidade", action: "GetHabilidades", params: { filter: habilidades.map(s => s.value) } });

            if (data) {
                let adicionar = data.filter(s => prestador.habilidades.filter(p => p.id === s.id).length == 0);
                if (adicionar.length > 0) {
                    let novaLista = prestador.habilidades
                    novaLista.push(...adicionar);
                    setPrestador({
                        ...prestador,
                        ["habilidades"]: novaLista
                    })
                }
            }
        }

        setShowModalHabilidade(false)
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

    const deleteHabilidade = async (object) => {
        if (object) {

            ;
            confirmAlert({
                title: 'Confirmação',
                message: 'Tem certeza que deseja remover este item?',
                buttons: [
                    {
                        label: 'Sim',
                        onClick: () => {
                            var novaLista = prestador.habilidades.filter(s => s.id !== object.id);
                            if (novaLista.length === 0) {
                                setPrestador({
                                    ...prestador,
                                    ["habilidades"]: []
                                })
                                return;
                            }
                            setPrestador({
                                ...prestador,
                                ["habilidades"]: novaLista
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

    const deleteBeneficio = async (object) => {
        if (object) {

            ;
            confirmAlert({
                title: 'Confirmação',
                message: 'Tem certeza que deseja remover este item?',
                buttons: [
                    {
                        label: 'Sim',
                        onClick: () => {
                            var novaLista = prestador.beneficios.filter(s => s.id !== object.id);
                            if (novaLista.length === 0) {
                                setPrestador({
                                    ...prestador,
                                    ["beneficios"]: []
                                })
                                return;
                            }
                            setPrestador({
                                ...prestador,
                                ["beneficios"]: novaLista
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
    const deleteCurso = async (object) => {
        if (object) {

            ;
            confirmAlert({
                title: 'Confirmação',
                message: 'Tem certeza que deseja remover este item?',
                buttons: [
                    {
                        label: 'Sim',
                        onClick: () => {
                            var novaLista = prestador.cursos.filter(s => s.id !== object.id);
                            if (novaLista.length === 0) {
                                setPrestador({
                                    ...prestador,
                                    ["cursos"]: []
                                })
                                return;
                            }
                            setPrestador({
                                ...prestador,
                                ["cursos"]: novaLista
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

    const deleteUsoDroga = async (object) => {
        if (object) {

            ;
            confirmAlert({
                title: 'Confirmação',
                message: 'Tem certeza que deseja remover este item?',
                buttons: [
                    {
                        label: 'Sim',
                        onClick: () => {
                            let saude = prestador.saude;
                            var novaLista = saude.drogas.filter(s => s.id !== object.id);
                            saude.drogas = novaLista;
                            setPrestador({
                                ...prestador,
                                ["saude"]: saude
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

                <button className='menu-button button-green' onClick={() => { handleCreate() }}>
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



            <div className="tabs-prestador">
                <Tab.Container defaultActiveKey="endereco">
                    <Nav variant="pills">
                        <Nav.Item>
                            <Nav.Link eventKey="endereco">
                                Endereço
                            </Nav.Link>
                        </Nav.Item>

                        <Nav.Item>
                            <Nav.Link eventKey="familiares">
                                Familiares
                            </Nav.Link>
                        </Nav.Item>

                        <Nav.Item>
                            <Nav.Link eventKey="beneficios">
                                Benefícios
                            </Nav.Link>
                        </Nav.Item>

                        <Nav.Item>
                            <Nav.Link eventKey="trabalho">
                                Trabalho
                            </Nav.Link>
                        </Nav.Item>

                        <Nav.Item>
                            <Nav.Link eventKey="habilidades">
                                Habilidades
                            </Nav.Link>
                        </Nav.Item>

                        <Nav.Item>
                            <Nav.Link eventKey="cursos">
                                Cursos e especialidades
                            </Nav.Link>
                        </Nav.Item>

                        <Nav.Item>
                            <Nav.Link eventKey="saude">
                                Saúde
                            </Nav.Link>
                        </Nav.Item>

                    </Nav>

                    <Tab.Content>
                        <Tab.Pane eventKey="endereco">

                            <Title title={"Dados de Endereço"} />
                            <div className="row">
                                <div className="col-md-12 no-padding">
                                    <Endereco endereco={endereco} handleChange={handleEndereco} />
                                </div>
                            </div>
                        </Tab.Pane>

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

                        <Tab.Pane eventKey="beneficios">

                            <Title title={"Dados de Benefícios do Governo"} />

                            <div className="row">
                                <div className="col-md-12 no-padding">
                                    <div className='menu'>

                                        <button className='menu-button button-blue' onClick={() => { handleModalBeneficio(true) }}>
                                            <i className='fa-solid fa-plus'></i> Adicionar Benefício
                                        </button>
                                    </div>

                                    <Table columns={[
                                        { Header: 'Nome', accessor: 'nome' },
                                        { Header: 'Observação', accessor: 'observacao' }
                                    ]} data={prestador.beneficios} onDelete={deleteBeneficio} />
                                </div>
                            </div>

                        </Tab.Pane>

                        <Tab.Pane eventKey="trabalho">

                            <Title title={"Dados de Trabalho"} />
                            <div className="row">

                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label htmlFor="trabalho_descricao">Descrição</label>
                                        <textarea
                                            id="trabalho_descricao"
                                            name="trabalho_descricao"
                                            className="form-control shadow-none input-custom"
                                            placeholder=""
                                            value={trabalho.trabalho_descricao}
                                            onChange={handleTrabalho}

                                        />
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="input-form">
                                        <label htmlFor="trabalho_horario_inicio">Horário de Entrada</label>
                                        <input
                                            id="trabalho_horario_inicio"
                                            name="trabalho_horario_inicio"
                                            className="form-control input rounded-2"
                                            type="time"
                                            value={trabalho.trabalho_horario_inicio}
                                            onChange={handleTrabalho}
                                        />
                                    </div>
                                </div>

                                <div className="col-md-3">
                                    <div className="input-form">
                                        <label htmlFor="trabalho_horario_fim">Horário de Saída</label>
                                        <input
                                            id="trabalho_horario_fim"
                                            name="trabalho_horario_fim"
                                            className="form-control input rounded-2"
                                            type="time"
                                            value={trabalho.trabalho_horario_fim}
                                            onChange={handleTrabalho}
                                        />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="input-form">
                                        <label htmlFor="trabalho_dias_semana">Dias Semana</label>
                                        <InputDiasSemana id="trabalho_dias_semana" name="trabalho_dias_semana" handleChange={handleDias} value={trabalho.trabalho_dias_semana} />
                                    </div>
                                </div>
                            </div>
                        </Tab.Pane>

                        <Tab.Pane eventKey="habilidades">

                            <Title title={"Dados de Habilidades"} />

                            <div className="row">
                                <div className="col-md-12 no-padding">
                                    <div className='menu'>

                                        <button className='menu-button button-blue' onClick={() => { handleModalHabilidade(true) }}>
                                            <i className='fa-solid fa-plus'></i> Adicionar Habilidade
                                        </button>
                                    </div>
                                    <Table columns={[
                                        { Header: 'Descrição', accessor: 'descricao' },
                                        { Header: 'Observação', accessor: 'observacao' }
                                    ]} data={prestador.habilidades} onDelete={deleteHabilidade} />
                                </div>
                            </div>

                        </Tab.Pane>

                        <Tab.Pane eventKey="cursos">

                            <Title title={"Dados de Curso e especializações"} />

                            <div className="row">
                                <div className="col-md-12 no-padding">
                                    <div className='menu'>

                                        <button className='menu-button button-blue' onClick={() => { handleModalCurso(true) }}>
                                            <i className='fa-solid fa-plus'></i> Adicionar Curso ou especialização
                                        </button>
                                    </div>

                                    <Table columns={[
                                        { Header: 'Descrição', accessor: 'descricao' },
                                        { Header: 'Observação', accessor: 'observacao' }
                                    ]} data={prestador.cursos} onDelete={deleteCurso} />
                                </div>
                            </div>

                        </Tab.Pane>

                        <Tab.Pane eventKey="saude">

                            <Title title={"Dados de Saúde"} />

                            <div className="row">
                                <hr></hr>
                                <div className="col-md-12 no-padding">


                                    <div className="row">
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label htmlFor="deficiencia">Possuí Deficiência?</label>
                                                <select className="select-custom w-10 form-select form-select-md" id="deficiencia" name="deficiencia"
                                                    value={prestador.saude.deficiencia}
                                                    required={true}
                                                    onChange={handleSaude}>
                                                    <option defaultValue={true} value='0'>Não</option>
                                                    <option value='1'>Mental</option>
                                                    <option value='2'>Auditiva</option>
                                                    <option value='3'>Visual</option>
                                                </select>
                                            </div>

                                        </div>
                                        <div className="col-md-8">
                                            <div className="form-group">
                                                <label htmlFor="observacao">Observação</label>
                                                <textarea
                                                    className="form-control shadow-none input-custom"
                                                    id="observacao"
                                                    name="observacao"
                                                    type="text"
                                                    placeholder=""
                                                    value={prestador.saude.observacao}
                                                    rows={5}
                                                    onChange={handleSaude} />
                                            </div>

                                        </div>

                                        <div className="col-md-12" style={{ marginTop: "1rem" }}>
                                            <div className='menu'>

                                                <button className='menu-button button-blue' onClick={() => { handleModalUsoDroga(true) }}>
                                                    <i className='fa-solid fa-plus'></i> Adicionar informação de uso de Drogas
                                                </button>
                                            </div>
                                            <Table columns={[
                                                { Header: 'Nome', accessor: 'nome' },
                                                { Header: 'Observação', accessor: 'observacao' },
                                                { Header: 'Frequência', accessor: 'frequencia_descricao' }
                                            ]} data={prestador.saude.drogas} onDelete={deleteUsoDroga} />
                                        </div>

                                    </div>


                                </div>
                            </div>

                        </Tab.Pane>


                    </Tab.Content>
                </Tab.Container>
            </div>



            <ModalFamiliar Model={modelFamiliar} show={showModalFamiliar} onHide={() => { handleModalFamiliar(false) }} onAdd={addnewFamiliar} onEdit={editFamiliar} />
            <ModalHabilidade show={showModalHabilidade} onHide={() => { handleModalHabilidade(false) }} onAdd={addNewHabilidades} />
            <ModalBeneficios show={showModalBeneficio} onHide={() => { handleModalBeneficio(false) }} onAdd={addNewBeneficio} />
            <ModalCurso show={showModalCurso} onHide={() => { handleModalCurso(false) }} onAdd={addNewCurso} />
            <ModalUsoDroga show={showModalUsoDroga} onHide={() => { handleModalUsoDroga(false) }} onAdd={addNewUsoDroga} />
        </>
    );
}

export default Create;