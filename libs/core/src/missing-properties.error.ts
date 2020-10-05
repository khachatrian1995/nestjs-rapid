export class MissingPropertiesError extends Error {
  constructor(missingProperties: string[]) {
    super(`${JSON.stringify(missingProperties)} should not be null or undefined`);
  }
}
