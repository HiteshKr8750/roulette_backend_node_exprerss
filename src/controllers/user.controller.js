const UserModel = require('../models/user.model');
const HttpException = require('../utils/HttpException.utils');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Log = require('winston');
const CommonHelper = require('../helpers/common.helper');
const ResponseMessages = require('../helpers/response.helper');
dotenv.config();

/******************************************************************************
 *                              User Controller
 ******************************************************************************/
class UserController {

    getActiveUsers = async (req, res, next) => {
        let userList = await UserModel.find({ is_active: 1 });

        if (!userList.length) {
            res.send(CommonHelper.errorResponse(404, ResponseMessages.USER_NOT_FOUND));
        }

        userList = userList.map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });

        res.send(CommonHelper.response(true, ResponseMessages.SUCCESS_RESPONSE, userList));
    };

    getAllUsers = async (req, res, next) => {
        let userList = await UserModel.find();

        if (!userList.length) {
            res.send(CommonHelper.errorResponse(404, ResponseMessages.USER_NOT_FOUND));
        }

        userList = userList.map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });

        res.send(CommonHelper.response(true, ResponseMessages.SUCCESS_RESPONSE, userList));
    };

    getInactiveUsers = async (req, res, next) => {
        let userList = await UserModel.find({ is_active: 0 });

        if (!userList.length) {
            res.send(CommonHelper.errorResponse(404, ResponseMessages.USER_NOT_FOUND));
        }

        userList = userList.map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });

        res.send(CommonHelper.response(true, ResponseMessages.SUCCESS_RESPONSE, userList));
    };

    getUserById = async (req, res, next) => {
        const user = await UserModel.findOne({ id: req.params.id });
        if (!user) {
            res.send(CommonHelper.errorResponse(404, ResponseMessages.USER_NOT_FOUND));
        }

        const { password, ...userWithoutPassword } = user;

        res.send(CommonHelper.response(true, ResponseMessages.SUCCESS_RESPONSE, userWithoutPassword));
    };

    getUserByuserName = async (req, res, next) => {
        const user = await UserModel.findOne({ username: req.params.username });
        if (!user) {
            res.send(CommonHelper.errorResponse(404, ResponseMessages.USER_NOT_FOUND));
        }

        const { password, ...userWithoutPassword } = user;

        res.send(CommonHelper.response(true, ResponseMessages.SUCCESS_RESPONSE, userWithoutPassword));
    };

    getCurrentUser = async (req, res, next) => {
        const { password, ...userWithoutPassword } = req.currentUser;
        res.send(CommonHelper.response(true, ResponseMessages.SUCCESS_RESPONSE, userWithoutPassword));
    };

    createUser = async (req, res, next) => {
        this.checkValidation(req);
        await this.hashPassword(req);
        console.log(req.body);
        const result = await UserModel.create(req.body);

        if (!result) {
            res.send(CommonHelper.errorResponse(500, ResponseMessages.SOMETHING_WENT_WRONG));
        }

        res.send(CommonHelper.response(true, ResponseMessages.SUCCESS_USER_CREATED));
    };

    updateUser = async (req, res, next) => {
        this.checkValidation(req);

        await this.hashPassword(req);

        const { confirm_password, ...restOfUpdates } = req.body;

        // do the update query and get the result
        // it can be partial edit
        const result = await UserModel.update(restOfUpdates, req.params.id);

        if (!result) {
            res.send(CommonHelper.errorResponse(404, ResponseMessages.SOMETHING_WENT_WRONG));
        }

        const { affectedRows, changedRows, info } = result;

        const message = !affectedRows ? ResponseMessages.USER_NOT_FOUND :
            affectedRows && changedRows ? ResponseMessages.SUCCESS_RESPONSE : ResponseMessages.ERROR_USER_UPDATED;

        res.send(CommonHelper.response(true, message));
    };

    deleteUser = async (req, res, next) => {
        const result = await UserModel.delete(req.params.id);
        if (!result) {
            throw new HttpException(404, 'User not found');
        }
        res.send('User has been deleted');
    };

    userLogin = async (req, res, next) => {
        this.checkValidation(req);

        const { email, password: pass } = req.body;

        const user = await UserModel.findOne({ email });

        if (!user) {
            throw new HttpException(401, 'Unable to login!');
        }

        const isMatch = await bcrypt.compare(pass, user.password);

        if (!isMatch) {
            throw new HttpException(401, 'Incorrect password!');
        }

        // user matched!
        const secretKey = process.env.SECRET_JWT || "";
        const token = jwt.sign({ user_id: user.id.toString() }, secretKey, {
            expiresIn: '24h'
        });


        const { password, ...userWithoutPassword } = user;

        res.send({ ...userWithoutPassword, token });
    };

    checkValidation = (req) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw new HttpException(400, 'Validation faild', errors);
        }
    }

    // hash password if it exists
    hashPassword = async (req) => {
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 8);
        }
    }
}

/******************************************************************************
 *                               Export
 ******************************************************************************/
module.exports = new UserController;
