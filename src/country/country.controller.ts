import { Body, Controller, Get, Post, Query, UseGuards, Headers } from '@nestjs/common';
import { CountryService } from './country.service';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';

@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get('search')
  async search(@Query('q') query: string): Promise<any> {
    return this.countryService.searchCountries(query);
  }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createCountry(
    @Headers('authorization') authToken: string,
    @Body()
    body: {
      name: string;
      latitude: number;
      longitude: number;
    },
  ) {
    return this.countryService.createCountry(authToken, body);
  }

  @Get('weather')
  async getLatestWeather() {
    const weatherData = await this.countryService.fetchWeatherData();
    return { success: true, data: weatherData };
  }

}
