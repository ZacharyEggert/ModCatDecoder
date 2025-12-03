import { beforeAll, beforeEach, describe, expect, test } from "bun:test";

import { FileContentObject } from "../src/helpers.mts";

type DecodeModule = typeof import("../src/decode.mts");

const VALID_MODCAT = "5MMM2FHVIB2HVIBCNSKE";

const domElements: Record<
  string,
  { innerHTML: string; addEventListener: () => void }
> = {};

const getOrCreateElement = (id: string) => {
  if (!domElements[id]) {
    domElements[id] = {
      innerHTML: "",
      addEventListener: () => undefined,
    };
  }
  return domElements[id];
};

let decodeModule: DecodeModule;

const createMockContent = () => {
  const content = new FileContentObject();
  content.model = { "5M": "Custom 24" };
  content.topWood = { M: "Maple" };
  content.frets = { M: "24 Frets" };
  content.topSpec = { "2": "10-Top" };
  content.topGrade = { F: "Flame" };
  content.neckWood = { H: "Mahogany" };
  content.neckCarve = { V: "Pattern Thin" };
  content.fingerboard = { I: "Rosewood" };
  content.inlay = { B: "Birds" };
  content.bridge = { "2": "Tremolo" };
  content.color = { HVIB: "Vintage Burst" };
  content.hardware = { C: "Chrome" };
  content.treblepu = { N: "Treble Pickup" };
  content.middlepu = { S: "Middle Pickup" };
  content.basspu = { K: "Bass Pickup" };
  content.elec = { E: "Standard Electronics" };
  return content;
};

beforeAll(async () => {
  (globalThis as any).document = {
    getElementById: (id: string) => getOrCreateElement(id),
  } as unknown as Document;

  (globalThis as any).fetch = ((_input: RequestInfo | URL) =>
    Promise.resolve({
      text: () => Promise.resolve("{}"),
    } as Response)) as typeof fetch;

  decodeModule = await import("../src/decode.mts");
});

beforeEach(() => {
  Object.values(domElements).forEach((element) => {
    element.innerHTML = "";
  });
  decodeModule.__resetDecoderState();
  decodeModule.__setDecodedFileContent(createMockContent());
});

describe("decodeMODCAT", () => {
  test("populates DOM fields when provided a valid MODCAT", () => {
    decodeModule.decodeMODCAT(VALID_MODCAT);

    expect(domElements.modelField.innerHTML).toBe("Custom 24");
    expect(domElements.colorField.innerHTML).toBe("Vintage Burst");
    expect(domElements.hardwareField.innerHTML).toBe("Chrome");
  });

  test("pads and reports missing data for malformed MODCAT input", () => {
    decodeModule.decodeMODCAT("bad code");

    expect(domElements.modelField.innerHTML).toBe("Couldn't find Model for BA");
    expect(domElements.colorField.innerHTML).toBe("Couldn't find Color for ");
  });
});

//TODO : Verify the AI generated tests
