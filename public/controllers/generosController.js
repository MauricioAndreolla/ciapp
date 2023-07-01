const db = require('../config/database');
const Sequelize = require('sequelize');


module.exports = {


    async GetGeneros() {

        let generos = await db.models.Genero.findAll();

        return generos.map(s => s.dataValues);
    },

    async CreateGenero(genero) {
        try {

            let result = await db.models.Genero.create({
                descricao: genero.descricao,
            }).finally(() => {
                //db.sequelize.close();
              });
            // //await db.sequelize.close();
            return { status: true, text: "Gênero cadastrado com sucesso!" }

        } catch (error) {
            return { status: false, text: "Erro ao salvar registro: " + error };
        }
    }

}