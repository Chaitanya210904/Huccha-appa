/**
 * Zod validation middleware
 */
export function validate(schema) {
  return (req, res, next) => {
    try {
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        const errorMessages = parsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
        return res.status(400).json({
          success: false,
          error: `Validation error: ${errorMessages}`
        });
      }
      req.body = parsed.data;
      next();
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: `Invalid input data: ${err.message}`
      });
    }
  };
}

