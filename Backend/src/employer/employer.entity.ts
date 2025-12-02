import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('employers')
export class Employer {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  companyName!: string;

  @Column()
  companyType!: string;

  @Column()
  licenseNumber!: string;

  @Column()
  countryOfOperation!: string;

  @Column()
  city!: string;

  @Column('text')
  address!: string;

  @Column({ nullable: true })
  website?: string;

  @Column()
  contactPersonFirstName!: string;

  @Column()
  contactPersonLastName!: string;

  @Column()
  contactPersonPosition!: string;

  @Column()
  phone!: string;

  @Column()
  email!: string;

  @Column({ 
    type: 'varchar', 
    default: 'pending'
  })
  status!: string;

  @Column({ nullable: true })
  alternateEmail?: string;

  @Column()
  numberOfEmployees!: string;

  @Column('text')
  sectorsOfOperation!: string;

  @Column()
  previousHiringExperience!: string;

  @Column({ type: 'text', nullable: true })
  hiringHistory?: string;

  @Column({ type: 'text', nullable: true })
  licenseDocumentPath?: string;

  @Column({ type: 'text', nullable: true })
  registrationCertificatePath?: string;

  @Column({ type: 'text', nullable: true })
  contactPersonPhotoPath?: string;

  @Column({ default: false })
  verified!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}