const db = require('../config/database');
const Sequelize = require('sequelize');


module.exports = {

    async GetPrestadores(){
        let Prestadores = await db.models.Prestador.findAll();
    
        return Prestadores.map(s => { return {
            id: s.id,
            cpf: s.cpf,
            nome: s.nome,
            image: s.image,
        }});
    },

    async Create(payload) {
        try {

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
                renda_familiar: parseFloat(payload.prestador.renda_familiar ?? 0),
                telefone1: payload.prestador.telefone1,
                telefone2: payload.prestador.telefone2,
                religiao: payload.prestador.religiao,
                image: buffer

            });

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

                    await db.models.PrestadoresBeneficios.create({
                        BeneficioId: beneficios.id,
                        PrestadoreId: Prestador.id,
                    })

                }
            }


            if (payload.prestador.habilidades.length > 0) {
                for (let i = 0; i < payload.prestador.habilidades.length; i++) {

                    const habilidades = payload.prestador.habilidades[i];

                    await db.models.PrestadoresHabilidades.create({
                        HabilidadeId: habilidades.id,
                        PrestadoreId: Prestador.id,
                    })

                }
            }

            if (payload.prestador.cursos.length > 0) {
                for (let i = 0; i < payload.prestador.cursos.length; i++) {

                    const cursos = payload.prestador.cursos[i];

                    await db.models.PrestadoresCursos.create({
                        CursoId: cursos.id,
                        PrestadoreId: Prestador.id,
                    })

                }
            }

            let FichaMedica = await db.models.FichaMedica.create({
                deficiencia: payload.prestador.saude.deficiencia,
                observacao: payload.prestador.saude.observacao,
            });

            if (payload.prestador.saude.drogas.length > 0) {
                for (let i = 0; i < payload.prestador.saude.drogas.length; i++) {

                    const droga = payload.prestador.saude.drogas[i];

                    await db.models.FichaMedicaDrogas.create({
                        DrogaId: droga.id,
                        FichaMedicaId: FichaMedica.id,
                    })

                }
            }
            return { status: true, text: `Prestador(a) ${Prestador.nome} cadastrado(a) com sucesso!` };

        } catch (error) {
            return { status: false, text: `Erro interno no servidor \n` + error };
        }
    }



}