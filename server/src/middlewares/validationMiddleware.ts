import { Request, Response, NextFunction } from 'express';
import { Schema, ValidationError } from 'joi';
import { AppError } from '.';

interface ValidationSchema {
  body?: Schema;
  query?: Schema;
  params?: Schema;
}

type ValidationErrors = {
  body?: ValidationError;
  query?: ValidationError;
  params?: ValidationError;
};

export const validateRequest = (schema: ValidationSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errorObj: ValidationErrors = {};

    if (schema.body) {
      const { error } = schema.body.validate(req.body ?? {}, {
        abortEarly: false,
      });
      if (error) errorObj.body = error;
    }

    if (schema.query) {
      const { error } = schema.query.validate(req.query ?? {}, {
        abortEarly: false,
      });
      if (error) errorObj.query = error;
    }

    if (schema.params) {
      const { error } = schema.params.validate(req.params ?? {}, {
        abortEarly: false,
      });
      if (error) errorObj.params = error;
    }

    if (Object.keys(errorObj).length > 0) {
      return next(new AppError('Validation error', 400, errorObj));
    }

    next();
  };
};
