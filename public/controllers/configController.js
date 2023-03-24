const db = require('../models/indexInternal');
const Database = require('../config/database')
const Encrypt = require('../utils/encrypt')


module.exports = {
    async GetConfig() {

        let config = await db.DbConfig.findOne();

        return config.dataValues;

    },

    async SetConfig(config) {

        try {


            let existConfig = await db.DbConfig.findOne();

            if (existConfig) {

                existConfig.dialet = config.dialet;
                existConfig.host = config.host;
                existConfig.port = config.port;
                existConfig.username = config.username;
                if (existConfig.password != config.password) {
                    let encriptPassword = await Encrypt.encriptData(config.password);
                    existConfig.password = encriptPassword;
                }

                await existConfig.save();

            }
            else {
                let encriptPassword = await Encrypt.encriptData(config.password);
                await db.DbConfig.create({
                    dialet: config.dialet,
                    host: config.host,
                    port: config.port,
                    username: config.username,
                    password: encriptPassword,
                });
            }

            try {

                let testConnection = await Database.ConnectExternalDatabase();
                if (!testConnection.status)
                    return { status: false, text: "Não foi possível conectar na base de dados, por favor verifique as informações inseridas." };

                //Init Database


                let checkUser = await Database.models.Usuario.findOne({
                    where: {
                        usuario: "root"
                    }
                });

                if (!checkUser) {
                    const { hash } = require('bcryptjs');
                    await Database.models.Usuario.create({
                        nome: 'root',
                        usuario: 'root',
                        senha: await hash("1234", 8),
                    });
                }



            } catch (error) {
                return { status: false, text: "Não foi possível conectar na base de dados, por favor verifique as informações inseridas." };
            }



        } catch (error) {
            return { status: false, text: "Erro interno no servidor: " + error };
        }

        return { status: true, text: `Configuração salva!` };
    }
}