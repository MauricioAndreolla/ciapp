import { useState, useEffect, useRef } from 'react';
import { Button, Modal } from 'react-bootstrap';
import Load from "../layout/Load";
import { toast } from "react-toastify";
import ModalCreateAcolhimento from '../acolhimento/ModalCreateAcolhimento';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { confirmAlert } from 'react-confirm-alert';
import susepe64 from '../../contents/images/susepe64';
import rs64 from '../../contents/images/rs64';

const ModalEntrevistaAcolhimento = ({ id, show, onHide }) => {
    const [entrevistas, setEntrevistas] = useState([]);
    const [load, setLoad] = useState(false);
    const modalRef = useRef(null);


    const [showModalCreateAcolhimento, setShowModalCreateAcolhimento] = useState(false);
    const handleModalCreateAcolhimento = (show = true) => {
        setShowModalCreateAcolhimento(show);
    }

    const addNewAcolhimento = async (acolhimento) => {

        setLoad(true);
        const data = await await window.api.Action({ controller: "Acolhimento", action: "CreateAcolhimento", params: { acolhimento: acolhimento, id_prestador: id } });

        setLoad(false);
        fetchData();
        if (!data.status) {
            toast.error(`Erro: ${data.text}`, { autoClose: false });
        }
        else {
            toast.success(data.text);
            handleModalCreateAcolhimento(false);
        }

    }

    const fetchData = async () => {
        setLoad(true);
        let data = await window.api.Action({ controller: "Acolhimento", action: "GetEntrevistas", params: id });

        setEntrevistas(data);
        setLoad(false);
    }

    const handleHide = async () => {
        onHide();
    };
    useEffect(() => {

        if (id) {

            fetchData();
        }

    }, [id]);

    const Imprimir = async (id) => {


        pdfMake.vfs = pdfFonts.pdfMake.vfs;

        var item = entrevistas.find(s => s.id === id);


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
                    text: '\n\nAPRESENTAÇÃO NA CIAP E AGENDAMENTO DE ENTREVISTA\n\n',
                    alignment: 'center',
                    fontSize: 12,
                    bold: true
                },
                {
                    text: [
                        `Pessoa encaminhada: ${item.prestador}\n\n`,
                        `CPF: ${item.cpf}\n\n`,
                        `Telefone: ${item.telefone}\n\n`,
                        `Processo: ${item.nro_processo}\n\n`,
                        `Entrevista de acolhimento agendada para: ${item.dt_agendamento}\n\n\n`
                    ],
                    fontSize: 12,
                    margin: [0, 10, 0, 10]
                },
                {
                    text: [
                        '1 – Local: Central Integrada de Alternativas Penais (CIAP); Fórum de Caxias, subsolo 1;\n\n',
                        '2 – O(a) entrevistador(a) buscará conhecer as condições socioeconômicas, familiares e habitacionais da pessoa encaminhada, tirar dúvidas e orientar adequadamente sobre a medida a ser  executada;\n\n',
                        '3 – O eventual não comparecimento à entrevista será notificado no processo;\n\n',
                        'Processo:\n\n',
                        '* Declaro que recebi uma cópia deste documento.'
                    ],
                    fontSize: 12
                },
                {
                    text: '\n\n\nAtendimento realizado por__________________________________',
                    alignment: 'right',
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


        pdfMake.createPdf(docDefinition).download('AgendamentoEntrevista.pdf');

    }

    
    const ImprimirCertidao = async (id) => {


        pdfMake.vfs = pdfFonts.pdfMake.vfs;

        var item = entrevistas.find(s => s.id === id);


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
                    text: '\n\nAPRESENTAÇÃO NA CIAP\n\n',
                    alignment: 'center',
                    fontSize: 12,
                    bold: true
                },
                {
                    text: [
                        `Processo Nº: ${item.nro_processo}\n\n`,
                        `Pessoa em alternativa penal: ${item.prestador}\n\n`,
                    ],
                    fontSize: 12,
                    margin: [0, 10, 0, 10]
                },
                {
                    text: 'CERTIDÃO\n\n\n\n',
                    bold: true
                },
                {
                    text:`Certifico que ${item.prestador} não compareceu à entrevista marcada para o dia ${item.dt_agendamento}, nesta Central.\n\n\n`,
                    fontSize: 12
                },
                {
                    text: '\n\n\nCaxias do Sul-RS, ____ de ______________ de 20_____.',
                    alignment: 'center',
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
        };


        pdfMake.createPdf(docDefinition).download('CertidaoNaoComparecimento.pdf');

    }

    const Deletar = (id) => {
        confirmAlert({
            title: 'Confirmação',
            message: `Deseja deletar o registro?`,
            buttons: [
                {
                    label: 'Sim',
                    onClick: async () => {
                        setLoad(true);
                        let postResult = await window.api.Action({ controller: "Acolhimento", action: "Delete", params: id });

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

    return (
        <>
            <style>{`
          #react-confirm-alert {
            z-index: 9999;
            position: absolute;
    }
      `}</style>
            <Modal className='modal-lg' ref={modalRef} show={show} onHide={handleHide}>
                <Modal.Header closeButton>
                    <Modal.Title><i className="fa-solid fa-users"></i> <small> Entrevista de Acolhimento</small></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className='menu'>
                            <button className='menu-button button-dark-blue' onClick={() => { handleModalCreateAcolhimento(true) }}>
                                <i className='fa-solid fa-plus'></i> Adicionar Registro
                            </button>
                        </div>
                        <div className='table-container'>
                            <div className='col-md-12'>
                                <table className='table table-small table-bordered table-hover'>
                                    <thead>
                                        <tr>
                                            <th>Prestador</th>
                                            <th>Nro. Processo</th>
                                            <th>Dt. Agendamento</th>
                                            <th></th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {entrevistas.map(r => (

                                            <tr key={r.id} style={{ verticalAlign: "middle", cursor: "pointer" }}>
                                                <td>{r.prestador}</td>
                                                <td>{r.nro_processo}</td>
                                                <td>{r.dt_agendamento}</td>
                                                <td>
                                                    <div className="btn-group" role="group">

                                                        <span id="btnGroupDrop1" type="button" className="btn btn-custom dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                                            <i className='fa fa-cog'></i> opções
                                                        </span>
                                                        <ul className="dropdown-menu" aria-labelledby="btnGroupDrop1">
                                                            <li> <a className="dropdown-item btn" onClick={() => { Imprimir(r.id) }} to="#"><i className="fa-solid fa-print"></i> Imprimir</a></li>
                                                            <li> <a className="dropdown-item btn" onClick={() => { ImprimirCertidao(r.id) }} to="#"><i className="fa-solid fa-print"></i> Imprimir Certidão de Não Comparecimento</a></li>
                                                            <li> <a className="dropdown-item btn" onClick={() => { Deletar(r.id) }} to="#"><i className="fa fa-trash"></i> Deletar</a></li>
                                                        </ul>
                                                    </div>
                                                </td>

                                            </tr>

                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button className='btn btn-sm' variant="secondary" onClick={handleHide}>
                        <i className="fa-solid fa-times"></i> <small>Fechar</small>
                    </Button>
                </Modal.Footer>
            </Modal>
            <ModalCreateAcolhimento show={showModalCreateAcolhimento} onHide={() => { handleModalCreateAcolhimento(false) }} onAdd={addNewAcolhimento} />
            <Load show={load} />
        </>
    );


}

export default ModalEntrevistaAcolhimento;