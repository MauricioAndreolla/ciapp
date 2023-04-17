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


            await db.models.Agendamento.bulkCreate(agendamentos)
            await db.sequelize.close();
        } catch (error) {
            return { status: false, text: `Erro interno no servidor. ${error}` };
        }

        return { status: true, text: `Agendamento criado` };


    },

    async Edit(payload) {

        
        
        try {
            
        
            
            payload.agendamento.forEach( async (payload) => {
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
                await Agendamento.save();
                await db.sequelize.close();
            });





        } catch (error) {
            return { status: false, text: `Erro interno no servidor. ${error}` };
        }

        return { status: true, text: `Agendamento Editado` };


    },

    async Delete(id) {
        try {
            Agendamento = await db.models.Agendamento.findByPk(id);
            await Agendamento.destroy();
            await db.sequelize.close();
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
            // where: {
            //     ProcessoId: where,
            // },
            include: [
                {
                    model: db.models.Processo,
                    include: {
                        model: db.models.Entidade,
                    }
                },
                { model: db.models.Tarefa }
            ],
        });

       await db.sequelize.close();

        return data.map(s => {
            let agendamentos = {
                id: s.id,
                agendamento_horario_inicio: s.horario_inicio,
                agendamento_horario_fim: s.horario_fim,
                agendamento_dia_inicial: s.data_inicial,
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
                AgendamentoId: payload.id_agendamento,
                ProcessoId: Agendamento.ProcessoId,
                TarefaId: Agendamento.TarefaId,
            });

            await db.sequelize.close();
        } catch (error) {
            return { status: false, text: "Erro interno no servidor. " + error.message };
        }

        return { status: true, text: `Registro Adicionado.` };

    }

}