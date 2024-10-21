import pino, { DestinationStream, destination } from "pino";
import { mask } from "@ecny/masker";

export function logger(name: string, stream?: DestinationStream): pino.Logger {
  const destinationStr: DestinationStream = stream ?? destination()

  const maskerString: DestinationStream = {
    write(msg) {
      const masked = mask(msg);
      destinationStr.write(JSON.stringify(masked) + "\n");
    },
  };

  return pino(
    {
      name,
      nestedKey: "app",
    },
    maskerString
  );
}
