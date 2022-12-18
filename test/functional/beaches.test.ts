import { Beach } from "@src/models/beach";
import mongoose from "mongoose";

describe('Beaches functional tests', () => {
    beforeAll(async () => await Beach.deleteMany({}));
    describe('When creating beach', () => {
        it('should create a beach with success', async () => {
            const newBeach = { 
                lat: -33.4404040,
                lng: 151.2321312,
                name: 'Navega',
                position: 'E'
            }

            const response = await global.testRequest.post('/beaches').send(newBeach);
            expect(response.status).toBe(201);
            expect(response.body).toEqual(expect.objectContaining(newBeach));
        });
    

        it('should throw 422 when there is a validation error', async() => {
            const newBeach = {
                lat: 'invalid_string',
                lng: 151.2321312,
                name: 'Navega',
                position: 'E'
            }
            const response = await global.testRequest.post('/beaches').send(newBeach);

            expect(response.status).toBe(422);
            expect(response.body).toEqual({
                error: 'Beach validation failed: lat: Cast to Number failed for value "invalid_string" (type string) at path "lat"',
            });
        });

        it('should return 500 when there is any other than validation error', async () => {
            const newBeach = { 
                lat: -33.4404040,
                lng: 151.2321312,
                name: 'Navega',
                position: 'E'
            }
            
            await mongoose.disconnect();
            const response = await global.testRequest.post('/beaches').send(newBeach);
            expect(response.status).toBe(500);
            expect(response.body).toEqual({
                error: 'Internal Server Error.',
            });
        })
    });
});