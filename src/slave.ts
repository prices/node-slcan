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
import * as stream from 'stream';

export class Slave {
    private _port: SerialPort;
    private _parser: stream.Transform;

    /**
     * Constructor
     */
    constructor(port: SerialPort) {
        this._port = port;
        this._parser = this._port.pipe(new Parser());
        this._parser.on('data', this._data);
        this._parser.on('command', this._command);
    }


    protected _data(data: Buffer) {
        console.log({data: data.toString()});
        /* Stuff */
    }

    protected _command(command: Buffer) {
        console.log({command: command.toString()});
        /* Stuff */
    }
}