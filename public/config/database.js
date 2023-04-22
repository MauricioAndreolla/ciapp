const Sequelize = require('sequelize');
const dbInternal = require('../models/indexInternal');
const Encrypt = require('../utils/encrypt');
const mysql = require('mysql2/promise');
const { modo } = require('../utils/appMode');

class Database {

    static dialet = null;
    static databaseName = `ciapp${modo === 0 ? "Central" : "Entidade"}`;
    static username = "";
    static password = "";
    static host = "";
    static port = "";
    static connected = false;
    static sequelize = null;
    static models = {};

    static async ConnectDatabase() {

        let config = await dbInternal.DbConfig.findOne();
        if (!config) return null;
        this.dialet = config.dialet;
        if (config.dialet === 0) {
            let decriptPassword = await Encrypt.dencriptData(config.password);

            const connection = await mysql.createConnection({ host: config.host, port: config.port, user: config.username, password: decriptPassword });
            await connection.query(`CREATE DATABASE IF NOT EXISTS \`${this.databaseName}\`;`);

            this.username = config.username;
            this.password = decriptPassword;
            this.host = config.host;
            this.port = config.port;
            this.sequelize = new Sequelize(this.databaseName, this.username, this.password, {
                host: this.host,
                port: this.port,
                dialect: 'mysql',
                createDatabase: true,
                pool: {
                    max: 100, 
                    min: 0,
                    acquire: 30000,
                    idle: 10000
                }
            });
        }
        else if (this.dialet === 1) {
            this.sequelize = new Sequelize({
                dialect: 'sqlite',
                pool: {
                    max: 100, 
                    min: 0,
                    acquire: 30000,
                    idle: 10000
                },
                storage: `C://ciapp/database/${modo === 0 ? "central" : "entidade"}/${this.databaseName}.sqlite`,
            });
        }

        return this.sequelize;

    }
    static async ConnectExternalDatabase(force = false) {
        let resultText = "Conectando com base externa de dados...\n";
        try {
            let externalDatabase = await this.ConnectDatabase();

            await externalDatabase.authenticate();
            resultText += "Conexão estabelecida com sucesso.\n";

            let bind = this.BindModels();

            resultText += `${bind.text}.\n`;

            if (!bind.status)
                return { status: false, text: resultText };

            await externalDatabase.sync({ force: force });
            resultText += "Tabelas sincronizadas com sucesso.\n";
            this.connected = true;
            return { status: true, text: resultText };

        } catch (error) {
            resultText += "ERRO AO CONECTAR NA BASE EXTERNA: " + error;
            return { status: false, text: resultText };
        }

    }

    static async CheckConnectionDatabase() {
        try {
            let externalDatabase = await this.ConnectDatabase();
            await externalDatabase.authenticate();
            return { status: true, text: "Conexão estabelecida com sucesso." };
        } catch (error) {
            return { status: false, text: "ERRO AO CONECTAR NA BASE EXTERNA: " + error };
        }
    }

    static BindModels() {
        try {
            var models = require('../models/index');
            this.sequelize.models = models;
            this.models = this.sequelize.models;
            return { status: true, text: "Models associadas" };
        } catch (error) {
            return { status: false, text: "Erro ao associar models: " + error };
        }

    }


}

module.exports = Database;