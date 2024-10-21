import { loadConfig } from "./load-config";
import { Setting } from "./types/setting";

let maskerConfig: Array<Setting> | string;

export function mask(input: string | undefined): object {
  maskerConfig = loadConfig();

  if (Array.isArray(maskerConfig) && maskerConfig.length > 0) {
    return maskJson(input, new Map());
  }

  return { "MaskerError": "unknown_error" };
}

function maskJson(
  input: string | undefined,
  response: Map<
    string,
    string | number | boolean | object | Array<string | object>
  >
): object {
  if (input!) {
    const jsonInput = JSON.parse(input);
    for (const key in jsonInput) {
      const type = whatIsIt(jsonInput[key]);
      if (type == "array") {
        if (findObject(jsonInput[key])) {
          response.set(key, maskArrayOfObjects(jsonInput[key]));
        } else {
          response.set(key, maskArray(key, jsonInput[key]));
        }
      } else if (type == "object") {
        response.set(key, maskJson(JSON.stringify(jsonInput[key]), new Map()));
      } else if (type == "string" || type == "number" || type == "boolean") {
        response.set(key, maskStringOrNumberOrBoolean(key, jsonInput[key]));
      } else {
        throw Error("The attribute type is not supported.");
      }
    }
  }
  return Object.fromEntries(response);
}

function findObject(array: Array<string | number | object>): boolean {
  return array.some(element => typeof element === "object");
}

function getSettings(field: string): Setting {
  if (typeof maskerConfig !== "string") {
    for (const element of maskerConfig) {
      if (element.fields!.some((v) => v.toLowerCase() === field.toLowerCase())) {
        return element;
      }
    }
  }

  return {};
}

function maskArrayOfObjects(elements: Array<object>): Array<object> {
  const maskedArray: Array<object> = [];

  for (const element of elements){
    maskedArray.push(maskJson(JSON.stringify(element), new Map()));
  }

  return maskedArray;
}

function maskArray(
  key: string,
  elements: Array<string | number>
): Array<string | number | boolean> {
  const setting: Setting = getSettings(key);
  const maskedArray: Array<string | number | boolean> = [];

  if (Object.keys(setting).length > 0) {
    for (const element of elements) {
      maskedArray.push(maskStringOrNumberOrBoolean(key, element, setting));
    }
  } else {
    return elements;
  }

  return maskedArray;
}

function maskStringOrNumberOrBoolean(
  key: string,
  element: string | number | boolean,
  settingIn?: Setting
): string | number | boolean {
  const setting: Setting = settingIn ?? getSettings(key);
  if (Object.keys(setting).length > 0) {
    return masker(setting, element);
  } else {
    return element;
  }
}

function masker(setting: Setting, element: string | number | boolean): string {
  const maskCharacter: string = setting.masker ?? "*";
  let startCharacters: number = setting.startCharacters ?? 0;
  let endCharacters: number = setting.endCharacters ?? 0;
  let fullMask: boolean = setting.fullMask ?? false;

  // When majority of the values of the string are unmasked, the full string will be easy to guess
  if (
    element.toString().length - startCharacters - endCharacters <
    startCharacters + endCharacters
  ) {
    startCharacters = 1;
    endCharacters = 1;
  }

  if (element.toString().length <= 2){
    fullMask = true;
  }

  if (fullMask || typeof element == "boolean") {
    return maskCharacter.repeat(
      element.toString().length + randomInteger(2, 3)
    );
  } else {
    let masked = element.toString().substring(0, startCharacters);
    masked += maskCharacter.repeat(
      element.toString().length - endCharacters - startCharacters
    );
    masked += element
      .toString()
      .substring(
        element.toString().length - endCharacters,
        element.toString().length
      );
    return masked;
  }
}

function randomInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function whatIsIt(value: any): string {
  if (Array.isArray(value)) return "array";
  if (value === null) return "null";
  return typeof value;
}


