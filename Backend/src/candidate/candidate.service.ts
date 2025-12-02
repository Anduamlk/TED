import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Candidate } from './candidate.entity';

@Injectable()
export class CandidateService {
  constructor(
    @InjectRepository(Candidate)
    private readonly candidateRepo: Repository<Candidate>,
  ) {}

  async create(data: Partial<Candidate>): Promise<Candidate> {
    const candidate = this.candidateRepo.create(data);
    return await this.candidateRepo.save(candidate);
  }

  findAll(): Promise<Candidate[]> {
    return this.candidateRepo.find({
      order: {
        createdAt: 'DESC'
      }
    });
  }

  findOne(id: string): Promise<Candidate | null> {
    return this.candidateRepo.findOne({ where: { id } });
  }

  async updateStatus(id: string, status: 'pending' | 'approved' | 'rejected'): Promise<Candidate> {
    const candidate = await this.candidateRepo.findOne({ where: { id } });
    if (!candidate) {
      throw new Error('Candidate not found');
    }
    
    candidate.status = status;
    return await this.candidateRepo.save(candidate);
  }

  // ADD THESE METHODS:

  async update(id: string, updateData: Partial<Candidate>): Promise<Candidate> {
    const candidate = await this.candidateRepo.findOne({ where: { id } });
    if (!candidate) {
      throw new Error('Candidate not found');
    }
    
    // Update candidate fields
    Object.assign(candidate, updateData);
    return await this.candidateRepo.save(candidate);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.candidateRepo.delete(id);
    return (result.affected ?? 0) > 0;
  }
}