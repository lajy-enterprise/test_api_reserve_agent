import { DataSource } from 'typeorm'
import * as dotenv from 'dotenv'
import { Accounts } from './entity/accounts.entity'

dotenv.config()

export const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false, // ¡Recuerda, solo para desarrollo!
  logging: true,
  entities: ['./entity/*.ts'],
})
// .initialize()
// .then(async connection => {
//   console.log('Conexión a la base de datos establecida')
//   const accountOne = await app.manager.findOne(Accounts, 1)
//   console.dir(accountOne)
// })
// .catch(error => console.log('Error al conectar a la base de datos: ', error))

const accountOne = await dataSource.manager.findOneBy(Accounts, {
  id: 1,
})
console.dir(accountOne)
