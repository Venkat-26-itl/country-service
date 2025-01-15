import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Country } from 'src/models/country.model';
import { CountryService } from './country.service';
import { CountryController } from './country.controller';
import { JwtAuthModule } from 'src/jwt/jwt-auth.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Country]),
    JwtAuthModule,
  ],
  providers: [CountryService],
  controllers: [CountryController],
  exports: [CountryService],
})
export class CountryModule {}
