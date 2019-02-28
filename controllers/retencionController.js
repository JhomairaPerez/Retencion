'use strict';
var models = require('../models/ind');
var Retencion = models.retencion;
const uuidv4 = require('uuid/v4');
var pdf = require('html-pdf');
let fs = require('fs');
class RetencionController {
    guardarRetencion(req, res, next) {
        if (req.body.external === '0') {
            Retencion.create({
                nombrePersona: req.body.nombrePersona,
                nroFactura: req.body.nroFactura,
                fecha: req.body.fecha,
                servicio: req.body.servicio,
                monto: req.body.monto,
                valorRetencion: req.body.valorRetencion,
                external_id: uuidv4()
            }).then(function (newRetencion) {
                if (newRetencion) {
                    res.redirect('/');
                    console.log('Se guardo Retencion');
                    req.flash('info', 'No se guardo la retencion', false);
                }
            });
        } else {
            Retencion.update({
                nombrePersona: req.body.nombrePersona,
                nroFactura: req.body.nroFactura,
                fecha: req.body.fecha,
                servicio: req.body.servicio,
                monto: req.body.monto,
                valorRetencion: req.body.valorRetencion
            }, {where: {external_id: req.body.external}}).then(function (updateRetencion, created) {
                if (updateRetencion) {
                    res.redirect('/');
                    req.flash('info', 'Se ha modificado correctamente', false);
                    console.log('Se modifico retencion............');
                }
            });
        }

    }
    buscarporFecha(req, res) {
        var fecha = req.params.fecha;
        var arra = fecha.split('-');
        var fe = arra[0];
        if (arra[1] * 1 > 9) {
            fe += '-' + (arra[1] * 1 + 1) + '-' + arra[2];
        } else {
            fe += '-0' + (arra[1] * 1 + 1) + '-' + arra[2];
        }
        var fel = fe;
        Retencion.findAll({where: {fecha: {"$between": [fecha, fel]}}}).then(function (retenciones) {
            res.status(200).json(retenciones);
        }).catch(function (err) {
            res.status(500).json(err);
        });
    }
    
    obtenerRetencion(req, res) {
        Retencion.findAll({}).then(function (retencion) {
            res.status(200).json(retencion);
        });
    }

     generarReporte(req, res) {
        Retencion.findAll({}).then(function (retencion) {
            console.log(retencion);
            var nombreArchivo = 'reporte.pdf';//variable para dar nombre al archivo pdf
             var estiloTabla = '<style>table {font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;border-collapse: collapse;width: 100%;font-size:70%;}\n\
                    table td, #customers th {border: 1px solid #ddd;padding: 8px;}table tr:nth-child(even){background-color: #f2f2f2;}\n\
                    table th {padding-top: 12px;padding-bottom: 12px;text-center: left;background-color: #040001;color: white;}</style>';
        var contenido = estiloTabla + '<div id="pageHeader" style="border-bottom: 1px solid #ddd; padding-bottom: 5px;">\n\
                        <p style="color: #666; margin: 0; padding-top: 12px; padding-bottom: 5px; text-align:right; font-family: sans-serif; font-size: .85em">';
        contenido += '</p></div><div style="background-color: #fafafa;  margin:1rem;padding:1rem;text-align: center; ">\n\
                        Reportes de retenciones\n\
                        <br>\n\
                        <br>\n\
                        <br>\n\
                        <table>\n\
                        <thead style="text-align: center;">\n\
                          <tr>\n\
                            <th>Nro</th>\n\
                            <th>Nombres</th>\n\
                            <th>Nro Factura</th>\n\
                            <th>Fecha</th>\n\
                            <th>Servicio</th>\n\
                            <th>Monto</th>\n\
                            <th>Valor Retencion</th>\n\
                          </tr>\n\
                        </thead>\n\
                        <tbody>';
        for (var i = 0; i < retencion.length; i++) {
            contenido += '<tr>';
            contenido += ' <td>' + (i + 1) + '</td>';
            contenido += '<td>' + retencion[i].nombrePersona + '</td>';
            contenido += '<td>' + retencion[i].nroFactura +'</td>';
            contenido += '<td>' + retencion[i].fecha + '</td>';
            contenido += '<td>' + retencion[i].servicio + '</td>';
            contenido += '<td>' + retencion[i].monto + '</td>';
            contenido += '<td>' + retencion[i].valorRetencion + '</td>';
            contenido += '</tr>';
        }
        contenido += '<div id="pageFooter" style="border-top: 1px solid #ddd; padding-top: 5px;">\n\
                        <p style="color: #666; width: 70%; padding-bottom: 5px; text-align: left; font-family: sans-serif; font-size: .65em; float:center;">\n\
                        Esta lista se creó en una computadora y no es válida sin la firma y el sello.</p>\n\
                        <p style="color: #666; margin: 0; padding-bottom: 5px; text-align: right; font-family:sans-serif; font-size: .65em">Página {{page}} de {{pages}}</p></div>';
            var options = {
                'format': 'A4',
                'header': {
                    'heigth': '60px'
                },
                "footer": {
                    'heigth': '22mm'
                }
            };
            //creacion del pdf
            pdf.create(contenido, options).toFile('public/' + nombreArchivo, function (err, respuesta) {//crreacion del pdf temporal en l acarpeta public reportes
                console.log('toyy aqui...........');
                if (err) {
                    console.log(err);
                } else {
                    console.log(respuesta);
                    res.download('public/' + nombreArchivo, nombreArchivo, function () {//metodo para descargar el pedf
                        fs.unlinkSync('public/' + nombreArchivo);// funcion anonima para elminar el reporte del servidor
                    });
                }
            });
        });
    }

}


module.exports = RetencionController;





