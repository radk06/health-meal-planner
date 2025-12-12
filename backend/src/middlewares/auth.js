import jwt from "jsonwebtoken";
import User from "../modules/users/users.model.js"; // optional, you can remove if unused

export async function authenticate(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res
      .status(401)
      .json({ message: "Missing or invalid Authorization header" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

// plural name to match some imports in routes
export function requireRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden for this role" });
    }
    next();
  };
}

/**
 * Aliases to support older import names
 * users.routes.js expects: requireAuth and requireRole
 */

export const requireAuth = authenticate;

export function requireRole(role) {
  // wrap the plural version so requireRole("admin") still works
  return requireRoles(role);
}
