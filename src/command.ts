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

export interface ICommand {
    readonly name: string;
    readonly prefix: string;
    readonly digits: number;
    readonly options?: { [key: string]: Buffer };
}
/* eslint-disable no-bitwise */
/* tslint:disable:no-bitwise */
export class Command {
    public static readonly commands: { [key: string]: ICommand } = {
        "canbitrate": {
            name: "CAN Bit Rate",
            prefix: "S",
            digits: 1,
            options: {
                "10K": Buffer.from([0]),
                "20K": Buffer.from([1]),
                "50K": Buffer.from([2]),
                "100K": Buffer.from([3]),
                "125K": Buffer.from([4]),
                "250K": Buffer.from([5]),
                "500K": Buffer.from([6]),
                "800K": Buffer.from([7]),
                "1M": Buffer.from([8]),
            },
        },
        "open": {
            name: "Open CAN Channel",
            prefix: "O",
            digits: 0,
        },
        "listen": {
            name: "Listen to the CAN Channel",
            prefix: "L",
            digits: 0,
        },
        "close": {
            name: "Close the CAN Channel",
            prefix: "C",
            digits: 0,
        },
        "autopoll": {
            name: "Set the autopoll",
            prefix: "X",
            digits: 1,
            options: {
                "OFF": Buffer.from([0]),
                "ON": Buffer.from([1]),
            },
        },
    }
    public readonly name: string;
    public readonly data: Buffer;
    public readonly command: ICommand;
    public readonly bad: boolean;
    private readonly string: string;
    private readonly _bad: ICommand = {
        name: "bad",
        prefix: "",
        digits: 0,
    }

    constructor(name: string, data?: Buffer | string) {
        this.bad = false;
        this.name = name.toLowerCase();
        this.data = Buffer.alloc(0);
        if (Command.commands.hasOwnProperty(this.name)) {
            this.command = Command.commands[this.name];
            if (this.command.digits) {
                if (data !== undefined) {
                    const key = data.toString().toUpperCase();
                    if (this.command.options && this.command.options.hasOwnProperty(key)) {
                        this.data = this.command.options[key];
                    } else if (typeof data === "string") {
                        this.data = Buffer.from(data);
                    } else {
                        this.data = data;
                    }
                } else {
                    this.bad = true;
                }
            }
        } else {
            this.command = this._bad;
            this.bad = true;
        }
        this.string = this._string();
        Object.freeze(this);
    }

    private _string(): string {
        let str = '';
        if (this.bad) {
            return str;
        }
        str += this.command.prefix;
        if (this.command.digits) {
            str += this.data.toString('hex').slice(0 - this.command.digits);
        }
        return str;
    }

    public toString(): string {
        return this.string;
    }
}