import { BadRequestException } from '@nestjs/common';
import { MissingPropertiesError } from '../errors';

export class MissingPropertiesException extends BadRequestException {
  constructor(missingPropertiesError: MissingPropertiesError) {
    const message = missingPropertiesError.properties.map((property: string) => {
      return `${property} should not be null or undefined`;
    });
    super(message);
  }
}
