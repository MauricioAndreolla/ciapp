
const db = require('../config/database');
const { Sequelize, Op } = require('sequelize');

module.exports = {

    async GetCidades(inputValue) {

        let where = {};

        if(inputValue) where = Sequelize.where(Sequelize.fn('UPPER', Sequelize.col('Cidade.nome')), {
            [Op.like]: `%${inputValue.toUpperCase()}%`
          })

        let data = await db.models.Cidade.findAll({
            include: db.models.UF,
            where: where,
            limit: 10
        });

        let formatedData = data.map(s => { return { value: s.id, label: `${s.nome} - ${s.UF.sigla}` } })
        return formatedData;

    }



}