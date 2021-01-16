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

import { EventEmitter } from 'events';

export class SlCAN extends EventEmitter {
    private _port: SerialPort;
    private _parser: stream.Transform;

    /**
     * Constructor
     */
    constructor(port: SerialPort) {
        super();
        this._port = port;
        this._parser = this._port.pipe(new Parser());
        this._port.on("open", () => {
            this._port.flush();
            this.emit("open");
            this.emit("ready");
        });
        this._parser.on("data", (data) => {
            this.emit("data", data);
        });
    }

    public send(pkt: Packet) {
        const d = new Data(pkt);
        this._port.write(d.toString() + Parser.delimiter);
    }

}