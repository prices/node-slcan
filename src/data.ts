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
/**
 * This is the packet interface
 */
export interface Packet {
    /** The CAN id to use in this packet */
    readonly id: number;
    /** The data for the packet */
    readonly data: Buffer;
    /** The length of the packet.  For RTR packets this is different from the data length. */
    readonly length?: number;
    /** True if this is an extended packet. */
    readonly ext?: boolean;
    /** True if this is an RTR packet */
    readonly rtr?: boolean;
    /** True if this packet has errors */
    readonly error?: boolean;
    /** Timestamp if this packet in ms */
    readonly timestamp?: number;
}
/* eslint-disable no-bitwise */
/* tslint:disable:no-bitwise */
/**
 * This does the conversions of the packets from text to something more useful.  It
 * does the conversion both ways.  It can be created from the string, or from the @see Packet interface.
 */
export class Data implements Packet {
    /** The CAN id to use in this packet */
    public readonly id: number;
    /** The data for the packet */
    public readonly data: Buffer;
    /** The length of the packet.  For RTR packets this is different from the data length. */
    public readonly length: number;
    /** True if this is an extended packet. */
    public readonly ext: boolean;
    /** True if this is an RTR packet */
    public readonly rtr: boolean;
    /** True if this packet has errors */
    public readonly error: boolean;
    /** Timestamp if this packet in ms */
    public readonly timestamp?: number;
    /** This is the string representation of the packet */
    private readonly string: string;
    /** The id masks for the standard and extended can frames */
    private readonly idmask = { ext: 0x1FFFFFFF, std: 0x7FF }
    /** This is the maximum for the time stamp. */
    private readonly timestampmax = 0xEA5F;

    /**
     * Creates the object
     *
     * @param buf This is the packet data to create this object from.  It can be the
     *            string incoming on the serial port, a Packet interface, or a Buffer
     */
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

    /**
     * This creates the string from the @see Packet interface.
     *
     * @return The string that goes on the serial port
     */
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
    /**
     * Public function to return the string
     *
     * @return The packet string
     */
    public toString(): string {
        return this.string;
    }
    /**
     * Public function to return the string
     *
     * @return A packet array
     */
    public toArray(): Packet {
        return {
            id: this.id,
            data: this.data,
            length: this.length,
            ext: this.ext,
            rtr: this.rtr,
            error: this.error,
            timestamp: this.timestamp,
        };
    }
}