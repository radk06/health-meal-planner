Health & Meal Prep Planner — Phase 2 (Modular Express API)
Overview

Modular Express.js backend with JSON data sources. Implements CRUD in model files, feature-scoped routes, route-level validation, and app-level middlewares.

Data Model (sample)
- Meals: { id, title, ingredients[string[]], calories, tags[string[]] }
- Ingredients: { id, name, location(pantry|fridge|freezer), qty, unit, expiresOn(ISO) }
- Users: { id, name, email, role, goals, passwordHash, passwordSalt }

Sample data lives in:
- src/modules/meals/meals.data.json
- src/modules/ingredients/ingredients.data.json
- src/modules/users/users.data.json

Architecture
src/
  modules/
    meals/ { meals.model.js, meals.routes.js, meals.validators.js, meals.data.json }
    ingredients/ { ingredients.model.js, ingredients.routes.js, ingredients.validators.js, ingredients.data.json }
    shopping/ { shopping.model.js, shopping.routes.js, shopping.validators.js }
    users/ { users.model.js, users.routes.js, users.data.json }
    auth/ { auth.routes.js, auth.validators.js, crypto.js }
  middlewares/ { validate.js, notFound.js, errorHandler.js }
  utils/ { file-db.js, paginate.js }
server.js

Models: All CRUD/business logic (read/write JSON).
Routes: Thin controllers calling model functions.
Route-level middlewares: express-validator per module.
App-level: express.json(), express.urlencoded(), 404 handler, central error handler.

Endpoints (examples)

Meals
- GET /api/meals?q=chicken&tag=low-carb&page=1&limit=10
- GET /api/meals/:id
- POST /api/meals → 201
- PUT /api/meals/:id
- DELETE /api/meals/:id

Ingredients
- GET /api/ingredients?location=fridge&expBefore=2025-12-31
- GET /api/ingredients/:id
- POST /api/ingredients → 201
- PUT /api/ingredients/:id
- DELETE /api/ingredients/:id

Shopping
- POST /api/shopping body: { "mealIds": ["meal_001","meal_002"] }

Auth
- POST /api/auth/signup
- POST /api/auth/login

Validation (per module)
- Meals POST/PUT: title (string, required), ingredients (string[] min 1), calories (int ≥ 0), tags (string[] optional)
- Ingredients POST/PUT: name (string), location (enum), qty (number ≥ 0), unit (string), expiresOn (ISO)
- Auth: email (valid), password (min 6), name (signup)

HTTP Status Codes
- 200 OK (GET/PUT/DELETE)
- 201 Created (POST)
- 400 Validation errors
- 404 Resource not found
- 500 Server errors (central handler)

Testing
- Tested via Postman/Insomnia and curl.
- Examples:
  - GET http://localhost:3000/api/meals
  - POST http://localhost:3000/api/meals (valid body → 201; missing fields → 400)
  - POST http://localhost:3000/api/shopping with { "mealIds": ["meal_001"] }
  - POST /api/auth/signup then POST /api/auth/login

Contributions
- Radamir Kekukh