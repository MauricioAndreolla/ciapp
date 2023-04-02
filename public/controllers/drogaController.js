const db = require('../config/database');
const Sequelize = require('sequelize');


module.exports = {



    async GetDrogaInfo(id){

        let droga = await db.models.Droga.findByPk(id);
        return droga ? droga.dataValues : {};

    },

    async GetDrogas(payload) {

        let where = {};

        if (payload && payload.filter && payload.filter.length > 0) {
            where = {
                id: {
                    [Sequelize.Op.in]:  payload.filter
                }
            }

        }

        let drogas = await db.models.Droga.findAll({
            where: where
        });

        return drogas.map(s => s.dataValues);
    },

    async CreateDroga(payload) {
        try {

            let result = await db.models.Droga.create({
                nome: payload.nome,
                observacao: payload.observacao,
            });

            return { status: true, text: "Droga cadastrada com sucesso!" }

        } catch (error) {
            return { status: false, text: "Erro ao salvar registro: " + error };
        }
    }

}