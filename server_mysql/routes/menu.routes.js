const MenuController = require('../controllers/menu.controller');

module.exports = function(app) {
    app.post("/menu", MenuController.CreateMenu);
    app.get("/menu/restaurante/:id", MenuController.getMenuByRestaurante);
}