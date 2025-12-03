import { FileContentObject, StripJSONComments } from "../src/helpers.mts";
import { afterEach, describe, expect, test } from "bun:test";

describe("StripJSONComments", () => {
  test("removes comments and trailing commas", () => {
    const jsonWithComments = `{
			// model mapping
			"model": {
				"AB": "Alpha Beta", // inline comment
			},
			/* block comment */
			"values": [
				1,
				2,
			],
		}`;

    const cleaned = StripJSONComments(jsonWithComments);
    const parsed = JSON.parse(cleaned);

    expect(parsed).toEqual({
      model: { AB: "Alpha Beta" },
      values: [1, 2],
    });
  });
});

describe("FileContentObject", () => {
  const keys = Object.keys(new FileContentObject());
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  test("constructs empty dictionaries by default", () => {
    const content = new FileContentObject();
    keys.forEach((key) => {
      expect(content[key as keyof FileContentObject]).toEqual({});
    });
  });

  test("fromJSONCFolder fetches and parses JSONC files", async () => {
    const mockData: Record<string, string> = {
      model: `{
				// comment to strip
				"AB": "Alpha Beta",
			}`,
    };

    const fetchCalls: string[] = [];
    globalThis.fetch = ((input: RequestInfo | URL) => {
      const url = typeof input === "string" ? input : input.toString();
      fetchCalls.push(url);
      const key = url.split("/").pop()?.replace(".jsonc", "") ?? "";
      const body = mockData[key] ?? "{}";
      return Promise.resolve({
        text: () => Promise.resolve(body),
      } as Response);
    }) as typeof fetch;

    const result = FileContentObject.fromJSONCFolder("/codes/");

    // Allow all queued promise callbacks to run
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(fetchCalls).toHaveLength(keys.length);
    expect(result.model).toEqual({ AB: "Alpha Beta" });
  });
});
