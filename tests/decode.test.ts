import { beforeAll, beforeEach, describe, expect, test } from 'bun:test';

import { FileContentObject } from '../src/helpers.mts';

type DecodeModule = typeof import('../src/decode.mts');

const VALID_MODCAT = '5MM2F-HVIB2_CC_NS-SK'; //TODO should be 5MM2F-HVIB2_CC_NS-SK - convert later

const domElements: Record<
  string,
  { innerHTML: string; addEventListener: () => void }
> = {};

const getOrCreateElement = (id: string) => {
  if (!domElements[id]) {
    domElements[id] = {
      innerHTML: '',
      addEventListener: () => undefined,
    };
  }
  return domElements[id];
};

let decodeModule: DecodeModule;

const createMockContent = () => {
  const content = new FileContentObject();
  content.model = { '5M': 'McCarty 594 Soapbar Limited' };
  content.topWood = { M: 'Maple' };
  content.frets = { '2': '22 Frets' };
  content.topSpec = { F: 'Figured' };
  content.topGrade = { '-': 'Non-Ten Top' };
  content.neckWood = { H: 'Mahogany' };
  content.neckCarve = { V: 'Pattern Vintage' };
  content.fingerboard = { I: 'East Indian Rosewood' };
  content.inlay = { B: 'Original Solid Birds (pre-2008)' };
  content.bridge = { '2': '2-Piece Bridge' };
  content.color = { CC: 'Custom Color' };
  content.hardware = { N: 'Nickel' };
  content.treblepu = { S: 'Soapbar' };
  content.middlepu = { '-': 'Middle Pickup' };
  content.basspu = { S: 'Soapbar' };
  content.elec = { K: 'McCarty 594' };
  return content;
};

beforeAll(async () => {
  (globalThis as any).document = {
    getElementById: (id: string) => getOrCreateElement(id),
  } as unknown as Document;

  (globalThis as any).fetch = ((_input: RequestInfo | URL) =>
    Promise.resolve({
      text: () => Promise.resolve('{}'),
    } as Response)) as typeof fetch;

  decodeModule = await import('../src/decode.mts');
});

beforeEach(() => {
  Object.values(domElements).forEach((element) => {
    element.innerHTML = '';
  });
  decodeModule.__resetDecoderState();
  decodeModule.__setDecodedFileContent(createMockContent());
});

describe('decodeMODCAT', () => {
  test('populates DOM fields when provided a valid MODCAT', () => {
    decodeModule.decodeMODCAT(VALID_MODCAT);

    expect(domElements.modelField.innerHTML).toBe(
      'McCarty 594 Soapbar Limited',
    );
    expect(domElements.colorField.innerHTML).toBe('Custom Color');
    expect(domElements.hardwareField.innerHTML).toBe('Nickel');
  });

  test('pads and reports missing data for malformed MODCAT input', () => {
    decodeModule.decodeMODCAT('bad code');

    expect(domElements.modelField.innerHTML).toBe("Couldn't find Model for BA");
    expect(domElements.colorField.innerHTML).toBe("Couldn't find Color for ");
  });
});

//TODO : Verify the AI generated tests
