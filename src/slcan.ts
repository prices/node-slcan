/**
 * @packageDocumentation
 * @author     Scott L. Price <prices@hugllc.com>
 * @copyright  © 2020 Hunt Utilities Group, LLC
 *
 * This is the include file for HUGnetCANLib.  This is the only file
 * that should get imported into other projects.
 *
 */
import SerialPort = require('serialport');
import { Master } from "./master";
import { Slave } from "./slave";

export function master(port: string | SerialPort, baud: number = 115200): Master {
    if (typeof port === "string") {
        port = new SerialPort(port, {
            baudRate: baud
        });
        if (!(port instanceof SerialPort)) {
            throw new Error(("Port Not found"));
        }
    }
    return new Master(port);
}

export function slave(port: string | SerialPort, baud: number = 115200): Slave {
    if (typeof port === "string") {
        port = new SerialPort(port, {
            baudRate: baud
        });
        if (!(port instanceof SerialPort)) {
            throw new Error(("Port Not found"));
        }
    }
    return new Slave(port);
}
