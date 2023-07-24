const db = require('../config/database');
const Sequelize = require('sequelize');

module.exports = {

    async GetOrigens(payload) {

        let where = {};

        if (payload && payload.filter && payload.filter.length > 0) {
            where = {
                id: {
                    [Sequelize.Op.in]:  payload.filter
                }
            }

        }

        let origens = await db.models.Origem.findAll({
            where: where
        }).finally(() => {
            //db.sequelize.close();
          });

        var mappedValues = origens.map(s => s.dataValues);
        // //await db.sequelize.close();
        return mappedValues
    },

    async CreateOrigem(payload) {
     
        try {

            let result = await db.models.Origem.create({
                descricao: payload.descricao,
                observacao: payload.observacao,
            }).finally(() => {
                //db.sequelize.close();
              });
            // //await db.sequelize.close();
            return { status: true, text: "Origem cadastrada com sucesso!" }

        } catch (error) {
            return { status: false, text: "Erro ao salvar registro: " + error };
        }
    }

}