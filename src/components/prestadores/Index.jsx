import { useNavigate, NavLink } from 'react-router-dom'
import { useState, useEffect, useContext } from "react";
import Title from "../layout/Title";
import { AuthenticationContext } from "../context/Authentication";
import ModalDetalhes from './ModalDetalhes';
import ModalRegistro from './ModalRegistros';
import Load from "../layout/Load";
import { confirmAlert } from 'react-confirm-alert';
import { toast } from "react-toastify";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

const Index = () => {
    const { user } = useContext(AuthenticationContext);
    const [prestadores, setPrestadores] = useState([]);
    const [search, setSearch] = useState({
        id: '',
        cpf: '',
        nome: '',
    });


    const [showModalDetalhes, setShowModalDetalhes] = useState(false);
    const [idDetalhes, setIdDetalhes] = useState(null);
    const [showModalRegistro, setShowModalRegistro] = useState(false);
    const [idRegistro, setIdRegistro] = useState(null);
    const [load, setLoad] = useState(false);
    const handleModalDetalhes = (show = true) => {
        setShowModalDetalhes(show);
    }

    const handleModalRegistro = (show = true) => {
        setShowModalRegistro(show);
    }

    const navigate = useNavigate();
    const novoPrestador = () => {
        navigate('create');
    }

    const Visualizar = (id) => {
        setIdDetalhes(id);
        handleModalDetalhes(true);
    }

    const Registros = (id) => {
        setIdRegistro(id);
        handleModalRegistro(true);
    }

    const Deletar = (id, nome) => {
        confirmAlert({
            title: 'Confirmação',
            message: `Deseja deletar o prestador ${nome} ?`,
            buttons: [
                {
                    label: 'Sim',
                    onClick: async () => {
                        setLoad(true);
                        const postResult = await window.api.Action({ controller: "Prestador", action: "Delete", params: id });
                        setLoad(false);

                        if (postResult.status) {
                            toast.success(postResult.text);
                            return fetchData()
                        }
                        else
                            toast.error(postResult.text, { autoClose: false });

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

    const fetchData = async () => {
        setLoad(true);
        const data = await window.api.Action({ controller: "Prestador", action: "GetPrestadores", params: search });
        setLoad(false);
        setPrestadores(data);
    }
    useEffect(() => {


        fetchData();

    }, [search]);

    const handleSearch = async (evt) => {
        let value = evt.target.value;

        switch (evt.target.name) {
            case 'cpf':
                value = formatCpf(value);
                break;
        }
        setSearch({
            ...search,
            [evt.target.name]: value
        });


    }

    function formatCpf(value) {
        value = value.replace(/\D/g, "");
        if (value.replace(/\D/g, "").length > 11) {
            value = value.slice(0, 11);
        }

        return value
            .replace(/\D/g, "") // Remove caracteres não numéricos
            .replace(/(\d{3})(\d)/, "$1.$2") // Adiciona o primeiro ponto
            .replace(/(\d{3})(\d)/, "$1.$2") // Adiciona o segundo ponto
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2"); // Adiciona o hífen
    }

    const GerarListagem = async (r) => {
        const search = {
            processo: r.nro_processo
        }

        const data = await window.api.Action({ controller: "Agendamentos", action: "GetAgendamentosEntidadeAtestado", params: search });

        if (data.length == 0) {
            toast.error("Sem registros para esse processo!", { autoClose: false });
            return;
        } else {
            const atestados = data.map((e) => {
                return ({
                    "Número Processo": e.nro_processo,
                    "Prestador": e.nome_prestador,
                    "Tarefa": e.tarefa,
                    "Entidade": e.entidade,
                    "Hora de entrada": e.dt_entrada,
                    "Hora de saída": e.dt_saida,
                    "Horas Cumpridas": e.horas_cumpridas,
                    "Observação": e.observacao,
                })

            });

            pdfMake.vfs = pdfFonts.pdfMake.vfs;
            var dd = {
                content: [
                    { text: `Relatório de comparecimento`, style: 'header1' },
                    { text: `Nome: ${atestados[0]?.Prestador ?? 'Prestador'}`, style: 'header2' },
                    { text: `Data: ${new Date().toLocaleDateString('pt-BR')}`, style: 'header3' },
                    table(atestados,
                        ['Número Processo', 'Prestador', 'Tarefa', 'Entidade', 'Hora de entrada', 'Hora de saída', 'Horas Cumpridas', 'Observação'],
                    )
                ],
                styles: {
                    header1: {
                        fontSize: 22,
                        lineHeight: 1,
                        bold: true
                    },
                    header2: {
                        fontSize: 16,
                        lineHeight: 1
                    },
                    header3: {
                        fontSize: 10,
                        lineHeight: 2
                    },
                    tableFont: {
                        fontSize: 8
                    }
                }
            }
            pdfMake.createPdf(dd).open({}, window.open('', '_blank'));
        }
    }

    function table(data, columns) {

        return {
            table: {
                headerRows: 1,
                body: buildTableBody(data, columns)
            }
        };

    }

    function buildTableBody(data, columns) {
        let body = [];

        body.push(columns);

        data.forEach(function (row) {
            let dataRow = [];

            columns.forEach(function (columns) {
                let colData = row[columns] !== undefined ? row[columns] : "";
                dataRow.push(String(colData))
            })

            body.push(dataRow);
        });

        return body;
    }

    return (
        <>
            <Title title={"Cadastro de Prestadores"} />
            {
                user.MODO_APLICACAO === 0 ?

                    <div className='menu'>

                        <button className='menu-button button-dark-blue ' onClick={() => { novoPrestador() }}>
                            <i className='fa-solid fa-plus'></i> Novo
                        </button>
                    </div>

                    : null
            }

            <div className="row search-container form-group">
                <div className='search-title'>
                    <i className='fas fa-search'></i> Pesquisa
                </div>
                <div className="input-form col-md-3">
                    <label htmlFor="id">Código</label>
                    <input
                        id="id"
                        name="id"
                        className="form-control shadow-none input-custom"
                        type="number"
                        placeholder="Ex: 1"
                        value={search.id}
                        onChange={handleSearch}
                    />
                </div>

                <div className="input-form col-md-3">
                    <label htmlFor="nome">Nome</label>
                    <input
                        id="nome"
                        name="nome"
                        className="form-control shadow-none input-custom"
                        type="text"
                        placeholder="Ex: João da Silva"
                        value={search.nome}
                        onChange={handleSearch}
                    />
                </div>
                {
                    user.MODO_APLICACAO === 0 ?
                        <div className="input-form col-md-3">
                            <label htmlFor="cpf">CPF</label>
                            <input
                                id="cpf"
                                name="cpf"
                                className="form-control shadow-none input-custom"
                                type="text"
                                placeholder="Ex: 000.000.000-00"
                                value={search.cpf}
                                onChange={handleSearch}
                            />
                        </div>

                        : null
                }




            </div>


            {
                prestadores.length === 0 ?
                    <div className="col-md-12 zero-count">Nenhum registro localizado.</div>

                    :

                    <div className='row table-container'>
                        <div className='col-md-12'>
                            <table className='table table-small table-bordered table-hover'>
                                <thead>
                                    <tr>
                                        <th>Código</th>
                                        <th>Nome</th>
                                        {
                                            user.MODO_APLICACAO === 0 ?
                                                <th>CPF</th>
                                                : null
                                        }

                                        <th>Último Processo</th>
                                        <th>Horas a Cumprir</th>
                                        <th>Horas Cumpridas</th>
                                        <th></th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {prestadores.map(r => (

                                        <tr key={r.id} style={{ verticalAlign: "middle" }}>
                                            <td>{r.id}</td>
                                            <td>{r.nome}</td>
                                            {
                                                user.MODO_APLICACAO === 0 ?
                                                    <td>{r.cpf}</td>
                                                    : null
                                            }

                                            <td>{r.nro_processo ?? "--"}</td>
                                            <td>{r.horas_cumprir > 0 ? r.horas_cumprir : "0"}</td>

                                            <td>{r.horas_cumpridas > 0 ? r.horas_cumpridas : "0"}</td>
                                            <td>
                                                <div className="btn-group" role="group">

                                                    <span id="btnGroupDrop1" type="button" className="btn btn-custom dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                                        <i className='fa fa-cog'></i> opções
                                                    </span>
                                                    <ul className="dropdown-menu" aria-labelledby="btnGroupDrop1">
                                                        {
                                                            user.MODO_APLICACAO === 0 ?
                                                                <>
                                                                    <li> <NavLink className="dropdown-item" id="edit" to={`/prestadores/edit/${r.id}`}> <i className='fa fa-edit'></i> Editar</NavLink></li>
                                                                    <li> <NavLink className="dropdown-item" id="novoProcesso" to={`/processos/create/${r.id}`}> <i className='fa fa-plus'></i> Novo Processo</NavLink></li>

                                                                    {!r.somente_leitura ?
                                                                        <li> <a className="dropdown-item btn" onClick={() => { Deletar(r.id, r.nome) }} to="#"><i className="fa fa-trash"></i> Deletar</a></li>
                                                                        : null
                                                                    }


                                                                </>
                                                                :
                                                                <>
                                                                    <li> <a className="dropdown-item btn" onClick={() => { Visualizar(r.id) }} to="#"><i className="fa fa-eye"></i> Detalhes</a></li>
                                                                    <li>
                                                                        <a className="dropdown-item btn" onClick={() => { GerarListagem(r) }}><i className="fas fa-solid fa-file"> </i> Atestado</a>
                                                                    </li>
                                                                </>


                                                        }

                                                        <li> <a className="dropdown-item btn" onClick={() => { Registros(r.id) }} to="#"><i className="fa fa-eye"></i> Ver Registros</a></li>

                                                        {/* <li> <a className="dropdown-item" onClick={() => { GerarListagem(r.id, r.ultimo_processo, r.nome) }} to="#"><i className="fa-solid fa-file"></i> Gerar Relatório</a></li>
                                                <li> <a className="dropdown-item" onClick={() => { DeletePrestador(r.id, r.nome) }} to="#"><i className="fa-solid fa-trash"></i> Excluir</a></li> */}
                                                    </ul>
                                                </div>
                                            </td>

                                        </tr>

                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
            }
            <ModalDetalhes show={showModalDetalhes} onHide={() => { handleModalDetalhes(false) }} id={idDetalhes} />
            <ModalRegistro show={showModalRegistro} onHide={() => { handleModalRegistro(false) }} id={idRegistro} />
            <Load show={load} />

        </>
    );
}

export default Index;