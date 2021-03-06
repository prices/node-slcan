
import * as assert from "assert";
import * as sinon from "sinon";
import { Parser } from "../src/parser";
import { PassThrough } from "stream";

const replies = [ ..."zZA", "F01", "V1234", "N1234" ];
const commands = [ ..."FPCLOVN", "S0", "s0123", "X0", "W0", "Z0" ];
const datas = [ ..."rRtT" ];

describe(`parser`, () => {
    describe("constants", () => {
        it("uses a return (ascii 13) character as a delimiter", () => {
            assert.strictEqual(
                Parser.delimiter,
                '\u000D',
            );
        });
        it("uses a return (ascii 7) character as an error delimiter", () => {
            assert.strictEqual(
                Parser.errorDelimiter,
                '\u0007',
            );
        });
    });
    describe("building a standard packet", () => {
        const pass = new PassThrough();
        let reply: any;
        let command: string;
        let data: string;
        const parser = pass.pipe(new Parser());
        parser.on("data", (d) => { data = d; });
        parser.on("command", (c) => { command = c; });
        parser.on("reply", (r) => { reply = r; });
        beforeEach(() => {
            reply = undefined;
            command = "";
            data = "";
        });
        afterEach(() => {
        });
        describe("replies", () => {
            it("emit true when only 'return' character is received", () => {
                pass.write(Parser.delimiter);
                assert.strictEqual(
                    reply,
                    true,
                );
            });
            it("emit false when a 'bell' character is received", () => {
                pass.write(Parser.errorDelimiter);
                assert.strictEqual(
                    reply,
                    false,
                );
            });
            replies.forEach((c) => {
                it(`emit '${c}' when ${c} is received`, () => {
                    pass.write(c + Parser.delimiter);
                    assert.strictEqual(
                        reply,
                        c,
                    );
                });    
            });
            [ ...commands, ...datas ].forEach((c) => {
                it(`emit nothing when ${c} is received`, () => {
                    pass.write(c + Parser.delimiter);
                    assert.strictEqual(
                        reply,
                        undefined,
                    );
                });    
            });
        });
        describe("commands", () => {
            commands.forEach((c) => {
                it(`emit '${c}' when  ${c} is received`, () => {
                    pass.write(c + Parser.delimiter);
                    assert.strictEqual(
                        command,
                        c,
                    );
                });    
            });
            [ ...datas, ...replies ].forEach((c) => {
                it(`emit nothing when ${c} is received`, () => {
                    pass.write(c + Parser.delimiter);
                    assert.strictEqual(
                        command,
                        "",
                    );
                });    
            });
        });
        describe("data packets", () => {
            datas.forEach((c) => {
                it(`emit '${c}' when  ${c} is received`, () => {
                    pass.write(c + Parser.delimiter);
                    assert.strictEqual(
                        data.toString(),
                        c,
                    );
                });    
            });
            [ ...commands, ...replies ].forEach((c) => {
                it(`emit nothing when ${c} is received`, () => {
                    pass.write(c + Parser.delimiter);
                    assert.strictEqual(
                        data.toString(),
                        "",
                    );
                });    
            });
        });
    });
});

