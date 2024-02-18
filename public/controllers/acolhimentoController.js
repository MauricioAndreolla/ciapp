const db = require('../config/database');
const Sequelize = require('sequelize');


const formatDate = (dataHoraAtual)=>{
    const dia = dataHoraAtual.getDate().toString().padStart(2, '0');
    const mes = (dataHoraAtual.getMonth() + 1).toString().padStart(2, '0'); 
    const ano = dataHoraAtual.getFullYear();
    const hora = dataHoraAtual.getHours().toString().padStart(2, '0'); 
    const minutos = dataHoraAtual.getMinutes().toString().padStart(2, '0'); 
    
    const dataHoraFormatada = `${dia}/${mes}/${ano}, às ${hora}:${minutos}`;
    return dataHoraFormatada;
}

module.exports = {


    async GetEntrevistas(id_prestador) {

        let atendimentos = await db.models.Acolhimento.findAll(
            {
                where: {
                    PrestadoreId: id_prestador
                },
                include: [
                    {
                        model: db.models.Processo,
                    },
                    {
                        model: db.models.Prestador,
                    }
                ]
            }
        );

        var mappedValues = atendimentos.map(s => {
            return {
                id: s.id,
                prestador: s.Prestadore.nome,
                cpf: s.Prestadore.cpf,
                telefone: s.Prestadore.telefone2 ? s.Prestadore.telefone1 + " / " + s.Prestadore.telefone2 : s.Prestadore.telefone1,
                nro_processo: s.Processo.nro_processo,
                dt_agendamento: formatDate(s.dt_agendamento)
            }
        });
        return mappedValues;
    },

    async CreateAcolhimento({ acolhimento, id_prestador }) {
        try {

            let Prestadores = await db.models.Prestador.findOne({
                where: { id: id_prestador },
                include: [
                    {
                        model: db.models.Processo
                    }
                ]
            });

            let id_processo = Prestadores.Processos.length > 0 ? Prestadores.Processos[Prestadores.Processos.length - 1].id : null;

            if (id_processo == null) {
                return { status: false, text: `Prestador sem processo vinculado` };
            }


            if (acolhimento?.dt_agendada == null) {
                return { status: false, text: `Data de agendamento inválida` };
            }

            let checkData = await db.models.Acolhimento.findOne({
                where: {
                    PrestadoreId: id_prestador,
                    ProcessoId: id_processo,
                    dt_agendamento: acolhimento.dt_agendada
                }
            });

            if (checkData)
                return { status: false, text: `Já existe um agendamento nessa data` };



            let result = await db.models.Acolhimento.create({
                PrestadoreId: id_prestador,
                ProcessoId: id_processo,
                dt_agendamento: acolhimento.dt_agendada
            }).finally(() => {
                //db.sequelize.close();
            });
            // //await db.sequelize.close();
            return { status: true, text: "Entrevista cadastrada com sucesso!" }

        } catch (error) {
            return { status: false, text: "Erro ao salvar registro: " + error };
        }
    },

    async Delete(id) {
        try {

            let atendimento = await db.models.Acolhimento.findOne({
                where: {
                    id: id
                }
            });

            if (atendimento) {
                await atendimento.destroy();
                return { status: true, text: "Registro removido com sucesso!" }
            }
            return { status: true, text: "Registro não encontrado!" }


        } catch (error) {
            return { status: false, text: "Erro ao deletar registro: " + error };
        }
    }

}