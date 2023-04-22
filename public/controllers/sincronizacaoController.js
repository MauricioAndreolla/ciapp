const db = require('../config/database');
const { hash } = require('bcryptjs');
const { TipoInstituicao } = require('../utils/enums');
const MODO_APLICACAO = require('../utils/appMode');
const encrypt = require('../utils/encrypt')


const DecriptData = async (textData) => {
    const buffer = new Buffer.from(textData, 'utf8');
    const decriptData = await encrypt.dencriptJsonData(buffer);
    return decriptData;
}


const SetFileCentral = async (payload) => {

    const decriptData = await DecriptData(payload.data);
    if (!decriptData)
        return { status: false, text: "Arquivo inválido" };

    if (decriptData.modo_aplicacao == MODO_APLICACAO.modo)
        return { status: false, text: "Arquivo não condiz com o tipo da aplicação, verifique se o arquivo foi gerado em uma Entidade" };


    for (let index = 0; index < decriptData.AtestadoFrequencia.length; index++) {
        const AtestadoFrequencia = decriptData.AtestadoFrequencia[index];

        let checkAtestadoExistente = await db.models.AtestadoFrequencia.findOne({
            where: {
                ref_integracao: AtestadoFrequencia.id
            }
        });

        if (!checkAtestadoExistente) {
            checkAtestadoExistente = await db.models.AtestadoFrequencia.create({

                dt_entrada: AtestadoFrequencia.dt_entrada,
                dt_saida: AtestadoFrequencia.dt_saida,
                observacao: AtestadoFrequencia.observacao,
                AgendamentoId: AtestadoFrequencia.AgendamentoId,
                ref_integracao: AtestadoFrequencia.id

            }).finally(() => {
                db.sequelize.close();
            });

        }
        else {

            checkAtestadoExistente.dt_entrada.AtestadoFrequencia.dt_entrada;
            checkAtestadoExistente.dt_saida.AtestadoFrequencia.dt_saida;
            checkAtestadoExistente.observacao.AtestadoFrequencia.observacao;
            await checkAtestadoExistente.save().finally(() => {
                db.sequelize.close();
            });
        }

    }

    return {
        status: true,
        text: "Arquivo Importado!"
    }


}


