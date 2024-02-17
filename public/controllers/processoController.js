const db = require('../config/database');
const { Op, where } = require('sequelize');
const { unformatCurrency, formatCurrency, diff_hours, secondsToHHMM, diff_seconds } = require('../utils/utils')



const checkDadosOrigatorios = (payload) => {

    if (!payload.processo.id_central || !payload.processo.id_central.value)
        return { status: false, text: `Campo "Central reponsável" é obrigatório.` };

    if (!payload.processo.nro_processo)
        return { status: false, text: `Campo "Número do processo" é obrigatório.` };

    if (!payload.processo.id_vara || !payload.processo.id_vara.value || payload.processo.id_vara.value <= 0)
        return { status: false, text: `Campo "Nome da Vara Judicial" é obrigatório.` };

    if (!payload.processo.horas_cumprir || parseInt(payload.processo.horas_cumprir) <= 0)
        return { status: false, text: `Campo "Horas a cumprir" é obrigatório.` };

    return { status: true };


}

module.exports = {

    async Delete(id) {

        let Processo = await db.models.Processo.findByPk(id, {
            include: db.models.Agendamento
        });
        if (!Processo) return { status: false, text: 'Processo não localizado.' };

        if (Processo.Agendamentos.length > 0) return { status: false, text: `O Processo ${Processo.nro_processo} possuí Agendamentos associados e não pode ser deletado` };

        await Processo.destroy();

        return { status: true, text: `Processo ${Processo.nome} deletado!` };


    },


    async GetProcesso(id) {
        const Processo = await db.models.Processo.findByPk(id, {
            include: [
                { model: db.models.Prestador },
                { model: db.models.Vara },
                { model: db.models.Entidade }
                // { model: db.models.AtestadoFrequencia }
            ]
        }).finally(() => {
            //db.sequelize.close();
        });

        const data = {
            id: Processo.id,
            id_central: { value: Processo.EntidadeId, label: Processo.Entidade.nome },
            id_vara: { value: Processo.VaraId, label: Processo.Vara.descricao },
            nro_processo: Processo.nro_processo,
            nro_artigo_penal: Processo.nro_artigo_penal,
            pena_originaria_regime: Processo.pena_originaria_regime,
            inciso: Processo.inciso,
            detalhamento: Processo.detalhamento,
            prd: Processo.prd,
            prd_descricao: Processo.prd_descricao,
            horas_cumprir: Processo.horas_cumprir,
            possui_multa: Processo.possui_multa,
            somente_leitura: Processo.somente_leitura,
            valor_a_pagar: formatCurrency(Processo.valor_a_pagar),
            qtd_penas_anteriores: Processo.qtd_penas_anteriores,
            nome_prestador: Processo.Prestadore.nome,
            // horas_cumpridas: Processo.AtestadoFrequencia.map(s => {
            //     return diff_hours(s.dt_entrada, s.dt_saida)
            // }).reduce((a, b) => a + b, 0)
        }
        // //await db.sequelize.close();
        return data;


    },

    async GetProcessos(search) {
        let where = {};
        if (search) {
            if (search.id)
                where.id = search.id;

            if (search.nro_processo) {
                where.nro_processo = {
                    [Op.substring]: search.nro_processo
                }
            }
            if (search.id_prestador && search.id_prestador.value) {
                where.PrestadoreId = search.id_prestador.value;
            }
        }

        const Processos = await db.models.Processo.findAll({
            include: [
                { model: db.models.Prestador },
                { model: db.models.Entidade },
                { model: db.models.Vara },
                {
                    model: db.models.Agendamento,
                    include: { model: db.models.AtestadoFrequencia }
                }

            ],
            where: where
        }).finally(() => {
            //db.sequelize.close();
        });

        const listaProcessos = Processos.map(s => {
            return {
                id: s.id,
                nro_processo: s.nro_processo,
                prestador: s.Prestadore.nome,
                horas_cumprir: s.horas_cumprir,
                somente_leitura: s.somente_leitura,
                horas_cumpridas:
                    secondsToHHMM(
                        s.Agendamentos.map(s => {

                            return s.AtestadoFrequencia.map(s => {
                                return diff_seconds(s.dt_entrada, s.dt_saida)
                            }).reduce((a, b) => a + b, 0)

                        }).reduce((a, b) => a + b, 0)),

                vara: s.Vara ? s.Vara.descricao : 'N/A',
                central: s.Entidade ? s.Entidade.nome : 'N/A'
            }
        });
        // //await db.sequelize.close();
        return listaProcessos;
    },



    async Create(payload) {
        try {

            let checkDados = checkDadosOrigatorios(payload);
            if (!checkDados.status)
                return checkDados;

            const Processo = await db.models.Processo.create({
                PrestadoreId: parseInt(payload.id_prestador),
                EntidadeId: payload.processo.id_central.value,
                VaraId: payload.processo.id_vara.value,
                nro_processo: payload.processo.nro_processo,
                nro_artigo_penal: payload.processo.nro_artigo_penal,
                pena_originaria_regime: parseInt(payload.processo.pena_originaria_regime),
                inciso: payload.processo.inciso,
                detalhamento: payload.processo.detalhamento,
                prd: payload.processo.prd,
                prd_descricao: payload.processo.prd ? payload.processo.prd_descricao : null,
                horas_cumprir: parseInt(payload.processo.horas_cumprir),
                possui_multa: payload.processo.prd ? payload.processo.possui_multa : false,
                valor_a_pagar: payload.processo.prd && payload.processo.possui_multa ? unformatCurrency(payload.processo.valor_a_pagar ?? '0') ?? 0 : 0,
                qtd_penas_anteriores: parseInt(payload.processo.qtd_penas_anteriores),
            });

            return { status: true, text: `Processo ${payload.processo.nro_processo} criado!` };
        } catch (error) {
            return { status: false, text: "Erro interno no servidor." };
        }


    },

    async Edit(payload) {
        try {

            let checkDados = checkDadosOrigatorios(payload);
            if (!checkDados.status)
                return checkDados;

            let Processo = await db.models.Processo.findByPk(payload.id);
            Processo.EntidadeId = payload.processo.id_central.value,
                Processo.VaraId = payload.processo.id_vara.value,
                Processo.nro_processo = payload.processo.nro_processo;
            Processo.nro_artigo_penal = payload.processo.nro_artigo_penal;
            Processo.pena_originaria_regime = parseInt(payload.processo.pena_originaria_regime);
            Processo.inciso = payload.processo.inciso;
            Processo.detalhamento = payload.processo.detalhamento;
            Processo.prd = payload.processo.prd;
            Processo.prd_descricao = payload.processo.prd ? payload.processo.prd_descricao : null;
            Processo.horas_cumprir = parseInt(payload.processo.horas_cumprir);
            Processo.possui_multa = payload.processo.prd ? payload.processo.possui_multa : false;
            Processo.valor_a_pagar = payload.processo.prd && payload.processo.possui_multa ? unformatCurrency(payload.processo.valor_a_pagar ?? '0') ?? 0 : 0;
            Processo.qtd_penas_anteriores = parseInt(payload.processo.qtd_penas_anteriores);
            await Processo.save().finally(() => {
                //db.sequelize.close();
            });
            // //await db.sequelize.close();

            return { status: true, text: `Processo ${Processo.nro_processo} salvo!` };
        } catch (error) {
            return { status: false, text: "Erro interno no servidor." };
        }

    },

    async GetUltimosArtigos() {

        try {
            const Processos = await db.models.Processo.findAll({
                where: {},
                order: [["updatedAt", "DESC"]],
                limit: 3
            });

            const listaArtigos = Processos.map(s => {
                return {
                    id: s.id,
                    nro_artigo_penal: s.nro_artigo_penal
                }
            });

            const artigos = listaArtigos?.map(objeto => objeto?.nro_artigo_penal).join(" ");
            
            if (artigos == null) {
                artigos = "Sem exemplo de artigos utilizados!";
            }

            return artigos;

        } catch (error) {
            return { status: false, text: `Erro interno no servidor. ${error}` };
        }

    },

    async GetRegistros(payload) {
        try {
            var id_prestador = payload.id;

            var Processos = await db.models.Processo.findAll({
                where: {
                    PrestadoreId: id_prestador
                }
            })

            var id_processo = Processos.map(s => s.id);

            const registros = await db.models.AtestadoFrequencia.findAll({
                include: [
                    {
                        model: db.models.Agendamento,
                        include: [
                            {
                                model: db.models.Tarefa,
                                include: [
                                    { model: db.models.Entidade }
                                ]
                            }
                        ],
                        where: {
                            ProcessoId: id_processo
                        }
                    }
                ],

            });

            const data = registros.map(s => {
                return {
                    id: s.id,
                    dt_entrada: s.dt_entrada.toLocaleString("pt-BR"),
                    dt_saida: s.dt_saida.toLocaleString("pt-BR"),
                    observacao: s.observacao,
                    total_horas: diff_hours(s.dt_entrada, s.dt_saida),
                    tarefa: s.Agendamento.Tarefa.titulo,
                    data_inicial: s.Agendamento.data_inicial,
                    horario_inicio: s.Agendamento.horario_inicio,
                    horario_fim: s.Agendamento.horario_fim,
                    entidade: s.Agendamento.Tarefa.Entidade.nome

                }
            });

            return { status: true, data: data };

        } catch (error) {
            return { status: false, text: "Erro interno no servidor." };
        }

    }



}