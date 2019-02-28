module.exports = function (sequelize, Sequelize) {    
    var Retencion = sequelize.define('retencion', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        nombrePersona: {
            type: Sequelize.STRING(50)
        },
        
        nroFactura: {
            type: Sequelize.STRING(50)
        },
        
        fecha: {
            type: Sequelize.DATEONLY
        }, 
        servicio: {
            type: Sequelize.DOUBLE
        }, 
        monto: {
            type: Sequelize.DOUBLE
        },
        valorRetencion: {
            type: Sequelize.DOUBLE
        },
        estado: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        external_id: {
            type: Sequelize.UUID
        }
        
    },{timestamps: false,
        freezeTableName: true
    });   
    
       
    return Retencion;
};




