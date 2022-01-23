const { is } = require('express/lib/request');
const query = require('../db/db-connection');
const { multipleColumnSet } = require('../utils/common.utils');
const ShortId = require('shortid');

class BetsOn {
    tableName = 'bets_on';

    find = async (params = {}) => {
        let sql = `SELECT * FROM ${this.tableName}`;

        if (!Object.keys(params).length) {
            return await query(sql);
        }

        const { columnSet, values } = multipleColumnSet(params);
        sql += ` WHERE ${columnSet}`;

        return await query(sql, [...values]);
    };

    findOne = async (params) => {
        const { columnSet, values } = multipleColumnSet(params);

        const sql = `SELECT * FROM ${this.tableName}
        WHERE ${columnSet}`;

        const result = await query(sql, [...values]);

        // return back the first row (user)
        return result[0];
    };

    /*
    * Create a new user
    */
    create = async ({ tournament_id, user_id, bet_number, points, is_win = 'no_result' }) => {
        /* create unique identification id of the user */
        const sql = `INSERT INTO ${this.tableName}
        (tournament_id, user_id, bet_number, points, is_win) VALUES (?,?,?,?,?)`;

        const result = await query(sql, [tournament_id, user_id, bet_number, points, is_win]);

        return result ? result.affectedRows : 0;;
    };

    update = async (params, id) => {
        const { columnSet, values } = multipleColumnSet(params);

        const sql = `UPDATE ${this.tableName} SET ${columnSet} WHERE id = ?`;

        const result = await query(sql, [...values, id]);

        return result;
    };

    delete = async (id) => {
        const sql = `DELETE FROM ${this.tableName}
        WHERE id = ?`;
        const result = await query(sql, [id]);
        const affectedRows = result ? result.affectedRows : 0;

        return affectedRows;
    };
}

module.exports = new BetsOn();
