import 'reflect-metadata'
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class Accounts {
  @PrimaryGeneratedColumn({ unsigned: true })
  id!: number

  @Column({ type: 'varchar', length: 255 })
  name!: string

  @Column({ type: 'varchar', length: 255 })
  address1!: string

  @Column({ type: 'varchar', length: 255 })
  address2!: string
}
