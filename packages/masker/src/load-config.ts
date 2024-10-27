import { Setting } from "./types/setting";

const config: Array<Setting> = [
  {
    fields: ["firstName", "refugee", "lastName", "age", "name"],
    masker: "*",
    endCharacters: 3,
    startCharacters: 2,
  },
  {
    fields: ["email"],
    masker: "*",
    endCharacters: 2,
    startCharacters: 3,
  },
  {
    fields: ["CVC"],
    masker: "*",
    fullMask: true,
  },
  {
    fields: ["address", "address1", "address2", "model"],
    masker: "-",
    endCharacters: 4,
    startCharacters: 4,
  },
  {
    fields: ["phone", "phoneNumber", "creditCardNumbers", "homePhone"],
    masker: "*",
    endCharacters: 4,
  },
];

export function loadConfig(): Setting[] {
  return config;
}
