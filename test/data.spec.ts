
import * as assert from "assert";
import * as sinon from "sinon";
import { Data } from "../src/data";

describe(`data`, () => {
    describe("building a standard packet", () => {
        const d = new Data(Buffer.from("t12380011223344556677"));
        it("sets the id properly", () => {
            assert.strictEqual(
                d.id,
                0x123,
            );
        });
        it("sets ext properly", () => {
            assert.strictEqual(
                d.ext,
                false,
            );
        });
        it("sets rtr properly", () => {
            assert.strictEqual(
                d.rtr,
                false,
            );
        });
        it("sets error properly", () => {
            assert.strictEqual(
                d.error,
                false,
            );
        });
        it("sets the length properly", () => {
            assert.strictEqual(
                d.length,
                8,
            );
        });
        it("sets the data properly", () => {
            assert.deepEqual(
                d.data,
                Buffer.from("0011223344556677", "hex"),
            );
        });
    });
    describe("building a extended packet", () => {
        const d = new Data(Buffer.from("T1234567880011223344556677"));
        it("sets the id properly", () => {
            assert.strictEqual(
                d.id,
                0x12345678,
            );
        });
        it("sets ext properly", () => {
            assert.strictEqual(
                d.ext,
                true,
            );
        });
        it("sets rtr properly", () => {
            assert.strictEqual(
                d.rtr,
                false,
            );
        });
        it("sets error properly", () => {
            assert.strictEqual(
                d.error,
                false,
            );
        });
        it("sets the length properly", () => {
            assert.strictEqual(
                d.length,
                8,
            );
        });
        it("sets the data properly", () => {
            assert.deepEqual(
                d.data,
                Buffer.from("0011223344556677", "hex"),
            );
        });
    });
    describe("building a standard RTR packet", () => {
        const d = new Data(Buffer.from("r1238"));
        it("sets the id properly", () => {
            assert.strictEqual(
                d.id,
                0x123,
            );
        });
        it("sets ext properly", () => {
            assert.strictEqual(
                d.ext,
                false,
            );
        });
        it("sets rtr properly", () => {
            assert.strictEqual(
                d.rtr,
                true,
            );
        });
        it("sets error properly", () => {
            assert.strictEqual(
                d.error,
                false,
            );
        });
        it("sets the length properly", () => {
            assert.strictEqual(
                d.length,
                8,
            );
        });
        it("sets the data properly", () => {
            assert.deepEqual(
                d.data,
                Buffer.alloc(0),
            );
        });
    });
    describe("building a extended packet", () => {
        const d = new Data(Buffer.from("R123456788"));
        it("sets the id properly", () => {
            assert.strictEqual(
                d.id,
                0x12345678,
            );
        });
        it("sets ext properly", () => {
            assert.strictEqual(
                d.ext,
                true,
            );
        });
        it("sets rtr properly", () => {
            assert.strictEqual(
                d.rtr,
                true,
            );
        });
        it("sets error properly", () => {
            assert.strictEqual(
                d.error,
                false,
            );
        });
        it("sets the length properly", () => {
            assert.strictEqual(
                d.length,
                8,
            );
        });
        it("sets the data properly", () => {
            assert.deepEqual(
                d.data,
                Buffer.alloc(0),
            );
        });
    });
});

