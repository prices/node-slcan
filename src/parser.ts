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

/**
 * This parses the data coming in from the serial port
 */
export class Parser extends Transform {
    /** The delimiter for the normal packets */
    public static readonly delimiter = '\r';
    /** The delimiter that notes an error.  \u0007 is the BEL character (ascii 7) */
    public static readonly errorDelimiter = '\u0007';

    /** This is the buffer we store the incoming data into until there is enough to parse. */
    private buf: Buffer = Buffer.alloc(0);
    /**
     * Creates the object
     *
     * @param options The options to use for the parser
     */
    constructor(options = {}) {
        super(options);
    }
    /**
     * This does the actual parsing.
     *
     * @param chunk The chunk of data coming in.
     * @param _encoding  The encoding of the data coming in.
     * @param callback The callback to call at the end.
     */
    public _transform(chunk: Buffer, _encoding: string, callback: () => void): void {
        let index = 0;
        while(index > -1) {
            index = chunk.indexOf(Parser.errorDelimiter);
            if (index > -1) {
                chunk = Buffer.concat([chunk.slice(0,index), chunk.slice(index+1, chunk.length)]);
                this.emit("reply", false);
            }
        }
        chunk = Buffer.concat([this.buf, chunk]);
        let end = 0;
        while(end > -1) {
            end = chunk.indexOf(Parser.delimiter);
            if (end > -1) {
                const c = chunk.slice(0, end);
                if (this._isData(c)) {
                    this.push(c);
                } else if (this._isReply(c)) {
                    this.emit("reply", (c.length > 0) ? c.toString() : true);
                } else {
                    this.emit("command", c.toString());
                }
                chunk = chunk.slice(end + 1);
            }
        }
        this.buf = chunk;
        callback();
    }

    /**
     * This checks to see if the packet coming in is data
     *
     * @param chunk The chunk of data to check
     *
     * @return True if this is a data packet
     */
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
    /**
     * This checks to see if the packet coming in is a reply
     *
     * @param chunk The chunk of data to check
     *
     * @return True if this is a reply packet
     */
    private _isReply(chunk: Buffer): boolean {
        switch (chunk.toString().slice(0, 1)) {
            case 'z':
            case 'Z':
                return chunk.length === 1;
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