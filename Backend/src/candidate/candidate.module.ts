import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Candidate } from './candidate.entity';
import { CandidateService } from './candidate.service';
import { CandidateController } from './candidate.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Candidate])],
  providers: [CandidateService],
  controllers: [CandidateController],
})
export class CandidateModule {}
