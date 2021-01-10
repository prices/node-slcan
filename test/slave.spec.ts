
import * as assert from "assert";
import * as sinon from "sinon";
import * as slcan from "../src/slcan";
const SerialPort = require('@serialport/stream')
const MockBinding = require('@serialport/binding-mock')
SerialPort.Binding = MockBinding;
// Create a port and enable the echo and recording.
const portname = '/dev/s';
MockBinding.createPort(portname, { echo: true, record: true });
describe(`slave`, () => {
    let clock: any;
    beforeEach(() => {
        clock = sinon.useFakeTimers();
    });
    afterEach(() => {
        clock.restore();
    });
    describe("asdf", () => {

        const port = new SerialPort(portname);
        // const slave = slcan.slave(port);
        it("info.id is set properly", () => {
            const slave = slcan.slave(port);
            port.write('T\rasdf\r\u0007\rT1234\r');
            console.log(port.isOpen);
            assert.strictEqual(
                1,
                1,
            );
        });
    });
});

