
const db = require('../config/database');
const { Op } = require("sequelize");
const { TipoInstituicao } = require('../utils/enums');

module.exports = {

    async Create(payload) {

        if (!payload)
            return { status: false, text: "Nenhuma informação recebida" };

        if (!payload.nome)
            return { status: false, text: "Informe um nome" };

        if (!payload.cnpj)
            return { status: false, text: "Informe um CNPJ" };

        if (!payload.telefone1 && !payload.telefone2)
            return { status: false, text: "Informe um telefone" };

        if (!payload.endereco)
            return { status: false, text: "Informe um endereço" };

        if (!payload.endereco.rua)
            return { status: false, text: "Informe uma rua" };

        if (!payload.endereco.cep)
            return { status: false, text: "Informe um CEP" };

        if (!payload.endereco.bairro)
            return { status: false, text: "Informe um bairro" };

        if (!payload.endereco.id_cidade)
            return { status: false, text: "Informe uma cidade" };
        
        try {

            let check =  await db.models.Instituicoes.findAll({
                where: {
                    tipo_instituicao: TipoInstituicao.Central,
                    cnpj: parseInt(payload.cnpj)
                }
            })
            if(check.length > 0)
                return { status: false, text: `CNPJ já cadastrado no sistema` };

            await db.models.Endereco.create({
                nome: payload.endereco.nome,
                rua: payload.endereco.rua,
                cep: payload.endereco.cep,
                numero: payload.endereco.numero,
                bairro: payload.endereco.bairro,
                complemento: payload.endereco.complemento,
                CidadeId: payload.endereco.id_cidade
            }).then(async (endereco) => {
                await db.models.Instituicoes.create({
                    nome: payload.nome,
                    cnpj: parseInt(payload.cnpj),
                    email: payload.email,
                    telefone1: payload.telefone1,
                    telefone2: payload.telefone2,
                    tipo_instituicao: TipoInstituicao.Central,
                    EnderecoId: endereco.id
                });
            });

        } catch (error) {
            return { status: false, text: "Erro interno no servidor." };
        }

        return { status: true, text: `Central ${payload.nome} criada!` };


    },

    async Edit(payload) {

        if (!payload)
            return { status: false, text: "Nenhuma informação recebida" };

        if (!payload.nome)
            return { status: false, text: "Informe um nome" };

        if (!payload.cnpj)
            return { status: false, text: "Informe um CNPJ" };

        if (!payload.telefone1 && !payload.telefone2)
            return { status: false, text: "Informe um telefone" };

        if (!payload.endereco)
            return { status: false, text: "Informe um endereço" };

        if (!payload.endereco.rua)
            return { status: false, text: "Informe uma rua" };

        if (!payload.endereco.cep)
            return { status: false, text: "Informe um CEP" };

        if (!payload.endereco.bairro)
            return { status: false, text: "Informe um bairro" };

        if (!payload.endereco.id_cidade)
            return { status: false, text: "Informe uma cidade" };


        try {

            let check =  await db.models.Instituicoes.findAll({
                where: {
                    tipo_instituicao: TipoInstituicao.Central,
                    cnpj: parseInt(payload.cnpj),
                    id: {
                        [Op.ne]: payload.id
                    }
                }
            })
            if(check.length > 0)
                return { status: false, text: `CNPJ já cadastrado no sistema` };

            let Central = await db.models.Instituicoes.findByPk(payload.id);
            Central.nome = payload.nome;
            Central.cnpj = parseInt(payload.cnpj);
            Central.email = payload.email;
            Central.telefone1 = payload.telefone1;
            Central.telefone2 = payload.telefone2;
            await Central.save();

            let Endereco = await db.models.Endereco.findByPk(payload.endereco.id);
            Endereco.rua = payload.endereco.rua,
                Endereco.cep = payload.endereco.cep,
                Endereco.numero = payload.endereco.numero,
                Endereco.bairro = payload.endereco.bairro,
                Endereco.complemento = payload.endereco.complemento,
                Endereco.CidadeId = payload.endereco.id_cidade;
            await Endereco.save();



        } catch (error) {
            return { status: false, text: "Erro interno no servidor." };
        }

        return { status: true, text: `Central ${payload.nome} salva!` };


    },

    async Delete(id) {
        let Central = {};
        try {
            Central = await db.models.Instituicoes.findByPk(id);
            let Endereco = await db.models.Endereco.findByPk(Central.EnderecoId);
            await Central.destroy();
            await Endereco.destroy();
        } catch (error) {
            return { status: false, text: "Erro interno no servidor." };
        }

        return { status: true, text: `Central ${Central.nome} removida!` };
    },

    async GetCentrais(search) {

        let where = {};
        where.tipo_instituicao = TipoInstituicao.Central;

        if (search) {
            if (search.id)
                where.id = search.id;

            if (search.nome){
                where.nome = {
                    [Op.substring]: search.nome
                }
            }

            if (search.cnpj){
                where.cnpj = {
                    [Op.substring]: search.cnpj
                }
            }
        }



        const data = await db.models.Instituicoes.findAll({

            where: where,
            include: [db.models.Endereco],
        });

        return data.map(s => {
            return {
                id: s.id,
                nome: s.nome,
                cnpj: s.cnpj,
                email: s.email,
                telefone1: s.telefone1,
                telefone2: s.telefone2,
                tipo_instituicao: TipoInstituicao.Central,
                endereco: {
                    id: s.Endereco.id,
                    rua: s.Endereco.rua,
                    numero: s.Endereco.numero,
                    cep: s.Endereco.cep,
                    bairro: s.Endereco.bairro,
                    complemento: s.Endereco.complemento,
                    CidadeId: s.Endereco.CidadeId,
                }
            }
        });
    },























    
    async GetCentraisSelect() {

        const data = await db.models.Entidade.findAll({

            where: {
                tipo_instituicao: TipoInstituicao.Central
            },
        });

        return data.map(s => {
            return {
                value: s.id,
                label: `${s.id} - ${s.nome}`
            }
        });
    },


}