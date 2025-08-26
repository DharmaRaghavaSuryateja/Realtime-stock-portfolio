import { AppError } from '.';
export const validateRequest = (schema) => {
    return (req, res, next) => {
        const errorObj = {};
        if (schema.body) {
            const { error } = schema.body.validate(req.body ?? {}, {
                abortEarly: false,
            });
            if (error)
                errorObj.body = error;
        }
        if (schema.query) {
            const { error } = schema.query.validate(req.query ?? {}, {
                abortEarly: false,
            });
            if (error)
                errorObj.query = error;
        }
        if (schema.params) {
            const { error } = schema.params.validate(req.params ?? {}, {
                abortEarly: false,
            });
            if (error)
                errorObj.params = error;
        }
        if (Object.keys(errorObj).length > 0) {
            return next(new AppError('Validation error', 400, errorObj));
        }
        next();
    };
};
