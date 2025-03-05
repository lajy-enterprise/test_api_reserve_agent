import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class Accounts {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number

  @Column({ type: 'varchar', length: 255 })
  name: string
}
