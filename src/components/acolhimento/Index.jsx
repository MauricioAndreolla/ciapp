import { AuthenticationContext } from "../context/Authentication";
import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import Load from "../layout/Load";
import Title from "../layout/Title";
import Table from '../layout/Table';
import ModalCreateAcolhimento from './ModalCreateAcolhimento';
import { toast } from "react-toastify";
import moment from 'moment';
import { confirmAlert } from 'react-confirm-alert';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

const Acolhimento = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthenticationContext);
    const [load, setLoad] = useState(false);
    const [acolhimentos, setAcolhimentos] = useState([]);
    const [modelAcolhimento, setModelAcolhimento] = useState({
        id: null,
        descricao: null,
        dt_registro: null
    });

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
    const editNewAcolhimento = async (acolhimento) => {

        setLoad(true);
        const data = await await window.api.Action({ controller: "Acolhimento", action: "SalvarAcolhimento", params: acolhimento });

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

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        // setLoad(true);
        // let data = await window.api.Action({ controller: "Acolhimento", action: "GetAcolhimentos", params: id });
        // setNomePrestador(data.nomePrestador.nome)

        // setAcolhimentos(data.acolhimentos.map(s => {
        //     return {
        //         id: s.id,
        //         dt_registro: moment(s.dt_registro).locale('pt').format('L'),
        //         descricao: s.descricao
        //     }
        // }));
        // setLoad(false);
    }

    const ModalEditAcolhimento = (object) => {
        handleModalAcolhimento(true, {
            id: object.id,
            descricao: object.descricao,
            dt_registro: moment(object.dt_registro, "DD/MM/YYYY").format("YYYY-MM-DD")
        });
    }

    const handleModalAcolhimento = (show = true, model = null) => {
        setModelAcolhimento(model);
        handleModalCreateAcolhimento(show);
    }

    const deleteAcolhimento = (object) => {
        if (object) {

            confirmAlert({
                title: 'Confirmação',
                message: 'Tem certeza que deseja remover este item?',
                buttons: [
                    {
                        label: 'Sim',
                        onClick: async () => {
                            setLoad(true);
                            const data = await await window.api.Action({ controller: "Acolhimento", action: "DeleteAcolhimento", params: object.id });

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

    function table(data, columns) {

        return {
            table: {
                headerRows: 1,
                body: buildTableBody(data, columns),
                widths: ['*', '*'],
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

    const exportarPDF = () => {
        const dados = acolhimentos.map((e) => {
            return ({
                "Data de Registro": e.dt_registro,
                "Descrição": e.descricao
            })

        });

        pdfMake.vfs = pdfFonts.pdfMake.vfs;
        var dd = {
            content: [
                { text: `Registro de Acolhimentos`, style: 'header1' },
              
                { text: `Data: ${new Date().toLocaleDateString('pt-BR')}`, style: 'header3' },
                table(dados,
                    ['Data de Registro', 'Descrição'],
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
                },
                table: {
                    widths: ['100%'],
                },
            }
        }
        pdfMake.createPdf(dd).open({}, window.open('', '_blank'));
    }

    return <>
        <Title title={"Entrevista de Acolhimentos"} />
        <div className='menu'>
            <button className='menu-button button-blue' onClick={() => { navigate('/prestadores') }}>
                <i className='fa-solid fa-arrow-left'></i> Voltar
            </button>
            <button className='menu-button button-dark-blue' onClick={() => { handleModalCreateAcolhimento(true) }}>
                <i className='fa-solid fa-plus'></i> Adicionar Registro
            </button>

            <button className='menu-button button-red' onClick={() => { exportarPDF() }}>
                <i className='fa-solid fa-file-pdf'></i> Exportar PDF
            </button>

        </div>

        <div className="col-md-12 no-padding">
            <Table columns={[
                { Header: 'Data de Registro', accessor: 'dt_registro' },
                { Header: 'Descrição', accessor: 'descricao' }
            ]} data={acolhimentos} onEdit={ModalEditAcolhimento} onDelete={deleteAcolhimento} />
        </div>




        <ModalCreateAcolhimento Model={modelAcolhimento} show={showModalCreateAcolhimento} onHide={() => { handleModalCreateAcolhimento(false) }} onAdd={addNewAcolhimento} onEdit={editNewAcolhimento} />
        <Load show={load} />
    </>
}

export default Acolhimento;