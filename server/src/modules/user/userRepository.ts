import type { RowDataPacket } from "mysql2";
import databaseClient from "../../../database/client";

interface User extends RowDataPacket {
  id: number;
  email: string;
  username: string;
  password: string;
  avatar_url?: string;
}

type Rows = User[];

class UserRepository {
  async updateUser(
    userId: number,
    updates: Partial<Omit<User, "id">>,
  ): Promise<void> {
    try {
      const fields = Object.keys(updates)
        .map((key) => `${key} = ?`)
        .join(", ");

      const values = [...Object.values(updates), userId];

      await databaseClient.query<Rows>(
        `UPDATE user SET ${fields} WHERE id = ?`,
        values,
      );
    } catch (error) {
      throw new Error(`Failed to update user: ${error}`);
    }
  }

  async findById(id: number): Promise<User | undefined> {
    try {
      const [rows] = await databaseClient.query<Rows>(
        "SELECT * FROM user WHERE id = ?",
        [id],
      );

      return rows[0];
    } catch (error) {
      throw new Error(`Failed to find user: ${error}`);
    }
  }
}

export default new UserRepository();
