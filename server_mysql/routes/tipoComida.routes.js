const TipoComidaController = require('../controllers/tipoComida.controller');

module.exports = function(app) {
    app.post("/tipo", TipoComidaController.CreateTipoComida);
    
}