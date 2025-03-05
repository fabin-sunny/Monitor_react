import mysql from "mysql2/promise";

export async function GET() {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "", // Add your MySQL password
      database: "system_monitor", // Adjust based on your database name
    });

    const [users] = await connection.execute("SELECT id, user FROM system_stats"); // Fetch users
    await connection.end();

    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return new Response(JSON.stringify({ error: "Error fetching users" }), { status: 500 });
  }
}
