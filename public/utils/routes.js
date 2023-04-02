
const Login = require('../controllers/loginController');
const Usuarios = require('../controllers/usuariosController');
const Centrais = require('../controllers/centraisController');
const Entidades = require('../controllers/entidadesController');
const Agendamentos = require('../controllers/agendamentosController');
const Config = require('../controllers/configController');
module.exports = {

    async Action(controller, action, params) {
        return await eval(`${controller}.${action}`)(params).then((results)=>{
            return (results);
          });
    
    }

}