
const Login = require('../controllers/loginController');
const Usuarios = require('../controllers/usuariosController');
const Config = require('../controllers/configController');
const Habilidade = require('../controllers/habilidadeController');
const Curso = require('../controllers/cursoController');
const Droga = require('../controllers/drogaController');
const Beneficio = require('../controllers/beneficioController');
const Cidades = require('../controllers/cidadesController');
const Prestador = require('../controllers/prestadorController');
module.exports = {

    async Action(controller, action, params) {
        return await eval(`${controller}.${action}`)(params).then((results)=>{
            return (results);
          });
    
    }

}