import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const usersFilePath = path.join(__dirname, "users.json");

export const loadUsers = async () => {
  try {
    const data = await fs.readFile(usersFilePath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    if (err.code === "ENOENT") {
      await saveUsers([]);
      return [];
    }
    throw err;
  }
};

export const saveUsers = async (users) => {
  await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), "utf-8");
};

export const addUser = async (userData) => {
  const users = await loadUsers();
  if (users.find((u) => u.name.toLowerCase() === userData.name.toLowerCase())) {
    throw new Error("User already exists");
  }
  const user = {
    id: `w${users.length + 1}`,
    ...userData,
    registeredAt: new Date().toISOString(),
  };
  users.push(user);
  await saveUsers(users);
  return user;
};

export const findUserByName = async (name) => {
  const users = await loadUsers();
  return users.find((u) => u.name.toLowerCase() === name.toLowerCase());
};
