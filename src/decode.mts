import { FileContentObject } from './helpers.mjs';

// Use a relative path so GitHub Pages project sites resolve correctly
const DEFAULT_JSONC_FOLDER_PATH = './public/codes/';

const FieldKeys = [
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
type Fields = Record<(typeof FieldKeys)[number], string>;
type FCOKey = keyof FileContentObject;
type CodeKey = keyof FileContentObject[FCOKey];

export interface DecoderOptions {
  resourcePath?: string;
}
export class Decoder {
  public resourcePath: string;
  private decodedFileContent: FileContentObject = new FileContentObject();
  private codes: Fields = {
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
  };
  private fields: Fields = {
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
  };

  constructor(options: DecoderOptions = {}) {
    // No initialization needed for now
    this.resourcePath = options.resourcePath || DEFAULT_JSONC_FOLDER_PATH;
    this.loadResources();
  }

  public async loadResources() {
    this.decodedFileContent = FileContentObject.fromJSONCFolder(
      this.resourcePath,
    );
  }

  public __setDecodedFileContent(content: FileContentObject) {
    this.decodedFileContent = content;
  }

  public decode(modcat: string) {
    this.processMODCAT(modcat);
    this.parseCodesToDetails();
  }

  public processMODCAT(modcat: string) {
    this.parseStringToCodes(this.sanitizeString(modcat));
  }

  public sanitizeString(input: string) {
    return input.replace(/\s+/g, '').replace(/-/g, '_').toUpperCase();
  }

  public parseStringToCodes(str: string) {
    if (str.length < 20) {
      let numUnderscores = 20 - str.length;
      let underscores = '';
      for (let i = 0; i < numUnderscores; i++) {
        underscores += '_';
      }
      str = [str.slice(0, 11), underscores, str.slice(11)].join('');
      console.log('MODCAT reconstructed to ' + str);
    }

    this.codes.model = str.substring(0, 2);
    this.codes.topWood = str.substring(2, 3);
    this.codes.frets = str.substring(3, 4);
    this.codes.topSpec = str.substring(4, 5);
    this.codes.topGrade = str.substring(5, 6);
    this.codes.neckWood = str.substring(6, 7);
    this.codes.neckCarve = str.substring(7, 8);
    this.codes.fingerboard = str.substring(8, 9);
    this.codes.inlay = str.substring(9, 10);
    this.codes.bridge = str.substring(10, 11);
    if (this.codes.color !== '____') {
      this.codes.color = str.substring(11, 15).replace(/_/g, '');
    }
    this.codes.hardware = str.substring(15, 16);
    this.codes.treblepu = str.substring(16, 17);
    this.codes.middlepu = str.substring(17, 18);
    this.codes.basspu = str.substring(18, 19);
    this.codes.elec = str.substring(19, 20);
  }

  public getValueFromCode = (
    category: FCOKey,
    lookupKey: CodeKey,
    label?: string,
  ) =>
    this.decodedFileContent[category] &&
    lookupKey in this.decodedFileContent[category]
      ? (this.decodedFileContent[category][lookupKey] ??
        `Couldn't find ${label ?? category} for "${lookupKey}"`)
      : `Couldn't find ${label ?? category} for "${lookupKey}"`;

  public parseCodesToDetails = (
    codesObject: typeof this.codes = this.codes,
  ) => {
    this.fields.model = this.getValueFromCode(
      'model',
      codesObject.model,
      'Model',
    );
    this.fields.topWood = this.getValueFromCode(
      'topWood',
      codesObject.topWood,
      'Top Wood',
    );
    this.fields.frets = this.getValueFromCode(
      'frets',
      codesObject.frets,
      'Frets',
    );
    this.fields.topSpec = this.getValueFromCode(
      'topSpec',
      codesObject.topSpec,
      'Top Spec',
    );
    this.fields.topGrade = this.getValueFromCode(
      'topGrade',
      codesObject.topGrade,
      'Top Grade',
    );
    this.fields.neckWood = this.getValueFromCode(
      'neckWood',
      codesObject.neckWood,
      'Neck Wood',
    );
    this.fields.neckCarve = this.getValueFromCode(
      'neckCarve',
      codesObject.neckCarve,
      'Neck Carve',
    );
    this.fields.fingerboard = this.getValueFromCode(
      'fingerboard',
      codesObject.fingerboard,
      'Fingerboard Wood',
    );
    this.fields.inlay = this.getValueFromCode(
      'inlay',
      codesObject.inlay,
      'Inlay',
    );
    this.fields.bridge = this.getValueFromCode(
      'bridge',
      codesObject.bridge,
      'Bridge',
    );
    this.fields.color = this.getValueFromCode(
      'color',
      codesObject.color,
      'Color',
    );
    this.fields.hardware = this.getValueFromCode(
      'hardware',
      codesObject.hardware,
      'Hardware',
    );
    this.fields.treblepu = this.getValueFromCode(
      'treblepu',
      codesObject.treblepu,
      'Treble Pickup',
    );
    this.fields.middlepu = this.getValueFromCode(
      'middlepu',
      codesObject.middlepu,
      'Middle Pickup',
    );
    this.fields.basspu = this.getValueFromCode(
      'basspu',
      codesObject.basspu,
      'Bass Pickup',
    );
    this.fields.elec = this.getValueFromCode(
      'elec',
      codesObject.elec,
      'Electronics',
    );
  };

  public getFields() {
    return this.fields;
  }

  public __resetDecoderState() {
    FieldKeys.forEach((key) => {
      this.codes[key] = '';
      this.fields[key] = '';
    });
  }
}
