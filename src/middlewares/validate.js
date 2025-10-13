import { validationResult } from "express-validator";

export function validate(rules) {
  return async (req, res, next) => {
    await Promise.all(rules.map(r => r.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  };
}
