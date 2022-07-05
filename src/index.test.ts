import * as ReactMonolith from ".";

describe("@ethicdevs/react-monolith public API", () => {
  it(`should exports a "makeAppServer" method to make the app server`, () => {
    expect(ReactMonolith.makeAppServer).toBeDefined();
    expect(ReactMonolith.makeAppServer).toBeInstanceOf<Function>(Function);
  });
  it(`should exports a "startAppServer" method to make the app server`, () => {
    expect(ReactMonolith.startAppServer).toBeDefined();
    expect(ReactMonolith.startAppServer).toBeInstanceOf<Function>(Function);
  });
  it(`should exports a "stopAppServerAndExit" method to make the app server`, () => {
    expect(ReactMonolith.stopAppServerAndExit).toBeDefined();
    expect(ReactMonolith.stopAppServerAndExit).toBeInstanceOf<Function>(
      Function,
    );
  });
});
