import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient({
// adapter: "postgresql",
// });

// import { PrismaClient } from "@prisma/client";
// import { Pool } from "pg";
// // import { PgAdapter } from "@prisma/adapter-pg";
// import { PgAdapter } from "@prisma/adapter-pg";

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });

// const adapter = new PgAdapter(pool);

// const prisma = new PrismaClient({ adapter });

// export default prisma;
