
import * as assert from "assert";
import * as sinon from "sinon";
import { Data, Packet } from "../src/data";

describe(`data`, () => {
    describe("building a standard packet", () => {
        const str = "t12380011223344556677";
        const pkt: Packet = {
            id: 0x123,
            ext: false,
            rtr: false,
            error: false,
            length: 8,
            data: Buffer.from("0011223344556677", "hex"),
        };
        const from = [
            [ "string", str ],
            [ "buffer", Buffer.from(str) ],
            [ "packet", pkt ],
        ];
        for (const type of from) {
            describe(`from ${type[0]}`, () => {
                const d = new Data(type[1]);
                it("sets the id properly", () => {
                    assert.strictEqual(
                        d.id,
                        pkt.id,
                    );
                });
                it("sets ext properly", () => {
                    assert.strictEqual(
                        d.ext,
                        pkt.ext,
                    );
                });
                it("sets rtr properly", () => {
                    assert.strictEqual(
                        d.rtr,
                        pkt.rtr,
                    );
                });
                it("sets error properly", () => {
                    assert.strictEqual(
                        d.error,
                        pkt.error,
                    );
                });
                it("sets the length properly", () => {
                    assert.strictEqual(
                        d.length,
                        pkt.length,
                    );
                });
                it("sets the data properly", () => {
                    assert.deepStrictEqual(
                        d.data,
                        pkt.data,
                    );
                });
                it("returns a string properly", () => {
                    assert.strictEqual(
                        d.toString(),
                        str,
                    );
                });
            });
        }
    });
    describe("building a extended packet", () => {
        const str = "T1234567880011223344556677";
        const pkt: Packet = {
            id: 0x12345678,
            ext: true,
            rtr: false,
            error: false,
            length: 8,
            data: Buffer.from("0011223344556677", "hex"),
        };
        const from = [
            [ "string", str ],
            [ "buffer", Buffer.from(str) ],
            [ "packet", pkt ],
        ];
        for (const type of from) {
            describe(`from ${type[0]}`, () => {
                const d = new Data(type[1]);
                it("sets the id properly", () => {
                    assert.strictEqual(
                        d.id,
                        pkt.id,
                    );
                });
                it("sets ext properly", () => {
                    assert.strictEqual(
                        d.ext,
                        pkt.ext,
                    );
                });
                it("sets rtr properly", () => {
                    assert.strictEqual(
                        d.rtr,
                        pkt.rtr,
                    );
                });
                it("sets error properly", () => {
                    assert.strictEqual(
                        d.error,
                        pkt.error,
                    );
                });
                it("sets the length properly", () => {
                    assert.strictEqual(
                        d.length,
                        pkt.length,
                    );
                });
                it("sets the data properly", () => {
                    assert.deepStrictEqual(
                        d.data,
                        pkt.data,
                    );
                });
                it("sets the timestamp properly", () => {
                    assert.strictEqual(
                        d.timestamp,
                        pkt.timestamp,
                    );
                });
                it("returns a string properly", () => {
                    assert.strictEqual(
                        d.toString(),
                        str,
                    );
                });
            });
        }
    });
    describe("building a standard packet with a timestamp", () => {
        const str = "t123800112233445566771234";
        const pkt: Packet = {
            id: 0x123,
            ext: false,
            rtr: false,
            error: false,
            length: 8,
            data: Buffer.from("0011223344556677", "hex"),
            timestamp: 0x1234,
        };
        const from = [
            [ "string", str ],
            [ "buffer", Buffer.from(str) ],
            [ "packet", pkt ],
        ];
        for (const type of from) {
            describe(`from ${type[0]}`, () => {
                const d = new Data(type[1]);
                it("sets the id properly", () => {
                    assert.strictEqual(
                        d.id,
                        pkt.id,
                    );
                });
                it("sets ext properly", () => {
                    assert.strictEqual(
                        d.ext,
                        pkt.ext,
                    );
                });
                it("sets rtr properly", () => {
                    assert.strictEqual(
                        d.rtr,
                        pkt.rtr,
                    );
                });
                it("sets error properly", () => {
                    assert.strictEqual(
                        d.error,
                        pkt.error,
                    );
                });
                it("sets the length properly", () => {
                    assert.strictEqual(
                        d.length,
                        pkt.length,
                    );
                });
                it("sets the data properly", () => {
                    assert.deepStrictEqual(
                        d.data,
                        pkt.data,
                    );
                });
                it("returns a string properly", () => {
                    assert.strictEqual(
                        d.toString(),
                        str,
                    );
                });
            });
        }
    });
    describe("building a standard RTR packet", () => {
        const str = "r1238";
        const pkt: Packet = {
            id: 0x123,
            ext: false,
            rtr: true,
            error: false,
            length: 8,
            data: Buffer.alloc(0),
        };
        const from = [
            [ "string", str ],
            [ "buffer", Buffer.from(str) ],
            [ "packet", pkt ],
        ];
        for (const type of from) {
            describe(`from ${type[0]}`, () => {
                const d = new Data(type[1]);
                it("sets the id properly", () => {
                    assert.strictEqual(
                        d.id,
                        pkt.id,
                    );
                });
                it("sets ext properly", () => {
                    assert.strictEqual(
                        d.ext,
                        pkt.ext,
                    );
                });
                it("sets rtr properly", () => {
                    assert.strictEqual(
                        d.rtr,
                        pkt.rtr,
                    );
                });
                it("sets error properly", () => {
                    assert.strictEqual(
                        d.error,
                        pkt.error,
                    );
                });
                it("sets the length properly", () => {
                    assert.strictEqual(
                        d.length,
                        pkt.length,
                    );
                });
                it("sets the data properly", () => {
                    assert.deepStrictEqual(
                        d.data,
                        pkt.data,
                    );
                });
                it("sets the timestamp properly", () => {
                    assert.strictEqual(
                        d.timestamp,
                        pkt.timestamp,
                    );
                });
                it("returns a string properly", () => {
                    assert.strictEqual(
                        d.toString(),
                        str,
                    );
                });
            });
        }
    });
    describe("building a standard RTR packet with timestamp", () => {
        const str = "r12381234";
        const pkt: Packet = {
            id: 0x123,
            ext: false,
            rtr: true,
            error: false,
            length: 8,
            data: Buffer.alloc(0),
            timestamp: 0x1234,
        };
        const from = [
            [ "string", str ],
            [ "buffer", Buffer.from(str) ],
            [ "packet", pkt ],
        ];
        for (const type of from) {
            describe(`from ${type[0]}`, () => {
                const d = new Data(type[1]);
                it("sets the id properly", () => {
                    assert.strictEqual(
                        d.id,
                        pkt.id,
                    );
                });
                it("sets ext properly", () => {
                    assert.strictEqual(
                        d.ext,
                        pkt.ext,
                    );
                });
                it("sets rtr properly", () => {
                    assert.strictEqual(
                        d.rtr,
                        pkt.rtr,
                    );
                });
                it("sets error properly", () => {
                    assert.strictEqual(
                        d.error,
                        pkt.error,
                    );
                });
                it("sets the length properly", () => {
                    assert.strictEqual(
                        d.length,
                        pkt.length,
                    );
                });
                it("sets the data properly", () => {
                    assert.deepStrictEqual(
                        d.data,
                        pkt.data,
                    );
                });
                it("sets the timestamp properly", () => {
                    assert.strictEqual(
                        d.timestamp,
                        pkt.timestamp,
                    );
                });
                it("returns a string properly", () => {
                    assert.strictEqual(
                        d.toString(),
                        str,
                    );
                });
            });
        }
    });
    describe("building a extended packet", () => {
        const str = "R123456788";
        const pkt: Packet = {
            id: 0x12345678,
            ext: true,
            rtr: true,
            error: false,
            length: 8,
            data: Buffer.alloc(0),
        };
        const from = [
            [ "string", str ],
            [ "buffer", Buffer.from(str) ],
            [ "packet", pkt ],
        ];
        for (const type of from) {
            describe(`from ${type[0]}`, () => {
                const d = new Data(type[1]);
                it("sets the id properly", () => {
                    assert.strictEqual(
                        d.id,
                        pkt.id,
                    );
                });
                it("sets ext properly", () => {
                    assert.strictEqual(
                        d.ext,
                        pkt.ext,
                    );
                });
                it("sets rtr properly", () => {
                    assert.strictEqual(
                        d.rtr,
                        pkt.rtr,
                    );
                });
                it("sets error properly", () => {
                    assert.strictEqual(
                        d.error,
                        pkt.error,
                    );
                });
                it("sets the length properly", () => {
                    assert.strictEqual(
                        d.length,
                        pkt.length,
                    );
                });
                it("sets the data properly", () => {
                    assert.deepStrictEqual(
                        d.data,
                        pkt.data,
                    );
                });
                it("sets the timestamp properly", () => {
                    assert.strictEqual(
                        d.timestamp,
                        pkt.timestamp,
                    );
                });
                it("returns a string properly", () => {
                    assert.strictEqual(
                        d.toString(),
                        str,
                    );
                });
            });
        }
    });


    describe("building a standard packet timestamp out of range", () => {
        const d = new Data(Buffer.from("t12380011223344556677FFFF"));
        it("sets error properly", () => {
            assert.strictEqual(
                d.error,
                false,
            );
        });
        it("has the correct size data", () => {
            assert.strictEqual(
                d.data.length,
                d.length,
            );
        });
        it("sets the timestamp properly", () => {
            assert.strictEqual(
                d.timestamp,
                undefined,
            );
        });
    });
    describe("building a standard packet too short", () => {
        const d = new Data(Buffer.from("t123800112233445566"));
        it("sets error properly", () => {
            assert.strictEqual(
                d.error,
                true,
            );
        });
        it("has the correct size data", () => {
            assert.strictEqual(
                d.data.length,
                d.length,
            );
        });
    });
    describe("building a standard packet too long", () => {
        const d = new Data(Buffer.from("t1238001122334455667788"));
        it("sets error properly", () => {
            assert.strictEqual(
                d.error,
                true,
            );
        });
        it("has the correct size data", () => {
            assert.strictEqual(
                d.data.length,
                d.length,
            );
        });
    });
    describe("building a extended packet too short", () => {
        const d = new Data(Buffer.from("T12345678800112233445566"));
        it("sets error properly", () => {
            assert.strictEqual(
                d.error,
                true,
            );
        });
        it("has the correct size data", () => {
            assert.strictEqual(
                d.data.length,
                d.length,
            );
        });
    });
    describe("building a extended packet too long", () => {
        const d = new Data(Buffer.from("T123456788001122334455667788"));
        it("sets error properly", () => {
            assert.strictEqual(
                d.error,
                true,
            );
        });
        it("has the correct size data", () => {
            assert.strictEqual(
                d.data.length,
                d.length,
            );
        });
    });
    describe("building a standard RTR packet too long", () => {
        const d = new Data(Buffer.from("r123811"));
        it("sets error properly", () => {
            assert.strictEqual(
                d.error,
                true,
            );
        });
        it("sets the data properly", () => {
            assert.deepStrictEqual(
                d.data,
                Buffer.alloc(0),
            );
        });
    });
    describe("building a standard RTR packet timestamp too big", () => {
        const d = new Data(Buffer.from("r1238FFFF"));
        it("sets error properly", () => {
            assert.strictEqual(
                d.error,
                false,
            );
        });
        it("sets the data properly", () => {
            assert.deepStrictEqual(
                d.data,
                Buffer.alloc(0),
            );
        });
        it("sets the timestamp properly", () => {
            assert.strictEqual(
                d.timestamp,
                undefined,
            );
        });
    });
    describe("building a extended packet too long", () => {
        const d = new Data(Buffer.from("R12345678811"));
        it("sets error properly", () => {
            assert.strictEqual(
                d.error,
                true,
            );
        });
        it("sets the data properly", () => {
            assert.deepStrictEqual(
                d.data,
                Buffer.alloc(0),
            );
        });
    });













});

