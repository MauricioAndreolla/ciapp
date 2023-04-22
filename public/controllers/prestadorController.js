const db = require('../config/database');
const { Op } = require('sequelize');

const { unformatCurrency, formatCurrency, diff_hours } = require('../utils/utils')

const checkDadosOrigatorios = (payload) => {

    if (!payload.prestador.nome || !payload.prestador.nome.trim())
        return { status: false, text: `Campo "Nome" é obrigatório.` };

    if (!payload.prestador.cpf || !payload.prestador.cpf.trim())
        return { status: false, text: `Campo "CPF" é obrigatório.` };

    if (!payload.prestador.dt_nascimento || !payload.prestador.dt_nascimento.trim())
        return { status: false, text: `Campo "Data de Nascimento" é obrigatório.` };

    if (!payload.prestador.telefone1 || !payload.prestador.telefone1.trim())
        return { status: false, text: `Campo "Telefone" é obrigatório.` };

    if (!payload.endereco.rua || !payload.endereco.rua.trim())
        return { status: false, text: `Campo "Rua" é obrigatório.` };

    if (!payload.endereco.cep || !payload.endereco.cep.trim())
        return { status: false, text: `Campo "CEP" é obrigatório.` };

    if (!payload.endereco.numero || !payload.endereco.numero.trim())
        return { status: false, text: `Campo "Número" é obrigatório.` };

    if (!payload.endereco.bairro || !payload.endereco.bairro.trim())
        return { status: false, text: `Campo "Bairro" é obrigatório.` };

    if (!payload.endereco.id_cidade)
        return { status: false, text: `Campo "Cidade" é obrigatório.` };

    return { status: true };


}
module.exports = {


    async Delete(id) {

        let Prestador = await db.models.Prestador.findByPk(id, {
            include: db.models.Processo
        });
        if (!Prestador) return { status: false, text: 'Prestador não localizado.' };

        if (Prestador.Processos.length > 0) return { status: false, text: `O Prestador ${Prestador.nome} possuí Processos associados e não pode ser deletado` };

        await Prestador.destroy();

        return { status: true, text: `Prestador ${Prestador.nome} deletado!` };


    },

    async GetPrestadores(search) {

        let where = {};
        if (search) {
            if (search.id)
                where.id = search.id;

            if (search.nome) {
                where.nome = {
                    [Op.substring]: search.nome
                }
            }
            if (search.cpf) {
                where.cpf = {
                    [Op.substring]: search.cpf
                }
            }
        }

        let Prestadores = await db.models.Prestador.findAll({
            where: where,
            include: [
                {
                    model: db.models.Processo,
                    include: [
                        {
                            model: db.models.Agendamento,
                            include: { model: db.models.AtestadoFrequencia }
                        }
                    ]
                }
            ]
        }).finally(() => {
            db.sequelize.close();
        });

        var mappedValues = Prestadores.map(s => {
            return {
                id: s.id,
                cpf: s.cpf,
                nome: s.nome,
                somente_leitura: s.somente_leitura,
                nro_processo: s.Processos.length > 0 ? s.Processos[s.Processos.length - 1].nro_processo : null,
                horas_cumprir: s.Processos.length > 0 ? s.Processos[s.Processos.length - 1].horas_cumprir : 0,
                horas_cumpridas: s.Processos.length > 0 ? s.Processos[s.Processos.length - 1].Agendamentos.map(s => {

                    return s.AtestadoFrequencia.map(s => {
                        return diff_hours(s.dt_entrada, s.dt_saida)
                    }).reduce((a, b) => a + b, 0)

                }).reduce((a, b) => a + b, 0) : 0,
            }
        });
        // await db.sequelize.close();
        return mappedValues;
    },


    async GetPrestador(id) {
        let Prestadores = await db.models.Prestador.findAll({
            where: {
                id: parseInt(id)
            },
            include: [
                { model: db.models.Trabalho },
                { model: db.models.Familiar },
                {
                    model: db.models.Endereco,
                    include: {
                        model: db.models.Cidade
                    }
                },
                {
                    model: db.models.Beneficio,
                    through: "PrestadoresBeneficios"
                },
                {
                    model: db.models.Habilidade,
                    through: "PrestadoresHabilidades"
                },
                {
                    model: db.models.Curso,
                    through: "PrestadoresCursos"
                },
                {
                    model: db.models.FichaMedica,
                    include: {
                        model: db.models.Droga,
                        through: "FichaMedicaDrogas"
                    }
                },
            ]
        }).finally(() => {
            db.sequelize.close();
        });

        let mappedValues = Prestadores.map(s => {
            return {
                id: s.id,
                cpf: s.cpf,
                nome: s.nome,
                image: s.image,
                nome_mae: s.nome_mae,
                dt_nascimento: s.dt_nascimento,
                estado_civil: s.estado_civil,
                etnia: s.etnia,
                escolaridade: s.escolaridade,
                renda_familiar: formatCurrency(s.renda_familiar),
                telefone1: s.telefone1,
                telefone2: s.telefone2,
                religiao: s.religiao,
                beneficios: s.Beneficios.length === 0 ? [] : s.Beneficios.map(b => {
                    return {
                        id: b.id,
                        nome: b.nome,
                        observacao: b.observacao
                    }
                }),
                familiares: s.Familiares.length === 0 ? [] : s.Familiares.map(b => {
                    return {
                        id: b.id,
                        familiar_nome: b.nome,
                        familiar_parentesco: b.parentesco,
                        familiar_idade: b.idade,
                        familiar_profissao: b.profissao,
                        novo_registro: false
                    }
                }),
                habilidades: s.Habilidades.length === 0 ? [] : s.Habilidades.map(b => {
                    return {
                        id: b.id,
                        descricao: b.descricao,
                        observacao: b.observacao
                    }
                }),
                cursos: s.Cursos.length === 0 ? [] : s.Cursos.map(b => {
                    return {
                        id: b.id,
                        descricao: b.descricao,
                        observacao: b.observacao
                    }
                }),
                saude: !s.FichaMedica ? {
                    deficiencia: 0,
                    observacao: "",
                    drogas: []
                } : {
                    id: s.FichaMedica.id,
                    deficiencia: s.FichaMedica.deficiencia,
                    observacao: s.FichaMedica.observacao,
                    drogas: s.FichaMedica.Drogas.map(b => {
                        return {
                            id: b.id,
                            nome: b.nome,
                            observacao: b.observacao,
                            frequencia: b.FichaMedicaDrogas.frequencia,
                            frequencia_descricao: b.FichaMedicaDrogas.frequencia === 0 ? "Eventualmente" : b.FichaMedicaDrogas.frequencia === 1 ? "Com Frequência" : b.FichaMedicaDrogas.frequencia === 2 ? "Não usa mais" : "--"
                        }
                    })
                },

                endereco: {
                    id: s.Endereco.id,
                    rua: s.Endereco.rua,
                    numero: s.Endereco.numero,
                    cep: s.Endereco.cep,
                    bairro: s.Endereco.bairro,
                    complemento: s.Endereco.complemento,
                    id_cidade: s.Endereco.CidadeId,
                },

                trabalho: !s.Trabalho ? {
                    trabalho_descricao: '',
                    trabalho_horario_inicio: '',
                    trabalho_horario_fim: '',
                    trabalho_dias_semana: []
                } : {
                    id: s.Trabalho.id,
                    trabalho_descricao: s.Trabalho.descricao,
                    trabalho_horario_inicio: s.Trabalho.horario_inicio,
                    trabalho_horario_fim: s.Trabalho.horario_fim,
                    trabalho_dias_semana: [
                        s.Trabalho.segunda ? { value: 0, label: "Segunda-feira" } : null,
                        s.Trabalho.terca ? { value: 1, label: "Terça-feira" } : null,
                        s.Trabalho.quarta ? { value: 2, label: "Quarta-feira" } : null,
                        s.Trabalho.quinta ? { value: 3, label: "Quinta-feira" } : null,
                        s.Trabalho.sexta ? { value: 4, label: "Sexta-feira" } : null,
                        s.Trabalho.sabado ? { value: 5, label: "Sábado" } : null,
                        s.Trabalho.domingo ? { value: 6, label: "Domingo" } : null,
                    ].filter(s => s !== null)
                }
            }
        });

        // await db.sequelize.close();
        return mappedValues;
    },

    async GetPrestadorSimple(id) {
        let Prestadores = await db.models.Prestador.findByPk(id).finally(() => {
            db.sequelize.close();
        });
        // await db.sequelize.close();
        return {
            nome: Prestadores.nome,
            image: Prestadores.image,
            id: Prestadores.id,
            telefone1: Prestadores.telefone1,
            dt_nascimento: Prestadores.dt_nascimento
        }
    },

    async Create(payload) {
        try {

            let checkDados = checkDadosOrigatorios(payload);
            if (!checkDados.status)
                return checkDados;

            let checkPrestador = await db.models.Prestador.findAll({
                where: {
                    cpf: payload.prestador.cpf
                }
            })

            if (checkPrestador.length > 0)
                return { status: false, text: `CPF já cadastrado no sistema` };


            let Endereco = await db.models.Endereco.create({
                nome: payload.endereco.nome,
                rua: payload.endereco.rua,
                cep: payload.endereco.cep,
                numero: payload.endereco.numero,
                bairro: payload.endereco.bairro,
                complemento: payload.endereco.complemento,
                CidadeId: payload.endereco.id_cidade
            });


            const buffer = payload.image ? Buffer.from(payload.image.replace(/^data:image\/[a-z]+;base64,/, ""), 'base64') : null;

            let Prestador = await db.models.Prestador.create({
                EnderecoId: Endereco.id,
                nome: payload.prestador.nome,
                cpf: payload.prestador.cpf,
                nome_mae: payload.prestador.nome_mae,
                dt_nascimento: payload.prestador.dt_nascimento,
                estado_civil: parseInt(payload.prestador.estado_civil),
                etnia: parseInt(payload.prestador.etnia),
                escolaridade: parseInt(payload.prestador.escolaridade),
                renda_familiar: unformatCurrency(payload.prestador.renda_familiar ?? 0),
                telefone1: payload.prestador.telefone1,
                telefone2: payload.prestador.telefone2,
                religiao: payload.prestador.religiao,
                image: buffer

            });

            if (payload.trabalho) {
                await db.models.Trabalho.create({
                    PrestadoreId: Prestador.id,
                    descricao: payload.trabalho.trabalho_descricao,
                    horario_inicio: payload.trabalho.trabalho_horario_inicio,
                    horario_fim: payload.trabalho.trabalho_horario_fim,
                    segunda: payload.trabalho.trabalho_dias_semana.filter(s => s.value === 0).length > 0,
                    terca: payload.trabalho.trabalho_dias_semana.filter(s => s.value === 1).length > 0,
                    quarta: payload.trabalho.trabalho_dias_semana.filter(s => s.value === 2).length > 0,
                    quinta: payload.trabalho.trabalho_dias_semana.filter(s => s.value === 3).length > 0,
                    sexta: payload.trabalho.trabalho_dias_semana.filter(s => s.value === 4).length > 0,
                    sabado: payload.trabalho.trabalho_dias_semana.filter(s => s.value === 5).length > 0,
                    domingo: payload.trabalho.trabalho_dias_semana.filter(s => s.value === 6).length > 0
                });
            }

            if (payload.prestador.familiares.length > 0) {
                for (let i = 0; i < payload.prestador.familiares.length; i++) {

                    const familiar = payload.prestador.familiares[i];

                    await db.models.Familiar.create({
                        PrestadoreId: Prestador.id,
                        nome: familiar.familiar_nome,
                        parentesco: familiar.familiar_parentesco,
                        idade: parseInt(familiar.familiar_idade),
                        profissao: familiar.familiar_profissao,
                    })

                }
            }

            if (payload.prestador.beneficios.length > 0) {
                for (let i = 0; i < payload.prestador.beneficios.length; i++) {

                    const beneficios = payload.prestador.beneficios[i];

                    let Beneficio = await db.models.Beneficio.findByPk(beneficios.id);

                    await Prestador.addBeneficios([Beneficio]);
                    await Beneficio.addPrestadores([Prestador]);

                }
            }


            if (payload.prestador.habilidades.length > 0) {
                for (let i = 0; i < payload.prestador.habilidades.length; i++) {

                    const habilidades = payload.prestador.habilidades[i];
                    let Habilidade = await db.models.Habilidade.findByPk(habilidades.id);
                    await Prestador.addHabilidades([Habilidade]);
                    await Habilidade.addPrestadores([Prestador]);
                }
            }

            if (payload.prestador.cursos.length > 0) {
                for (let i = 0; i < payload.prestador.cursos.length; i++) {

                    const cursos = payload.prestador.cursos[i];
                    let Curso = await db.models.Curso.findByPk(cursos.id);
                    await Prestador.addCursos([Curso]);
                    await Curso.addPrestadores([Prestador]);

                }
            }

            let FichaMedica = await db.models.FichaMedica.create({
                PrestadoreId: Prestador.id,
                deficiencia: payload.prestador.saude.deficiencia,
                observacao: payload.prestador.saude.observacao,
            });

            if (payload.prestador.saude.drogas.length > 0) {
                for (let i = 0; i < payload.prestador.saude.drogas.length; i++) {

                    const droga = payload.prestador.saude.drogas[i];
                    let Droga = await db.models.Droga.findByPk(droga.id);

                    var result = await db.models.FichaMedicaDrogas.create({
                        FichaMedicaId: FichaMedica.id,
                        DrogaId: Droga.id,
                        frequencia: parseInt(droga.frequencia),

                    })
                    await FichaMedica.addDrogas([Droga]);
                    await Droga.addFichaMedicas([FichaMedica]);

                }
            }
            await db.sequelize.close();
            return { status: true, text: `Prestador(a) ${Prestador.nome} cadastrado(a) com sucesso!`, id: Prestador.id };

        } catch (error) {
            return { status: false, text: `Erro interno no servidor \n` + error };
        }
    },

    async Edit(payload) {
        try {

            let checkDados = checkDadosOrigatorios(payload);
            if (!checkDados.status)
                return checkDados;

            let checkPrestador = await db.models.Prestador.findAll({
                where: {
                    cpf: payload.prestador.cpf,
                    id: {
                        [Op.ne]: payload.prestador.id
                    }
                }
            })

            if (checkPrestador.length > 0)
                return { status: false, text: `CPF já cadastrado no sistema` };


            let Endereco = await db.models.Endereco.findByPk(payload.endereco.id);
            Endereco.nome = payload.endereco.nome;
            Endereco.rua = payload.endereco.rua;
            Endereco.cep = payload.endereco.cep;
            Endereco.numero = payload.endereco.numero;
            Endereco.bairro = payload.endereco.bairro;
            Endereco.complemento = payload.endereco.complemento;
            Endereco.CidadeId = payload.endereco.id_cidade;

            await Endereco.save();

            const buffer = payload.image ? Buffer.from(payload.image.replace(/^data:image\/[a-z]+;base64,/, ""), 'base64') : null;

            let Prestador = await db.models.Prestador.findByPk(payload.prestador.id);
            Prestador.EnderecoId = Endereco.id;
            Prestador.nome = payload.prestador.nome;
            Prestador.cpf = payload.prestador.cpf;
            Prestador.nome_mae = payload.prestador.nome_mae;
            Prestador.dt_nascimento = payload.prestador.dt_nascimento;
            Prestador.estado_civil = parseInt(payload.prestador.estado_civil);
            Prestador.etnia = parseInt(payload.prestador.etnia);
            Prestador.escolaridade = parseInt(payload.prestador.escolaridade);
            Prestador.renda_familiar = unformatCurrency(payload.prestador.renda_familiar ?? 0);
            Prestador.telefone1 = payload.prestador.telefone1;
            Prestador.telefone2 = payload.prestador.telefone2;
            Prestador.religiao = payload.prestador.religiao;
            Prestador.image = buffer;
            await Prestador.save();

            if (payload.trabalho) {

                let Trabalho = await db.models.Trabalho.findByPk(payload.trabalho.id);
                Trabalho.descricao = payload.trabalho.trabalho_descricao;
                Trabalho.horario_inicio = payload.trabalho.trabalho_horario_inicio;
                Trabalho.horario_fim = payload.trabalho.trabalho_horario_fim;
                Trabalho.segunda = payload.trabalho.trabalho_dias_semana.filter(s => s.value === 0).length > 0;
                Trabalho.terca = payload.trabalho.trabalho_dias_semana.filter(s => s.value === 1).length > 0;
                Trabalho.quarta = payload.trabalho.trabalho_dias_semana.filter(s => s.value === 2).length > 0;
                Trabalho.quinta = payload.trabalho.trabalho_dias_semana.filter(s => s.value === 3).length > 0;
                Trabalho.sexta = payload.trabalho.trabalho_dias_semana.filter(s => s.value === 4).length > 0;
                Trabalho.sabado = payload.trabalho.trabalho_dias_semana.filter(s => s.value === 5).length > 0;
                Trabalho.domingo = payload.trabalho.trabalho_dias_semana.filter(s => s.value === 6).length > 0;
                await Trabalho.save();
            } else {
                await db.models.Trabalho.destroy({ where: { PrestadoreId: Prestador.id } })
            }


            if (payload.prestador.familiares.length > 0) {

                let familiaresCadastrados = await db.models.Familiar.findAll({
                    where: {
                        PrestadoreId: Prestador.id
                    }
                })

                let familiaresParaCadastrar = payload.prestador.familiares.filter(s => s.novo_registro == true);
                for (let i = 0; i < familiaresParaCadastrar.length; i++) {

                    const familiar = familiaresParaCadastrar[i];

                    await db.models.Familiar.create({
                        PrestadoreId: Prestador.id,
                        nome: familiar.familiar_nome,
                        parentesco: familiar.familiar_parentesco,
                        idade: parseInt(familiar.familiar_idade),
                        profissao: familiar.familiar_profissao,
                    })
                }

                for (let i = 0; i < familiaresCadastrados.length; i++) {
                    const familiarCadastrado = familiaresCadastrados[i];

                    let checkFamiliar = payload.prestador.familiares.find(s => s.novo_registro == false && s.id == familiarCadastrado.id);
                    if (checkFamiliar) {
                        familiarCadastrado.nome = checkFamiliar.nome;
                        familiarCadastrado.parentesco = checkFamiliar.familiar_parentesco;
                        familiarCadastrado.idade = parseInt(checkFamiliar.familiar_idade);
                        familiarCadastrado.profissao = checkFamiliar.familiar_profissao;
                        await familiarCadastrado.save();
                    }
                    else {
                        await db.models.Familiar.destroy({ where: { id: familiarCadastrado.id } })
                    }

                }
            }
            else {
                await db.models.Familiar.destroy({ where: { PrestadoreId: Prestador.id } })
            }

            if (payload.prestador.beneficios.length > 0) {
                Prestador.setBeneficios([]);
                for (let i = 0; i < payload.prestador.beneficios.length; i++) {

                    const beneficios = payload.prestador.beneficios[i];

                    let Beneficio = await db.models.Beneficio.findByPk(beneficios.id);

                    await Prestador.addBeneficios([Beneficio]);
                    await Beneficio.addPrestadores([Prestador]);

                }
            }
            else {
                Prestador.setBeneficios([]);
            }

            if (payload.prestador.habilidades.length > 0) {
                Prestador.setHabilidades([]);
                for (let i = 0; i < payload.prestador.habilidades.length; i++) {

                    const habilidades = payload.prestador.habilidades[i];
                    let Habilidade = await db.models.Habilidade.findByPk(habilidades.id);
                    await Prestador.addHabilidades([Habilidade]);
                    await Habilidade.addPrestadores([Prestador]);
                }
            }
            else {
                Prestador.setHabilidades([]);
            }

            if (payload.prestador.cursos.length > 0) {
                Prestador.setCursos([]);
                for (let i = 0; i < payload.prestador.cursos.length; i++) {

                    const cursos = payload.prestador.cursos[i];
                    let Curso = await db.models.Curso.findByPk(cursos.id);
                    await Prestador.addCursos([Curso]);
                    await Curso.addPrestadores([Prestador]);

                }
            } else {
                Prestador.setCursos([]);
            }

            let FichaMedica = await db.models.FichaMedica.findByPk(payload.prestador.saude.id);
            FichaMedica.deficiencia = payload.prestador.saude.deficiencia;
            FichaMedica.observacao = payload.prestador.saude.observacao;
            await FichaMedica.save();

            if (payload.prestador.saude.drogas.length > 0) {
                FichaMedica.setDrogas([]);
                for (let i = 0; i < payload.prestador.saude.drogas.length; i++) {

                    const droga = payload.prestador.saude.drogas[i];
                    let Droga = await db.models.Droga.findByPk(droga.id);

                    var result = await db.models.FichaMedicaDrogas.create({
                        FichaMedicaId: FichaMedica.id,
                        DrogaId: Droga.id,
                        frequencia: parseInt(droga.frequencia),

                    })
                    await FichaMedica.addDrogas([Droga]);
                    await Droga.addFichaMedicas([FichaMedica]);

                }
            } else {
                FichaMedica.setDrogas([]);
            }
            await db.sequelize.close();
            return { status: true, text: `Prestador(a) ${Prestador.nome} alterado(a) com sucesso!` };

        } catch (error) {
            return { status: false, text: `Erro interno no servidor \n` + error };
        }
    }



}