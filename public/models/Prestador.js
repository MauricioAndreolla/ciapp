const { Model, DataTypes } = require('sequelize');
const ModoAplicacao = require('../utils/appMode');
const Database = require("../config/database");

class Prestador extends Model { }

Prestador.init({
    nome: {
        type: DataTypes.STRING,
    },
    cpf: {
        type: DataTypes.STRING,
        unique: true
    },
    nome_mae: {
        type: DataTypes.STRING,
    },

    dt_nascimento: {
        type: DataTypes.DATE,
    },
    estado_civil: {
        type: DataTypes.INTEGER,
    },
    etnia: {
        type: DataTypes.INTEGER,
    },
    escolaridade: {
        type: DataTypes.INTEGER,
    },
    renda_familiar: {
        type: DataTypes.DOUBLE,
    },
    telefone1: {
        type: DataTypes.STRING,
    },
    telefone2: {
        type: DataTypes.STRING,
    },
    religiao: {
        type: DataTypes.STRING,
    },
    ref_integracao: {
        type: DataTypes.INTEGER,
    },
    image: {
        type: DataTypes.BLOB('long'),
        get() {
          let buffer = this.getDataValue('image');

          if(!buffer) return null;
  
          let imgBase64 = "";
  
          if(Database.dialet === 0){
            imgBase64 = Buffer.from(buffer).toString('base64');
            if(imgBase64) imgBase64 = `data:image/jpeg;base64,${imgBase64}`;
          }
          else{
            imgBase64 = Buffer.from(buffer).toString();
          }
          
          return imgBase64;
        }
      }

}, {
    sequelize: Database.sequelize,
    modelName: 'Prestadores'
});

module.exports = Prestador;