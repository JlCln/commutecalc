import databaseClient from "../../../database/client";
import type { Rows } from "../../../database/client";

interface User {
  id: number;
  email: string;
  password: string;
  username: string;
}

class AuthRepository {
  async findByEmail(email: string) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM user WHERE email = ?",
      [email],
    );

    return rows[0] as User | undefined;
  }

  async findById(id: number) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM user WHERE id = ?",
      [id],
    );

    return rows[0] as User | undefined;
  }

  async createUser(email: string, hashedPassword: string, username: string) {
    const [result] = await databaseClient.query(
      "INSERT INTO user (email, password, username) VALUES (?, ?, ?)",
      [email, hashedPassword, username],
    );

    return result;
  }
}

export default new AuthRepository();
