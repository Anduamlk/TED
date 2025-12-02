import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class CreateCandidateDto {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column()
  gender!: string;

  @Column()
  dateOfBirth!: string;

  @Column()
  phone!: string;

  @Column()
  email!: string;

  @Column()
  passportNumber!: string;

  @Column('text')
  skills!: string;

  @Column()
  preferredDestination!: string;

  @Column({ nullable: true })
  otherDestination?: string;

  @Column({ nullable: true })
  passportPath?: string;

  @Column({ nullable: true })
  photoPath?: string;

  @Column({ nullable: true })
  medicalClearancePath?: string;

  @Column({ nullable: true })
  policeClearancePath?: string;

  @Column({ 
    type: 'varchar', 
    default: 'pending'
  })
  status!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}