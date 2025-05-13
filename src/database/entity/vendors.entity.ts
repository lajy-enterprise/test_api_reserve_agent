import 'reflect-metadata'
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class Vendors {
  @PrimaryGeneratedColumn({ unsigned: true })
  id!: number

  @Column({ type: 'varchar', length: 255 })
  name!: string
}
