import { InternalServerErrorException } from '@nestjs/common';
import { UnsupportedArgumentMetadataTypeError } from '../errors';

export class UnsupportedArgumentMetadataTypeException extends InternalServerErrorException {
  constructor(unsupportedArgumentMetadataTypeError: UnsupportedArgumentMetadataTypeError) {
    super(unsupportedArgumentMetadataTypeError.message);
  }
}
