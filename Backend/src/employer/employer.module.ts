import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployerController } from './employer.controller';
import { EmployerService } from './employer.service';
import { Employer } from './employer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Employer])],
  controllers: [EmployerController],
  providers: [EmployerService],
  exports: [EmployerService], 
})
export class EmployerModule {}
