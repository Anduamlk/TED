import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agency } from './agency.entity';

@Injectable()
export class AgencyService {
  constructor(
    @InjectRepository(Agency)
    private readonly agencyRepo: Repository<Agency>,
  ) {}

  async create(data: Partial<Agency>): Promise<Agency> {
    const agency = this.agencyRepo.create(data);
    return await this.agencyRepo.save(agency);
  }

  findAll(): Promise<Agency[]> {
    return this.agencyRepo.find({
      order: {
        createdAt: 'DESC'
      }
    });
  }

  findOne(id: string): Promise<Agency | null> {
    return this.agencyRepo.findOne({ where: { id } });
  }

  async updateStatus(id: string, status: 'pending' | 'approved' | 'rejected'): Promise<Agency> {
    const agency = await this.agencyRepo.findOne({ where: { id } });
    if (!agency) {
      throw new Error('Agency not found');
    }
    
    agency.status = status;
    return await this.agencyRepo.save(agency);
  }

  async verifyAgency(id: string): Promise<Agency> {
    const agency = await this.agencyRepo.findOne({ where: { id } });
    if (!agency) {
      throw new Error('Agency not found');
    }
    
    agency.verified = true;
    return await this.agencyRepo.save(agency);
  }

  async update(id: string, updateData: Partial<Agency>): Promise<Agency> {
    const agency = await this.agencyRepo.findOne({ where: { id } });
    if (!agency) {
      throw new Error('Agency not found');
    }
    
    // Update agency fields
    Object.assign(agency, updateData);
    return await this.agencyRepo.save(agency);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.agencyRepo.delete(id);
    return (result.affected ?? 0) > 0;
  }
}