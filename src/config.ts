import * as dotenv from 'dotenv'
import type { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions.js'
dotenv.config()

type EnvConfig = {
  port: number
  openai_api_key?: string
  db_type: MysqlConnectionOptions['type']
  db_host?: string
  db_port: number
  db_username?: string
  db_database?: string
  db_password?: string
}

const dbType =
  (process.env?.DB_TYPE as MysqlConnectionOptions['type']) || 'mysql'

export const env: EnvConfig = {
  port: Number.parseInt(process.env?.PORT || '3000', 10),
  openai_api_key: process.env.OPENAI_API_KEY,
  db_type: dbType,
  db_host: process.env.DB_HOST,
  db_port: Number.parseInt(process.env.DB_PORT || '3306', 10),
  db_username: process.env.DB_USER,
  db_database: process.env.DB_DATABASE,
  db_password: process.env.DB_PASSWORD,
}
