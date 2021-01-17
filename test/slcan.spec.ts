
import * as assert from "assert";
import Slcan from "../src/slcan";
import { Data } from "../src/data";
import { Parser } from "../src/parser";
import SerialPort from "serialport";
const MockBinding = require('@serialport/binding-mock')

describe(`Slcan`, () => {
    const portname = '/dev/s';
    before(() => {
        MockBinding.createPort(portname, { echo: true, record: true });
        SerialPort.Binding = MockBinding;
    });
    after(() => {
        MockBinding.reset();
    });
    
    it("sends data properly", (done) => {
        const pkt = {
            id: 5,
            data: Buffer.from('01020304050607', 'hex'),
        }
        const expect = (new Data(pkt)).toString() + Parser.delimiter;
        const port = new SerialPort(portname);
        const s = new Slcan(port);
        port.on('error', done)
        s.on('open', () => {
            // This sends out the data when the port is ready
            s.send(pkt);
        });
        port.on('data', (data: Buffer) => {
            try {
                assert.strictEqual(
                    data.toString(),
                    expect,
                );
                port.close(done);
            } catch(e) {
                done(e);
            }
        })
    });
});

