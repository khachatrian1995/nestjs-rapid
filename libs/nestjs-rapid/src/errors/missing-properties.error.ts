export class MissingPropertiesError extends Error {
  constructor(readonly properties: string[]) {
    super(`${JSON.stringify(properties)} should not be null or undefined`);
  }
}
