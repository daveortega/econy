import { loadConfig } from '../../load-config'
import { Setting } from '../../types/setting';

describe("Masker module", () => {
    test("Given a present config file when loading the config then a resultant array of setting is received", () => {
        jest.resetAllMocks()
        const maskerConfig: Array<Setting> | string = loadConfig();
        expect(maskerConfig.length).toBeGreaterThan(1)
    });

  });