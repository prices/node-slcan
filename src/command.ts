/**
 * @packageDocumentation
 * @author       Scott Price <prices@hugllc.com>
 * @copyright    (C) 2021 Scott Price
 *
 * ## Introduction
 *
 * Creates a command packet from a command
 *
 */

/**
 * The command interface.
 */
export interface ICommand {
    /** This is the spelled out name */
    readonly name: string;
    /** This is the packet prefix that is used when we send it out */
    readonly prefix: string;
    /** The number of digits to put into the packet.  Set to 0 if there is no options. */
    readonly digits: number;
    /** The prefix expected in the reply */
    readonly replyPrefix: string;
    /** The options that are possible with this one */
    readonly options?: { [key: string]: Buffer };
}

/**
 * The command interface.
 */
export interface IReply {
    /** Is this an error */
    readonly error: boolean;
    /** The prefix in this reply */
    readonly prefix: string;
    /** The data returned with the packet */
    readonly data: Buffer;
}

/**
 * This creates a command packet to send out, and checks to see if a reply is actually for
 * this command.
 *
 * This is an immutable object.
 */
export class Command {
    /** The information about the commands that we know. */
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
            replyPrefix: "",
        },
        "open": {
            name: "Open CAN Channel",
            prefix: "O",
            digits: 0,
            replyPrefix: "",
        },
        "listen": {
            name: "Listen to the CAN Channel",
            prefix: "L",
            digits: 0,
            replyPrefix: "",
        },
        "close": {
            name: "Close the CAN Channel",
            prefix: "C",
            digits: 0,
            replyPrefix: "",
        },
        "autopoll": {
            name: "Set the autopoll",
            prefix: "X",
            digits: 1,
            options: {
                "OFF": Buffer.from([0]),
                "ON": Buffer.from([1]),
            },
            replyPrefix: "",
        },
        "flags": {
            name: "Read out the flags",
            prefix: "F",
            digits: 0,
            replyPrefix: "F",
        },
    }
    /** The name of this command */
    public readonly name: string;
    /** The data we will put on the packet */
    public readonly data: Buffer;
    /** The data we will put on the packet */
    public readonly length: number;
    /** The command that we have */
    public readonly command: ICommand;
    /** Flag to show if this is a good command or not */
    public readonly bad: boolean;
    /** The string representation of this command */
    private readonly string: string;
    /** This is for bad commands */
    private readonly _bad: ICommand = {
        name: "bad",
        prefix: "",
        digits: 0,
        replyPrefix: "",
    }

    /**
     * Creates the object
     *
     * @param name The short name of the command
     * @param data The data to attach.  Not used if the command does not require data.
     */
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
        this.length = this.string.length;
        Object.freeze(this);
    }
    /**
     * Creates a string from this object
     *
     * @return The packet string
     */
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
    /**
     * Public function to get a string.
     *
     * @return The packet string
     */
    public toString(): string {
        return this.string;
    }
    /**
     * Checks to see if this reply is for me
     *
     * @param reply The reply to check
     */
    public isReply(reply: IReply): boolean {
        return this.command.replyPrefix === reply.prefix;
    }
}