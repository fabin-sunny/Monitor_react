import mysql from "mysql2/promise";

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "", // Your MySQL password
      database: "system_monitor", // Adjust as needed
    });

    const [rows] = await connection.execute("SELECT * FROM system_stats WHERE id = ?", [id]);
    await connection.end();

    if (rows.length === 0) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(rows[0]), { status: 200 });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return new Response(JSON.stringify({ error: "Error fetching user data" }), { status: 500 });
  }
}
