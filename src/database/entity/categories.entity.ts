import 'reflect-metadata'
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class Categories {
  @PrimaryGeneratedColumn({ unsigned: true })
  category_id!: number

  @Column({ type: 'varchar', length: 255 })
  name!: string
}
