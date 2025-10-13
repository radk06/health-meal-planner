import { readJson, writeJson, genId } from "../../utils/file-db.js";
import { paginate } from "../../utils/paginate.js";

const DATA_PATH = "src/modules/users/users.data.json";

export async function getAllUsers({ page = 1, limit = 10 }) {
  const items = await readJson(DATA_PATH, []);
  return paginate(items.map(stripSensitive), { page, limit });
}

export async function getUserById(id) {
  const items = await readJson(DATA_PATH, []);
  const u = items.find(x => x.id === id);
  return u ? stripSensitive(u) : null;
}

export async function getUserByEmail(email) {
  const items = await readJson(DATA_PATH, []);
  return items.find(x => x.email.toLowerCase() === email.toLowerCase()) || null;
}

export async function addNewUser(user) {
  const items = await readJson(DATA_PATH, []);
  const exists = items.some(x => x.email.toLowerCase() === user.email.toLowerCase());
  if (exists) {
    const err = new Error("Email already registered");
    err.status = 400;
    throw err;
  }
  const u = { id: genId("u"), role: "user", goals: { target: "balanced" }, ...user };
  items.push(u);
  await writeJson(DATA_PATH, items);
  return stripSensitive(u);
}

export async function updateExistingUser(id, patch) {
  const items = await readJson(DATA_PATH, []);
  const idx = items.findIndex(x => x.id === id);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...patch, id };
  await writeJson(DATA_PATH, items);
  return stripSensitive(items[idx]);
}

export async function deleteUser(id) {
  const items = await readJson(DATA_PATH, []);
  const idx = items.findIndex(x => x.id === id);
  if (idx === -1) return false;
  items.splice(idx, 1);
  await writeJson(DATA_PATH, items);
  return true;
}

function stripSensitive(u) {
  const { passwordHash, passwordSalt, ...safe } = u;
  return safe;
}
