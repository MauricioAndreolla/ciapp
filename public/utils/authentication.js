const db = require('../config/database');
const bcrypt = require('bcryptjs');
const MODO_APLICACAO = require('../utils/appMode');

class Authentication {
    static isAuthenticated = false;
    static idUser = null;
    static name = "";
    static username = "";


    static async Authenticate(username, password) {
        this.UnAuthenticate();

        let checkUser = await db.models.Usuario.findOne({
            where: {
                usuario: username
            }
        });

        if (checkUser) {
            const isValid = bcrypt.compareSync(password, checkUser.senha);
            if (isValid) {
                this.isAuthenticated = true;
                this.idUser = checkUser.id;
                this.name = checkUser.nome;
                this.username = checkUser.usuario;
            }
        }

        if (!this.isAuthenticated)
            return { status: false, text: "Usuário ou senha inválida" };

        return { status: true, user: { id: checkUser.id, user: checkUser.nome, MODO_APLICACAO: MODO_APLICACAO.modo } };

    }

    static UnAuthenticate() {
        this.isAuthenticated = false;
        this.idUser = null;
        this.name = "";
        this.username = "";
    }



}

module.exports = Authentication;