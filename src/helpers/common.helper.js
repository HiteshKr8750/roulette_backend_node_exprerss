function response(status = true, message = '', data, code = 200) {
    return {
        status: status,
        code: code,
        message: message,
        data: data
    }
}

function errorResponse(code = 500, message) {
    return {
        status: false,
        code: code,
        message: message,
    }
}

function checkValidation(req) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new HttpException(400, 'Validation faild', errors);
    }
}

module.exports = {
    response,
    errorResponse,
    checkValidation
}