import 'reflect-metadata'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm'

import { Accounts } from './accounts.entity'
import { Brands } from './brands.entity'
import { Categories } from './categories.entity'
import { SubCategories } from './sub_categories.entity'
import { Vendors } from './vendors.entity'

@Entity()
export class Products {
  @PrimaryGeneratedColumn({ unsigned: true })
  id!: number

  @ManyToOne(() => Accounts)
  @JoinColumn({ name: 'account_id' })
  account!: Accounts

  @ManyToOne(() => Brands)
  @JoinColumn({ name: 'brand_id' })
  brand!: Brands

  @ManyToOne(() => Categories)
  @JoinColumn({ name: 'category_id' })
  category!: Categories

  @ManyToOne(() => SubCategories, { nullable: true })
  @JoinColumn({ name: 'sub_category_id' })
  subCategory!: SubCategories | null

  @ManyToOne(() => Vendors)
  @JoinColumn({ name: 'vendor_id' })
  vendor!: Vendors

  @Column({ type: 'varchar', length: 255 })
  product_key!: string

  @Column({ type: 'varchar', length: 255 })
  notes!: string

  @Column({ type: 'decimal', precision: 10, scale: 2, unsigned: true })
  price!: number

  @Column({ type: 'int', unsigned: true })
  qty!: number

  @Column({ type: 'varchar', nullable: true })
  compatibility!: string
}
