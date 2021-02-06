
import * as assert  from "assert";
import Slcan from "../src/slcan";
import { Data } from "../src/data";
import { Parser } from "../src/parser";
import SerialPort from "serialport";
const MockBinding = require('@serialport/binding-mock')

describe(`Slcan`, () => {
    const portname = '/dev/s';
    beforeEach(() => {
        MockBinding.createPort(portname, { echo: true, record: true });
        SerialPort.Binding = MockBinding;
    });
    afterEach(() => {
        MockBinding.reset();
    });
    describe(`sending data`, () => {
        const pkts = [
            { 
                name: "standard packet",
                pkt: {
                    id: 5,
                    data: Buffer.from('01020304050607', 'hex'),
                }
            },
            { 
                name: "extended packet",
                pkt: {
                    id: 0x14000000,
                    data: Buffer.from('0000000000000000', 'hex'),
                    ext: true,
                }
            },
        ];
        for (const p of pkts) {
            it(`sends a ${p.name}`, (done) => {
                const expect = (new Data(p.pkt)).toString() + Parser.delimiter;
                const port = new SerialPort(portname);
                const s = new Slcan(port, false);
                s.on('ready', () => {
                    // This sends out the data when the port is ready
                    s.open();
                });
                s.on('open', () => {
                    port.flush();
                    port.on('data', (data: Buffer) => {
                        try {
                            assert.strictEqual(
                                data.toString(),
                                expect,
                            );
                            done();
                        } catch(e) {
                            done();
                        }
                    });    
                    // This sends out the data when the port is ready
                    const ret = s.send(p.pkt);
                    try {
                        assert.strictEqual(
                            ret,
                            true,
                        );
                    } catch(e) {
                    }
                });
                port.write(Parser.delimiter);
            });
        }
        it("does not send a packet when the port is not open", (done) => {
            const pkt = {
                id: 5,
                data: Buffer.from('01020304050607', 'hex'),
            }
            const expect = (new Data(pkt)).toString() + Parser.delimiter;
            const port = new SerialPort(portname);
            const s = new Slcan(port, false);
            s.on('ready', () => {
                // This sends out the data when the port is ready
                const ret = s.send(pkt);
                try {
                    assert.strictEqual(
                        ret,
                        false,
                    );
                    done();
                } catch(e) {
                    done();
                }
            });
        });
        it("sends a standard data packet autoopen w/open called", (done) => {
            const pkt = {
                id: 5,
                data: Buffer.from('01020304050607', 'hex'),
            }
            const expect = (new Data(pkt)).toString() + Parser.delimiter;
            const port = new SerialPort(portname);
            const s = new Slcan(port, true);
            s.on('ready', () => {
                // This sends out the data when the port is ready
                s.open();
            });
            s.on('open', () => {
                port.flush();
                port.on('data', (data: Buffer) => {
                    try {
                        assert.strictEqual(
                            data.toString(),
                            expect,
                        );
                        done();
                    } catch(e) {
                        done();
                    }
                });    
                // This sends out the data when the port is ready
                const ret = s.send(pkt);
                try {
                    assert.strictEqual(
                        ret,
                        true,
                    );
                } catch(e) {
                }
            });
            port.write(Parser.delimiter);
        });
        it("sends a standard data packet with autoopen", (done) => {
            const pkt = {
                id: 5,
                data: Buffer.from('01020304050607', 'hex'),
            }
            const expect = (new Data(pkt)).toString() + Parser.delimiter;
            const port = new SerialPort(portname);
            const s = new Slcan(port);
            s.on('open', () => {
                port.flush();
                port.on('data', (data: Buffer) => {
                    try {
                        assert.strictEqual(
                            data.toString(),
                            expect,
                        );
                        done();
                    } catch(e) {
                        done();
                    }
                });    
                // This sends out the data when the port is ready
                const ret = s.send(pkt);
                try {
                    assert.strictEqual(
                        ret,
                        true,
                    );
                } catch(e) {
                }
            });
        });
    });
    describe(`sending open`, () => {
        it("deals with a good reply", (done) => {
            const port = new SerialPort(portname);
            const s = new Slcan(port, false);
            s.on('ready', () => {
                s.open().then((v) => {
                    try {
                        assert.strictEqual(
                            v,
                            true
                        );
                        done();
                    } catch(e) {
                        done();
                    }
                });
                port.flush();
                port.write(Parser.delimiter);
            });
        });
        it("deals with an error reply", (done) => {
            const port = new SerialPort(portname);
            const s = new Slcan(port, false);
            s.on('ready', () => {
                s.open().then((v) => {
                    try {
                        assert.strictEqual(
                            v,
                            false
                        );
                        done();
                    } catch(e) {
                        done();
                    }
                });
                port.flush();
                port.write(Parser.errorDelimiter);
            });
        });
        it("deals with a different reply first", (done) => {
            const port = new SerialPort(portname);
            const s = new Slcan(port, false);
            s.on('ready', () => {
                s.open().then((v) => {
                    try {
                        assert.strictEqual(
                            v,
                            true
                        );
                        done();
                    } catch(e) {
                        done();
                    }
                });
                port.flush();
                port.write("F12" + Parser.delimiter + Parser.delimiter);
            });
        });
        it("deals with no reply", (done) => {
            const port = new SerialPort(portname);
            const s = new Slcan(port, false);
            s.on('ready', () => {
                s.open().then((v) => {
                    try {
                        assert.strictEqual(
                            v,
                            false
                        );
                        done();
                    } catch(e) {
                        done();
                    }
                });
                port.flush();
            });
        });
    });
    describe(`sending close`, () => {
        it("deals with a good reply", (done) => {
            const port = new SerialPort(portname);
            const s = new Slcan(port, false);
            s.on('ready', () => {
                s.close().then((v) => {
                    try {
                        assert.strictEqual(
                            v,
                            true,
                        );
                        done();
                    } catch(e) {
                        done();
                    }
                });
                port.flush();
                port.write(Parser.delimiter);
            });
        });
        it("deals with an error reply", (done) => {
            const port = new SerialPort(portname);
            const s = new Slcan(port, false);
            s.on('ready', () => {
                s.close().then((v) => {
                    try {
                        assert.strictEqual(
                            v,
                            false
                        );
                        port.close();
                        done();
                    } catch(e) {
                        done();
                    }
                });
                port.flush();
                port.write(Parser.errorDelimiter);
            });
        });
        it("deals with a different reply first", (done) => {
            const port = new SerialPort(portname);
            const s = new Slcan(port, false);
            s.on('ready', () => {
                s.close().then((v) => {
                    try {
                        assert.strictEqual(
                            v,
                            true
                        );
                        port.close();
                        done();
                    } catch(e) {
                        done();
                    }
                });
                port.flush();
                port.write("F12" + Parser.delimiter + Parser.delimiter);
            });
        });
        it("deals with no reply", (done) => {
            const port = new SerialPort(portname);
            const s = new Slcan(port, false);
            s.on('ready', () => {
                s.close().then((v) => {
                    try {
                        assert.strictEqual(
                            v,
                            false
                        );
                        done();
                    } catch(e) {
                        done();
                    }
                });
                port.flush();
            });
        });
    });
    describe(`sending listen`, () => {
        it("deals with a good reply", (done) => {
            const port = new SerialPort(portname);
            const s = new Slcan(port,false);
            s.on('ready', () => {
                s.listen().then((v) => {
                    try {
                        assert.strictEqual(
                            v,
                            true
                        );
                        done();
                    } catch(e) {
                        done();
                    }
                });
                port.flush();
                port.write(Parser.delimiter);
            });
        });
        it("deals with an error reply", (done) => {
            const port = new SerialPort(portname);
            const s = new Slcan(port, false);
            s.on('ready', () => {
                s.listen().then((v) => {
                    try {
                        assert.strictEqual(
                            v,
                            false
                        );
                        done();
                    } catch(e) {
                        done();
                    }
                });
                port.flush();
                port.write(Parser.errorDelimiter);
            });
        });
        it("deals with a different reply first", (done) => {
            const port = new SerialPort(portname);
            const s = new Slcan(port, false);
            s.on('ready', () => {
                s.listen().then((v) => {
                    try {
                        assert.strictEqual(
                            v,
                            true
                        );
                        done();
                    } catch(e) {
                        done();
                    }
                });
                port.flush();
                port.write("F12" + Parser.delimiter + Parser.delimiter);
            });
        });
        it("deals with no reply", (done) => {
            const port = new SerialPort(portname);
            const s = new Slcan(port, false);
            s.on('ready', () => {
                s.listen().then((v) => {
                    try {
                        assert.strictEqual(
                            v,
                            false
                        );
                        done();
                    } catch(e) {
                        done();
                    }
                });
                port.flush();
            });
        });
    });
});

