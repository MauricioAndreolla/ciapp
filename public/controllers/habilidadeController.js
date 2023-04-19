const db = require('../config/database');
const Sequelize = require('sequelize');


module.exports = {

    async GetHabilidades(payload) {

        let where = {};

        if (payload && payload.filter && payload.filter.length > 0) {
            where = {
                id: {
                    [Sequelize.Op.in]:  payload.filter
                }
            }

        }

        let habilidades = await db.models.Habilidade.findAll({
            where: where
        }).finally(() => {
            db.sequelize.close();
          });

        var mappedValues = habilidades.map(s => s.dataValues);
        // await db.sequelize.close();
        return mappedValues
    },

    async CreateHabilidade(payload) {
        try {

            let result = await db.models.Habilidade.create({
                descricao: payload.descricao,
                observacao: payload.observacao,
            }).finally(() => {
                db.sequelize.close();
              });
            // await db.sequelize.close();
            return { status: true, text: "Habilidade cadastrada com sucesso!" }

        } catch (error) {
            return { status: false, text: "Erro ao salvar registro: " + error };
        }
    }

}