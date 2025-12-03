import { readFileSync } from "fs";
export function StripJSONComments(jsonString: string): string {
  return jsonString
    .split("\n")
    .map((line) => line.replace(/\/\/.*$/g, "")) // Remove single-line comments
    .join("\n")
    .replace(/\/\*[\s\S]*?\*\//g, "") // Remove multi-line comments
    .replace(/,\s*}/g, "}") // Remove trailing commas before closing braces
    .replace(/,\s*]/g, "]"); // Remove trailing commas before closing brackets
}

export class FileContentObject {
  public model: Record<string, string>;
  public topWood: Record<string, string>;
  public frets: Record<string, string>;
  public topSpec: Record<string, string>;
  public topGrade: Record<string, string>;
  public neckWood: Record<string, string>;
  public neckCarve: Record<string, string>;
  public fingerboard: Record<string, string>;
  public inlay: Record<string, string>;
  public bridge: Record<string, string>;
  public color: Record<string, string>;
  public hardware: Record<string, string>;
  public treblepu: Record<string, string>;
  public middlepu: Record<string, string>;
  public basspu: Record<string, string>;
  public elec: Record<string, string>;

  constructor() {
    this.model = {};
    this.topWood = {};
    this.frets = {};
    this.topSpec = {};
    this.topGrade = {};
    this.neckWood = {};
    this.neckCarve = {};
    this.fingerboard = {};
    this.inlay = {};
    this.bridge = {};
    this.color = {};
    this.hardware = {};
    this.treblepu = {};
    this.middlepu = {};
    this.basspu = {};
    this.elec = {};
  }

  static fromJSONCFolder(resourcePath: string): FileContentObject {
    const fileContentObject = new FileContentObject();

    Object.keys(fileContentObject).forEach((key) => {
      const filePath = `${resourcePath}${key}.jsonc`;
      const fileContent = readFileSync(filePath, "utf-8");

      const jsoncWithoutComments = StripJSONComments(fileContent);

      //parse the cleaned JSON content
      fileContentObject[key as keyof typeof fileContentObject] = JSON.parse(
        jsoncWithoutComments,
      ) as Record<string, string>;
    });

    return fileContentObject;
  }
}
