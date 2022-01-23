const HttpException = require('../../utils/HttpException.utils');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Log = require('winston');
const CommonHelper = require('../../helpers/common.helper');
const ResponseMessages = require('../../helpers/response.helper');
const TournamentModel = require('../../models/tournament.model');
dotenv.config();

class TournamentController {

    /* 
    * Create new Tournament 
    */
    createTourney = async () => {
        // CommonHelper.checkValidation(req);
        // console.log(req.body);
        const result = await TournamentModel.create();

        if (!result) {
            return CommonHelper.errorResponse(500, ResponseMessages.SOMETHING_WENT_WRONG);
            // res.send();
        }
        return CommonHelper.response(true, ResponseMessages.SUCCESS_TOURNAMEN_CREATED);
        // res.send();
    }

    /* 
    * update the tournament 
    */
    updateTourney = async (req, res, next) => {
        CommonHelper.checkValidation(req);
        console.log(req.body);
        const result = await TournamentModel.update(req.body, req.params.id);

        if (!result) {
            res.send(CommonHelper.errorResponse(404, ResponseMessages.SOMETHING_WENT_WRONG));
        }

        const { affectedRows, changedRows, info } = result;

        const message = !affectedRows ? ResponseMessages.USER_NOT_FOUND :
            affectedRows && changedRows ? ResponseMessages.SUCCESS_RESPONSE : ResponseMessages.ERROR_USER_UPDATED;

        res.send(CommonHelper.response(true, message));
    }



}

/******************************************************************************
 *                               Export
 ******************************************************************************/
module.exports = new TournamentController();