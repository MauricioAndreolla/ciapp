

const Usuario = require('./Usuario');
const Habilidade = require('./Habilidade');
const Entidade = require('./Entidade');
const Beneficio = require('./Beneficio');
const Curso = require('./Curso');
const Droga = require('./Droga');
const Cidade = require('./Cidade');
const UF = require('./UF');
const Endereco = require('./Endereco');
const Prestador = require('./Prestador');
const Familiar = require('./Familiar');
const FichaMedica = require('./FichaMedica');
const Trabalho = require('./Trabalho');
const FichaMedicaDrogas = require('./FichaMedicaDrogas');
const Vara = require('./Vara');
const Processo = require('./Processo');
const Tarefa = require('./Tarefa');
const Agendamento = require('./Agendamento');
const AtestadoFrequencia = require('./AtestadoFrequencia');

Endereco.belongsTo(Cidade);
Cidade.belongsTo(UF);

Endereco.hasOne(Prestador);
Prestador.belongsTo(Endereco);

Familiar.belongsTo(Prestador);
Prestador.hasMany(Familiar);

Trabalho.belongsTo(Prestador);
Prestador.hasOne(Trabalho);

// Prestador.hasMany(Beneficio);
// Beneficio.hasMany(Prestador);
Prestador.belongsToMany(Beneficio, {through: "PrestadoresBeneficios"});
Beneficio.belongsToMany(Prestador, {through: "PrestadoresBeneficios"});

Prestador.belongsToMany(Habilidade, {through: "PrestadoresHabilidades"});
Habilidade.belongsToMany(Prestador, {through: "PrestadoresHabilidades"});

Prestador.belongsToMany(Curso, {through: "PrestadoresCursos"});
Curso.belongsToMany(Prestador, {through: "PrestadoresCursos"});

FichaMedica.belongsTo(Prestador);
Prestador.hasOne(FichaMedica);

Vara.hasMany(Processo);
Processo.belongsTo(Vara);

Prestador.hasMany(Processo);
Processo.belongsTo(Prestador);


Entidade.hasMany(Processo);
Processo.belongsTo(Entidade);

Endereco.hasOne(Entidade);
Entidade.belongsTo(Endereco);

Entidade.hasMany(Tarefa);

Agendamento.hasMany(AtestadoFrequencia);
AtestadoFrequencia.hasOne(Agendamento);


Agendamento.belongsTo(Processo);
Agendamento.belongsTo(Tarefa);

Processo.hasMany(Agendamento);

FichaMedica.belongsToMany(Droga, {through: FichaMedicaDrogas});
Droga.belongsToMany(FichaMedica, {through: FichaMedicaDrogas});

module.exports = {
    Agendamento,
    AtestadoFrequencia,
    Tarefa,
    Usuario,
    Entidade,
    Tarefa,
    Habilidade,
    Curso,
    Droga,
    Beneficio,
    UF,
    Cidade,
    Endereco,
    Prestador,
    Familiar,
    FichaMedica,
    Trabalho,
    FichaMedicaDrogas,
    Vara,
    Processo
    
};