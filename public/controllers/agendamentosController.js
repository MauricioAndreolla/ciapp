const db = require('../config/database');
const { Op } = require("sequelize");

function diff_hours(dt2, dt1) {

    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= (60 * 60);
    return Math.abs(Math.round(diff));

}

module.exports = {

    async Create(payload) {

        try {

            if (payload.search.id_prestador.value == null || payload.search.id_prestador == '') {
                return { status: false, text: `Selecione o prestador` };
            } else if (payload.search.id_processo.value == null || payload.search.id_processo == '') {
                return { status: false, text: `Selecione o processo` };
            } else if (payload.search.id_processo.value == null || payload.search.id_tarefa == '') {
                return { status: false, text: `Selecione a tarefa` };
            } else if (payload.search.id_processo.value == null || payload.search.id_entidade == '') {
                return { status: false, text: `Selecione a instituição` };
            } else if (payload.agendamentos.agendamento_dias_semana.length <= 0) {
                return { status: false, text: `Selecione os dias da semana das tarefas` };
            }


            await db.sequelize.models.Agendamentos.create({

                data_inicial: payload.agendamentos.agendamento_dia_inicial,
                horario_inicio: payload.agendamentos.agendamento_horario_inicio,
                horario_fim: payload.agendamentos.agendamento_horario_fim,
                segunda: payload.agendamentos.agendamento_dias_semana.filter(s => s.value === 0).length > 0,
                terca: payload.agendamentos.agendamento_dias_semana.filter(s => s.value === 1).length > 0,
                quarta: payload.agendamentos.agendamento_dias_semana.filter(s => s.value === 2).length > 0,
                quinta: payload.agendamentos.agendamento_dias_semana.filter(s => s.value === 3).length > 0,
                sexta: payload.agendamentos.agendamento_dias_semana.filter(s => s.value === 4).length > 0,
                sabado: payload.agendamentos.agendamento_dias_semana.filter(s => s.value === 5).length > 0,
                domingo: payload.agendamentos.agendamento_dias_semana.filter(s => s.value === 6).length > 0,
                ProcessoId: payload.search.id_processo.value,
                TarefaId: payload.search.id_tarefa.value
            })

        } catch (error) {
            return { status: false, text: `Erro interno no servidor.` };
        }

        return { status: true, text: `Agendamento criado` };


    },

    async Edit(payload) {



        try {

            if (payload.search.id_prestador.value == null || payload.search.id_prestador == '') {
                return { status: false, text: `Selecione o prestador` };
            } else if (payload.search.id_processo.value == null || payload.search.id_processo == '') {
                return { status: false, text: `Selecione o processo` };
            } else if (payload.search.id_processo.value == null || payload.search.id_tarefa == '') {
                return { status: false, text: `Selecione a tarefa` };
            } else if (payload.search.id_processo.value == null || payload.search.id_entidade == '') {
                return { status: false, text: `Selecione a instituição` };
            } else if (payload.agendamentos.agendamento_dias_semana.length <= 0) {
                return { status: false, text: `Selecione os dias da semana das tarefas` };
            }


            let Agendamento = await db.sequelize.models.Agendamentos.findByPk(payload.agendamentos.id);



            Agendamento.data_inicial = payload.agendamentos.agendamento_dia_inicial,
                Agendamento.horario_inicio = payload.agendamentos.agendamento_horario_inicio,
                Agendamento.horario_fim = payload.agendamentos.agendamento_horario_fim,
                Agendamento.segunda = payload.agendamentos.agendamento_dias_semana.filter(s => s.value === 0).length > 0,
                Agendamento.terca = payload.agendamentos.agendamento_dias_semana.filter(s => s.value === 1).length > 0,
                Agendamento.quarta = payload.agendamentos.agendamento_dias_semana.filter(s => s.value === 2).length > 0,
                Agendamento.quinta = payload.agendamentos.agendamento_dias_semana.filter(s => s.value === 3).length > 0,
                Agendamento.sexta = payload.agendamentos.agendamento_dias_semana.filter(s => s.value === 4).length > 0,
                Agendamento.sabado = payload.agendamentos.agendamento_dias_semana.filter(s => s.value === 5).length > 0,
                Agendamento.domingo = payload.agendamentos.agendamento_dias_semana.filter(s => s.value === 6).length > 0,
                Agendamento.ProcessoId = payload.search.id_processo.value,
                Agendamento.TarefaId = payload.search.id_tarefa.value
            await Agendamento.save();



        } catch (error) {
            return { status: false, text: "Erro interno no servidor." };
        }

        return { status: true, text: `Agendamento Editado` };


    },

    async Delete(id) {
        let Agenda = {};
        try {
            Agendamento = await db.sequelize.models.Agendamentos.findByPk(id);
            await Agendamento.destroy();
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
                //ProcessoId: where,
            },
            include: [
                // {
                //     model: db.models.Processo,
                //     include: [
                //         { model: db.models.Instituicoes },
                //         { model: db.models.Prestadores },
                //         { model: db.models.Vara },
                //         { model: db.models.AtestadoFrequencia }]
                // },
                // { model: db.models.Tarefa }
            ],
        });

        return data.map(s => {
            let agendamentos = {
                id: s.id,
                agendamento_data_inicial: s.data_inicial,
                agendamento_horario_inicio: s.horario_inicio,
                agendamento_horario_fim: s.horario_fim,
                agendamento_dia_inicial: s.data_inicial,
                agendamento_dias_semana: {
                    domingo: s.domingo,
                    segunda: s.segunda,
                    terca: s.terca,
                    quarta: s.quarta,
                    quinta: s.quinta,
                    sexta: s.sexta,
                    sabado: s.sabado,
                },

                // processo_id: s.ProcessoId,
                // tarefa_id: s.TarefaId,
                // tarefa: s.Tarefa,
                // processo: {
                //     nro_processo: s.Processo.nro_processo,
                //     nro_artigo_penal: s.Processo.nro_artigo_penal,
                //     pena_originaria: s.Processo.pena_originaria,
                //     pena_originaria_regime: s.Processo.pena_originaria_regime,
                //     inciso: s.Processo.inciso,
                //     detalhamento: s.Processo.detalhamento,
                //     prd: s.Processo.prd,
                //     prd_descricao: s.Processo.prd_descricao,
                //     horas_cumprir: s.Processo.horas_cumprir,
                //     possui_multa: s.Processo.possui_multa,
                //     valor_a_pagar: s.Processo.valor_a_pagar,
                //     qtd_penas_anteriores: s.Processo.qtd_penas_anteriores,
                //     vara: s.Processo.Vara ? s.Processo.Vara.nome : '',
                //     nome_prestador: s.Processo.Prestadore.nome,
                //     imagem_prestador: s.Processo.Prestadore.image,
                //     horas_cumpridas: s.Processo.AtestadoFrequencia.map(s => {
                //         return diff_hours(s.dt_entrada, s.dt_saida)
                //     }).reduce((a, b) => a + b, 0)
                // }
            }
            return agendamentos;
        });
    },










































    async Registrar(payload) {
        try {

            var Agendamento = await db.sequelize.models.Agendamentos.findOne({
                where: {
                    id: payload.id_agendamento
                }
            });

            let processo = await db.sequelize.models.Processos.findByPk(Agendamento.ProcessoId);

            let total = diff_hours(new Date(payload.registro.data + " " + payload.registro.horario_entrada),new Date(payload.registro.data + " " + payload.registro.horario_saida) );

            if(total > (processo.horas_cumprir - total))
                return { status: false, text: `Quantidade de horas maior que o necessário` };

            let addRESULT = await db.sequelize.models.AtestadoFrequencia.create({
                dt_entrada: new Date(payload.registro.data + " " + payload.registro.horario_entrada),
                dt_saida: new Date(payload.registro.data + " " + payload.registro.horario_saida),
                observacao: payload.registro.observacao,
                AgendamentoId: payload.id_agendamento,
                ProcessoId: Agendamento.ProcessoId,
                TarefaId: Agendamento.TarefaId,
            });
        } catch (error) {
            return { status: false, text: "Erro interno no servidor. " + error.message };
        }

        return { status: true, text: `Registro Adicionado.` };

    }

}