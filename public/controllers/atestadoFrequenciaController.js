const db = require('../config/database');
const { Op } = require("sequelize");

function diff_hours(dt2, dt1) {

    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= (60 * 60);
    return Math.abs(Math.round(diff));

}

module.exports = {

    async GetAtestadoFrequenciaRelatorio(search) {

        let where = {};
        let someAttributes = {};

        if (search) {
            if (search.processo) {
                where.id = search.processo;
            }

            if (search.agendamento) {
                where.AgendamentoId = search.agendamento;
            }
        }

        const literalSQL = db.dialet === 0 ? 'SUM(TIME_TO_SEC(TIMEDIFF(`AtestadoFrequencia`.`dt_saida`, `AtestadoFrequencia`.`dt_entrada`))/3600)' : "SUM(strftime('%s', AtestadoFrequencia.dt_saida) - strftime('%s', AtestadoFrequencia.dt_entrada))/3600";


        const data = await db.models.AtestadoFrequencia.findAll({
            attributes: [
                'id',
                'dt_entrada',
                'dt_saida',
                'observacao',
                'agendamentoid',
                [db.sequelize.literal(literalSQL), 'horas_cumpridas'],
            ],
            where: where,
            include: [
                {
                    model: db.models.Agendamento,
                    include: [
                        {
                            model: db.models.Processo,
                            include: [
                                { model: db.models.Prestador },
                                { model: db.models.Entidade }
                            ]
                        },
                        {
                            model: db.models.Tarefa,
                        }
                    ]
                }
            ],
            group: [
                'AtestadoFrequencia.id',
                'AtestadoFrequencia.dt_entrada',
                'AtestadoFrequencia.dt_saida',
                'AtestadoFrequencia.observacao',
                'Processo.id',
                'Tarefa.id',
                'Tarefa.titulo',
                'Tarefa.descricao',
                'Tarefa.status'
            ],
            having: {
                [Op.or]: [
                    { 'horas_cumpridas': null },
                    db.sequelize.literal('`horas_cumpridas` < `Processo`.`horas_cumprir`')
                ]
            }
        }).finally(() => {
            db.sequelize.close();
        });

        var mappedValues = data.map(s => {
            return {
                nome: s.Agendamento.Processo.Prestadore.nome,
                entidade: s.Agendamento.Processo.Entidade.nome,
                titulo: s.Agendamento.Tarefa.titulo,
                processo: {
                    nro_processo: s.Agendamento.Processo.nro_processo,
                    horas_cumpridas: s.AtestadoFrequencia.map(s => {
                        return diff_hours(s.dt_entrada, s.dt_saida)
                    }).reduce((a, b) => a + b, 0)
                },
                dt_entrada: new Date(s.dt_entrada),
                dt_saida: new Date(s.dt_saida),
                observacao: s.observacao,

            }
        });
        return mappedValues;
    },

    async GetAtestadoFrequencia(search) {

        let where = {};
        let someAttributes = {};

        const data = await db.models.AtestadoFrequencia.findAll({
            where: { AgendamentoId: search?.id_agendamento },
            include: [
                {
                    model: db.models.Agendamento,
                    include: [
                        { model: db.models.Processo },
                        { model: db.models.Tarefa }
                    ]
                }
            ],
        }).finally(() => {
            db.sequelize.close();
        });

        var mappedValues = data.map(s => {
            let atestado = {
                id: s.id,
                dt_entrada: new Date(s.dt_entrada).toLocaleDateString('pt-BR'),
                dt_saida: new Date(s.dt_saida).toLocaleDateString('pt-BR'),
                observacao: s.observacao,
                AgendamentoId: s.AgendamentoId,

                agendamento: {
                    id: s.Agendamento.id,
                    agendamento_horario_inicio: s.Agendamento.horario_inicio,
                    agendamento_horario_fim: s.Agendamento.horario_fim,
                    agendamento_dia_inicial: s.Agendamento.data_inicial,
                    agendamento_dia_final: s.Agendamento.data_final,
                    agendamento_dias_semana: [
                        s.segunda ? { value: 0, label: "Segunda-feira" } : null,
                        s.terca ? { value: 1, label: "Terça-feira" } : null,
                        s.quarta ? { value: 2, label: "Quarta-feira" } : null,
                        s.quinta ? { value: 3, label: "Quinta-feira" } : null,
                        s.sexta ? { value: 4, label: "Sexta-feira" } : null,
                        s.sabado ? { value: 5, label: "Sábado" } : null,
                        s.domingo ? { value: 6, label: "Domingo" } : null,
                    ].filter(s => s !== null),
                },

                tarefa: {
                    id: s.Agendamento.Tarefa.id,
                    titulo: s.Agendamento.Tarefa.titulo,
                    descricao: s.Agendamento.Tarefa.descricao,
                    status: s.Agendamento.Tarefa.status
                },

                processo: {
                    id: s.Agendamento.Processo.id,
                    nro_processo: s.Agendamento.Processo.nro_processo,
                    nro_artigo_penal: s.Agendamento.Processo.nro_artigo_penal,
                    pena_originaria: s.Agendamento.Processo.pena_originaria,
                    pena_originaria_regime: s.Agendamento.Processo.pena_originaria_regime,
                    inciso: s.Agendamento.Processo.inciso,
                    detalhamento: s.Agendamento.Processo.detalhamento,
                    prd: s.Agendamento.Processo.prd,
                    prd_descricao: s.Agendamento.Processo.prd_descricao,
                    horas_cumprir: s.Agendamento.Processo.horas_cumprir,
                    possui_multa: s.Agendamento.Processo.possui_multa,
                    valor_a_pagar: s.Agendamento.Processo.valor_a_pagar,
                    qtd_penas_anteriores: s.Agendamento.Processo.qtd_penas_anteriores,
                }



            }
            return atestado;
        });
        return mappedValues;
    },


}

