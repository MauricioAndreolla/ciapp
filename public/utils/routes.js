
const Login = require('../controllers/loginController');
const Usuarios = require('../controllers/usuariosController');
const Entidades = require('../controllers/entidadesController');
const Agendamentos = require('../controllers/agendamentosController');
const Config = require('../controllers/configController');
const Habilidade = require('../controllers/habilidadeController');
const Curso = require('../controllers/cursoController');
const Droga = require('../controllers/drogaController');
const Beneficio = require('../controllers/beneficioController');
const Cidades = require('../controllers/cidadesController');
const Prestador = require('../controllers/prestadorController');
const Vara = require('../controllers/varaController');
const Processo = require('../controllers/processoController');
const Sincronizacao = require('../controllers/sincronizacaoController');
const Genero = require('../controllers/generosController');
const Atendimento = require('../controllers/atendimentoController');
const Origem = require('../controllers/origemController');
const Acolhimento = require('../controllers/acolhimentoController');


module.exports = {

    async Action(controller, action, params) {
        return await eval(`${controller}.${action}`)(params).then((results)=>{
            return (results);
          });
    
    }

}