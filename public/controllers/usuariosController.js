const db = require('../config/database');
const { Op } = require("sequelize");
const { hash } = require('bcryptjs');

const authentication = require('../utils/authentication');


module.exports = {

    async Create(payload) {
        if (!payload)
            return { status: false, text: "Nenhuma informação recebida" };

        if (!payload.userName)
            return { status: false, text: "Informe um nome de usuário" };

        if (!payload.user)
            return { status: false, text: "Informe um usuário" };

        if (!payload.password)
            return { status: false, text: "Informe uma senha" };

        try {

            await db.models.Usuario.create({
                nome: payload.userName,
                usuario: payload.user,
                tipo_usuario: payload.tipo_usuario,
                senha: await hash(payload.password, 8)
            });

        } catch (error) {
            return { status: false, text: `Erro interno no servidor.` };
        }

        return { status: true, text: `Usuário ${payload.userName} criado(a)!` };
    },

    async Delete(id) {

        if (id == authentication.idUser)
            return { status: false, text: "Não é possível remover o usuário logado." };
        let User = {};
        let nome = '';
        try {
            User = await db.models.Usuario.findByPk(id);
            nome = User.nome;
            await User.destroy();
        } catch (error) {
            return { status: false, text: "Erro interno no servidor." };
        }

        return { status: true, text: `Usuário ${nome} removida!` };

    },

    async Edit(payload) {


        if (!payload)
            return { status: false, text: "Nenhuma informação recebida" };

        if (!payload.userName)
            return { status: false, text: "Informe um nome de usuário" };

        if (!payload.user)
            return { status: false, text: "Informe um usuário" };

        if (!payload.password)
            return { status: false, text: "Informe uma senha" };
        try {

            let Usuario = await db.models.Usuario.findByPk(payload.id);
            Usuario.nome = payload.userName;
            Usuario.usuario = payload.user;
            Usuario.tipo_usuario = payload.tipo_usuario;
            Usuario.senha = await hash(payload.password, 8);
            await Usuario.save();

        } catch (error) {
            return { status: false, text: error.message };
        }

        return { status: true, text: `Usuario ${payload.userName} editado!` };



    },

    async GetUsuarios(search) {

        let where = {
            id: { [Op.ne]: 1 },
        };

        if (search) {
            if (search.id)
                where.id = search.id;

            if (search.nome) {
                where.nome = {
                    [Op.substring]: search.name
                }
            }

            if (search.cnpj) {
                where.usuario = {
                    [Op.substring]: search.user
                }
            }
        }


        const data = await db.models.Usuario.findAll({
            where: where,
        });

        return data.map(s => {
            return {
                id: s.id,
                nome: s.nome,
                usuario: s.usuario,
                senha: s.senha,
                tipo_usuario: s.tipo_usuario,
                tipo_usuario_desc: s.tipo_usuario === 0 ? "Normal" : s.tipo_usuario === 1 ? "Administrador" : "--"
            }
        });
    }

}