const SetFileEntidade = async (payload) => {
    const decriptData = await DecriptData(payload.data);
    if (!decriptData)
        return { status: false, text: "Arquivo inválido" };

    if (decriptData.modo_aplicacao == MODO_APLICACAO.modo)
        return { status: false, text: "Arquivo não condiz com o tipo da aplicação, verifique se o arquivo foi gerado em uma Central" };

    var Entidade = await db.models.Entidade.findOne(
        {
            where: {
                tipo_instituicao: TipoInstituicao.Entidade
            },
            include: [
                { model: db.models.Endereco }
            ],
        });

    if (!Entidade) {

        Entidade = await db.models.Endereco.create({

            rua: decriptData.Entidade.endereco.rua,
            cep: decriptData.Entidade.endereco.cep,
            numero: decriptData.Entidade.endereco.numero,
            bairro: decriptData.Entidade.endereco.bairro,
            complemento: decriptData.Entidade.endereco.complemento,
            CidadeId: decriptData.Entidade.endereco.CidadeId,


        }).then(async (endereco) => {
            Entidade = await db.models.Entidade.create({
                nome: decriptData.Entidade.nome,
                cnpj: decriptData.Entidade.cnpj,
                email: decriptData.Entidade.email,
                telefone1: decriptData.Entidade.telefone1,
                telefone2: decriptData.Entidade.telefone2,
                tipo_instituicao: TipoInstituicao.Entidade,
                ref_integracao: decriptData.Entidade.id,
                dt_descredenciamento: decriptData.Entidade.dt_descredenciamento,
                EnderecoId: endereco.id
            });
        });
    }
    else if (Entidade.ref_integracao != decriptData.Entidade.id) {
        return { status: false, text: "Entidade do arquivo divergente da existente no banco de dados" };
    } else {

        Entidade.nome = decriptData.Entidade.nome;
        Entidade.cnpj = decriptData.Entidade.cnpj;
        Entidade.email = decriptData.Entidade.email;
        Entidade.telefone1 = decriptData.Entidade.telefone1;
        Entidade.telefone2 = decriptData.Entidade.telefone2;
        Entidade.tipo_instituicao = decriptData.Entidade.tipo_instituicao;
        Entidade.dt_descredenciamento = decriptData.Entidade.dt_descredenciamento;
        Entidade.observacao = decriptData.Entidade.observacao;

        Entidade.Endereco.rua = decriptData.Entidade.endereco.rua;
        Entidade.Endereco.numero = decriptData.Entidade.endereco.numero;
        Entidade.Endereco.cep = decriptData.Entidade.endereco.cep;
        Entidade.Endereco.bairro = decriptData.Entidade.endereco.bairro;
        Entidade.Endereco.complemento = decriptData.Entidade.endereco.complemento;
        Entidade.Endereco.CidadeId = decriptData.Entidade.endereco.CidadeId;

        await Entidade.save();
        await Entidade.Endereco.save();
    }

    for (let index = 0; index < decriptData.Centrais.length; index++) {

        const Central = decriptData.Centrais[index];

        let centralExistente = await db.models.Entidade.findOne({
            where: {
                ref_integracao: Central.id
            },
            include: [
                { model: db.models.Endereco }
            ]
        });

        if (!centralExistente) {
            await db.models.Endereco.create({

                rua: Central.endereco.rua,
                cep: Central.endereco.cep,
                numero: Central.endereco.numero,
                bairro: Central.endereco.bairro,
                complemento: Central.endereco.complemento,
                CidadeId: Central.endereco.id_cidade

            }).then(async (endereco) => {
                Entidade = await db.models.Entidade.create({
                    nome: Central.nome,
                    cnpj: Central.cnpj,
                    email: Central.email,
                    telefone1: Central.telefone1,
                    telefone2: Central.telefone2,
                    tipo_instituicao: Central.tipo_instituicao,
                    dt_descredenciamento: Central.dt_descredenciamento,
                    observacao: Central.observacao,
                    ref_integracao: Central.id,
                    EnderecoId: endereco.id
                });
            });

        } else {

            centralExistente.nome = Central.nome;
            centralExistente.cnpj = Central.cnpj;
            centralExistente.email = Central.email;
            centralExistente.telefone1 = Central.telefone1;
            centralExistente.telefone2 = Central.telefone2;
            centralExistente.tipo_instituicao = Central.tipo_instituicao;
            centralExistente.observacao = Central.observacao;
            centralExistente.dt_descredenciamento = Central.dt_descredenciamento;

            centralExistente.Endereco.rua = Central.endereco.rua;
            centralExistente.Endereco.cep = Central.endereco.cep;
            centralExistente.Endereco.numero = Central.endereco.numero;
            centralExistente.Endereco.bairro = Central.endereco.bairro;
            centralExistente.Endereco.complemento = Central.endereco.complemento;
            centralExistente.Endereco.CidadeId = Central.endereco.CidadeId;

            await centralExistente.save();
            await centralExistente.Endereco.save();
        }
    }

    let Prestadores = decriptData.Processos.map(s => s.Prestador);

    for (let index = 0; index < Prestadores.length; index++) {

        const Prestador = Prestadores[index];
        // let EnderecoPrestador = Prestador.Endereco;

        let prestadorExistente = await db.models.Prestador.findOne({
            where: {
                ref_integracao: Prestador.id
            },
            // include: [
            //     { model: db.models.Endereco }
            // ]
        });

        if (!prestadorExistente) {

            // let Endereco = await db.models.Endereco.create({
            //     nome: EnderecoPrestador.nome,
            //     rua: EnderecoPrestador.rua,
            //     cep: EnderecoPrestador.cep,
            //     numero: EnderecoPrestador.numero,
            //     bairro: EnderecoPrestador.bairro,
            //     complemento: EnderecoPrestador.complemento,
            //     CidadeId: EnderecoPrestador.CidadeId
            // });


            prestadorExistente = await db.models.Prestador.create({

                // EnderecoId: Endereco.id,
                nome: Prestador.nome,
                // cpf: Prestador.cpf,
                // nome_mae: Prestador.nome_mae,
                dt_nascimento: Prestador.dt_nascimento,
                // estado_civil: Prestador.estado_civil,
                // etnia: Prestador.etnia,
                // escolaridade: Prestador.escolaridade,
                // renda_familiar: Prestador.renda_familiar ?? 0,
                telefone1: Prestador.telefone1,
                // telefone2: Prestador.telefone2,
                // religiao: Prestador.religiao,
                image: Prestador.image,
                ref_integracao: Prestador.id

            });

        }
        else {
            prestadorExistente.nome = Prestador.nome;
            // prestadorExistente.cpf = Prestador.cpf;
            // prestadorExistente.nome_mae = Prestador.nome_mae;
            prestadorExistente.dt_nascimento = Prestador.dt_nascimento;
            // prestadorExistente.estado_civil = Prestador.estado_civil;
            // prestadorExistente.etnia = Prestador.etnia;
            // prestadorExistente.escolaridade = Prestador.escolaridade;
            // prestadorExistente.renda_familiar = Prestador.renda_familiar ?? 0;
            prestadorExistente.telefone1 = Prestador.telefone1;
            // prestadorExistente.telefone2 = Prestador.telefone2;
            // prestadorExistente.religiao = Prestador.religiao;
            prestadorExistente.image = Prestador.image;
            await prestadorExistente.save();

            // prestadorExistente.Endereco.nome = EnderecoPrestador.nome;
            // prestadorExistente.Endereco.rua = EnderecoPrestador.rua;
            // prestadorExistente.Endereco.cep = EnderecoPrestador.cep;
            // prestadorExistente.Endereco.numero = EnderecoPrestador.numero;
            // prestadorExistente.Endereco.bairro = EnderecoPrestador.bairro;
            // prestadorExistente.Endereco.complemento = EnderecoPrestador.complemento;
            // prestadorExistente.Endereco.CidadeId = EnderecoPrestador.CidadeId;
            // await prestadorExistente.Endereco.save();
        }


        // prestadorExistente.setBeneficios([]);
        // for (let index = 0; index < Prestador.Beneficios.length; index++) {
        //     const Beneficio = Prestador.Beneficios[index];

        //     let beneficioExistente = await db.models.Beneficio.findOne({
        //         where:{
        //             ref_integracao: Beneficio.id
        //         }
        //     });

        //     if(beneficioExistente){
        //         beneficioExistente.nome = Beneficio.nome;
        //         beneficioExistente.observacao = Beneficio.observacao;
        //         await beneficioExistente.save();
        //     }
        //     else{
        //         beneficioExistente = await db.models.Beneficio.create({
        //             nome: Beneficio.nome,
        //             observacao: Beneficio.observacao,
        //             PrestadorId: prestadorExistente.id
        //         });
        //     }

        //     await prestadorExistente.addBeneficios([beneficioExistente]);
        //     await beneficioExistente.addPrestadores([prestadorExistente]);


        // }




    }


    for (let index = 0; index < decriptData.Processos.length; index++) {

        let Processo = decriptData.Processos[index];

        let Vara = Processo.Vara;

        let varaExistente = await db.models.Vara.findOne({
            where: {
                ref_integracao: Vara.id
            }
        });

        if (!varaExistente) {
            varaExistente = await db.models.Vara.create({
                descricao: Vara.descricao,
                ref_integracao: Vara.id
            });
        }
        else {

            varaExistente.descricao = Vara.descricao;
            await varaExistente.save();
        }

        let centralExistente = await db.models.Entidade.findOne({
            where: {
                ref_integracao: Processo.id_central
            }
        });

        let prestadorExistente = await db.models.Prestador.findOne({
            where: {
                ref_integracao: Processo.Prestador.id
            }
        });


        let processoExistente = await db.models.Processo.findOne({
            where: {
                ref_integracao: Processo.id
            }
        });

        if (!processoExistente) {

            processoExistente = await db.models.Processo.create({
                EntidadeId: centralExistente.id,
                PrestadoreId: prestadorExistente.id,
                VaraId: varaExistente.id,
                nro_processo: Processo.nro_processo,
                // nro_artigo_penal: Processo.nro_artigo_penal,
                // pena_originaria: Processo.pena_originaria,
                // pena_originaria_regime: Processo.pena_originaria_regime,
                // inciso: Processo.inciso,
                // detalhamento: Processo.detalhamento,
                // prd: Processo.prd,
                // prd_descricao: Processo.prd_descricao,
                horas_cumprir: Processo.horas_cumprir,
                // possui_multa: Processo.possui_multa,
                // valor_a_pagar: Processo.valor_a_pagar,
                // qtd_penas_anteriores: Processo.qtd_penas_anteriores,
                // persecucao_penal: Processo.persecucao_penal,
                ref_integracao: Processo.id
            })

        }
        else {
            processoExistente.EntidadeId = centralExistente.id;
            processoExistente.PrestadoreId = prestadorExistente.id;
            processoExistente.nro_processo = Processo.nro_processo;
            // processoExistente.nro_artigo_penal = Processo.nro_artigo_penal;
            // processoExistente.pena_originaria = Processo.pena_originaria;
            // processoExistente.pena_originaria_regime = Processo.pena_originaria_regime;
            // processoExistente.inciso = Processo.inciso;
            // processoExistente.detalhamento = Processo.detalhamento;
            // processoExistente.prd = Processo.prd;
            // processoExistente.prd_descricao = Processo.prd_descricao;
            processoExistente.horas_cumprir = Processo.horas_cumprir;
            // processoExistente.possui_multa = Processo.possui_multa;
            // processoExistente.valor_a_pagar = Processo.valor_a_pagar;
            // processoExistente.qtd_penas_anteriores = Processo.qtd_penas_anteriores;
            // processoExistente.persecucao_penal = Processo.persecucao_penal;
            processoExistente.ref_integracao = Processo.id;

            await processoExistente.save();
        }


    }


    let Tarefas = decriptData.Entidade.tarefa;

    for (let index = 0; index < Tarefas.length; index++) {
        const Tarefa = Tarefas[index];

        let tarefaExistente = await db.models.Tarefa.findOne({
            where: {
                ref_integracao: Tarefa.id
            }
        });

        if (!tarefaExistente) {

            tarefaExistente = await db.models.Tarefa.create({
                ref_integracao: Tarefa.id,
                titulo: Tarefa.titulo,
                descricao: Tarefa.descricao,
                status: Tarefa.status,
                EntidadeId: Entidade.id
            })
        }
        else {

            tarefaExistente.titulo = Tarefa.titulo;
            tarefaExistente.descricao = Tarefa.descricao;
            tarefaExistente.status = Tarefa.status;

            await tarefaExistente.save();
        }

    }


    for (let index = 0; index < decriptData.Agendamentos.length; index++) {
        const Agendamento = decriptData.Agendamentos[index];

        let agendamentoExistente = await db.models.Agendamento.findOne({
            where: {
                ref_integracao: Agendamento.id
            }
        });


        let processoExistente = await db.models.Processo.findOne({
            where: {
                ref_integracao: Agendamento.ProcessoId
            }
        });

        let tarefaExistente = await db.models.Tarefa.findOne({
            where: {
                ref_integracao: Agendamento.TarefaId
            }
        });


        if (!agendamentoExistente) {
            agendamentoExistente = await db.models.Agendamento.create({
                ref_integracao: Agendamento.id,
                horario_inicio: Agendamento.horario_inicio,
                horario_fim: Agendamento.horario_fim,
                data_inicial: Agendamento.data_inicial,
                data_final: Agendamento.data_final,
                segunda: Agendamento.segunda,
                terca: Agendamento.terca,
                quarta: Agendamento.quarta,
                quinta: Agendamento.quinta,
                sexta: Agendamento.sexta,
                sabado: Agendamento.sabado,
                domingo: Agendamento.domingo,
                ProcessoId: processoExistente.id,
                TarefaId: tarefaExistente.id,
            });
        }
        else {

            agendamentoExistente.horario_inicio = Agendamento.horario_inicio;
            agendamentoExistente.horario_fim = Agendamento.horario_fim;
            agendamentoExistente.data_inicial = Agendamento.data_inicial;
            agendamentoExistente.data_final = Agendamento.data_final;
            agendamentoExistente.segunda = Agendamento.segunda;
            agendamentoExistente.terca = Agendamento.terca;
            agendamentoExistente.quarta = Agendamento.quarta;
            agendamentoExistente.quinta = Agendamento.quinta;
            agendamentoExistente.sexta = Agendamento.sexta;
            agendamentoExistente.sabado = Agendamento.sabado;
            agendamentoExistente.domingo = Agendamento.domingo;
            agendamentoExistente.ProcessoId = processoExistente.id;
            agendamentoExistente.TarefaId = tarefaExistente.id;

            await agendamentoExistente.save();
        }

    }


    const DefaultUser = decriptData.DefaultUser;
    const adminUser = await db.models.Usuario.findOne({
        where: {
            usuario: DefaultUser.usuario
        }
    });

    if (adminUser == null) {

        await db.models.Usuario.create({
            nome: DefaultUser.nome,
            usuario: DefaultUser.usuario,
            senha: DefaultUser.senha,
            EntidadeId: Entidade.id
        });

    }

    return {
        status: true,
        text: "Arquivo Importado!"
    }



}


