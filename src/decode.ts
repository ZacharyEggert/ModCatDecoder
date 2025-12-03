import { FileContentObject } from "./helpers";

const CODE_FILE_PATH = "../codes/";
const prs = FileContentObject.fromJSONCFolder(CODE_FILE_PATH);

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

type FieldKey = `${keyof typeof fields}Field`;

const addValueToDOM = (field: FieldKey, value: string) => {
  const element = document.getElementById(field);
  if (element) {
    element.innerHTML = value;
  }
};

const addFieldValuesToDOM = () => {
  addValueToDOM("modelField", fields.model);
  addValueToDOM("topWoodField", fields.topWood);
  addValueToDOM("fretsField", fields.frets);
  addValueToDOM("topSpecField", fields.topSpec);
  addValueToDOM("topGradeField", fields.topGrade);
  addValueToDOM("neckWoodField", fields.neckWood);
  addValueToDOM("neckCarveField", fields.neckCarve);
  addValueToDOM("fingerboardField", fields.fingerboard);
  addValueToDOM("inlayField", fields.inlay);
  addValueToDOM("bridgeField", fields.bridge);
  addValueToDOM("colorField", fields.color);
  addValueToDOM("hardwareField", fields.hardware);
  addValueToDOM("treblepuField", fields.treblepu);
  addValueToDOM("middlepuField", fields.middlepu);
  addValueToDOM("basspuField", fields.basspu);
  addValueToDOM("elecField", fields.elec);
};

const getCodesFromString = (str: string) => {
  str = format(str);

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
};

type PrefixKey = keyof typeof prs;
type CodeKey = keyof (typeof prs)[PrefixKey];
const getValue = (prefix: PrefixKey, code: CodeKey, label: string) =>
  prs[prefix] && code in prs[prefix]
    ? (prs[prefix][code] ?? `Couldn't find ${label} for ${code}`)
    : `Couldn't find ${label} for ${code}`;

//A bit clever but it makes the data obj more readable.
const getFieldValues = () => {
  fields.model = getValue("model", codes.modelCode, "Model");
  fields.topWood = getValue("topWood", codes.topWoodCode, "Top Wood");
  fields.frets = getValue("frets", codes.fretsCode, "Frets");
  fields.topSpec = getValue("topSpec", codes.topSpecCode, "Top Spec");
  fields.topGrade = getValue("topGrade", codes.topGradeCode, "Top Grade");
  fields.neckWood = getValue("neckWood", codes.neckWoodCode, "Neck Wood");
  fields.neckCarve = getValue("neckCarve", codes.neckCarveCode, "Neck Carve");
  fields.fingerboard = getValue(
    "fingerboard",
    codes.fingerboardCode,
    "Fingerboard Wood",
  );
  fields.inlay = getValue("inlay", codes.inlayCode, "Inlay");
  fields.bridge = getValue("bridge", codes.bridgeCode, "Bridge");
  fields.color = getValue("color", codes.colorCode, "Color");
  fields.hardware = getValue("hardware", codes.hardwareCode, "Hardware");
  fields.treblepu = getValue("treblepu", codes.treblepuCode, "Treble Pickup");
  fields.middlepu = getValue("middlepu", codes.middlepuCode, "Middle Pickup");
  fields.basspu = getValue("basspu", codes.basspuCode, "Bass Pickup");
  fields.elec = getValue("elec", codes.elecCode, "Electronics");
};
// removes whitespace & replaces - with _
const format = (text: string) =>
  text.replace(/\s+/g, "").replace(/-/g, "_").toUpperCase();

const decodeMODCAT = (input: string) => {
  getCodesFromString(input);
  getFieldValues();
  addFieldValuesToDOM();
};
