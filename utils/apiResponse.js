const { Response } = require('express');

// Helper code for the API consumer to understand the error and handle it accordingly
const code = {
    SUCCESS: 1,
    FAILURE: 10001,
    RETRY: 10002,
    INVALID_ACCESS_TOKEN: 10003,
};

const ResponseStatus = {
    SUCCESS: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_ERROR: 500,
};

class ApiResponse {
    constructor(code, status, message) {
        this.code = code;
        this.status = status;
        this.message = message;
    }

    prepare(res, response) {
        return res.status(this.status).json(ApiResponse.sanitize(response));
    }

    send(res) {
        return this.prepare(res, this);
    }

    static sanitize(response) {
        const clone = {};
        Object.assign(clone, response);
        // @ts-ignore
        delete clone.status;
        for (const i in clone) if (typeof clone[i] === 'undefined') delete clone[i];
        return clone;
    }
}

class AuthFailureResponse extends ApiResponse {
    constructor(message = 'Authentication Failure') {
        super(code.FAILURE, ResponseStatus.UNAUTHORIZED, message);
    }
}

class NotFoundResponse extends ApiResponse {
    constructor(message = 'Not Found') {
        super(code.FAILURE, ResponseStatus.NOT_FOUND, message);
        this.url = undefined;
    }

    send(res) {
        this.url = res.req?.originalUrl;
        return super.prepare(res, this);
    }
}

class ForbiddenResponse extends ApiResponse {
    constructor(message = 'Forbidden') {
        super(code.FAILURE, ResponseStatus.FORBIDDEN, message);
    }
}

class BadRequestResponse extends ApiResponse {
    constructor(message = 'Bad Parameters') {
        super(code.FAILURE, ResponseStatus.BAD_REQUEST, message);
    }
}

class InternalErrorResponse extends ApiResponse {
    constructor(message = 'Internal Error') {
        super(code.FAILURE, ResponseStatus.INTERNAL_ERROR, message);
    }
}

class SuccessMsgResponse extends ApiResponse {
    constructor(message) {
        super(code.SUCCESS, ResponseStatus.SUCCESS, message);
    }
}

class FailureMsgResponse extends ApiResponse {
    constructor(message) {
        super(code.FAILURE, ResponseStatus.SUCCESS, message);
    }
}

class SuccessResponse extends ApiResponse {
    constructor(message, data) {
        super(code.SUCCESS, ResponseStatus.SUCCESS, message);
        this.data = data;
    }

    send(res) {
        return super.prepare(res, this);
    }
}

class AccessTokenErrorResponse extends ApiResponse {
    constructor(message = 'Access token invalid') {
        super(code.INVALID_ACCESS_TOKEN, ResponseStatus.UNAUTHORIZED, message);
        this.instruction = 'refresh_token';
    }

    send(res) {
        res.setHeader('instruction', this.instruction);
        return super.prepare(res, this);
    }
}

class TokenRefreshResponse extends ApiResponse {
    constructor(message, accessToken, refreshToken) {
        super(code.SUCCESS, ResponseStatus.SUCCESS, message);
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }

    send(res) {
        return super.prepare(res, this);
    }
}

module.exports = {
    AuthFailureResponse,
    NotFoundResponse,
    ForbiddenResponse,
    BadRequestResponse,
    InternalErrorResponse,
    SuccessMsgResponse,
    FailureMsgResponse,
    SuccessResponse,
    AccessTokenErrorResponse,
    TokenRefreshResponse,
};
