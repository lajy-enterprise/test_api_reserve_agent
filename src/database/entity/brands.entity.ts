import 'reflect-metadata'
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class Brands {
  @PrimaryGeneratedColumn({ unsigned: true })
  brand_id!: number

  @Column({ type: 'varchar', length: 255 })
  name!: string
}
