const { Pool } = require('pg');
const DBService = require('./DBService');

class DBPoolService extends DBService {
  constructor(props) {
    super(props);

    this.pool = new Pool(this.config);
  }

  async disconnect() {
    await super.disconnect();
    await this.pool.end();
  }

  query(query, params) {
    return this.pool.query(query, params);
  }
}

module.exports = DBPoolService;
