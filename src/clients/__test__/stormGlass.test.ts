import { StormGlass } from '@src/clients/stormGlass';
import axios from 'axios';
import stormGlassWeather3HoursFixture from '@test/fixtures/stormglass_weather_3_hours.json';
import stormGlassWeather3HoursFixtureNormalized from '@test/fixtures/stormglass_normalized_3_hours.json';

// simulando a funcao fetchPoint do StormGlass com mock para dps trocar pro fetch
jest.mock('axios');

describe('StormGlass Client', () => {
    const mockedAxios = axios as jest.Mocked<typeof axios>;

    it('should return the normalized forecast from the StormGlass service', async () => {
        const lat = 58.7984;
        const lng = 17.8081;

        mockedAxios.get.mockResolvedValueOnce({
            data: stormGlassWeather3HoursFixture,
        });

        const stormGlass = new StormGlass(mockedAxios);
        const response = await stormGlass.fetchPoints(lat, lng);
        expect(response).toEqual(stormGlassWeather3HoursFixtureNormalized);
    });
});
