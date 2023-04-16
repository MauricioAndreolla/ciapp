const db = require('../config/database');
const Sequelize = require('sequelize');


module.exports = {

    async GetCursos(payload) {

        let where = {};

        if (payload && payload.filter && payload.filter.length > 0) {
            where = {
                id: {
                    [Sequelize.Op.in]:  payload.filter
                }
            }

        }

        let cursos = await db.models.Curso.findAll({
            where: where
        });
        await db.sequelize.close();
        return cursos.map(s => s.dataValues);
    },

    async CreateCurso(payload) {
        try {

            let result = await db.models.Curso.create({
                descricao: payload.descricao,
                observacao: payload.observacao,
            });
            await db.sequelize.close();
            return { status: true, text: "Curso/ especialização cadastrada com sucesso!" }

        } catch (error) {
            return { status: false, text: "Erro ao salvar registro: " + error };
        }
    }

}