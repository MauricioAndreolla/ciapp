const db = require('../config/database');
const Sequelize = require('sequelize');


module.exports = {


    async GetAtendimentos(id_prestador) {

        let nomePrestador =  await db.models.Prestador.findOne(
            {
                attributes: ['nome'],
                where:{
                    id: id_prestador
                },
             
            });

        let atendimentos = await db.models.RegistroAtendimento.findAll(
            {
                where: {
                    PrestadoreId: id_prestador
                }
            }
        );

        return {
            nomePrestador: nomePrestador.dataValues,
            atendimentos: atendimentos.map(s => s.dataValues)
        }
    },

    async CreateAtendimento(params) {
        try {

            let result = await db.models.RegistroAtendimento.create({
                descricao: params.atendimento.descricao,
                dt_registro: params.atendimento.dt_registro,
                PrestadoreId: params.id_prestador
            }).finally(() => {
                //db.sequelize.close();
              });
            // //await db.sequelize.close();
            return { status: true, text: "Atendimento cadastrado com sucesso!" }

        } catch (error) {
            return { status: false, text: "Erro ao salvar registro: " + error };
        }
    },

    async SalvarAtendimento(params) {
        try {

            let atendimento = await db.models.RegistroAtendimento.findOne({
                where:{
                    id: params.id
                }
            });

            if(atendimento){
                atendimento.descricao = params.descricao;
                atendimento.dt_registro = params.dt_registro;
                await atendimento.save();
                return { status: true, text: "Atendimento salvo com sucesso!" }
            }
            return { status: true, text: "Atendimento não encontrado!" }
       

        } catch (error) {
            return { status: false, text: "Erro ao salvar registro: " + error };
        }
    },

    
    async DeleteAtendimento(id) {
        try {

            let atendimento = await db.models.RegistroAtendimento.findOne({
                where:{
                    id: id
                }
            });

            if(atendimento){
                await atendimento.destroy();
                return { status: true, text: "Atendimento removido com sucesso!" }
            }
            return { status: true, text: "Atendimento não encontrado!" }
       

        } catch (error) {
            return { status: false, text: "Erro ao salvar registro: " + error };
        }
    }

}