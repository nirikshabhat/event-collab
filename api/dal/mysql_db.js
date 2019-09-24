import * as mysql from 'mysql'
import * as db_config from "../config/db.json";
import * as util from 'util';

module.exports = {
    getConnection: function () {
        if (this.pool) return this.pool;
        var pool = mysql.createPool({
          connectionLimit:db_config.connection_limit,  
          host     : db_config.host,
          user     : db_config.user,
          password : db_config.password,
          database : db_config.database
        });
        pool.query = util.promisify(pool.query);
        return pool;
      }
}