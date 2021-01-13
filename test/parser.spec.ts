
import * as assert from "assert";
import * as sinon from "sinon";
import { Parser } from "../src/parser";
import { PassThrough } from "stream";

describe(`parser`, () => {
    describe("building a standard packet", () => {
        const pass = new PassThrough();
        let reply: any = undefined;
        let command: string = "";
        let data: string = "";
        const parser = pass.pipe(new Parser());
        parser.on("data", (d) => { data = d; });
        parser.on("command", (c) => { command = c; });
        parser.on("reply", (r) => { reply = r; });
        it("emits true on reply when a 'return' character is received", () => {
            pass.write("\r");
            assert.strictEqual(
                reply,
                true,
            );
        });
        it("emits false on reply when a 'bell' character is received", () => {
            pass.write("\u0007");
            assert.strictEqual(
                reply,
                false,
            );
        });
    });
});

