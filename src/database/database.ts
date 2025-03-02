import { DataSource } from 'typeorm'
import * as dotenv from 'dotenv'

dotenv.config()

export const app = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false, // ¡Recuerda, solo para desarrollo!
  logging: true,
  entities: ['dist/entities/*.js'],
  migrations: [],
  subscribers: [],
})
  .initialize()
  .then(async connection => {
    console.log('Conexión a la base de datos establecida')
    // ... tu código ...
  })
  .catch(error => console.log('Error al conectar a la base de datos: ', error))
