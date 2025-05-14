import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { Products } from './entity/products.entity'
import { Accounts } from './entity/accounts.entity'
import { Brands } from './entity/brands.entity'
import { Categories } from './entity/categories.entity'
import { Vendors } from './entity/vendors.entity'
import { SubCategories } from './entity/sub_categories.entity'
import { env } from '@/config'

const dataSource = new DataSource({
  type: env?.db_type || 'mysql',
  host: env.db_host,
  port: env.db_port || 3306,
  username: env.db_username,
  password: env.db_password,
  database: env.db_database,
  synchronize: false, // ¡Recuerda, solo para desarrollo!
  logging: true,
  entities: [Accounts, Brands, Categories, SubCategories, Vendors, Products],
})

await dataSource.initialize()
// .then(async app => {
//   console.log('Conexión a la base de datos establecida')
//   // const accountOne = await app.manager.findOneBy(Accounts, {
//   //   id: 1,
//   // })
//   // console.dir(accountOne)
// })
// .catch(error => console.log('Error al conectar a la base de datos: ', error))

// const accountRepository = dataSource.getRepository(Accounts)
// const accountOne = await accountRepository.findOne({
//   where: { id: 1 },
// })
//
// console.dir(accountOne)
export default dataSource
