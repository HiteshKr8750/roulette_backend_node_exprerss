const { is } = require('express/lib/request');
const query = require('../db/db-connection');
const { multipleColumnSet } = require('../utils/common.utils');
const Role = require('../utils/userRoles.utils');
const ShortId = require('shortid');
class UserModel {
	tableName = 'users';
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
	create = async ({ email, password, first_name, last_name, role }) => {
		/* create uniue username for each user created by the super-admin */
		let username = await this.generateUniqueAccountName(first_name + last_name);
		console.log(`unique username: ${username}`);

		/* create unique identification id of the user */
		let userUniqueId = ShortId.generate();
		console.log(`unique user id:  ${userUniqueId}`);

		const sql = `INSERT INTO ${this.tableName}
        (unique_id,username,password, first_name, last_name, email, role) VALUES (?,?,?,?,?,?,?)`;

		const result = await query(sql, [userUniqueId, username, password, first_name, last_name, email, role]);

		return result ? result.affectedRows : 0;;
	};

	/* generate user unique username */
	generateUniqueAccountName = async (proposedName) => {
		const user = await this.findOne({ username: proposedName });
		/* user exist in db with this username */
		if (user) {
			proposedName += Math.floor((Math.random() * 100) + 1);
			return this.generateUniqueAccountName(proposedName);
		}
		return proposedName;
	}

	update = async (params, id) => {
		const { columnSet, values } = multipleColumnSet(params);

		const sql = `UPDATE user SET ${columnSet} WHERE id = ?`;

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

module.exports = new UserModel();
