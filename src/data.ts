/**
 * @packageDocumentation
 * @author       Scott Price <prices@hugllc.com>
 * @copyright    (C) 2021 Scott Price
 *
 * ## Introduction
 *
 * Parses a data packet
 *
 */

export interface packet {
    readonly id: number;
    readonly data: Buffer;
    readonly length: number;
    readonly ext: boolean;
    readonly rtr: boolean;
    readonly error: boolean;
}

export class Data implements packet{
    public readonly id: number;
    public readonly data: Buffer;
    public readonly length: number;
    public readonly ext: boolean;
    public readonly rtr: boolean;
    public readonly error: boolean;

    constructor(buf: Buffer) {
        const str = buf.toString();
        const type = str.slice(0, 1);
        this.ext = (type === 'R') || (type === 'T');
        this.rtr = (type === 'R') || (type === 'r');
        this.error = false;

        if (this.ext) {
            this.id = Buffer.from(str.slice(1,9), 'hex').readInt32BE(0) & 0x1FFFFFFF;
            this.length = Buffer.from('0' + str.slice(9, 10), 'hex').readInt8(0);
            this.data = Buffer.from(str.slice(10), 'hex');
        } else {
            this.id = Buffer.from('0' + str.slice(1,4), 'hex').readInt16BE(0) & 0x7FF;
            this.length = Buffer.from('0' + str.slice(4, 5), 'hex').readInt8(0);
            this.data = Buffer.from(str.slice(5), 'hex');
        }
        if (this.rtr) {
            this.error = this.error || this.data.length !== 0;
        } else {
            this.error = this.error || this.data.length !== this.length;
        }
        Object.freeze(this);
    }
}