const GetFileCentral = async (payload) => {
    const id_entidade = payload.entidade.value;

    const Entidade = await db.models.Entidade.findByPk(id_entidade,
        {
            include: [
                { model: db.models.Endereco },
                { model: db.models.Tarefa }
            ],
        });


    if (!Entidade)
        return { status: false, text: "Entidade não localizada!" };


    const Centrais = await db.models.Entidade.findAll(
        {
            where: {
                tipo_instituicao: TipoInstituicao.Central
            },
            include: [
                { model: db.models.Endereco }
            ],
        });


    const id_tarefas = Entidade.Tarefas.map(s => s.id);


    const Agendamentos = await db.models.Agendamento.findAll({
        where: {
            TarefaId: id_tarefas
        }
    });


    const id_processos = Agendamentos.map(s => s.ProcessoId);

    const Processos = await db.models.Processo.findAll({
        where: {
            id: id_processos
        },
        include: [
            {
                model: db.models.Prestador,
                include: [
                    { model: db.models.Endereco },
                    // { model: db.models.Trabalho },
                    // { model: db.models.Familiar },
                    // {
                    //     model: db.models.Beneficio,
                    //     through: "PrestadoresBeneficios"
                    // },
                    // {
                    //     model: db.models.Habilidade,
                    //     through: "PrestadoresHabilidades"
                    // },
                    // {
                    //     model: db.models.Curso,
                    //     through: "PrestadoresCursos"
                    // },

                    // {
                    //     model: db.models.FichaMedica,
                    //     include: {
                    //         model: db.models.Droga,
                    //         through: "FichaMedicaDrogas"
                    //     }
                    // },
                ]
            },
            { model: db.models.Vara }
        ]
    }
    );


    const AgendamentosData = Agendamentos.map(s => {
        return {
            id: s.id,
            horario_inicio: s.horario_inicio,
            horario_fim: s.horario_fim,
            data_inicial: s.data_inicial,
            data_final: s.data_final,
            segunda: s.segunda,
            terca: s.terca,
            quarta: s.quarta,
            quinta: s.quinta,
            sexta: s.sexta,
            sabado: s.sabado,
            domingo: s.domingo,
            ProcessoId: s.ProcessoId,
            TarefaId: s.TarefaId,
        }
    });

    const ProcessosData = Processos.map(s => {
        return {

            id: s.id,
            id_central: s.EntidadeId,
            nro_processo: s.nro_processo,
            // nro_artigo_penal: s.nro_artigo_penal,
            // pena_originaria: s.pena_originaria,
            // pena_originaria_regime: s.pena_originaria_regime,
            // inciso: s.inciso,
            // detalhamento: s.detalhamento,
            // prd: s.prd,
            // prd_descricao: s.prd_descricao,
            horas_cumprir: s.horas_cumprir,
            // possui_multa: s.possui_multa,
            // valor_a_pagar: s.valor_a_pagar,
            // qtd_penas_anteriores: s.qtd_penas_anteriores,
            // persecucao_penal: s.persecucao_penal,

            Vara: {
                id: s.Vara.id,
                descricao: s.Vara.descricao
            },

            Prestador: {
                id: s.Prestadore.id,
                // cpf: s.Prestadore.cpf,
                nome: s.Prestadore.nome,
                image: s.Prestadore.image,
                // nome_mae: s.Prestadore.nome_mae,
                dt_nascimento: s.Prestadore.dt_nascimento,
                // estado_civil: s.Prestadore.estado_civil,
                // etnia: s.Prestadore.etnia,
                // escolaridade: s.Prestadore.escolaridade,
                // renda_familiar: s.Prestadore.renda_familiar,
                telefone1: s.Prestadore.telefone1,
                // telefone2: s.Prestadore.telefone2,
                // religiao: s.Prestadore.religiao,

                // Beneficios: s.Prestadore.Beneficios.map(b => { //ok
                //     return {
                //         id: b.id,
                //         nome: b.nome,
                //         observacao: b.observacao
                //     }
                // }),

                // Familiares: s.Prestadore.Familiares.map(b => {
                //     return {
                //         id: b.id,
                //         familiar_nome: b.nome,
                //         familiar_parentesco: b.parentesco,
                //         familiar_idade: b.idade,
                //         familiar_profissao: b.profissao,
                //     }
                // }),

                // Habilidades: s.Prestadore.Habilidades.map(b => {
                //     return {
                //         id: b.id,
                //         descricao: b.descricao,
                //         observacao: b.observacao,
                //     }
                // }),

                // Cursos: s.Prestadore.Cursos.map(b => {
                //     return {
                //         id: b.id,
                //         descricao: b.descricao,
                //         observacao: b.observacao,
                //     }
                // }),

                // Endereco: {
                //     id: s.Prestadore.Endereco.id,
                //     rua: s.Prestadore.Endereco.rua,
                //     numero: s.Prestadore.Endereco.numero,
                //     cep: s.Prestadore.Endereco.cep,
                //     bairro: s.Prestadore.Endereco.bairro,
                //     complemento: s.Prestadore.Endereco.complemento,
                //     CidadeId: s.Prestadore.Endereco.CidadeId,
                // },

                // Trabalho: {
                //     id: s.Prestadore.Trabalho.id,
                //     descricao: s.Prestadore.Trabalho.descricao,
                //     horario_inicio: s.Prestadore.Trabalho.horario_inicio,
                //     horario_fim: s.Prestadore.Trabalho.horario_fim,
                //     segunda: s.Prestadore.Trabalho.segunda,
                //     terca: s.Prestadore.Trabalho.terca,
                //     quarta: s.Prestadore.Trabalho.quarta,
                //     quinta: s.Prestadore.Trabalho.quinta,
                //     sexta: s.Prestadore.Trabalho.sexta,
                //     sabado: s.Prestadore.Trabalho.sabado,
                //     domingo: s.Prestadore.Trabalho.domingo,
                // },

                // FichaMedica: {
                //     id: s.Prestadore.FichaMedica.id,
                //     deficiencia: s.Prestadore.FichaMedica.deficiencia,
                //     observacao: s.Prestadore.FichaMedica.observacao,
                //     drogas: s.Prestadore.FichaMedica.Drogas.map(b => {
                //         return {
                //             id: b.id,
                //             nome: b.nome,
                //             observacao: b.observacao,
                //             frequencia: b.FichaMedicaDrogas.frequencia,
                //         }
                //     })
                // }

            }

        }
    }
    );

    const CentraisData = Centrais.map(s => {
        return {
            id: s.id,
            nome: s.nome,
            cnpj: s.cnpj,
            email: s.email,
            telefone1: s.telefone1,
            telefone2: s.telefone2,
            tipo_instituicao: s.tipo_instituicao,
            dt_descredenciamento: s.dt_descredenciamento,
            observacao: s.observacao,
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
    })

    const EntidadeData = {
        id: Entidade.id,
        nome: Entidade.nome,
        cnpj: Entidade.cnpj,
        email: Entidade.email,
        telefone1: Entidade.telefone1,
        telefone2: Entidade.telefone2,
        tipo_instituicao: Entidade.tipo_instituicao,
        dt_descredenciamento: Entidade.dt_descredenciamento,
        observacao: Entidade.observacao,
        endereco: {
            id: Entidade.Endereco.id,
            rua: Entidade.Endereco.rua,
            numero: Entidade.Endereco.numero,
            cep: Entidade.Endereco.cep,
            bairro: Entidade.Endereco.bairro,
            complemento: Entidade.Endereco.complemento,
            CidadeId: Entidade.Endereco.CidadeId,
        },
        tarefa: Entidade.Tarefas.map(a => {
            return {
                id: a.id,
                titulo: a.titulo,
                descricao: a.descricao,
                status: a.status
            }
        }),
    }

    const defaultAdminUser = {
        usuario: "admin",
        nome: "Administrador",
        senha: await hash("C1appAdm1n", 8),
        EntidadeId: id_entidade
    }

    const exportData = {
        modo_aplicacao: MODO_APLICACAO.modo,
        Entidade: EntidadeData, //OK
        Centrais: CentraisData, //OK
        Processos: ProcessosData, //OK
        Agendamentos: AgendamentosData,

        DefaultUser: defaultAdminUser



    }


    let criptData = await encrypt.encriptJsonData(exportData);

    return {
        status: true,
        text: "Arquivo Gerado",
        data: criptData,
        fileName: `syncFile_${Entidade.nome.replaceAll(" ", "")}.bin`
    }
}


const GetFileEntidade = async (payload) => {

    var Entidade = await db.models.Entidade.findOne(
        {
            where: {
                tipo_instituicao: TipoInstituicao.Entidade
            }
        });

    var AtestadosFrequencia = await db.models.AtestadoFrequencia.findAll({
        include: db.models.Agendamento
    });

    const exportData = {
        modo_aplicacao: MODO_APLICACAO.modo,
        AtestadoFrequencia: AtestadosFrequencia.map(s => {
            return {

                id: s.id,
                dt_entrada: s.dt_entrada,
                dt_saida: s.dt_saida,
                observacao: s.observacao,
                AgendamentoId: s.Agendamento.ref_integracao
            }
        }),

    };


    let criptData = await encrypt.encriptJsonData(exportData);

    return {
        status: true,
        data: criptData,
        text: "Arquivo Gerado",
        fileName: `syncFileEntidade_${Entidade.nome.replaceAll(" ", "")}.bin`
    }

}

module.exports = {

    async GetFile(payload) {

        if (MODO_APLICACAO.modo === MODO_APLICACAO.MODO_APLICACAO.Central) {

            return await GetFileCentral(payload);

        }
        else {
            return await GetFileEntidade(payload);
        }

    },



    async SetFile(payload) {

        if (MODO_APLICACAO.modo === MODO_APLICACAO.MODO_APLICACAO.Central) {

            return await SetFileCentral(payload);

        }
        else {
            return await SetFileEntidade(payload);
        }
    }

}