
const db = require('../config/database');
const { Sequelize, Op } = require('sequelize');

module.exports = {

    async GetCidades(payload) {

        let where = {};
        if (payload.inputValue) {
            where[Op.or] = [
                Sequelize.where(Sequelize.fn('UPPER', Sequelize.col('Cidade.nome')), {
                    [Op.like]: `%${payload.inputValue.toUpperCase()}%`
                })
            ];
        }
        else{
            if (payload.id_cidade && payload.id_cidade > 0) {
                if (!where[Op.or]) {
                    where[Op.or] = [];
                }
                where[Op.or].push({ id: payload.id_cidade });
            }
        }

       

        let data = await db.models.Cidade.findAll({
            include: db.models.UF,
            where: where,
            limit: 10
        }).finally(() => {
            db.sequelize.close();
          });

        let formatedData = data.map(s => { return { value: s.id, label: `${s.nome} - ${s.UF.sigla}` } })
        // await db.sequelize.close();
       
        return formatedData;

    },


    async GetCidadeById(id) {

        let data = await db.models.Cidade.findAll({

            where: { id: id },
            include: db.models.UF,
            limit: 10
        }).finally(() => {
            db.sequelize.close();
          });
      
        let formatedData = data.map(s => { return { value: s.id, label: `${s.nome} - ${s.UF.sigla}` } });

        // await db.sequelize.close();
        
        return formatedData;

    }



}