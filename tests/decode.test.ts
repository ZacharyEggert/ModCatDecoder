import { beforeAll, beforeEach, describe, expect, test } from 'bun:test';

import { Decoder } from '../src/decode.mts';
import { FileContentObject } from '../src/helpers.mts';

const VALID_MODCAT = '5MM2F-HVIB2_CC_NS-SK';

let decoder: Decoder;

const createMockContent = () => {
  const content = new FileContentObject();
  content.model = { '5M': 'McCarty 594 Soapbar Limited' };
  content.topWood = { M: 'Maple' };
  content.frets = { '2': '22 Frets' };
  content.topSpec = { F: 'Figured' };
  content.topGrade = { _: 'Non-Ten Top' };
  content.neckWood = { H: 'Mahogany' };
  content.neckCarve = { V: 'Pattern Vintage' };
  content.fingerboard = { I: 'East Indian Rosewood' };
  content.inlay = { B: 'Original Solid Birds (pre-2008)' };
  content.bridge = { '2': '2-Piece Bridge' };
  content.color = { CC: 'Custom Color' };
  content.hardware = { N: 'Nickel' };
  content.treblepu = { S: 'Soapbar' };
  content.middlepu = { _: 'Middle Pickup' };
  content.basspu = { S: 'Soapbar' };
  content.elec = { K: 'McCarty 594' };
  return content;
};

beforeAll(async () => {
  (globalThis as any).fetch = ((_input: RequestInfo | URL) =>
    Promise.resolve({
      text: () => Promise.resolve('{}'),
    } as Response)) as typeof fetch;
});

beforeEach(() => {
  decoder = new Decoder();
  decoder.__setDecodedFileContent(createMockContent());
  decoder.__resetDecoderState();
});

describe('Decoder', () => {
  test('populates fields when provided a valid MODCAT', () => {
    decoder.decode(VALID_MODCAT);

    const fields = decoder.getFields();
    expect(fields.model).toBe('McCarty 594 Soapbar Limited');
    expect(fields.color).toBe('Custom Color');
    expect(fields.hardware).toBe('Nickel');
  });

  test('pads and reports missing data for malformed MODCAT input', () => {
    decoder.decode('bad code');

    const fields = decoder.getFields();
    expect(fields.model).toBe('Couldn\'t find Model for "BA"');
    expect(fields.color).toBe('Couldn\'t find Color for ""');
  });
});
