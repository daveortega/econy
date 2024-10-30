import { logger } from "../../logger";
import * as pinoTest from "pino-test";

describe("Logger module", () => {
  test("Given a system warning when the logger is called then log is created", async () => {
    const stream = pinoTest.sink();
    const myLogger = logger("Testing log", stream);
    myLogger.warn("Im here");
    stream.once("data", (data) => {
      expect(data.msg).toEqual("Im here");
      expect(data.level).toEqual(40);
    });
  });

  test("Given a system error when the logger is created then log error is created and masked", async () => {
    const stream = pinoTest.sink();
    const myLogger = logger("Testing log", stream);
    myLogger.error({"firstName": "dave"});
    stream.once("data", (data) => {
      expect(data.app).toEqual({"firstName": "d**e"});
      expect(data.level).toEqual(50);
    });
  });

  test("Given a system error when the logger is created then log error is logged", async () => {
    const myLogger = logger("Testing log");
    myLogger.error({"firstName": "dave"});
  });

  test("Given a debug error and the level error not defined when the logger is created then log error is not logged", async () => {
    const stream = pinoTest.sink();
    const myLogger = logger("Testing log", stream);
    myLogger.debug({"firstName": "dave"});
    stream.once("data", (data) => {
      expect(data.app).toEqual('');
    });
  });

  test("Given a debug error and the level error is defined when the logger is created then log error is not logged", async () => {
    const stream = pinoTest.sink();
    const myLogger = logger("Testing log", stream, "debug");
    myLogger.debug({"firstName": "dave"});
    stream.once("data", (data) => {
      expect(data.app).toEqual({"firstName": "d**e"});
      expect(data.level).toEqual(20);
    });
  });

});
