import * as moment from 'moment';

export class AcoGeneral {

    static getDateddmmyy(someDate: Date): Date {
        const aDate: Date = new Date(moment(someDate).format('M/D/YYYY'));
        aDate.setMinutes(aDate.getMinutes() + 120); // note 120 is to add 2 Hours to GMT
        return aDate;
    }

}
