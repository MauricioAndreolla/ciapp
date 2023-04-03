const db = require('../config/database');
const { Op } = require("sequelize");
const { TipoInstituicao } = require('../utils/enums');


module.exports = {

    async Create(payload) {
        console.log(payload)

        if (!payload)
            return { status: false, text: "Nenhuma informação recebida" };

        if (!payload.nome)
            return { status: false, text: "Informe um nome" };

        if (!payload.cnpj)
            return { status: false, text: "Informe um CNPJ" };

        if (!payload.telefone1 || !payload.telefone2)
            return { status: false, text: "Informe um telefone" };

        // if (!payload.endereco)
        //     return { status: false, text: "Informe um endereço" };

        // if (!payload.endereco.rua)
        //     return { status: false, text: "Informe uma rua" };

        // if (!payload.endereco.cep)
        //     return { status: false, text: "Informe um CEP" };

        // if (!payload.endereco.bairro)
        //     return { status: false, text: "Informe um bairro" };

        // if (!payload.endereco.id_cidade)
        //     return { status: false, text: "Informe uma cidade" };


        try {
            let Entidade = null;
            let check = await db.models.Entidade.findAll({
                where: {
                    tipo_instituicao: TipoInstituicao.Entidade,
                    cnpj: parseInt(payload.cnpj)
                }
            })
            if (check.length > 0)
                return { status: false, text: `CNPJ já cadastrado no sistema` };

            // await db.sequelize.models.Endereco.create({
            //     nome: payload.endereco.nome,
            //     rua: payload.endereco.rua,
            //     cep: payload.endereco.cep,
            //     numero: payload.endereco.numero,
            //     bairro: payload.endereco.bairro,
            //     complemento: payload.endereco.complemento,
            //     CidadeId: payload.endereco.id_cidade
            // }).then(async (endereco) => {
            //     Entidade = await db.sequelize.models.Entidades.create({
            //         nome: payload.nome,
            //         cnpj: parseInt(payload.cnpj),
            //         email: payload.email,
            //         telefone1: payload.telefone1,
            //         telefone2: payload.telefone2,
            //         tipo_instituicao: TipoInstituicao.Entidade,
            //         EnderecoId: endereco.id
            //     });
            // });

            if (payload.tarefas.length > 0) {
                for (let i = 0; i < payload.tarefas.length; i++) {

                    const tarefa = payload.tarefas[i];

                    await db.sequelize.models.Tarefa.create({
                        InstituicoId: Instituicao.id,
                        titulo: tarefa.tarefaTitulo,
                        descricao: tarefa.tarefaDescricao,
                        status: parseInt(tarefa.status)
                    })

                }
            }


        } catch (error) {
            return { status: false, text: "Erro interno no servidor" };
        }

        return { status: true, text: `Entidade ${payload.nome} criada!` };


    },

    async Edit(payload) {

        if (!payload)
            return { status: false, text: "Nenhuma informação recebida" };

        if (!payload.nome)
            return { status: false, text: "Informe um nome" };

        if (!payload.cnpj)
            return { status: false, text: "Informe um CNPJ" };

        if (!payload.telefone1 || !payload.telefone2)
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

            let check = await db.sequelize.models.Entidades.findAll({
                where: {
                    tipo_instituicao: TipoInstituicao.Entidade,
                    cnpj: parseInt(payload.cnpj),
                    id: {
                        [Op.ne]: payload.id
                    }
                }
            })
            if (check.length > 0)
                return { status: false, text: `CNPJ já cadastrado no sistema` };

            let Entidade = await db.sequelize.models.Entidades.findByPk(payload.id);
            Entidade.nome = payload.nome;
            Entidade.cnpj = parseInt(payload.cnpj);
            Entidade.email = payload.email;
            Entidade.telefone1 = payload.telefone1;
            Entidade.telefone2 = payload.telefone2;
            await Entidade.save();

            let Endereco = await db.sequelize.models.Endereco.findByPk(payload.endereco.id);
            Endereco.rua = payload.endereco.rua,
                Endereco.cep = payload.endereco.cep,
                Endereco.numero = payload.endereco.numero,
                Endereco.bairro = payload.endereco.bairro,
                Endereco.complemento = payload.endereco.complemento,
                Endereco.CidadeId = payload.endereco.id_cidade;
            await Endereco.save();


            if (payload.tarefas.length > 0) {
                await db.sequelize.models.Tarefa.destroy({
                    where: {
                        InstituicoId: Entidade.id
                    }
                })
                for (let i = 0; i < payload.tarefas.length; i++) {

                    const tarefa = payload.tarefas[i];

                    await db.sequelize.models.Tarefa.create({
                        InstituicoId: Entidade.id,
                        titulo: tarefa.titulo,
                        descricao: tarefa.descricao,
                        status: parseInt(tarefa.status)
                    })

                }
            } else {
                await db.sequelize.models.Tarefa.destroy({
                    where: {
                        InstituicoId: Entidade.id
                    }
                })
            }




        } catch (error) {
            return { status: false, text: "Erro interno no servidor." };
        }

        return { status: true, text: `Entidade ${payload.nome} salva!` };


    },

    async Delete(id) {
        let Entidade = {};
        try {
            Entidade = await db.sequelize.models.Entidades.findByPk(id);
            let Endereco = await db.sequelize.models.Endereco.findByPk(Entidade.EnderecoId);
            await Entidade.destroy();
            await Endereco.destroy();
        } catch (error) {
            return { status: false, text: "Erro interno no servidor." };
        }

        return { status: true, text: `Entidade ${Entidade.nome} removida!` };
    },

    async GetEntidadesSelect(){
        const data = await db.sequelize.models.Entidades.findAll(
            {
                where:{
                    tipo_instituicao: TipoInstituicao.Entidade
                }
            }
        );
        let array = data.map(s => {

            return {
                value: s.id,
                label: s.nome
            }

        });

        return array;
    },

    async GetEntidades(search) {

        let where = {};
        let someAttributes = {};
        where.tipo_instituicao = TipoInstituicao.Entidade;

        if (search) {
            if (search.id)
                where.id = search.id;

            if (search.nome) {
                where.nome = {
                    [Op.substring]: search.nome
                }
            }

            if (search.cnpj) {
                where.cnpj = {
                    [Op.substring]: search.cnpj
                }
            }
        }



        const data = await db.sequelize.models.Entidades.findAll({

            where: where,
            include: [
                { model: db.sequelize.models.Endereco },
                { model: db.sequelize.models.Tarefa }
            ],
        });


        return data.map(s => {
            return {
                id: s.id,
                nome: s.nome,
                cnpj: s.cnpj,
                email: s.email,
                telefone1: s.telefone1,
                telefone2: s.telefone2,
                tipo_instituicao: TipoInstituicao.Entidade,
                dt_descredenciamento: s.dt_descredenciamento,
                motivo: s.observacao,
                endereco: {
                    id: s.Endereco.id,
                    rua: s.Endereco.rua,
                    numero: s.Endereco.numero,
                    cep: s.Endereco.cep,
                    bairro: s.Endereco.bairro,
                    complemento: s.Endereco.complemento,
                    CidadeId: s.Endereco.CidadeId,
                },
                tarefa: s.Tarefas.map(a => {
                    return {
                        id: a.id,
                        titulo: a.titulo,
                        descricao: a.descricao,
                        status: a.status
                    }
                }),
            }
        });
    },

    async GetEntidade(id) {

        const data = await db.sequelize.models.Entidades.findByPk(id);
        return data.nome;
    },

    async Descredenciar(payload) {

        try {
            let Entidade = await db.sequelize.models.Entidades.findByPk(payload.id);
            Entidade.dt_descredenciamento = new Date();
            Entidade.observacao = payload.motivo;
            await Entidade.save();
            return { status: true, text: `Entidade ${Entidade.nome} descredenciada!` };
        } catch (error) {
            return { status: false, text: "Erro interno no servidor." };
        }


    },

    async Credenciar(id) {

        try {
            let Entidade = await db.sequelize.models.Entidades.findByPk(id);
            Entidade.dt_descredenciamento = null;
            Entidade.observacao = null;
            await Entidade.save();
            return { status: true, text: `Entidade ${Entidade.nome} credenciada!` };
        } catch (error) {
            return { status: false, text: "Erro interno no servidor." };
        }


    },

    async GetTarefasLabel() {
        const data = await db.sequelize.models.Tarefa.findAll({
            include: [   { model: db.sequelize.models.Entidades }]
        });


        let array = data.map(s => {

            return {
                value: s.id,
                label: s.titulo,
                instituicaoTarefaId: s.Instituico.id,
                Entidades: s.Instituico.dataValues
            }

        });

        return array;
    },





}