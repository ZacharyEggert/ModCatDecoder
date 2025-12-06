import { beforeAll, beforeEach, describe, expect, test } from 'bun:test';

type IndexModule = typeof import('../src/index.mts');

const FIELD_KEYS = [
  'model',
  'topWood',
  'frets',
  'topSpec',
  'topGrade',
  'neckWood',
  'neckCarve',
  'fingerboard',
  'inlay',
  'bridge',
  'color',
  'hardware',
  'treblepu',
  'middlepu',
  'basspu',
  'elec',
] as const;

type FieldKey = (typeof FIELD_KEYS)[number];
type Fields = Record<FieldKey, string>;

const createEmptyFields = (): Fields => ({
  model: '',
  topWood: '',
  frets: '',
  topSpec: '',
  topGrade: '',
  neckWood: '',
  neckCarve: '',
  fingerboard: '',
  inlay: '',
  bridge: '',
  color: '',
  hardware: '',
  treblepu: '',
  middlepu: '',
  basspu: '',
  elec: '',
});

class MockDecoder {
  public lastInput: string | null = null;
  private fields: Fields = createEmptyFields();

  decode(modcat: string) {
    this.lastInput = modcat;
  }

  getFields() {
    return this.fields;
  }

  setFields(next: Partial<Fields>) {
    this.fields = { ...this.fields, ...next };
  }
}

let DOMControllerClass: IndexModule['DOMController'];
let mockDecoder: MockDecoder;
let elements: Record<string, any>;
let clickHandler: (() => void) | null;

const registerElement = (id: string, element: any) => {
  elements[id] = element;
  return element;
};

const setupDocumentStub = () => {
  const documentStub = {
    getElementById: (id: string) => elements[id] ?? null,
  };
  (globalThis as any).document = documentStub as Document;
};

beforeAll(async () => {
  const originalDocument = globalThis.document;
  (globalThis as any).document = undefined;
  ({ DOMController: DOMControllerClass } = await import('../src/index.mts'));
  (globalThis as any).document = originalDocument;
});

beforeEach(() => {
  elements = {};
  clickHandler = null;
  setupDocumentStub();

  registerElement('decodeButton', {
    addEventListener: (_event: string, handler: () => void) => {
      clickHandler = handler;
    },
  });

  registerElement('theMODCAT', { value: '' });

  FIELD_KEYS.forEach((key) => {
    registerElement(`${key}Field`, { innerHTML: '' });
  });

  mockDecoder = new MockDecoder();
  new DOMControllerClass(mockDecoder as any);
});

describe('DOMController', () => {
  test('wires up decode button click handler on construction', () => {
    expect(clickHandler).toBeTypeOf('function');
  });

  test('invokes decoder and updates DOM when decode button clicked', () => {
    const inputElement = elements['theMODCAT'];
    inputElement.value = '5MM2F-HVIB2_CC_NS-SK';

    mockDecoder.setFields({
      model: 'Decoded Model',
      color: 'Decoded Color',
      hardware: 'Decoded Hardware',
    });

    clickHandler?.();

    expect(mockDecoder.lastInput).toBe('5MM2F-HVIB2_CC_NS-SK');
    expect(elements['modelField'].innerHTML).toBe('Decoded Model');
    expect(elements['colorField'].innerHTML).toBe('Decoded Color');
    expect(elements['hardwareField'].innerHTML).toBe('Decoded Hardware');
  });

  test('handleDecode is a no-op when MODCAT input is missing', () => {
    elements['theMODCAT'] = null;

    clickHandler?.();

    expect(mockDecoder.lastInput).toBeNull();
  });
});
