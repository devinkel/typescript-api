import { StormGlass } from '@src/clients/StormGlass';
import { Beach, GeoPosition } from '@src/models/beach';
import stormGlassNormalizedResponseFixture from '@test/fixtures/stormglass_normalized_3_hours.json';
import { Forecast, ForecastProcessingInternalError } from '../forecast';

jest.mock('@src/clients/StormGlass');

describe('Forecast Service', () => {
    const mockedStormGlassService = new StormGlass() as jest.Mocked<StormGlass>;
    it('should return the forecast for multiple beaches in the same hour with different ratings ordered by rating decreasing', async () => {
        mockedStormGlassService.fetchPoints.mockResolvedValueOnce([
            {
                swellDirection: 123.41,
                swellHeight: 0.21,
                swellPeriod: 3.67,
                time: '2020-04-26T00:00:00+00:00',
                waveDirection: 232.12,
                waveHeight: 0.46,
                windDirection: 310.48,
                windSpeed: 100,
            },
        ]);
        mockedStormGlassService.fetchPoints.mockResolvedValueOnce([
            {
                swellDirection: 64.26,
                swellHeight: 0.15,
                swellPeriod: 13.89,
                time: '2020-04-26T00:00:00+00:00',
                waveDirection: 231.38,
                waveHeight: 2.07,
                windDirection: 299.45,
                windSpeed: 100,
            },
        ]);
        const defaultBeaches: Beach[] = [
            {
                lat: -33.792726,
                lng: 151.289824,
                name: 'Manly',
                position: GeoPosition.E,
                user: 'fake-id',
            },
            {
                lat: -33.792726,
                lng: 141.289824,
                name: 'Dee Why',
                position: GeoPosition.S,
                user: 'fake-id',
            },
        ];
        const expectedResponse = [
            {
                time: '2020-04-26T00:00:00+00:00',
                forecast: [
                    {
                        lat: -33.792726,
                        lng: 151.289824,
                        name: 'Manly',
                        position: 'E',
                        rating: 2,
                        swellDirection: 123.41,
                        swellHeight: 0.21,
                        swellPeriod: 3.67,
                        time: '2020-04-26T00:00:00+00:00',
                        waveDirection: 232.12,
                        waveHeight: 0.46,
                        windDirection: 310.48,
                        windSpeed: 100,
                    },
                    {
                        lat: -33.792726,
                        lng: 141.289824,
                        name: 'Dee Why',
                        position: 'S',
                        rating: 3,
                        swellDirection: 64.26,
                        swellHeight: 0.15,
                        swellPeriod: 13.89,
                        time: '2020-04-26T00:00:00+00:00',
                        waveDirection: 231.38,
                        waveHeight: 2.07,
                        windDirection: 299.45,
                        windSpeed: 100,
                    },
                ],
            },
        ];
        const forecast = new Forecast(mockedStormGlassService);
        const beachesWithRating = await forecast.processForecastForBeaches(
            defaultBeaches,
            'asc',
            'rating'
        );
        expect(beachesWithRating).toEqual(expectedResponse);
    });

    it('should return an empty list when the beaches  array is empty', async () => {
        const forecast = new Forecast();
        const response = await forecast.processForecastForBeaches([]);
        expect(response).toEqual([]);
    });

    it('should throw internal processing error when something goes wrong during the rating', async () => {
        const beaches: Beach[] = [
            {
                lat: -33.792726,
                lng: 151.289428,
                name: 'Mainly',
                position: GeoPosition.E,
                user: 'fake-id',
            },
        ];

        mockedStormGlassService.fetchPoints.mockRejectedValue(
            'Error fetcjing data'
        );

        const forecast = new Forecast(mockedStormGlassService);
        await expect(
            forecast.processForecastForBeaches(beaches)
        ).rejects.toThrow(ForecastProcessingInternalError);
    });
});
