import 'reflect-metadata'
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity('sub_categories')
export class SubCategories {
  @PrimaryGeneratedColumn({ unsigned: true })
  id!: number

  @Column({ type: 'varchar', length: 255 })
  name!: string
}
