export const signup = (req, res) => {
  res.status(201).json({
    message: "Signup success (dummy)",
    user: { id: "user_123", email: req.body?.email || "test@example.com" },
    token: "fake.jwt.token"
  });
};

export const login = (req, res) => {
  res.json({
    message: "Login success (dummy)",
    user: { id: "user_123", email: req.body?.email || "test@example.com" },
    token: "fake.jwt.token"
  });
};
