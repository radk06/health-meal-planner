export const me = (req, res) => {
  res.json({ id: "user_123", name: "Student User", email: "student@school.ca" });
};

export const listUsers = (req, res) => {
  res.json({
    items: [
      { id: "user_123", name: "Student User" },
      { id: "user_456", name: "Meal Planner Admin" }
    ]
  });
};
