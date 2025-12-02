import { IsString, IsEmail, IsEnum, IsOptional, Matches, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export enum PreviousExperience {
  YES = 'Yes',
  NO = 'No',
}

export class CreateAgencyDto {
  @IsString()
  agencyName!: string;

  @IsString()
  licenseNumber!: string;

  @IsString()
  licenseExpiryDate!: string;

  @IsString()
  authorizedCountries!: string;

  @IsString()
  @Matches(/^\d{4}$/, { message: 'Enter a valid year' })
  yearEstablished!: string;

  @IsString()
  directorFirstName!: string;

  @IsString()
  directorLastName!: string;

  @IsString()
  @Matches(/^\+?\d{7,15}$/, { message: 'Invalid phone number format' })
  directorPhone!: string;

  @IsEmail()
  directorEmail!: string;

  @IsString()
  @Matches(/^\+?\d{7,15}$/, { message: 'Invalid phone number format' })
  contactPhone!: string;

  @IsEmail()
  contactEmail!: string;

  @IsString()
  address!: string;

  @IsString()
  city!: string;

  @IsString()
  region!: string;

  @IsString()
  numberOfRecruiters!: string;

  @IsOptional()
  @IsString()
  numberOfActivePlacements?: string;

  @IsString()
  servicesOffered!: string;

  @IsEnum(PreviousExperience)
  previousExperience!: PreviousExperience;

  @IsOptional()
  @IsString()
  experienceYears?: string;

  @IsOptional()
  @IsString()
  licenseDocumentPath?: string;

  @IsOptional()
  @IsString()
  registrationCertificatePath?: string;

  @IsOptional()
  @IsString()
  directorPhotoPath?: string;

  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  agreeToTerms!: boolean;
}
