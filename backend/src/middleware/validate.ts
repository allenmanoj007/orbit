import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { error } from '../utils/apiResponse';

interface ValidationSchema {
  body?: AnyZodObject;
  params?: AnyZodObject;
  query?: AnyZodObject;
}

export function validate(schema: AnyZodObject | ValidationSchema) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Determine if it's a combined schema object or a single body schema
      if ('body' in schema || 'params' in schema || 'query' in schema) {
        const s = schema as ValidationSchema;
        if (s.body) req.body = await s.body.parseAsync(req.body);
        if (s.params) req.params = await s.params.parseAsync(req.params);
        if (s.query) req.query = await s.query.parseAsync(req.query);
      } else {
        req.body = await (schema as AnyZodObject).parseAsync(req.body);
      }
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errors = err.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message,
        }));
        error(res, 'Validation failed', 422, errors);
        return;
      }
      next(err);
    }
  };
}
