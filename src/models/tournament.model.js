const { is } = require('express/lib/request');
const query = require('../db/db-connection');
const { multipleColumnSet } = require('../utils/common.utils');
const NumericIdGenerator = require("nodejs-unique-numeric-id-generator");
const { json } = require('express');

class TournamentModel {
    tableName = 'tournament';

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
    * Create a new tournament
    */
    create = async () => {
        let isActive = 1;

        let uniqueTournamentId = 'TOUR-' + NumericIdGenerator.generate(new Date().toJSON());

        console.log(new Date().toJSON());

        let startTime = new Date();
        // let endTime = new Date(startTime.getTime() + 1 * 60000);
        let endTime=null;

        console.log(startTime, endTime);

        // let minNum = 0;
        // let maxNum = 36;

        /* generate result number */
        // let resultNumber = Math.floor(Math.random() * (maxNum - minNum) + minNum);
        let resultNumber = null;

        console.log(resultNumber);

        const sql = `INSERT INTO ${this.tableName}
        (t_unique_id,t_start_time,t_end_time, result_number, is_active) VALUES (?,?,?,?,?)`;

        const result = await query(sql, [uniqueTournamentId, startTime, endTime, resultNumber, isActive]);

        return uniqueTournamentId;
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

module.exports = new TournamentModel();
