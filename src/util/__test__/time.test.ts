import { TimeUtil } from '../time';
import moment from 'moment';

describe('getUnixTimeForAFutureDay', () => {
    it('should return the correct Unix time for a future day', () => {
        const days = 7;
        const expectedUnixTime = moment().add(days, 'days').unix();
        const result = TimeUtil.getUnixTimeForAFutureDay(days);
        expect(result).toEqual(expectedUnixTime);
    });
});
