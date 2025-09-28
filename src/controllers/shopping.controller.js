export const generateShoppingList = (req, res) => {
  // Dummy: just return a fixed list
  res.json({
    items: [
      { name: "chicken breast", quantity: "2 pieces" },
      { name: "lettuce", quantity: "1 head" },
      { name: "tomato", quantity: "3 pcs" }
    ]
  });
};
