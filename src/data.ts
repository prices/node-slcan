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

import { strict } from "assert";
import { stringify } from "querystring";

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
    private readonly string: string;
    private readonly idmask = { ext: 0x1FFFFFFF, std: 0x7FF }

    constructor(buf: Buffer | packet | string) {
        if ((buf instanceof Buffer) || (typeof buf === 'string')) {
            const str = (buf instanceof Buffer) ? buf.toString() : buf;
            const type = str.slice(0, 1);
            this.ext = (type === 'R') || (type === 'T');
            this.rtr = (type === 'R') || (type === 'r');
            this.error = false;

            if (this.ext) {
                this.id = Buffer.from(str.slice(1,9), 'hex').readInt32BE(0) & this.idmask.ext;
                this.length = Buffer.from('0' + str.slice(9, 10), 'hex').readInt8(0);
                this.data = Buffer.from(str.slice(10), 'hex');
            } else {
                this.id = Buffer.from('0' + str.slice(1,4), 'hex').readInt16BE(0) & this.idmask.std;
                this.length = Buffer.from('0' + str.slice(4, 5), 'hex').readInt8(0);
                this.data = Buffer.from(str.slice(5), 'hex');
            }
            if (this.rtr) {
                this.error = this.error || this.data.length !== 0;
                this.data = Buffer.alloc(0);
            } else {
                this.error = this.error || this.data.length !== this.length;
                this.data = Buffer.concat([this.data, Buffer.alloc(this.length)]).slice(0, this.length);
            }
        } else {
            const pkt = buf as packet;
            this.id = pkt.id;
            this.data = pkt.data;
            this.length = pkt.length;
            this.ext = pkt.ext;
            this.rtr = pkt.rtr;
            this.error = pkt.error;
        }
        this.string = this._string(this);
        Object.freeze(this);
    }

    private _string(p: packet): string {
        let str = '';
        let buf;
        if (p.rtr) {
            str += (p.ext) ? 'R' : 'r';
        } else {
            str += (p.ext) ? 'T' : 't';
        }
        if (p.ext) {
            buf = Buffer.alloc(4);
            buf.writeInt32BE(p.id & this.idmask.ext);
            str += buf.toString('hex');
        } else {
            buf = Buffer.alloc(2);
            buf.writeInt16BE(p.id & this.idmask.std);
            str += buf.toString('hex').slice(-3);
        }
        buf = Buffer.alloc(1);
        buf.writeInt8(p.length);
        str += buf.toString('hex').slice(-1);    
        if (!p.rtr) {
            str += p.data.toString('hex');
        }
        return str;
    }

    public toString(): string {
        return this.string;
    }
}