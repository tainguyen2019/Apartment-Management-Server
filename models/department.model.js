const TABLE_NAMES = require('../constants/tables');
const dbService = require('../services/db.service');

class Department {
  constructor() {
    this.tableName = TABLE_NAMES.department;
  }

  async getAll() {
    const { rows: departments } = await dbService.search(this.tableName, '*');
    return departments;
  }

  async getDepartment(staffId) {
    const queryString = `
    select * from department where id = 
    (select department_id from job_position where id=(
     select position_id from staff
     where id=$1 
    ))`;
    const { rows } = await dbService.query(queryString, [staffId]);

    return rows[0];
  }
}

const departmentModel = new Department();

module.exports = departmentModel;
