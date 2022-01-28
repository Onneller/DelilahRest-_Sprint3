const db_data   = require('./db_connection_data');
const Sequelize = require('sequelize');
const database  = new Sequelize(db_data.conf_db_name, 
                                db_data.conf_user, 
                                db_data.conf_password,
                                {
                                    host    : db_data.conf_db_host,
                                    dialect : 'mysql',
                                    port    : db_data.conf_port,
                                    dialectOptions  : {
                                        multipleStatements  : true
                                    }
                                })

async function testConnection (){
    try {
        await database.authenticate();
        console.log('Connection has been established successfully');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

testConnection();

module.exports.Select = async (query, data = {}) => {
    return await database.query(query, {
        replacements: data,
        type: database.QueryTypes.SELECT
    });
}

module.exports.query = async (query) =>{
    return await database.query(query)
}

module.exports.Insert = async (query, data = {}) => {
    let result;
    try {
        result = await database.query(query, {
            replacements: data,
            type: database.QueryTypes.INSERT
        });
    } catch (error) {
        result = {
            error: true,
            message: error
        }
    }
    return result;
}

module.exports.Update = async (query, data = {}) => {
    return await database.query(query, {
        replacements: data,
        type: database.QueryTypes.UPDATE
    });
}

module.exports.Delete = async (query, data = {}) => {
    return await database.query(query, {
        replacements: data,
        type: database.QueryTypes.DELETE
    });
}
