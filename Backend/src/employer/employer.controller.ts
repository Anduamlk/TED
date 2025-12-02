import {
  Controller,
  Post,
  Get,
  Body,
  UploadedFiles,
  UseInterceptors,
  HttpException,
  HttpStatus,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { EmployerService } from './employer.service';
import { CreateEmployerDto } from './dto/create-employer.dto';
import { fileStorage } from '../utils/file-storage.util';
import { Employer } from './employer.entity';

@Controller('api')
export class EmployerController {
  constructor(private readonly employerService: EmployerService) {}

  @Post('register/employer')
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: fileStorage('uploads/employers'), 
      limits: {
        fileSize: 5 * 1024 * 1024, 
      },
    }),
  )
  async registerEmployer(
    @Body() body: any, 
    @UploadedFiles() files: Express.Multer.File[] = [],
  ): Promise<{ employerId: string }> {
    try {
      
      const fileMap: Record<string, string> = {};
      for (const file of files) {
        const relativePath = `uploads/employers/${file.filename}`;
        fileMap[file.fieldname + 'Path'] = relativePath;
      }
      const employerData: Partial<Employer> = {
        companyName: body.companyName,
        companyType: body.companyType,
        licenseNumber: body.licenseNumber,
        countryOfOperation: body.countryOfOperation,
        city: body.city,
        address: body.address,
        website: body.website || undefined,
        contactPersonFirstName: body.contactPersonFirstName,
        contactPersonLastName: body.contactPersonLastName,
        contactPersonPosition: body.contactPersonPosition,
        phone: body.phone,
        email: body.email,
        alternateEmail: body.alternateEmail || undefined,
        numberOfEmployees: body.numberOfEmployees,
        sectorsOfOperation: body.sectorsOfOperation,
        previousHiringExperience: body.previousHiringExperience,
        hiringHistory: body.hiringHistory || undefined,
        licenseDocumentPath: fileMap['licenseDocumentPath'] || undefined,
        registrationCertificatePath: fileMap['registrationCertificatePath'] || undefined,
        contactPersonPhotoPath: fileMap['contactPersonPhotoPath'] || undefined,
        status: 'pending', 
        verified: false, 
      };

      console.log('Employer data to save:', employerData); 

      const newEmployer = await this.employerService.create(employerData);
      return { employerId: newEmployer.id };
    } catch (err) {
      console.error('Employer registration error:', err);
      throw new HttpException(
        'Failed to register employer',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('employers')
  async getAllEmployers() {
    const employers = await this.employerService.findAll();
    return employers;
  }

  @Get('employers/:id')
  async getEmployer(@Param('id') id: string) {
    const employer = await this.employerService.findOne(id);
    if (!employer) {
      throw new HttpException('Employer not found', HttpStatus.NOT_FOUND);
    }
    return employer;
  }

  @Patch('employers/:id/approve')
  async approveEmployer(@Param('id') id: string) {
    const employer = await this.employerService.updateStatus(id, 'approved');
    return { message: 'Employer approved successfully', employer };
  }

  @Patch('employers/:id/reject')
  async rejectEmployer(@Param('id') id: string) {
    const employer = await this.employerService.updateStatus(id, 'rejected');
    return { message: 'Employer rejected successfully', employer };
  }

  @Patch('employers/:id')
  async updateEmployer(
    @Param('id') id: string,
    @Body() updateData: {
      companyName?: string;
      email?: string;
      phone?: string;
      status?: 'active' | 'inactive' | 'pending';
      contactPersonFirstName?: string;
      contactPersonLastName?: string;
      contactPersonPosition?: string;
      website?: string;
      sectorsOfOperation?: string;
    }
  ) {
    try {
      const employer = await this.employerService.update(id, updateData);
      if (!employer) {
        throw new HttpException('Employer not found', HttpStatus.NOT_FOUND);
      }
      return { message: 'Employer updated successfully', employer };
    } catch (err) {
      console.error('Employer update error:', err);
      throw new HttpException(
        'Failed to update employer',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('employers/:id')
  async deleteEmployer(@Param('id') id: string) {
    try {
      const result = await this.employerService.remove(id);
      if (!result) {
        throw new HttpException('Employer not found', HttpStatus.NOT_FOUND);
      }
      return { message: 'Employer deleted successfully' };
    } catch (err) {
      console.error('Employer deletion error:', err);
      throw new HttpException(
        'Failed to delete employer',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}