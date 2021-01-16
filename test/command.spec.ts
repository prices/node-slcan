
import * as assert from "assert";
import { Command } from "../src/command";

describe(`command`, () => {
    describe(`a bad command with data`, () => {
        const d = new Command("badcommand", Buffer.from([1]));
        it("is marked", () => {
            assert.strictEqual(
                d.bad,
                true,
            );
        });
        it("has no string", () => {
            assert.strictEqual(
                d.toString(),
                "",
            );
        });
    });
    describe(`a bad command without data`, () => {
        const d = new Command("badcommand");
        it("is marked", () => {
            assert.strictEqual(
                d.bad,
                true,
            );
        });
        it("has no string", () => {
            assert.strictEqual(
                d.toString(),
                "",
            );
        });
    });
    describe(`a good command with data that should have it`, () => {
        const d = new Command("autopoll");
        it("is marked", () => {
            assert.strictEqual(
                d.bad,
                true,
            );
        });
        it("has no string", () => {
            assert.strictEqual(
                d.toString(),
                "",
            );
        });
    });
    describe(`create an open command`, () => {
        const d = new Command("open");
        it("is marked good", () => {
            assert.strictEqual(
                d.bad,
                false,
            );
        });
        it("has the correct string", () => {
            assert.strictEqual(
                d.toString(),
                "O",
            );
        });
    });
    describe(`create an close command`, () => {
        const d = new Command("close");
        it("is marked good", () => {
            assert.strictEqual(
                d.bad,
                false,
            );
        });
        it("has the correct string", () => {
            assert.strictEqual(
                d.toString(),
                "C",
            );
        });
    });
    describe(`create an listen command`, () => {
        const d = new Command("listen");
        it("is marked good", () => {
            assert.strictEqual(
                d.bad,
                false,
            );
        });
        it("has the correct string", () => {
            assert.strictEqual(
                d.toString(),
                "L",
            );
        });
    });
    describe(`will set the baud rate`, () => {
        const options = [
            "10K",
            "20K",
            "50K",
            "100K",
            "125K",
            "250K",
            "500K",
            "800K",
            "1M",
        ];
        for (const i in options) {
            if (i in options) {
                describe(`to ${options[i]}`, () => {
                    const d = new Command("CANBitRate", options[i]);
                    it("is marked good", () => {
                        assert.strictEqual(
                            d.bad,
                            false,
                        );
                    });
                    it("creates a string", () => {
                        assert.strictEqual(
                            d.toString(),
                            "S" + i,
                        );
                    });
                });
            }
        }
    });
    describe(`will set autopoll`, () => {
        const rates = [
            "OFF",
            "ON",
        ];
        for (const i in rates) {
            if (i in rates) {
                describe(`to ${rates[i]}`, () => {
                    const d = new Command("autopoll", rates[i]);
                    it("is marked good", () => {
                        assert.strictEqual(
                            d.bad,
                            false,
                        );
                    });
                    it("creates a string", () => {
                        assert.strictEqual(
                            d.toString(),
                            "X" + i,
                        );
                    });
                });
            }
        }
    });
    describe(`will set autopoll from buffers`, () => {
        const rates = [
            Buffer.from([0]),
            Buffer.from([1]),
        ];
        for (const i in rates) {
            if (i in rates) {
                describe(`to Buffer.from([${rates[i].toString('hex').slice(-1)}])`, () => {
                    const d = new Command("autopoll", rates[i]);
                    it("is marked good", () => {
                        assert.strictEqual(
                            d.bad,
                            false,
                        );
                    });
                    it("creates a string", () => {
                        assert.strictEqual(
                            d.toString(),
                            "X" + i,
                        );
                    });
                });
            }
        }
    });
    describe(`will set autopoll from strings`, () => {
        const rates = [
            "0",
            "1",
        ];
        for (const i in rates) {
            if (i in rates) {
                describe(`to ${rates[i].toString()}`, () => {
                    const d = new Command("autopoll", rates[i]);
                    it("is marked good", () => {
                        assert.strictEqual(
                            d.bad,
                            false,
                        );
                    });
                    it("creates a string", () => {
                        assert.strictEqual(
                            d.toString(),
                            "X" + i,
                        );
                    });
                });
            }
        }
    });
});

