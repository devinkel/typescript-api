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

    it('should exclude incomplete data points', async () => {
        const lat = 58.7984;
        const lng = 17.8081;
        const incompletResponse = {
            hours: [
                {
                    windDirection: {
                        noaa: 300,
                    },
                    time: '2020-04-26T00:00:00+00:00',
                },
            ],
        };
        mockedAxios.get.mockResolvedValue({ data: incompletResponse });

        const stormGlass = new StormGlass(mockedAxios);
        const response = await stormGlass.fetchPoints(lat, lng);

        expect(response).toEqual([]);
    });

    it('should get a generic error from StormGlass service when the request fail before reaching the service', async () => {
        const lat = 58.7984;
        const lng = 17.8081;

        mockedAxios.get.mockRejectedValue({ message: ' Network Error ' });

        const stormGlass = new StormGlass(mockedAxios);

        await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
            'Unexpected error when trying to communicate to StormGlass: Network Error'
        );
    });

    it('should get a StormGlassResponseError when the StormGlass service responds with error', async () => {
        const lat = 58.7984;
        const lng = 17.8081;

        mockedAxios.get.mockRejectedValue({
            response: {
                status : 402,
                data: { errors: {key: "API quota exceeded"}}
            }
        });

        const stormGlass = new StormGlass(mockedAxios)

        await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
            'Unexpected error returned by the StormGlass service: Error: {"errors":{"key":"API quota exceeded"}} Code: 402'
        );
    });
});
