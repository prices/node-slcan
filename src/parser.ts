/**
 * @packageDocumentation
 * @author       Scott Price <prices@hugllc.com>
 * @copyright    (C) 2021 Scott Price
 *
 * ## Introduction
 *
 * Parses the incoming stream of data
 *
 */

import { Transform } from "stream"

export class Parser extends Transform {
    private buf: Buffer = Buffer.alloc(0);
    constructor(options = {}) {
        super(options);
    }

    public _transform(chunk: Buffer, _encoding: string, callback: () => void): void {
        let index = -1;
        while((index = chunk.indexOf('\u0007')) > -1) {  // \u0007 is the BEL character (ascii 7)
            chunk = Buffer.concat([chunk.slice(0,index), chunk.slice(index+1, chunk.length)]);
            this.emit("reply", false);
        }
        chunk = Buffer.concat([this.buf, chunk]);
        let end = -1;
        while((end = chunk.indexOf("\r")) > -1) {
            const c = chunk.slice(0, end);
            if (this._isData(c)) {
                this.push(c.toString());
            } else if (this._isReply(c)) {
                this.emit("reply", c.toString());
            } else {
                this.emit("request", c.toString());
            }
            chunk = chunk.slice(end + 1);
        }
        this.buf = chunk;
        callback();
    }

    private _isData(chunk: Buffer): boolean {
        switch (chunk.toString().slice(0, 1)) {
            case 'r':
            case 'R':
            case 't':
            case 'T':
                return true;
        }
        return false;
    }
    private _isReply(chunk: Buffer): boolean {
        switch (chunk.toString().slice(0, 1)) {
            case 'z':
            case 'Z':
                return true;
            case 'F':
            case 'V':
            case 'N':
                return chunk.length > 1;
            case 'A':
                this.emit("request", chunk.toString());  // This could be a reply or a request
                return true;
        }
        return chunk.length === 0;
    }
}