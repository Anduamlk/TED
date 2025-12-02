import { 
  Controller, 
  Post, 
  Get,
  Body, 
  UseInterceptors, 
  UploadedFiles,
  Patch,
  Param,
  UsePipes,
  ValidationPipe,
  Delete,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { CandidateService } from './candidate.service';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { fileStorage } from '../utils/file-storage.util';

@Controller('api')
export class CandidateController {
  constructor(private readonly candidateService: CandidateService) {}

  @Post('register/candidate')
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: fileStorage('uploads/candidates'), 
      limits: {
        fileSize: 5 * 1024 * 1024, 
      },
    }),
  )
  async registerCandidate(
    @Body() body: any, 
    @UploadedFiles() files: Array<Express.Multer.File> = [],
  ) {
    
    const fileMap: Record<string, string> = {};

    for (const file of files) {
      const relativePath = `uploads/candidates/${file.filename}`;
      fileMap[file.fieldname + 'Path'] = relativePath;
    }
    const candidateData = {
      firstName: body.firstName,
      lastName: body.lastName,
      gender: body.gender,
      dateOfBirth: body.dateOfBirth,
      phone: body.phone,
      email: body.email,
      passportNumber: body.passportNumber,
      skills: body.skills,
      preferredDestination: body.preferredDestination,
      otherDestination: body.otherDestination || null,
      ...fileMap,
    };
    const newCandidate = await this.candidateService.create(candidateData);
    return { candidateId: newCandidate.id };
  }

  @Get('candidates')
  async getAllCandidates() {
    const candidates = await this.candidateService.findAll();
    return candidates;
  }

  @Get('candidates/:id')
  async getCandidate(@Param('id') id: string) {
    const candidate = await this.candidateService.findOne(id);
    if (!candidate) {
      throw new HttpException('Candidate not found', HttpStatus.NOT_FOUND);
    }
    return candidate;
  }

  @Patch('candidates/:id/approve')
  async approveCandidate(@Param('id') id: string) {
    const candidate = await this.candidateService.updateStatus(id, 'approved');
    return { message: 'Candidate approved successfully', candidate };
  }

  @Patch('candidates/:id/reject')
  async rejectCandidate(@Param('id') id: string) {
    const candidate = await this.candidateService.updateStatus(id, 'rejected');
    return { message: 'Candidate rejected successfully', candidate };
  }

  @Patch('candidates/:id')
  async updateCandidate(
    @Param('id') id: string,
    @Body() updateData: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
      status?: 'active' | 'inactive' | 'pending';
      skills?: string;
      preferredDestination?: string;
    }
  ) {
    try {
      const candidate = await this.candidateService.update(id, updateData);
      if (!candidate) {
        throw new HttpException('Candidate not found', HttpStatus.NOT_FOUND);
      }
      return { message: 'Candidate updated successfully', candidate };
    } catch (err) {
      console.error('Candidate update error:', err);
      throw new HttpException(
        'Failed to update candidate',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('candidates/:id')
  async deleteCandidate(@Param('id') id: string) {
    try {
      const result = await this.candidateService.remove(id);
      if (!result) {
        throw new HttpException('Candidate not found', HttpStatus.NOT_FOUND);
      }
      return { message: 'Candidate deleted successfully' };
    } catch (err) {
      console.error('Candidate deletion error:', err);
      throw new HttpException(
        'Failed to delete candidate',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}