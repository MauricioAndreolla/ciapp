const db = require('../config/database');
const { Op } = require("sequelize");
const { diff_hours } = require('../utils/utils')


module.exports = {


    async Create(payload) {

        try {

            payload.agendamento.map(element => {
                if (element.processo == null || element.processo == '') {
                    return { status: false, text: `Selecione o processo` };
                } else if (element.tarefa == null || element.tarefa == '') {
                    return { status: false, text: `Selecione a tarefa` };
                } else if (element.entidade == null || element.entidade == '') {
                    return { status: false, text: `Selecione a instituição` };
                } else if (element.agendamento_dias_semana.length <= 0) {
                    return { status: false, text: `Selecione os dias da semana das tarefas` };
                }
            });


            const agendamentos = payload.agendamento.map(agendamento => {
                return ({
                    data_inicial: agendamento.agendamento_dia_inicial,
                    data_final: agendamento.agendamento_dia_final,
                    horario_inicio: agendamento.agendamento_horario_inicio,
                    horario_fim: agendamento.agendamento_horario_fim,
                    segunda: agendamento.agendamento_dias_semana.filter(s => s.value === 0).length > 0,
                    terca: agendamento.agendamento_dias_semana.filter(s => s.value === 1).length > 0,
                    quarta: agendamento.agendamento_dias_semana.filter(s => s.value === 2).length > 0,
                    quinta: agendamento.agendamento_dias_semana.filter(s => s.value === 3).length > 0,
                    sexta: agendamento.agendamento_dias_semana.filter(s => s.value === 4).length > 0,
                    sabado: agendamento.agendamento_dias_semana.filter(s => s.value === 5).length > 0,
                    domingo: agendamento.agendamento_dias_semana.filter(s => s.value === 6).length > 0,
                    ProcessoId: agendamento.processo,
                    TarefaId: agendamento.tarefa
                })
            })


            await db.models.Agendamento.bulkCreate(agendamentos).finally(() => {
                db.sequelize.close();
            });
            // await db.sequelize.close();
        } catch (error) {
            return { status: false, text: `Erro interno no servidor. ${error}` };
        }

        return { status: true, text: `Agendamento criado` };


    },

    async Edit(payload) {



        try {



            payload.agendamento.forEach(async (payload) => {
                if (payload.processo == null || payload.processo == '') {
                    return { status: false, text: `Selecione o processo` };
                } else if (payload.tarefa == null || payload.tarefa == '') {
                    return { status: false, text: `Selecione a tarefa` };
                } else if (payload.entidade == null || payload.entidade == '') {
                    return { status: false, text: `Selecione a instituição` };
                } else if (payload.agendamento_dias_semana.length <= 0) {
                    return { status: false, text: `Selecione os dias da semana das tarefas` };
                }

                let Agendamento = await db.models.Agendamento.findByPk(payload.id);

                Agendamento.data_inicial = payload.agendamento_dia_inicial,
                    Agendamento.data_final = payload.agendamento_dia_final,
                    Agendamento.data_final = payload.agendamento_dia_final,
                    Agendamento.horario_inicio = payload.agendamento_horario_inicio,
                    Agendamento.horario_fim = payload.agendamento_horario_fim,
                    Agendamento.segunda = payload.agendamento_dias_semana.filter(s => s.value === 0).length > 0,
                    Agendamento.terca = payload.agendamento_dias_semana.filter(s => s.value === 1).length > 0,
                    Agendamento.quarta = payload.agendamento_dias_semana.filter(s => s.value === 2).length > 0,
                    Agendamento.quinta = payload.agendamento_dias_semana.filter(s => s.value === 3).length > 0,
                    Agendamento.sexta = payload.agendamento_dias_semana.filter(s => s.value === 4).length > 0,
                    Agendamento.sabado = payload.agendamento_dias_semana.filter(s => s.value === 5).length > 0,
                    Agendamento.domingo = payload.agendamento_dias_semana.filter(s => s.value === 6).length > 0,
                    Agendamento.ProcessoId = payload.processo.id,
                    Agendamento.TarefaId = payload.tarefa.id
                await Agendamento.save().finally(() => {
                    db.sequelize.close();
                });
                // await db.sequelize.close();
            });





        } catch (error) {
            return { status: false, text: `Erro interno no servidor. ${error}` };
        }

        return { status: true, text: `Agendamento Editado` };


    },

    async Delete(id) {
        try {
            Agendamento = await db.models.Agendamento.findByPk(id);
            await Agendamento.destroy().finally(() => {
                db.sequelize.close();
            });
            // await db.sequelize.close();
        } catch (error) {
            return { status: false, text: "Erro interno no servidor." };
        }

        return { status: true, text: `Agendamento removido!` };
    },

    async GetAgendamentos(search) {

        let where = {};
        let someAttributes = {};

        if (search) {
            if (search.processo) {
                where.id = search.processo;
            }

        }


        const data = await db.models.Agendamento.findAll({
            where: {
                ativo: true,
            },
            include: [
                {
                    model: db.models.Processo,
                    include: {
                        model: db.models.Entidade,
                    }
                },
                {
                    model: db.models.Tarefa,
                    where: {
                        status: true
                    }
                }
            ],
        }).finally(() => {
            db.sequelize.close();
        });
    


        var mappedValues = data.map(s => {
            let agendamentos = {
                id: s.id,
                agendamento_horario_inicio: s.horario_inicio,
                agendamento_horario_fim: s.horario_fim,
                agendamento_dia_inicial: s.data_inicial,
                agendamento_dia_final: s.data_final,
                agendamento_dias_semana: [
                    s.segunda ? { value: 0, label: "Segunda-feira" } : null,
                    s.terca ? { value: 1, label: "Terça-feira" } : null,
                    s.quarta ? { value: 2, label: "Quarta-feira" } : null,
                    s.quinta ? { value: 3, label: "Quinta-feira" } : null,
                    s.sexta ? { value: 4, label: "Sexta-feira" } : null,
                    s.sabado ? { value: 5, label: "Sábado" } : null,
                    s.domingo ? { value: 6, label: "Domingo" } : null,
                ].filter(s => s !== null),

                tarefa: {
                    id: s.Tarefa.id,
                    titulo: s.Tarefa.titulo,
                    descricao: s.Tarefa.descricao,
                    status: s.Tarefa.status
                },
                processo: {
                    id: s.Processo.id,
                    nro_processo: s.Processo.nro_processo,
                    nro_artigo_penal: s.Processo.nro_artigo_penal,
                    pena_originaria: s.Processo.pena_originaria,
                    pena_originaria_regime: s.Processo.pena_originaria_regime,
                    inciso: s.Processo.inciso,
                    detalhamento: s.Processo.detalhamento,
                    prd: s.Processo.prd,
                    prd_descricao: s.Processo.prd_descricao,
                    horas_cumprir: s.Processo.horas_cumprir,
                    possui_multa: s.Processo.possui_multa,
                    valor_a_pagar: s.Processo.valor_a_pagar,
                    qtd_penas_anteriores: s.Processo.qtd_penas_anteriores,
                    // nome_prestador: s.Processo.Prestadore.nome,
                    // vara: s.Processo.Vara ? s.Processo.Vara.descricao : '',
                    // imagem_prestador: s.Processo.Prestadore.image,
                    // horas_cumpridas: s.Processo.AtestadoFrequencia.map(s => {
                    //     return diff_hours(s.dt_entrada, s.dt_saida)
                    // }).reduce((a, b) => a + b, 0)
                },
                entidade: {
                    id: s.Processo.Entidade.id,
                    nome: s.Processo.Entidade.nome,
                    cnpj: s.Processo.Entidade.cnpj,
                    email: s.Processo.Entidade.email,
                    telefone1: s.Processo.Entidade.telefone1,
                    telefone2: s.Processo.Entidade.telefone2
                }
            }
            return agendamentos;
        });

        // await db.sequelize.close();

        return mappedValues;
    },

    async GetAgendamentosEntidade(search) {

        let where = {

        };
        let someAttributes = {};

        if (search) {
            if (search.processo) {
                where.id = search.processo;
            }

            if (search.agendamento) {
                where.id = search.agendamento;
            }
        }

        const literalSQL = db.dialet === 0 ? 'SUM(TIME_TO_SEC(TIMEDIFF(`AtestadoFrequencia`.`dt_saida`, `AtestadoFrequencia`.`dt_entrada`))/3600)' : "SUM(strftime('%s', AtestadoFrequencia.dt_saida) - strftime('%s', AtestadoFrequencia.dt_entrada))/3600";

        const data = await db.models.Agendamento.findAll({
            where: {
                ativo: true
            },
            attributes: [
                'id',
                'horario_inicio',
                'horario_fim',
                'data_inicial',
                'data_final',
                'segunda',
                'terca',
                'quarta',
                'quinta',
                'sexta',
                'sabado',
                'domingo',
                [db.sequelize.literal(literalSQL), 'horas_cumpridas'],
            ],
            include: [
                {
                    model: db.models.Processo,
                    include: [
                        { model: db.models.Entidade },
                        { model: db.models.Prestador },
                        { model: db.models.Vara },
                    ]
                },
                {
                    model: db.models.Tarefa,
                    where: {
                        status: true
                    }
                },
                { model: db.models.AtestadoFrequencia }
            ],
            group: [
                'Agendamento.id',
                'Agendamento.horario_inicio',
                'Agendamento.horario_fim',
                'Agendamento.data_inicial',
                'Agendamento.data_final',
                'Agendamento.segunda',
                'Agendamento.terca',
                'Agendamento.quarta',
                'Agendamento.quinta',
                'Agendamento.sexta',
                'Agendamento.sabado',
                'Agendamento.domingo',
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
            let agendamentos = {
                id: s.id,
                agendamento_horario_inicio: s.horario_inicio,
                agendamento_horario_fim: s.horario_fim,
                agendamento_dia_inicial: s.data_inicial,
                agendamento_dia_final: s.data_final,
                agendamento_dias_semana: {
                    domingo: s.domingo,
                    segunda: s.segunda,
                    terca: s.terca,
                    quarta: s.quarta,
                    quinta: s.quinta,
                    sexta: s.sexta,
                    sabado: s.sabado,
                },

                tarefa: {
                    id: s.Tarefa.id,
                    titulo: s.Tarefa.titulo,
                    descricao: s.Tarefa.descricao,
                    status: s.Tarefa.status
                },
                processo: {
                    id: s.Processo.id,
                    nro_processo: s.Processo.nro_processo,
                    nro_artigo_penal: s.Processo.nro_artigo_penal,
                    pena_originaria: s.Processo.pena_originaria,
                    pena_originaria_regime: s.Processo.pena_originaria_regime,
                    inciso: s.Processo.inciso,
                    detalhamento: s.Processo.detalhamento,
                    prd: s.Processo.prd,
                    prd_descricao: s.Processo.prd_descricao,
                    horas_cumprir: s.Processo.horas_cumprir,
                    possui_multa: s.Processo.possui_multa,
                    valor_a_pagar: s.Processo.valor_a_pagar,
                    qtd_penas_anteriores: s.Processo.qtd_penas_anteriores,
                    nome_prestador: s.Processo.Prestadore.nome,
                    imagem_prestador: s.Processo.Prestadore.image,
                    vara: s.Processo.Vara ? s.Processo.Vara.descricao : '',
                    horas_cumpridas: s.AtestadoFrequencia.map(s => {
                        return diff_hours(s.dt_entrada, s.dt_saida)
                    }).reduce((a, b) => a + b, 0)
                },
                entidade: {
                    id: s.Processo.Entidade.id,
                    nome: s.Processo.Entidade.nome,
                    cnpj: s.Processo.Entidade.cnpj,
                    email: s.Processo.Entidade.email,
                    telefone1: s.Processo.Entidade.telefone1,
                    telefone2: s.Processo.Entidade.telefone2
                },

                atestadoFrequencia: s.AtestadoFrequencia.map(e => {
                    return ({
                        dt_entrada: new Date(e.dt_entrada).toLocaleTimeString('pt-BR'),
                        dt_saida:  new Date(e.dt_saida).toLocaleTimeString('pt-BR'),
                        observacao: e.observacao,
                        agendamentoId:  e.AgendamentoId,
                    })
                })
            }
            return agendamentos;
        });

        // await db.sequelize.close();
        return mappedValues;
    },

    async Registrar(payload) {
        try {

            var Agendamento = await db.models.Agendamento.findOne({
                where: {
                    id: payload.id_agendamento
                }
            });

            let processo = await db.models.Processo.findByPk(Agendamento.ProcessoId);

            let total = diff_hours(new Date(payload.registro.data + " " + payload.registro.horario_entrada), new Date(payload.registro.data + " " + payload.registro.horario_saida));

            if (total > (processo.horas_cumprir - total))
                return { status: false, text: `Quantidade de horas maior que o necessário` };

            let addRESULT = await db.models.AtestadoFrequencia.create({
                dt_entrada: new Date(payload.registro.data + " " + payload.registro.horario_entrada),
                dt_saida: new Date(payload.registro.data + " " + payload.registro.horario_saida),
                observacao: payload.registro.observacao,
                AgendamentoId: payload.id_agendamento
            }).finally(() => {
                db.sequelize.close();
            });

            // await db.sequelize.close();
        } catch (error) {
            return { status: false, text: "Erro interno no servidor. " + error.message };
        }

        return { status: true, text: `Registro Adicionado.` };

    }

}