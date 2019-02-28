var express = require('express');
var router = express.Router();

//retencion
var retencion = require('../controllers/retencionController');
var retencionController = new retencion();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('retencion', { title: 'Retencion' });
});

router.post('/guardar_retencion',retencionController.guardarRetencion);
router.get('/ver_retencion',retencionController.obtenerRetencion);
router.get('/buscar/:fecha',retencionController.buscarporFecha);
router.get('/reporte',retencionController.generarReporte);

module.exports = router;
