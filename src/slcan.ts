/**
 * @packageDocumentation
 * @author       Scott Price <prices@hugllc.com>
 * @copyright    (C) 2021 Scott Price
 *
 * ## Introduction
 *
 * This is a class implements the server roll in slcan.
 *
 * The slcan standard can be found here:
 *
 * http://www.can232.com/docs/can232_v3.pdf
 *
 */

import SerialPort = require('serialport');
import { Parser } from './parser';
const delimiter = require('@serialport/parser-delimiter')
import * as stream from 'stream';
import { Data, Packet } from './data';
import { Command, IReply } from './command';
import { EventEmitter } from 'events';

/**
 * The main class for slcan.  This is the class the user
 * will instantiate.
 */
class Slcan extends EventEmitter {
    /** The serial port to use. */
    private readonly _port: SerialPort;
    /** The parser we are using. */
    private readonly _parser: stream.Transform;
    /** The waiting replies */
    private _replies: { [key: string]: (reply: IReply) => boolean } = {};
    /** The timeout in ms */
    private timeout: number = 500;
    /** Flag that says if our data channel is open or not */
    private _open: boolean;
    /** This is for making sure that packets don't crash if more than one is sent */
    private _pktCounter: number = 0;
    /** This says if we have enabled autopoll */
    private _autopoll: boolean = true;
    /**
     * Creates the object
     *
     * @param port The serial port to use
     */
    constructor(port: SerialPort, autoopen = true) {
        super();
        this._port = port;
        this._open = autoopen;
        this._parser = this._port.pipe(new Parser());
        this._parser.on("reply", (r) => this._reply(r));
        this._parser.on("data", (data) => {
            this.emit("data", (new Data(data)).toArray());
        });
        this._port.on("open", () => {
            this._port.flush();
            this.emit("ready");
            if (autoopen) {
                this.emit("open");
            }
        });
    }

    /**
     * Sends out data packets.
     *
     * @param pkt The data packet to send out
     */
    public send(pkt: Packet): Promise<boolean> {
        if (this._open) {
            const index = 'd' + this._pktCounter++;
            return Promise.race([
                new Promise<boolean>((resolve) => {
                    const d = new Data(pkt);
                    this._replies[index] = (reply) => {
                        if (reply.error) {
                            resolve(false);
                            delete this._replies[index];
                            return true;
                        } else {
                            const prefix = (this._autopoll) ? "z" : "";
                            if (reply.prefix === prefix) {
                                resolve(true)
                                delete this._replies[index];
                                return true;
                            }
                        }
                        return false;
                    };
                    this._write(d.toString());
                }),
                new Promise<boolean>((resolve) => {
                    setTimeout(() => {
                        resolve(false),
                        delete this._replies[index];
                    }, this.timeout);
                }),
            ]);
        }
        return Promise.resolve(false);
    }

    /**
     * Sends out data packets.
     *
     * @param pkt The data packet to send out
     */
    public open(): Promise<boolean> {
        return this._command("open", () => {
            const open = this._open;
            this._open = true;
            if (!open) {
                this.emit("open");
            }
        });
    }
    /**
     * Sends out data packets.
     *
     * @param pkt The data packet to send out
     */
    public listen(): Promise<boolean> {
        return this._command("listen", () => {
            this._open = true;
            this.emit("open");
        });
    }

    /**
     * Sends out data packets.
     *
     * @param pkt The data packet to send out
     */
    public close(): Promise<boolean> {
        return this._command("close", () => {
            this._open = false;
            this.emit("close");
        });
    }

    private _command(cmd: string, onSuccess: () => void): Promise<boolean> {
        return Promise.race([
            new Promise<boolean>((resolve) => {
                const c = new Command(cmd);
                this._replies[cmd] = (reply) => {
                    if (c.isReply(reply)) {
                        if (reply.error) {
                            resolve(false);
                        } else {
                            onSuccess();
                            resolve(true);
                        }
                        return true;
                    }
                    return false;
                };
                this._write(c.toString());
            }),
            new Promise<boolean>((resolve) => {
                setTimeout(() => {
                    resolve(false),
                    delete this._replies[cmd];
                }, this.timeout);
            }),
        ]);
    }
    /**
     * This deals with replies
     *
     * @param reply The reply we are dealing with
     */
    private _reply(reply: string | boolean): void {
        const r = this._parseReply(reply);
        const obj = this._replies;
        let key: keyof (typeof obj);
        for (key in this._replies) {
            if (this._replies[key](r)) {
                delete this._replies[key];
                break;
            }
        }
    }

    /**
     * This parses a reply
     *
     * @param reply The reply to parse
     */
    private _parseReply(reply: string | boolean): IReply {
        if (typeof reply === "string") {
            return {
                error: reply.length === 0,
                prefix: reply.slice(0, 1),
                data: Buffer.from(reply.slice(1), "hex"),
            };
        }
        return {
            error: !reply,
            prefix: "",
            data: Buffer.alloc(0),
        };
    }

    /**
     * Send out stuff
     *
     * @param str The string to send out
     */
    private _write(str: string): void {
        this._port.write(str + Parser.delimiter);
    }
}
export default Slcan;
export { Slcan, Packet }