import { parseBoxArgs } from "../../../utils/parseBoxArgs";

describe("parseBoxArgs", () => {
  it("should parse simple arguments", () => {
    const input = "add hello world";

    const result = parseBoxArgs(input);

    expect(result).toEqual(["add", "hello", "world"]);
  });

  it("should parse quoted arguments", () => {
    const input = 'add "hello world"';

    const result = parseBoxArgs(input);

    expect(result).toEqual(["add", "hello world"]);
  });

  it("should parse mixed quoted and normal arguments", () => {
    const input = 'add "hello world" test';

    const result = parseBoxArgs(input);

    expect(result).toEqual(["add", "hello world", "test"]);
  });

  it("should handle multiple quoted args", () => {
    const input = 'cmd "hello world" "another arg"';

    const result = parseBoxArgs(input);

    expect(result).toEqual(["cmd", "hello world", "another arg"]);
  });
});
