const db = require('../config/database');
const Sequelize = require('sequelize');


module.exports = {

    async GetVaras(payload) {

        let where = {};

        if (payload && payload.filter && payload.filter.length > 0) {
            where = {
                id: {
                    [Sequelize.Op.in]:  payload.filter
                }
            }

        }

        let varas = await db.models.Vara.findAll({
            where: where
        });

        return varas.map(s => s.dataValues);
    },

    async CreateVara(descricao) {
        try {

            let result = await db.models.Vara.create({
                descricao: descricao
            });

            return { status: true, text: "Vara judicial cadastrada com sucesso!" }

        } catch (error) {
            return { status: false, text: "Erro ao salvar registro: " + error };
        }
    }

}