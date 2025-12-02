import { 
  Controller, 
  Post, 
  Get,
  Body, 
  UploadedFiles, 
  UseInterceptors,
  Patch,
  Param,
  HttpException,
  HttpStatus,
  Delete
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AgencyService } from './agency.service';
import { CreateAgencyDto } from './dto/create-agency.dto';
import { fileStorage } from '../utils/file-storage.util';
import { Agency } from './agency.entity';

@Controller('api')
export class AgencyController {
  constructor(private readonly agencyService: AgencyService) {}

  @Post('register/agency')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'licenseDocument', maxCount: 1 },
      { name: 'registrationCertificate', maxCount: 1 },
      { name: 'directorPhoto', maxCount: 1 },
    ], { 
      storage: fileStorage('uploads/agencies'),
      limits: {
        fileSize: 5 * 1024 * 1024,
      }
    })
  )
  async register(
    @Body() body: any,
    @UploadedFiles() files: {
      licenseDocument?: Express.Multer.File[];
      registrationCertificate?: Express.Multer.File[];
      directorPhoto?: Express.Multer.File[];
    },
  ) {
    try {
      const agencyData: Partial<Agency> = {
        agencyName: body.agencyName,
        licenseNumber: body.licenseNumber,
        licenseExpiryDate: body.licenseExpiryDate,
        authorizedCountries: body.authorizedCountries,
        yearEstablished: body.yearEstablished,
        directorFirstName: body.directorFirstName,
        directorLastName: body.directorLastName,
        directorPhone: body.directorPhone,
        directorEmail: body.directorEmail,
        contactPhone: body.contactPhone,
        contactEmail: body.contactEmail,
        address: body.address,
        city: body.city,
        region: body.region,
        numberOfRecruiters: body.numberOfRecruiters,
        numberOfActivePlacements: body.numberOfActivePlacements || undefined,
        servicesOffered: body.servicesOffered,
        previousExperience: body.previousExperience,
        experienceYears: body.experienceYears || undefined,
        licenseDocumentPath: files.licenseDocument?.[0] ? `uploads/agencies/${files.licenseDocument[0].filename}` : undefined,
        registrationCertificatePath: files.registrationCertificate?.[0] ? `uploads/agencies/${files.registrationCertificate[0].filename}` : undefined,
        directorPhotoPath: files.directorPhoto?.[0] ? `uploads/agencies/${files.directorPhoto[0].filename}` : undefined,
        status: 'pending',
        verified: false,
      };
      const agency = await this.agencyService.create(agencyData);
      return { agencyId: agency.id };
    } catch (err) {
      console.error('Agency registration error:', err);
      throw new HttpException(
        'Failed to register agency',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('agencies')
  async getAllAgencies() {
    const agencies = await this.agencyService.findAll();
    return agencies;
  }

  @Get('agencies/:id')
  async getAgency(@Param('id') id: string) {
    const agency = await this.agencyService.findOne(id);
    if (!agency) {
      throw new HttpException('Agency not found', HttpStatus.NOT_FOUND);
    }
    return agency;
  }

  @Patch('agencies/:id/approve')
  async approveAgency(@Param('id') id: string) {
    const agency = await this.agencyService.updateStatus(id, 'approved');
    return { message: 'Agency approved successfully', agency };
  }

  @Patch('agencies/:id/reject')
  async rejectAgency(@Param('id') id: string) {
    const agency = await this.agencyService.updateStatus(id, 'rejected');
    return { message: 'Agency rejected successfully', agency };
  }

  @Patch('agencies/:id')
  async updateAgency(
    @Param('id') id: string,
    @Body() updateData: {
      agencyName?: string;
      contactEmail?: string;
      contactPhone?: string;
      status?: 'active' | 'inactive' | 'pending';
      directorFirstName?: string;
      directorLastName?: string;
      directorEmail?: string;
      directorPhone?: string;
    }
  ) {
    try {
      const agency = await this.agencyService.update(id, updateData);
      if (!agency) {
        throw new HttpException('Agency not found', HttpStatus.NOT_FOUND);
      }
      return { message: 'Agency updated successfully', agency };
    } catch (err) {
      console.error('Agency update error:', err);
      throw new HttpException(
        'Failed to update agency',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // DELETE agency
  @Delete('agencies/:id')
  async deleteAgency(@Param('id') id: string) {
    try {
      const result = await this.agencyService.remove(id);
      if (!result) {
        throw new HttpException('Agency not found', HttpStatus.NOT_FOUND);
      }
      return { message: 'Agency deleted successfully' };
    } catch (err) {
      console.error('Agency deletion error:', err);
      throw new HttpException(
        'Failed to delete agency',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}