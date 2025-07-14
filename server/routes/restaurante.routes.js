const RestauranteController = require('../controllers/restaurante.controller');
//Que es una ruta de express?
//Cual es la estructura?
//En terminos generales, como un endpoint, un path (ruta), está el controlador, 
module.exports = function(app) {
    app.post("/restaurantes/nuevo", RestauranteController.CreateRestaurante);
    app.get("/restaurantes", RestauranteController.getAllRestaurantes);
    app.get("/restaurantes/:id", RestauranteController.getRestaurante);
    app.put("/restaurantes/:id", RestauranteController.updateRestaurante);
    app.delete("/restaurantes/:id", RestauranteController.deleteRestaurante);
}