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

export interface Packet {
    readonly id: number;
    readonly data: Buffer;
    readonly length?: number;
    readonly ext?: boolean;
    readonly rtr?: boolean;
    readonly error?: boolean;
    readonly timestamp?: number;
}
/* eslint-disable no-bitwise */
/* tslint:disable:no-bitwise */
export class Data implements Packet{
    public readonly id: number;
    public readonly data: Buffer;
    public readonly length: number;
    public readonly ext: boolean;
    public readonly rtr: boolean;
    public readonly error: boolean;
    public readonly timestamp?: number;
    private readonly string: string;
    private readonly idmask = { ext: 0x1FFFFFFF, std: 0x7FF }
    private readonly timestampmax = 0xEA5F;

    constructor(buf: Buffer | Packet | string) {
        if ((buf instanceof Buffer) || (typeof buf === 'string')) {
            const str = (buf instanceof Buffer) ? buf.toString() : buf;
            const type = str.slice(0, 1);
            this.ext = (type === 'R') || (type === 'T');
            this.rtr = (type === 'R') || (type === 'r');
            this.error = false;

            if (this.ext) {
                this.id = Buffer.from(str.slice(1,9), 'hex').readUInt32BE(0) & this.idmask.ext;
                this.length = Buffer.from('0' + str.slice(9, 10), 'hex').readInt8(0);
                this.data = Buffer.from(str.slice(10), 'hex');
            } else {
                this.id = Buffer.from('0' + str.slice(1,4), 'hex').readUInt16BE(0) & this.idmask.std;
                this.length = Buffer.from('0' + str.slice(4, 5), 'hex').readInt8(0);
                this.data = Buffer.from(str.slice(5), 'hex');
            }

            if (this.rtr) {
                if (this.data.length === 2) {
                    this.timestamp = this.data.readUInt16BE(0);
                    this.data = Buffer.alloc(0);
                    if (this.timestamp > this.timestampmax) {
                        this.timestamp = undefined;
                    }
                }
                this.error = this.error || this.data.length !== 0;
                this.data = Buffer.alloc(0);
            } else {
                if (this.data.length === (this.length + 2)) {
                    this.timestamp = this.data.readUInt16BE(this.length);
                    this.data = this.data.slice(0, this.length);
                    if (this.timestamp > this.timestampmax) {
                        this.timestamp = undefined;
                    }
                }
                this.error = this.error || this.data.length !== this.length;
                this.data = Buffer.concat([this.data, Buffer.alloc(this.length)]).slice(0, this.length);
            }
        } else {
            const pkt = buf as Packet;
            this.ext = (pkt.ext === undefined) ? false : pkt.ext;
            this.id = (pkt.ext) ? pkt.id & this.idmask.ext : pkt.id & this.idmask.std;
            this.data = pkt.data;
            this.length = (pkt.length === undefined) ? this.data.length : pkt.length;
            this.rtr = (pkt.rtr === undefined) ? false : pkt.rtr;
            this.error = (pkt.error === undefined) ? false : pkt.error;
            this.timestamp = pkt.timestamp;
        }
        this.string = this._string();
        Object.freeze(this);
    }

    private _string(): string {
        let str = '';
        let buf;
        if (this.rtr) {
            str += (this.ext) ? 'R' : 'r';
        } else {
            str += (this.ext) ? 'T' : 't';
        }
        if (this.ext) {
            buf = Buffer.alloc(4);
            buf.writeUInt32BE(this.id & this.idmask.ext);
            str += buf.toString('hex');
        } else {
            buf = Buffer.alloc(2);
            buf.writeUInt16BE(this.id & this.idmask.std);
            str += buf.toString('hex').slice(-3);
        }
        buf = Buffer.alloc(1);
        buf.writeInt8(this.length);
        str += buf.toString('hex').slice(-1);
        if (!this.rtr) {
            str += this.data.toString('hex');
        }
        if ((this.timestamp !== undefined) && (this.timestamp <= this.timestampmax)) {
            buf = Buffer.alloc(2);
            buf.writeUInt16BE(this.timestamp);
            str += buf.toString('hex');
        }
        return str;
    }

    public toString(): string {
        return this.string;
    }
}