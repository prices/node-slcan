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
    public readonly string: string;

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
            this.data = Buffer.alloc(0);
        } else {
            this.error = this.error || this.data.length !== this.length;
            this.data = Buffer.concat([this.data, Buffer.alloc(this.length)]).slice(0, this.length);
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
            buf.writeInt32BE(this.id);
            str += buf.toString('hex');
        } else {
            buf = Buffer.alloc(2);
            buf.writeInt16BE(this.id);
            str += buf.toString('hex').slice(-3);
        }
        buf = Buffer.alloc(1);
        buf.writeInt8(this.length);
        str += buf.toString('hex').slice(-1);    
        if (!this.rtr) {
            str += this.data.toString('hex');
        }
        return str;
    }

    public toString(): string {
        return this.string;
    }
}