import { useNavigate, NavLink } from 'react-router-dom'
import { useState, useEffect, useContext } from "react";
import Title from "../layout/Title";
import { AuthenticationContext } from "../context/Authentication";
import ModalDetalhes from './ModalDetalhes';
import ModalRegistro from './ModalRegistros';
import ModalCreateAcolhimento from './Acolhimento';
import Load from "../layout/Load";
import { confirmAlert } from 'react-confirm-alert';
import { toast } from "react-toastify";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import susepe64 from '../../contents/images/susepe64';
import rs64 from '../../contents/images/rs64';

const Index = () => {
    const { user } = useContext(AuthenticationContext);
    const [prestadores, setPrestadores] = useState([]);
    const [search, setSearch] = useState({
        id: '',
        cpf: '',
        nome: '',
    });

    var fontFiles = {
        "times-new-roman": {
          normal: "../../contents/fonts/TimesNewRoman/times-new-roman.ttf",
          bold: "../../contents/fonts/TimesNewRoman/times-new-roman-bold.ttf",
          italics: "../../contents/fonts/TimesNewRoman/times-new-roman-italic.ttf",
          bolditalics: "../../contents/fonts/TimesNewRoman/times-new-roman-bold-italic.ttf"
        }
      };


    const [showModalDetalhes, setShowModalDetalhes] = useState(false);
    const [idDetalhes, setIdDetalhes] = useState(null);
    const [showModalRegistro, setShowModalRegistro] = useState(false);
    const [showModalAcolhimento, setShowModalAcolhimento] = useState(false);
    const [idAcolhimento, setIdAcolhimento] = useState(null);
    const [idRegistro, setIdRegistro] = useState(null);
    const [load, setLoad] = useState(false);

    const handleModalDetalhes = (show = true) => {
        setShowModalDetalhes(show);
    }

    const handleModalRegistro = (show = true) => {
        setShowModalRegistro(show);
    }

    const handleModalAcolhimento = (show = true) => {
        setShowModalAcolhimento(show);
    }

    const navigate = useNavigate();
    const novoPrestador = () => {
        navigate('create');
    }

    const Visualizar = (id) => {
        setIdDetalhes(id);
        handleModalDetalhes(true);
    }

    const EntrevistaAcolhimento = (id) => {
        setIdAcolhimento(id);
        handleModalAcolhimento(true);
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
                        ['Número Processo', 'Tarefa', 'Entidade', 'Hora de entrada', 'Hora de saída', 'Horas Cumpridas', 'Observação'],
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


    const VisualizarPrestador = (id) => {
        navigate(`/prestadores/edit/${id}?readOnly=true`);
    }

    const GerarOrientacoes = (id) => {
        var prestador = prestadores.find(s => s.id === id);

        if (prestador) {
            pdfMake.vfs = pdfFonts.pdfMake.vfs;

            const docDefinition = {
                content: [
                    {
                        layout: 'noBorders',
                        table: {
                            widths: ['auto', '*', 'auto'],
                            body: [
                                [
                                    {
                                        image: susepe64,
                                        width: 50, height: 60
                                    },
                                    {
                                        text: `ESTADO DO RIO GRANDE DO SUL\nSECRETARIA DE SISTEMAS PENAL E SOCIOEDUCATIVO\nSUPERINTENDÊNCIA DOS SERVIÇOS PENITENCIÁRIOS\n7ª DELEGACIA PENITENCIÁRIA REGIONAL\nCENTRAL INTEGRADA DE ALTERNATIVAS PENAIS (CIAP)`,
                                        fontSize: 10,
                                        margin: [0, 10],
                                        alignment: 'center'
                                    },
                                    {
                                        image: rs64,
                                        width: 50, height: 60
                                    },
                                ]
                            ]
                        }
                    },
                    {
                        text: '\n\nORIENTAÇÕES\n\n',
                        alignment: 'center',
                        fontSize: 12,
                        bold: true
                    },
                    {
                        text: `Eu, ${prestador.nome}, processo n° ${prestador.nro_processo} compareci à Central Integrada de Alternativas Penais (CIAP) de Caxias do Sul, nesta data, onde fui entrevistado por_________________________________e também recebi as seguintes orientações referentes ao cumprimento de Prestação de Serviço à Comunidade (PSC):`,
                        fontSize: 12,
                        margin: [0, 10, 0, 10]
                    },
                    {
                        text: [
                            '1 – Entregar na CIAP a a ficha de encaminhamento preenchida e assinada pela entidade parceira até o dia __________________.\n\n',
                            `2 – Manter, na entidade em que estiver cumprindo a PSC, regularidade mensal mínimo __ horas semanais, totalizando ${prestador.horas_cumprir} horas de PSC.\n\n`,
                            '3 - Informar imediatamente a CIAP de qualquer eventualidade que impeça o correto cumprimento do acordo, para que os profissionais da CIAP possam realizar ajustes que permitam sanar eventuais contratempos;\n\n',
                            '4 – As horas de serviço comunitário poderão ser distribuídas em mais de um dia da semana, caso seja mais adequado para o(a) cumpridor(a).\n\n',
                            '5 – Entregar os documentos da frequência mensal entre os dias 01 e 10 do mês seguinte ao que foi cumprido, das 12 horas às 17 horas, diretamente na CIAP ou por arquivo.PDF, digitalizado em impressora, pelo whatsapp (51 9 8473 0118) ou pelo e-mail ciap-cs@susepe.rs.gov.br.'
                        ],
                        fontSize: 12
                    },
                    {
                        text: '\n\n\nCaxias do Sul-RS, ____ de ______________ de 20_____.',
                        alignment: 'right',
                    },
                    {
                        text: [
                            '\n\n\n________________________________________________________\n',
                            'Assinatura da pessoa em alternativa penal\n\n\n\n'
                        ],
                        alignment: 'center',
                    },
                    {
                        text: [
                            'Central Integradas de Alternativas Penais – CIAP\n',
                            'Rua Dr. Montaury nº 2107, subsolo, Bairro Panazzolo\n',
                            'Telefone: (54) 3039-9081 Ramal 1119\n',
                            'E-mail: ciap-cs@susepe.rs.gov.br\n'
                        ],
                        alignment: 'center',
                        fontSize: 8
                    },
                    {
                        text: 'Whatsapp  (51) 9 8473 0118',
                        bold: true,
                        alignment: 'center',
                        fontSize: 8
                    }
                ],
            };


            pdfMake.createPdf(docDefinition).download('Orientacoes.pdf');
        }
    }

    const GerarOrientacoesPena = (id) => {
        var prestador = prestadores.find(s => s.id === id);

        if (prestador) {
            pdfMake.vfs = pdfFonts.pdfMake.vfs;
            Object.assign(pdfMake.vfs, fontFiles);
            const docDefinition = {
                content: [
                    {
                        layout: 'noBorders',
                        table: {
                            heights: 40, 
                            widths: ['auto', '*', 'auto'],
                            body: [
                                [
                                    {
                                        image: susepe64,
                                        width: 50, height: 60
                                    },
                                    {
                                        text: `ESTADO DO RIO GRANDE DO SUL\nSECRETARIA DE SISTEMAS PENAL E SOCIOEDUCATIVO\nSUPERINTENDÊNCIA DOS SERVIÇOS PENITENCIÁRIOS\n7ª DELEGACIA PENITENCIÁRIA REGIONAL\nCENTRAL INTEGRADA DE ALTERNATIVAS PENAIS (CIAP)`,
                                        fontSize: 10,
                                        margin: [0, 10],
                                        alignment: 'center'
                                    },
                                    {
                                        image: rs64,
                                        width: 50, height: 60
                                    },
                                ]
                            ]
                        }
                    },
                    {
                        text: '\n\nORIENTAÇÕES\n\n',
                        alignment: 'center',
                        fontSize: 12,
                        bold: true
                    },
                    {
                        text: `Eu, ${prestador.nome}, processo n° ${prestador.nro_processo}, compareci à Central Integrada de Alternativas Penais (CIAP) de Caxias do Sul, nesta data, onde fui entrevistada por________________________e também recebi as seguintes orientações referentes ao cumprimento de prestação de serviço à comunidade (PSC):`,
                        fontSize: 12,
                        margin: [0, 10, 0, 10],
                        fontFamily: 'times-new-roman',
                    },
                    {
                        text: [
                            '1 – Entregar na CIAP a ficha de encaminhamento preenchida e assinada pela entidade parceira até o dia ____________;\n\n',
                            `2 – Manter regularidade mensal na entidade em que estiver cumprindo a PSC;\n\n`,
                            '3 – Informar imediatamente a CIAP de qualquer eventualidade que impeça o correto cumprimento da pena;\n\n',
                            '4 – Deve-se respeitar a proporção de ',
                            { text: 'uma hora de prestação para cada dia de condenação;\n\n', bold: true },
                            '5 – Nos casos em que a sanção for superior a um ano, ',
                            { text: 'poderá a pessoa cumprir a pena em menor tempo, porém, nunca em tempo inferior à metade da pena fixada', bold: true },
                            ', ou seja, manter uma ',
                            { text: 'média de pelo menos 30 horas e no máximo 60 horas', bold: true },
                            ', durante todos os meses de cumprimento de pena;\n\n',
                            '6 – Entregar os documentos da frequência mensal entre os dias 01 e 10 do mês seguinte ao trabalhado, das 12 horas às 17 horas, diretamente na CIAP ou por arquivo .PDF, digitalizado em impressora, pelo whatsapp (51 9 8473 0118) ou pelo e-mail ciap-cs@susepe.rs.gov.br.\n\n',
                            '* Declaro que recebi uma cópia deste documento.'
                        ],
                        fontSize: 12,
                        fontFamily: 'times-new-roman',
                    },
                    {
                        text: '\n\n\nCaxias do Sul-RS, ____ de ______________ de 20_____.',
                        alignment: 'right',
                    },
                    {
                        text: [
                            '\n\n\n________________________________________________________\n',
                            'Assinatura da pessoa em alternativa penal\n\n\n\n'
                        ],
                        alignment: 'center',
                    },
                    {
                        text: [
                            'Central Integradas de Alternativas Penais – CIAP\n',
                            'Rua Dr. Montaury nº 2107, subsolo, Bairro Panazzolo\n',
                            'Telefone: (54) 3039-9081 Ramal 1119\n',
                            'E-mail: ciap-cs@susepe.rs.gov.br\n'
                        ],
                        alignment: 'center',
                        fontSize: 8
                    },
                    {
                        text: 'Whatsapp  (51) 9 8473 0118',
                        bold: true,
                        alignment: 'center',
                        fontSize: 8
                    }
                ],
            };


            pdfMake.createPdf(docDefinition).download('OrientacoesPena.pdf');
        }
    }

    const GerarAtestadoComparecimento = (id) => {
        var prestador = prestadores.find(s => s.id === id);

        if (prestador) {
            pdfMake.vfs = pdfFonts.pdfMake.vfs;
            Object.assign(pdfMake.vfs, fontFiles);

            const docDefinition = {
                content: [
                    {
                        layout: 'noBorders',
                        table: {
                            widths: ['auto', '*', 'auto'],
                            body: [
                                [
                                    {
                                        image: susepe64,
                                        width: 50, height: 60
                                    },
                                    {
                                        text: `ESTADO DO RIO GRANDE DO SUL\nSECRETARIA DE SISTEMAS PENAL E SOCIOEDUCATIVO\nSUPERINTENDÊNCIA DOS SERVIÇOS PENITENCIÁRIOS\n7ª DELEGACIA PENITENCIÁRIA REGIONAL\nCENTRAL INTEGRADA DE ALTERNATIVAS PENAIS (CIAP)`,
                                        fontSize: 10,
                                        margin: [0, 10],
                                        alignment: 'center'
                                    },
                                    {
                                        image: rs64,
                                        width: 50, height: 60
                                    },
                                ]
                            ]
                        }
                    },
                    {
                        text: '\n\nATESTADO DE COMPARECIMENTO\n\n\n\n',
                        alignment: 'center',
                        fontSize: 12,
                        bold: true
                    },
                    {
                        text: `Atesto que na presente data ${prestador.nome} compareceu nesta Central Integrada de Alternativas Penais (CIAP), para atendimento, no turno da tarde.`,
                        fontSize: 12,
                        margin: [0, 50, 0, 50]
                    },
                    {
                        text: '\n\n\n\n\nCaxias do Sul-RS, ____ de ______________ de 20_____.',
                        alignment: 'right',
                    },
                    {
                        text: [
                            '\n\n\n\n\n\n\n\n_____________________________________________\n',
                            'Nome do Profissional\n\n\n\n',
                            '_____________________________________________\n',
                            'Especialista e cargo\n\n\n\n'
                        ],
                        alignment: 'center',
                        fontSize: 8
                    },
                    {
                        text: [
                            'Central Integradas de Alternativas Penais – CIAP\n',
                            'Rua Dr. Montaury nº 2107, subsolo, Bairro Panazzolo\n',
                            'Telefone: (54) 3039-9081 Ramal 1119\n',
                            'E-mail: ciap-cs@susepe.rs.gov.br\n'
                        ],
                        alignment: 'center',
                        fontSize: 8
                    },
                    {
                        text: 'Whatsapp  (51) 9 8473 0118',
                        bold: true,
                        alignment: 'center',
                        fontSize: 8
                    }
                ],
                fontFamily: 'times-new-roman'
            };


            pdfMake.createPdf(docDefinition).download('AtestadoComparecimento.pdf');
        }
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

                                        <tr key={r.id} style={{ verticalAlign: "middle", cursor: "pointer" }} onDoubleClick={() => { VisualizarPrestador(r.id) }}>
                                            <td>{r.id}</td>
                                            <td>{r.nome}</td>
                                            {
                                                user.MODO_APLICACAO === 0 ?
                                                    <td>{r.cpf}</td>
                                                    : null
                                            }

                                            <td>{r.nro_processo ?? "--"}</td>
                                            <td>{r.horas_cumprir > 0 ? r.horas_cumprir : "0"}</td>

                                            <td>{r.horas_cumpridas ?? '00:00'}</td>
                                            <td>
                                                <div className="btn-group" role="group">

                                                    <span id="btnGroupDrop1" type="button" className="btn btn-custom dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                                        <i className='fa fa-cog'></i> opções
                                                    </span>
                                                    <ul className="dropdown-menu" aria-labelledby="btnGroupDrop1">
                                                        {
                                                            user.MODO_APLICACAO === 0 ?
                                                                <>
                                                                    <li> <NavLink className="dropdown-item" id="atendimento" to={`/prestadores/atendimentos/${r.id}`}> <i className='fa-regular fa-file-lines'></i> Atendimentos</NavLink></li>
                                                                    <li> <NavLink className="dropdown-item" id="edit" to={`/prestadores/edit/${r.id}`}> <i className='fa fa-edit'></i> Editar</NavLink></li>
                                                                    <li> <NavLink className="dropdown-item" id="novoProcesso" to={`/processos/create/${r.id}`}> <i className='fa fa-plus'></i> Novo Processo</NavLink></li>
                                                                    <li className='divider'></li>
                                                                    <li> <a className="dropdown-item btn" onClick={() => { GerarAtestadoComparecimento(r.id) }} to="#"><i className="fa-regular fa-file"></i> Atestado de Comparecimento</a></li>
                                                                    <li> <a className="dropdown-item btn" onClick={() => { EntrevistaAcolhimento(r.id) }} to="#"><i className="fa-regular fa-file"></i> Entrevista de Acolhimento</a></li>
                                                                    <li> <a className="dropdown-item btn" onClick={() => { GerarOrientacoes(r.id) }} to="#"><i className="fa-regular fa-file"></i> Orientações ANPP</a></li>
                                                                    <li> <a className="dropdown-item btn" onClick={() => { GerarOrientacoesPena(r.id) }} to="#"><i className="fa-regular fa-file"></i> Orientações Pena</a></li>
                                                              
                                                                    {!r.somente_leitura ?
                                                                        <li> <a className="dropdown-item btn" onClick={() => { Deletar(r.id, r.nome) }} to="#"><i className="fa fa-trash"></i> Deletar</a></li>
                                                                        : null
                                                                    }


                                                                </>
                                                                :
                                                                <>
                                                                    <li> <a className="dropdown-item btn" onClick={() => { Visualizar(r.id) }} to="#"><i className="fa fa-eye"></i> Detalhes</a></li>
                                                                </>


                                                        }
                                                        <li>
                                                            <a className="dropdown-item btn" onClick={() => { GerarListagem(r) }}><i className="fas fa-solid fa-file"> </i> Atestado</a>
                                                        </li>

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
            <ModalCreateAcolhimento show={showModalAcolhimento} onHide={() => { handleModalAcolhimento(false) }} id={idAcolhimento} />

            <Load show={load} />

        </>
    );
}

export default Index;