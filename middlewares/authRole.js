const { ForbiddenResponse, InternalErrorResponse } = require("../utils/apiResponse");

exports.authorizeRole = (allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user.role;

        if (typeof allowedRoles === 'string') {
            if (userRole === allowedRoles) {
                next();
            } else {
                return new ForbiddenResponse().send(res);
            }
        } else if (Array.isArray(allowedRoles)) {
            if (allowedRoles.includes(userRole)) {
                next();
            } else {
                return new ForbiddenResponse().send(res);
            }
        } else {
            return new InternalErrorResponse().send(res);
        }
    };
};