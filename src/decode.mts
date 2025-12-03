import { FileContentObject } from "./helpers.mjs";

const JSONC_FOLDER_PATH = "/public/codes/";

const decodedFileContent = FileContentObject.fromJSONCFolder(JSONC_FOLDER_PATH);

const codes = {
  modelCode: "",
  topWoodCode: "",
  fretsCode: "",
  topSpecCode: "",
  topGradeCode: "",
  neckWoodCode: "",
  neckCarveCode: "",
  fingerboardCode: "",
  inlayCode: "",
  bridgeCode: "",
  colorCode: "",
  hardwareCode: "",
  treblepuCode: "",
  middlepuCode: "",
  basspuCode: "",
  elecCode: "",
};

const fields = {
  model: "",
  topWood: "",
  frets: "",
  topSpec: "",
  topGrade: "",
  neckWood: "",
  neckCarve: "",
  fingerboard: "",
  inlay: "",
  bridge: "",
  color: "",
  hardware: "",
  treblepu: "",
  middlepu: "",
  basspu: "",
  elec: "",
};

type FieldId = `${keyof typeof fields}Field`;

const setDOMFieldContent = (fieldId: FieldId, content: string) => {
  const element = document.getElementById(fieldId);
  if (element) {
    element.innerHTML = content;
  }
};

const populateDOMFields = (_fields: typeof fields = fields) => {
  setDOMFieldContent("modelField", _fields.model);
  setDOMFieldContent("topWoodField", _fields.topWood);
  setDOMFieldContent("fretsField", _fields.frets);
  setDOMFieldContent("topSpecField", _fields.topSpec);
  setDOMFieldContent("topGradeField", _fields.topGrade);
  setDOMFieldContent("neckWoodField", _fields.neckWood);
  setDOMFieldContent("neckCarveField", _fields.neckCarve);
  setDOMFieldContent("fingerboardField", _fields.fingerboard);
  setDOMFieldContent("inlayField", _fields.inlay);
  setDOMFieldContent("bridgeField", _fields.bridge);
  setDOMFieldContent("colorField", _fields.color);
  setDOMFieldContent("hardwareField", _fields.hardware);
  setDOMFieldContent("treblepuField", _fields.treblepu);
  setDOMFieldContent("middlepuField", _fields.middlepu);
  setDOMFieldContent("basspuField", _fields.basspu);
  setDOMFieldContent("elecField", _fields.elec);
};

const parseStringToCodes = (str: string) => {
  if (str.length < 20) {
    let numUnderscores = 20 - str.length;
    let underscores = "";
    for (let i = 0; i < numUnderscores; i++) {
      underscores += "_";
    }
    str = [str.slice(0, 11), underscores, str.slice(11)].join("");
    console.log("MODCAT reconstructed to " + str);
  }

  codes.modelCode = str.substring(0, 2);
  codes.topWoodCode = str.substring(2, 3);
  codes.fretsCode = str.substring(3, 4);
  codes.topSpecCode = str.substring(4, 5);
  codes.topGradeCode = str.substring(5, 6);
  codes.neckWoodCode = str.substring(6, 7);
  codes.neckCarveCode = str.substring(7, 8);
  codes.fingerboardCode = str.substring(8, 9);
  codes.inlayCode = str.substring(9, 10);
  codes.bridgeCode = str.substring(10, 11);
  if (codes.colorCode != "____") {
    codes.colorCode = str.substring(11, 15).replace(/_/g, "");
  }
  codes.hardwareCode = str.substring(15, 16);
  codes.treblepuCode = str.substring(16, 17);
  codes.middlepuCode = str.substring(17, 18);
  codes.basspuCode = str.substring(18, 19);
  codes.elecCode = str.substring(19, 20);
  return codes;
};

type FCOKey = keyof typeof decodedFileContent;
type CodeKey = keyof (typeof decodedFileContent)[FCOKey];
const getValue = (category: FCOKey, lookupKey: CodeKey, label: string) =>
  decodedFileContent[category] && lookupKey in decodedFileContent[category]
    ? (decodedFileContent[category][lookupKey] ??
      `Couldn't find ${label} for ${lookupKey}`)
    : `Couldn't find ${label} for ${lookupKey}`;

//A bit clever but it makes the data obj more readable.
const parseCodesToDetails = (_codes: typeof codes = codes) => {
  fields.model = getValue("model", _codes.modelCode, "Model");
  fields.topWood = getValue("topWood", _codes.topWoodCode, "Top Wood");
  fields.frets = getValue("frets", _codes.fretsCode, "Frets");
  fields.topSpec = getValue("topSpec", _codes.topSpecCode, "Top Spec");
  fields.topGrade = getValue("topGrade", _codes.topGradeCode, "Top Grade");
  fields.neckWood = getValue("neckWood", _codes.neckWoodCode, "Neck Wood");
  fields.neckCarve = getValue("neckCarve", _codes.neckCarveCode, "Neck Carve");
  fields.fingerboard = getValue(
    "fingerboard",
    _codes.fingerboardCode,
    "Fingerboard Wood",
  );
  fields.inlay = getValue("inlay", _codes.inlayCode, "Inlay");
  fields.bridge = getValue("bridge", _codes.bridgeCode, "Bridge");
  fields.color = getValue("color", _codes.colorCode, "Color");
  fields.hardware = getValue("hardware", _codes.hardwareCode, "Hardware");
  fields.treblepu = getValue("treblepu", _codes.treblepuCode, "Treble Pickup");
  fields.middlepu = getValue("middlepu", _codes.middlepuCode, "Middle Pickup");
  fields.basspu = getValue("basspu", _codes.basspuCode, "Bass Pickup");
  fields.elec = getValue("elec", _codes.elecCode, "Electronics");
  return fields;
};

// removes whitespace & replaces - with _
const sanitizeString = (text: string) =>
  text.replace(/\s+/g, "").replace(/-/g, "_").toUpperCase();

const decodeMODCAT = (input: string) => {
  const sanitizedInput = sanitizeString(input);
  const parsedCodes = parseStringToCodes(sanitizedInput);
  const parsedFields = parseCodesToDetails(parsedCodes);
  populateDOMFields(parsedFields);
};

document.getElementById("decodeButton")?.addEventListener("click", () => {
  const inputElement = document.getElementById("theMODCAT") as HTMLInputElement;
  if (!inputElement) return;
  decodeMODCAT(inputElement.value);
});
