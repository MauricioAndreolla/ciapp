const TipoInstituicao = {
    Central: 0,
    Entidade: 1,
}
Object.freeze(TipoInstituicao);


const Escolaridade = {
    Analfabeto: 0,
    FundamentalIncompleto: 1,
    FundamentalCompleto: 2,
    MedioIncompleto: 3,
    MedioCompleto: 4,
    SuperiorIncompleto: 5,
    SuperiorCompleto: 6
}
Object.freeze(Escolaridade);


const Etnia = {
    Branco: 0,
    Preto: 1,
    Pardo: 2,
    Amarela: 3,
    Indigena: 4
}
Object.freeze(Etnia);


const EstadoCivil = {
    Solteiro: 0,
    Casado: 1,
    Separado: 2,
    Divorciado: 3,
    Viuvo: 4,
    UniaoEstavel: 5
}
Object.freeze(EstadoCivil);


const Deficiencia = {
    Nenhuma: 0,
    Mental: 1,
    Auditiva: 2,
    Visual: 3,
    Fisica: 4
}
Object.freeze(Deficiencia);


const Frequencia = {
    NaoUsa: 0,
    Eventualmente: 1,
    ComFrequencia: 2
}
Object.freeze(Frequencia);


const TipoUsuario = {
    root: 2,
    admin: 1,
    normal: 0
}
Object.freeze(TipoUsuario);

const Parentesco = {
    "Pai": 0,
    "Mãe": 1,
    "Filho(a)": 2,
    "Tio(a)": 3,
    "Primo(a)": 4,
    "Avô": 5,
    "Avó": 6,
    "Irmã": 7,
    "Irmão": 8,
    "Esposo(a)": 9,
    "Namorado(a)": 10,
    "Outro(a)": 11
}
Object.freeze(Parentesco);


module.exports = {
    TipoInstituicao: TipoInstituicao,
    EstadoCivil: EstadoCivil,
    Escolaridade: Escolaridade,
    Etnia: Etnia,
    Deficiencia: Deficiencia,
    Frequencia: Frequencia,
    TipoUsuario: TipoUsuario,
    Parentesco: Parentesco
}