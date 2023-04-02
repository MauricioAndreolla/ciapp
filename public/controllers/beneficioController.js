const db = require('../config/database');
const Sequelize = require('sequelize');


module.exports = {

    async GetBeneficios(payload) {

        let where = {};

        if (payload && payload.filter && payload.filter.length > 0) {
            where = {
                id: {
                    [Sequelize.Op.in]:  payload.filter
                }
            }

        }

        let beneficios = await db.models.Beneficio.findAll({
            where: where
        });

        return beneficios.map(s => s.dataValues);
    },

    async CreateBeneficio(payload) {
        try {

            let result = await db.models.Beneficio.create({
                nome: payload.nome,
                observacao: payload.observacao,
            });

            return { status: true, text: "Beneficio cadastrado com sucesso!" }

        } catch (error) {
            return { status: false, text: "Erro ao salvar registro: " + error };
        }
    }

}