import { mask } from "../../mask-json";
import { faker } from "@faker-js/faker";

jest.mock("../../load-config", () => ({
  loadConfig: jest.fn().mockReturnValue([
    {
      fields: ["name", "refugee", "lastName", "age"],
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
  ]),
}));

describe("Masker module", () => {
  test("Given a string when calling the masker then the value should be return unmasked", () => {
    const jsonInput = faker.lorem.words(5);

    const result = mask(JSON.stringify(jsonInput));

    expect(result).toEqual(
      expect.objectContaining({
        data: expect.stringContaining(jsonInput),
      })
    );
  });

  test("Given an object with a key for which its value has few characters and the attribute is set to be masked when calling the masker then the value should be masked and only the the last and first characters are unmasked", () => {
    const jsonInput = {
      name: faker.string.alpha({ length: { min: 5, max: 5 } }),
    };

    const result = mask(JSON.stringify(jsonInput));

    expect(result).toEqual(
      expect.objectContaining({
        name: expect.stringContaining("***"),
      })
    );

    const regexExp = new RegExp(
      `[a-zA-Z]{1}[*]{${jsonInput.name.length - 1 - 1}}[a-zA-Z]{1}`
    );
    expect(result).toEqual(
      expect.objectContaining({
        name: expect.stringMatching(regexExp),
      })
    );
  });

  test("Given an object with a key for which its attribute is set to be masked when calling the masker then the value should be masked and only the the last and first characters are unmasked", () => {
    const jsonInput = {
      name: faker.string.alpha({ length: { min: 10, max: 10 } }),
    };

    const result = mask(JSON.stringify(jsonInput));
    const regexExp = new RegExp(
      `[a-zA-Z]{2}[*]{${jsonInput.name.length - 3 - 2}}[a-zA-Z]{3}`
    );

    expect(result).toEqual(
      expect.objectContaining({
        name: expect.stringMatching(regexExp),
      })
    );
  });

  test("Given an object with a key for which its value is not set to be masked when calling the masker then the value should be unmasked", () => {
    const jsonInput = {
      group: "Morning",
    };

    const result = mask(JSON.stringify(jsonInput));

    expect(result).toEqual(
      expect.objectContaining({
        group: expect.stringContaining(jsonInput.group),
      })
    );
  });

  test("Given an object with a key for which its value is boolean and is set to be masked when calling the masker then the value should masked", () => {
    const jsonInput = {
      refugee: faker.datatype.boolean(),
    };

    const result = mask(JSON.stringify(jsonInput));
    const regexExp = new RegExp(`[*]{6,8}`);

    expect(result).toEqual(
      expect.objectContaining({
        refugee: expect.stringMatching(regexExp),
      })
    );
  });

  test("Given an object with a key for which its value is set to be fully masked when calling the masker then the string should masked", () => {
    const jsonInput = {
      CVC: faker.number.int({ min: 1000, max: 99999 }),
    };

    const result = mask(JSON.stringify(jsonInput));
    const regexExp = new RegExp(`[*]{6,8}`);

    expect(result).toEqual(
      expect.objectContaining({
        CVC: expect.stringMatching(regexExp),
      })
    );
  });

  test("Given an object with multiple keys for which some values are set to be masked and some unmasked when calling the masker then the resultant object should have mask and unmasked value", () => {
    const jsonInput = {
      name: faker.string.alpha({ length: { min: 10, max: 10 } }),
      refugee: faker.datatype.boolean(),
      CVC: faker.number.int({ min: 1000, max: 99999 }),
      group: "Morning",
      email: faker.internet.email(),
    };

    const result = mask(JSON.stringify(jsonInput));
    const nameRegexExp = new RegExp(
      `[a-zA-Z]{2}[*]{${jsonInput.name.length - 3 - 2}}[a-zA-Z]{3}`
    );
    const refugeeRegexExp = new RegExp(`[*]{6,8}`);
    const CVCRegexExp = new RegExp(`[*]{6,8}`);
    const emailRegexExp = new RegExp(`[a-zA-Z]{3}[*]+[a-zA-Z]{2}`);

    expect(result).toEqual(
      expect.objectContaining({
        name: expect.stringMatching(nameRegexExp),
        refugee: expect.stringMatching(refugeeRegexExp),
        group: expect.stringContaining("Morning"),
        CVC: expect.stringMatching(CVCRegexExp),
        email: expect.stringMatching(emailRegexExp),
      })
    );
  });

  test("Given an object with a nested object with multiple keys for which some values are set to be masked and some unmasked when calling the masker then the resultant object should have mask and unmasked value", () => {
    const jsonInput = {
      name: faker.string.alpha({ length: { min: 10, max: 10 } }),
      deliveryAddress: {
        address: faker.location.streetAddress({ useFullAddress: true }),
        postCode: faker.location.zipCode(),
      },
    };

    const result = mask(JSON.stringify(jsonInput));
    const nameRegexExp = new RegExp(
      `[a-zA-Z]{2}[*]{${jsonInput.name.length - 3 - 2}}[a-zA-Z]{3}`
    );
    const addressRegexExp = new RegExp(
      `[a-zA-Z0-9\\s]{4}[-]+[a-zA-Z0-9\\s]{4}`
    );

    expect(result).toEqual(
      expect.objectContaining({
        name: expect.stringMatching(nameRegexExp),
        deliveryAddress: {
          address: expect.stringMatching(addressRegexExp),
          postCode: jsonInput.deliveryAddress.postCode,
        },
      })
    );
  });

  test("Given an object with a nested object within a nested object with multiple keys for which some values are set to be masked and some unmasked when calling the masker then the resultant object should have mask and unmasked value", () => {
    const jsonInput = {
      name: faker.string.alpha({ length: { min: 10, max: 10 } }),
      deliveryAddress: {
        address: faker.location.streetAddress({ useFullAddress: true }),
        postCode: faker.location.zipCode(),
        phone: faker.phone.number(),
        deliveryDetails: {
          refugee: faker.datatype.boolean(),
          notes: faker.lorem.sentence(5),
        },
      },
    };

    const result = mask(JSON.stringify(jsonInput));
    const nameRegexExp = new RegExp(
      `[a-zA-Z]{2}[*]{${jsonInput.name.length - 3 - 2}}[a-zA-Z]{3}`
    );
    const addressRegexExp = new RegExp(
      `[a-zA-Z0-9\\s]{4}[-]+[a-zA-Z0-9\\s]{4}`
    );
    const refugeeRegexExp = new RegExp(`[*]{6,8}`);
    const phoneRegexExp = new RegExp(`[*]+[0-9a-zA-Z]{4}`);

    expect(result).toEqual(
      expect.objectContaining({
        name: expect.stringMatching(nameRegexExp),
        deliveryAddress: {
          address: expect.stringMatching(addressRegexExp),
          postCode: jsonInput.deliveryAddress.postCode,
          phone: expect.stringMatching(phoneRegexExp),
          deliveryDetails: {
            refugee: expect.stringMatching(refugeeRegexExp),
            notes: jsonInput.deliveryAddress.deliveryDetails.notes,
          },
        },
      })
    );
  });

  test("Given an array for which some values are set to be masked when calling the masker then the resultant array should be masked", () => {
    const jsonInput = {
      creditCardnumbers: faker.helpers.multiple(
        faker.finance.creditCardNumber,
        { count: 3 }
      ),
    };

    const result = mask(JSON.stringify(jsonInput));
    const regexExp = new RegExp(`[*]+[0-9]{4}`);

    expect(result).toEqual(
      expect.objectContaining({
        creditCardnumbers: expect.arrayContaining([
          expect.stringMatching(regexExp),
        ]),
      })
    );
  });

  test("Given an array for which some values are not set to be masked when calling the masker then the resultant array should be unmasked", () => {
    const jsonInput = {
      hobbies: faker.helpers.arrayElement(["Soccer", "Music", "Dance"]),
    };

    const result = mask(JSON.stringify(jsonInput));

    expect(result).toEqual(jsonInput);
  });

  test("Given an object that contains an array of objected for which some values are  set to be masked when calling the masker then the resultant object and the array within should be masked", () => {
    const jsonInput = {
      name: faker.string.alpha({ length: { min: 10, max: 10 } }),
      addresses: [
        {
          address: faker.location.streetAddress(),
          postCode: faker.location.zipCode(),
        },
        {
          address: faker.location.streetAddress(true),
          postCode: faker.location.zipCode(),
        },
      ],
    };

    const result = mask(JSON.stringify(jsonInput));
    const nameRegexExp = new RegExp(
      `[a-zA-Z]{2}[*]{${jsonInput.name.length - 3 - 2}}[a-zA-Z]{3}`
    );
    const addressRegexExp = new RegExp(
      `[a-zA-Z0-9\\s]{4}[-]+[a-zA-Z0-9\\s]{4}`
    );
    const postCodeRegex = new RegExp(`[0-9]{4,}`);

    expect(result).toEqual(
      expect.objectContaining({
        name: expect.stringMatching(nameRegexExp),
        addresses: expect.arrayContaining([
          expect.objectContaining({
            address: expect.stringMatching(addressRegexExp),
            postCode: expect.stringMatching(postCodeRegex),
          }),
        ]),
      })
    );
  });

  test("Given a complex object that contains an strings, arrays and objects for which some values are set to be masked and some not when calling the masker then the resultant object should be as expected", () => {
    const jsonInput = {
      name: "John",
      lastName: "Doe",
      age: 40,
      active: true,
      contactDetails: {
        homePhone: "+1 1234567890",
        workPhone: "+1 9876543210",
      },
      hobbies: ["Soccer", "Footy", "Movies"],
      registeredCars: [
        {
          make: "Mazda",
          model: "CX-5",
        },
        {
          make: "Kia",
          model: "Cerato",
        },
      ],
    };

    const result = mask(JSON.stringify(jsonInput));

    expect(result).toEqual(
      expect.objectContaining({
        name: expect.stringContaining("J**n"),
        lastName: expect.stringContaining("D*e"),
        age: expect.stringMatching(/[*]{4,5}/),
        active: true,
        contactDetails: expect.objectContaining({
          homePhone: expect.stringContaining("*********7890"),
          workPhone: expect.stringContaining("+1 9876543210"),
        }),
        hobbies: [ 'Soccer', 'Footy', 'Movies' ],
        registeredCars: expect.arrayContaining([
          expect.objectContaining({
            make: expect.stringMatching(/[a-zA-Z]{3,5}/),
            model: expect.stringMatching(/[A-Z]{1}[-]+[o5]{1}/)
          })
        ])
      })
    )
  });

});
