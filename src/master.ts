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

export class Master {
    private _port: SerialPort;
    private _parser: stream.Transform;

    /**
     * Constructor
     */
    constructor(port: SerialPort) {
        this._port = port;
        this._parser = this._port.pipe(new Parser());
        this._port.flush();
        this._parser.on('data', this._data);
        this._parser.on('reply', this._reply);
    }


    protected _reply(reply: Buffer | boolean) {
        console.log({reply: reply.toString()});
        /* Stuff */
    }

    protected _data(data: Buffer) {
        console.log({data: data.toString()});
        /* Stuff */
    }

}