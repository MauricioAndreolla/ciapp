const db = require('../config/database');
const { Op } = require("sequelize");
const { TipoInstituicao } = require('../utils/enums');

module.exports = {

    async Create(payload) {
        if (!payload)
            return { status: false, text: "Nenhuma informação recebida" };

        if (!payload.entidade.nome)
            return { status: false, text: "Informe um nome" };

        if (!payload.entidade.cnpj)
            return { status: false, text: "Informe um CNPJ" };

        if (!payload.entidade.telefone1)
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
            let Entidade = null;

            let check = await db.models.Entidade.findAll({
                where: {
                    cnpj: payload.entidade.cnpj
                }
            });

            if (check.length > 0)
                return { status: false, text: `CNPJ já cadastrado no sistema` };

            await db.models.Endereco.create({
                rua: payload.endereco.rua,
                cep: payload.endereco.cep,
                numero: payload.endereco.numero,
                bairro: payload.endereco.bairro,
                complemento: payload.endereco.complemento,
                CidadeId: payload.endereco.id_cidade
            }).then(async (endereco) => {
                Entidade = await db.models.Entidade.create({
                    nome: payload.entidade.nome,
                    cnpj: payload.entidade.cnpj,
                    email: payload.entidade.email,
                    telefone1: payload.entidade.telefone1,
                    telefone2: payload.entidade.telefone2,
                    tipo_instituicao: payload.entidade.tipoInstituicao,
                    EnderecoId: endereco.id
                });
            });

            if (payload.entidade.tarefas.length > 0) {
                for (let i = 0; i < payload.entidade.tarefas.length; i++) {
                    const tarefa = payload.entidade.tarefas[i];
                    await db.models.Tarefa.create({
                        EntidadeId: Entidade.id,
                        titulo: tarefa.titulo,
                        descricao: tarefa.descricao,
                        status: tarefa.status
                    });
                }
            }
        } catch (error) {
            return { status: false, text: `Erro interno no servidor` };
        }
        return { status: true, text: `Entidade ${payload.entidade.nome} criada!` };
    },

    async Edit(payload) {
        if (!payload)
            return { status: false, text: "Nenhuma informação recebida" };

        if (!payload.entidade.nome)
            return { status: false, text: "Informe um nome" };

        if (!payload.entidade.cnpj)
            return { status: false, text: "Informe um CNPJ" };

        if (!payload.entidade.telefone1)
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
            let Entidade = await db.models.Entidade.findByPk(payload.entidade.id);
            Entidade.nome = payload.entidade.nome;
            Entidade.cnpj = payload.entidade.cnpj;
            Entidade.email = payload.entidade.email;
            Entidade.telefone1 = payload.entidade.telefone1;
            Entidade.telefone2 = payload.entidade.telefone2;
            Entidade.tipo_instituicao = payload.entidade.tipoInstituicao;
            await Entidade.save();

            let Endereco = await db.models.Endereco.findByPk(payload.endereco.id);
            Endereco.rua = payload.endereco.rua,
                Endereco.cep = payload.endereco.cep,
                Endereco.numero = payload.endereco.numero,
                Endereco.bairro = payload.endereco.bairro,
                Endereco.complemento = payload.endereco.complemento,
                Endereco.CidadeId = payload.endereco.id_cidade;
            await Endereco.save();

            if (payload.entidade.tarefas) {
                await db.models.Tarefa.destroy({
                    where: {
                        EntidadeId: payload.entidade.id
                    }
                });

                payload.entidade.tarefas.forEach(async (tarefa) => {
                    await db.models.Tarefa.create({
                        titulo: tarefa.titulo,
                        descricao: tarefa.descricao,
                        status: tarefa.status,
                        EntidadeId: payload.entidade.id,
                    })

                });
            }
        } catch (error) {
            return { status: false, text: `Erro interno no servidor. ${error}` };
        }
        return { status: true, text: `Entidade ${payload.entidade.nome} editada!` };
    },

    async Delete(id) {
        let Entidade = {};
        try {
            Entidade = await db.models.Entidade.findByPk(id);
            let Endereco = await db.models.Endereco.findByPk(Entidade.EnderecoId);
            await Entidade.destroy();
            await Endereco.destroy();
        } catch (error) {
            await db.sequelize.close();
            return { status: false, text: "Erro interno no servidor." };
        }
        return { status: true, text: `Entidade ${Entidade.nome} removida!` };

    },


    async GetEntidades(search) {
        let where = {};
        let someAttributes = {};

        if (search) {
            if (search.id) { where.id = search.id; }
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
            if (search.tipo_instituicao != null) {
                where.tipo_instituicao = search.tipo_instituicao;
            }
            if (search.dt_descredenciamento == 0) {
                where.dt_descredenciamento = null;
            }
        }

        const data = await db.models.Entidade.findAll({
            where: where,
            include: [
                { model: db.models.Endereco },
                { model: db.models.Tarefa }
            ],
        }).finally(() => {
            db.sequelize.close();
          });

        var mappedValues = data.map(s => {
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
        // await db.sequelize.close();
        return mappedValues;
    },

    async GetEntidade(id) {
        const data = await db.models.Entidade.findByPk(id,
            {
                include: [
                    { model: db.models.Endereco },
                    { model: db.models.Tarefa }
                ],
            }
        ).finally(() => {
            db.sequelize.close();
          });

        // await db.sequelize.close();

        var mappedValues = {
            id: data.dataValues.id,
            nome: data.dataValues.nome,
            cnpj: data.dataValues.cnpj,
            email: data.dataValues.email,
            telefone1: data.dataValues.telefone1,
            telefone2: data.dataValues.telefone2,
            tipoInstituicao: data.dataValues.tipo_instituicao,
            dt_descredenciamento: data.dataValues.dt_descredenciamento,
            observacao: data.dataValues.observacao,
            endereco: {
                id: data.dataValues.Endereco.id,
                cep: data.dataValues.Endereco.cep,
                rua: data.dataValues.Endereco.rua,
                numero: data.dataValues.Endereco.numero,
                bairro: data.dataValues.Endereco.bairro,
                complemento: data.dataValues.Endereco.complemento,
                id_cidade: data.dataValues.Endereco.CidadeId,
            },
            tarefas: data.dataValues.Tarefas.map((e) => {
                return {
                    id: e.id,
                    titulo: e.titulo,
                    descricao: e.descricao,
                    status: e.status,
                }
            })
        }
        return mappedValues;
    },

    async Descredenciar(payload) {
        try {
            const agendamento = await db.models.Agendamento.findOne({
                include: [
                    {
                        model: db.models.Tarefa,
                        where: { entidadeId: payload.id }
                    }
                ]
            });

            if (agendamento != null) {
                return { status: false, text: `Existe um agendamento para essa entidade não é possível descredenciar` };
            } else {
                let Entidade = await db.models.Entidade.findByPk(payload.id);
                Entidade.dt_descredenciamento = payload.dt_descredenciamento;
                Entidade.observacao = payload.motivo;
                await Entidade.save().finally(() => {
                    db.sequelize.close();
                  });
                // await db.sequelize.close();
                return { status: true, text: `Entidade ${Entidade.nome} descredenciada!` };
            }

        } catch (error) {
            return { status: false, text: `Erro interno no servidor.${error}` };
        }
    },

    async Credenciar(id) {

        try {
            let Entidade = await db.models.Entidade.findByPk(id);
            Entidade.dt_descredenciamento = null;
            Entidade.observacao = null;
            await Entidade.save().finally(() => {
                db.sequelize.close();
              });
            // await db.sequelize.close();
            return { status: true, text: `Entidade ${Entidade.nome} credenciada!` };
        } catch (error) {
            return { status: false, text: `Erro interno no servidor. ${error}` };
        }


    },

    async GetCentraisSelect() {
        const data = await db.models.Entidade.findAll({
            where: {
                tipo_instituicao: TipoInstituicao.Central
            },
        }).finally(() => {
            db.sequelize.close();
          });

        var mappedValues = data.map(s => {
            return {
                value: s.id,
                label: `${s.id} - ${s.nome}`
            }
        });
        // await db.sequelize.close();
        return mappedValues;
    }
}