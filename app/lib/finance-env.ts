export function isFinanceDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL?.trim());
}
