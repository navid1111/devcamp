const jwt = require('jsonwebtoken');
const asyncHandler = require('./async.js');
const errorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const Bootcamp = require('../models/Bootcamp.js');

exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization && req.headers.authorization.startsWith('Bearer') 
    ) {
        token = req.headers.authorization.split(' ')[1];
    }
    // Uncomment the following block if you want to support cookie-based authentication
    // else if (req.cookies.token) {
    //     token = req.cookies.token;
    // }

    // Make sure the token exists
    if (!token) {
        return next(new errorResponse('Not authorized to access this', 401));
    }
    try {
        // Verify Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded); // Corrected typo here
        req.user = await User.findById(decoded.id);

        next();
    } catch (error) {
        return next(new errorResponse('Not authorized to access this', 401));
    }
});

exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return next(new errorResponse(`User role is not defined`, 403));
        }

        // Check if any role of the user matches the authorized roles
        const isAuthorized = req.user.role.some(userRole => roles.includes(userRole));

        if (!isAuthorized) {
            return next(new errorResponse(`User role ${req.user.role} is not authorized to access this route`, 403));
        }

        next();
    };
};

exports.authorizeBootcampRole = (action) => {
    return async (req, res, next) => {
        try {
            // Retrieve the bootcamp by ID
            const bootcamp = await Bootcamp.findById(req.params.id);
            if (!bootcamp) {
                return next(new errorResponse(`Bootcamp not found with ID ${req.params.id}`, 404));
            }

            // Ensure the user exists and has a role in the bootcamp
            const userIdToCheck = req.user.id;
            const userRoleEntry = bootcamp.userRoles.find((userRole) =>
                userRole.user.toString() === userIdToCheck.toString()
            );

            if (!userRoleEntry) {
                return next(new errorResponse(`User is not assigned a role in this bootcamp`, 403));
            }

            // Get permissible roles for the action
            const permissibleRoles = bootcamp.permissions?.get(action);
            if (!permissibleRoles) {
                return next(new errorResponse(`No permissions defined for action: ${action}`, 403));
            }

            // Check if the user's role is authorized
            const isAuthorized = permissibleRoles.includes(userRoleEntry.role);
            if (!isAuthorized) {
                return next(
                    new errorResponse(
                        `User role "${userRoleEntry.role}" is not authorized to perform action: ${action}`,
                        403
                    )
                );
            }

            // Proceed to the next middleware
            next();
        } catch (error) {
            next(error);
        }
    };
};