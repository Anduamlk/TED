import { IsString, IsNotEmpty, IsOptional, IsEmail, IsEnum, Matches } from 'class-validator';

export class CreateEmployerDto {
  @IsString()
  @IsNotEmpty()
  companyName!: string;

  @IsEnum(['Private', 'Government', 'NGO'])
  companyType!: string;

  @IsString()
  @IsNotEmpty()
  licenseNumber!: string;

  @IsString()
  @IsNotEmpty()
  countryOfOperation!: string;

  @IsString()
  @IsNotEmpty()
  city!: string;

  @IsString()
  @IsNotEmpty()
  address!: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsString()
  @IsNotEmpty()
  contactPersonFirstName!: string;

  @IsString()
  @IsNotEmpty()
  contactPersonLastName!: string;

  @IsString()
  @IsNotEmpty()
  contactPersonPosition!: string;

  @IsString()
  @Matches(/^\+?\d{7,15}$/, { message: 'Invalid phone number format' })
  phone!: string;

  @IsEmail()
  email!: string;

  

  @IsOptional()
  @IsEmail()
  alternateEmail?: string;

  @IsString()
  @IsNotEmpty()
  numberOfEmployees!: string;

  @IsString()
  @IsNotEmpty()
  sectorsOfOperation!: string;

  @IsEnum(['Yes', 'No'])
  previousHiringExperience!: string;

  @IsOptional()
  @IsString()
  hiringHistory?: string;
}
