import type { RowDataPacket } from "mysql2/promise";
import databaseClient from "../../../database/client";
import type { Result } from "../../../database/client";
import type { UserStats } from "../../types/stats";

interface TransportStop {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

interface CommuteStats {
  dailyMinutes: number;
  weeklyMinutes: number;
  monthlyMinutes: number;
  yearlyMinutes: number;
}

interface CommuteRecord {
  user_id: number;
  start_stop_id: number;
  end_stop_id: number;
  departure_time: string;
  average_duration_minutes: number;
  days_of_week: string;
}

interface MostFrequentRoute {
  startStop: string;
  endStop: string;
  count: number;
}

class TransportRepository {
  async getAllStops(): Promise<TransportStop[]> {
    try {
      const [rows] = await databaseClient.query(
        "SELECT id, name, latitude, longitude FROM transport_stop",
      );
      return rows as TransportStop[];
    } catch (error) {
      console.error("Transport stops error:", error);
      throw new Error("Failed to fetch transport stops");
    }
  }

  async getCommuteStats(userId: number): Promise<CommuteStats> {
    const [records] = await databaseClient.query(
      "SELECT average_duration_minutes, days_of_week FROM commute_record WHERE user_id = ?",
      [userId],
    );

    const commuteRecords = records as CommuteRecord[];

    if (!commuteRecords.length) {
      return {
        dailyMinutes: 0,
        weeklyMinutes: 0,
        monthlyMinutes: 0,
        yearlyMinutes: 0,
      };
    }

    const dailyMinutes = commuteRecords.reduce((total, record) => {
      return total + record.average_duration_minutes;
    }, 0);

    const weeklyMinutes = dailyMinutes * 5;
    const monthlyMinutes = weeklyMinutes * 4;
    const yearlyMinutes = monthlyMinutes * 12;

    return {
      dailyMinutes,
      weeklyMinutes,
      monthlyMinutes,
      yearlyMinutes,
    };
  }

  async createCommuteRecord(data: Omit<CommuteRecord, "id">) {
    const [result] = await databaseClient.query<Result>(
      `INSERT INTO commute_record 
       (user_id, start_stop_id, end_stop_id, departure_time, average_duration_minutes, days_of_week) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        data.user_id,
        data.start_stop_id,
        data.end_stop_id,
        data.departure_time,
        data.average_duration_minutes,
        data.days_of_week,
      ],
    );
    return result;
  }

  async getUserStats(userId: number): Promise<UserStats> {
    try {
      const [basicStats] = await databaseClient.query<RowDataPacket[]>(
        `SELECT 
          COUNT(*) as totalCommutes,
          AVG(average_duration_minutes) as avgDuration,
          SUM(average_duration_minutes) as totalDuration
        FROM commute_record 
        WHERE user_id = ?`,
        [userId],
      );

      const [frequentRoutes] = await databaseClient.query<
        (RowDataPacket & {
          startStop: string;
          endStop: string;
          count: number;
        })[]
      >(
        `SELECT 
          ts1.name as startStop,
          ts2.name as endStop,
          COUNT(*) as count
        FROM commute_record cr
        JOIN transport_stop ts1 ON cr.start_stop_id = ts1.id
        JOIN transport_stop ts2 ON cr.end_stop_id = ts2.id
        WHERE cr.user_id = ?
        GROUP BY start_stop_id, end_stop_id
        HAVING count > 0
        ORDER BY count DESC
        LIMIT 1`,
        [userId],
      );

      const mostFrequentRoute = frequentRoutes[0] || {
        startStop: "Aucun trajet",
        endStop: "enregistré",
        count: 0,
      };

      return {
        totalCommutes: basicStats[0]?.totalCommutes || 0,
        avgDuration: Math.round(basicStats[0]?.avgDuration || 0),
        totalDuration: basicStats[0]?.totalDuration || 0,
        mostFrequentRoute,
      };
    } catch (error) {
      console.error("Error fetching user stats:", error);
      throw new Error("Failed to fetch user statistics");
    }
  }

  async getDetailedStats(userId: number) {
    try {
      const [dailyStats] = await databaseClient.query(
        `
        SELECT 
          DATE(departure_time) as date,
          SUM(average_duration_minutes) as duration,
          COUNT(*) as count
        FROM commute_record 
        WHERE user_id = ?
        GROUP BY DATE(departure_time)
        ORDER BY date DESC
        LIMIT 7
      `,
        [userId],
      );

      const [weeklyStats] = await databaseClient.query(
        `
        SELECT 
          DATE(MIN(departure_time)) as week,
          YEARWEEK(departure_time, 1) as week_number,
          SUM(average_duration_minutes) as duration,
          COUNT(*) as count
        FROM commute_record 
        WHERE user_id = ?
        GROUP BY YEARWEEK(departure_time, 1)
        ORDER BY week_number DESC
        LIMIT 4
      `,
        [userId],
      );

      const [monthlyStats] = await databaseClient.query(
        `
        SELECT 
          DATE_FORMAT(MIN(departure_time), '%Y-%m-01') as month,
          SUM(average_duration_minutes) as duration,
          COUNT(*) as count
        FROM commute_record 
        WHERE user_id = ?
        GROUP BY YEAR(departure_time), MONTH(departure_time)
        ORDER BY month DESC
        LIMIT 12
      `,
        [userId],
      );

      return {
        daily: dailyStats || [],
        weekly: weeklyStats || [],
        monthly: monthlyStats || [],
      };
    } catch (error) {
      console.error("Error fetching detailed stats:", error);
      throw error;
    }
  }

  async deleteCommuteRecord(userId: number, recordId: number) {
    try {
      const [result] = await databaseClient.query<Result>(
        `DELETE FROM commute_record 
         WHERE id = ? AND user_id = ?`,
        [recordId, userId],
      );
      return result;
    } catch (error) {
      console.error("Error deleting commute record:", error);
      throw error;
    }
  }

  async deleteAllStats(userId: number): Promise<void> {
    try {
      await databaseClient.query(
        "DELETE FROM commute_record WHERE user_id = ?",
        [userId],
      );
    } catch (error) {
      console.error("Error deleting all stats:", error);
      throw error;
    }
  }
}

export default new TransportRepository();
