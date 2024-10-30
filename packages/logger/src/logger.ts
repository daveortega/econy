import { LoadOptions } from './../../../node_modules/@types/js-yaml/index.d';
import pino, { DestinationStream, destination } from "pino";
import { mask } from "@ecny/masker";

export function logger(name: string, stream?: DestinationStream, level?: string): pino.Logger {
  const destinationStr: DestinationStream = stream ?? destination()

  const maskerString: DestinationStream = {
    write(msg) {
      const masked = mask(msg);
      destinationStr.write(JSON.stringify(masked) + "\n");
    },
  };

  const logLevel = level ?? "info";

  return pino(
    {
      name,
      level: logLevel,
      nestedKey: "app",
    },
    maskerString
  );
}
