import { CustomerOrder } from './customerorder';
export class DelNote {

    delNoteRef: number;
    delNoteDate: Date;
    delOrdRef: CustomerOrder;
    senderName: string;
    senderAddr1: string;
    senderAddr2: string;
    senderAddr3: string;
    senderAddr4: string;
    senderTown: string;
    deliveryDate: Date;
    deliveryTime: string;
    senderMessage: string;
    receiverName: string;
    receiverAddr1: string;
    receiverAddr2: string;
    receiverAddr3: string;
    receiverAddr4: string;
    receiverTown: string;
    receiverPhone: string;
    customHamperRemarks: string;
    reqCalendar: boolean;
    reqDiary: boolean;
    reqCard: boolean;
    reqOther: string;
    itemCode: string;
    itemDescription: string;
    qtyOrd: number;
    status: string;
    delNotePrintDate: Date;
    labelPrintDate: Date;
    locked: boolean;

    constructor() {}
}
