import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Country } from 'src/models/country.model';
import axios from 'axios';

@Injectable()
export class CountryService {
  constructor(
    @InjectModel(Country)
    private readonly countryModel: typeof Country,
  ) {}

  async createCountry(
    authToken: string,
    data: { name: string; latitude: number; longitude: number },
  ) {
    try{
      const token = authToken.startsWith('Bearer ')
      ? authToken.slice(7)
      : authToken;

    const response = await axios.get(
      'http://localhost:3000/user/getUserId',
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    const userId = response.data.userId;
    const result = {
      ...data,
      createdBy: userId,
    };
    return this.countryModel.create(result);
    } catch(error) {
      console.error('create country API error:', error);
      throw new Error('Failed to fetch user ID or create country. Please try again.');
    }
  }

  async searchCountries(
    query: string,
  ): Promise<{ name: string; lat: number; long: number }[]> {
    if (query.length < 3) {
      return [];
    }

    try {
      const response = await axios.get(
        `https://restcountries.com/v3.1/name/${query}`,
      );
      return response.data.map((country: any) => ({
        name: country.name.common,
        lat: country.latlng[0],
        long: country.latlng[1],
      }));
    } catch (error) {
      console.error('Error fetching countries:', error);
      throw new Error('Failed to fetch countries.');
    }
  }

  async fetchWeatherData() {
    try{
      const countries = await this.countryModel.findAll({
        attributes: ['name', 'latitude', 'longitude'],
      });
  
      const apiKey = process.env.WEATHER_API_KEY;
  
      const weatherData = await Promise.all(
        countries.map(async (country) => {
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${country.latitude}&lon=${country.longitude}&appid=${apiKey}&units=metric`,
          );
          const weather = response.data;
  
          return {
            name: country.name,
            temperature: weather.main.temp,
            description: weather.weather[0].description,
          };
        }),
      );
      return weatherData;
    } catch(error){
      console.error('Error fetching weather:', error);
      throw new Error('Failed to fetch weather.');
    }
  }
}
