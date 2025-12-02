import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn,
  UpdateDateColumn 
} from 'typeorm';

@Entity('agencies')
export class Agency {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  agencyName!: string;

  @Column()
  licenseNumber!: string;

  @Column()
  licenseExpiryDate!: string;

  @Column()
  authorizedCountries!: string;

  @Column()
  yearEstablished!: string;

  @Column()
  directorFirstName!: string;

  @Column()
  directorLastName!: string;

  @Column()
  directorPhone!: string;

  @Column()
  directorEmail!: string;

  @Column()
  contactPhone!: string;

  @Column()
  contactEmail!: string;

  @Column('text')
  address!: string;

  @Column()
  city!: string;

  @Column()
  region!: string;

  @Column()
  numberOfRecruiters!: string;

  @Column({ nullable: true })
  numberOfActivePlacements?: string;

  @Column('text')
  servicesOffered!: string;

  @Column()
  previousExperience!: string;

  @Column({ nullable: true })
  experienceYears?: string;

  @Column({ type: 'text', nullable: true })
  licenseDocumentPath?: string;

  @Column({ type: 'text', nullable: true })
  registrationCertificatePath?: string;

  @Column({ type: 'text', nullable: true })
  directorPhotoPath?: string;

  @Column({ 
    type: 'varchar', 
    default: 'pending'
  })
  status!: string;

  @Column({ default: false })
  verified!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}