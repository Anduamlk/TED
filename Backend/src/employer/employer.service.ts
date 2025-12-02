import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employer } from './employer.entity';

@Injectable()
export class EmployerService {
  constructor(
    @InjectRepository(Employer)
    private readonly employerRepo: Repository<Employer>,
  ) {}

  async create(data: Partial<Employer>): Promise<Employer> {
    const employer = this.employerRepo.create(data);
    return await this.employerRepo.save(employer);
  }

  findAll(): Promise<Employer[]> {
    return this.employerRepo.find({
      order: {
        createdAt: 'DESC'
      }
    });
  }

  findOne(id: string): Promise<Employer | null> {
    return this.employerRepo.findOne({ where: { id } });
  }

  async updateStatus(id: string, status: 'pending' | 'approved' | 'rejected'): Promise<Employer> {
    const employer = await this.employerRepo.findOne({ where: { id } });
    if (!employer) {
      throw new Error('Employer not found');
    }
    
    employer.status = status;
    return await this.employerRepo.save(employer);
  }

  async verifyEmployer(id: string): Promise<Employer> {
    const employer = await this.employerRepo.findOne({ where: { id } });
    if (!employer) {
      throw new Error('Employer not found');
    }
    
    employer.verified = true;
    return await this.employerRepo.save(employer);
  }

  // ADD THESE METHODS:

  async update(id: string, updateData: Partial<Employer>): Promise<Employer> {
    const employer = await this.employerRepo.findOne({ where: { id } });
    if (!employer) {
      throw new Error('Employer not found');
    }
    
    // Update employer fields
    Object.assign(employer, updateData);
    return await this.employerRepo.save(employer);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.employerRepo.delete(id);
    return (result.affected ?? 0) > 0;
  }
}