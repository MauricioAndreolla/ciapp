
const Authentication = require('../utils/authentication');

module.exports = {

    async Authenticate(args){
        return Authentication.Authenticate(args.usuario, args.senha);
    }


}