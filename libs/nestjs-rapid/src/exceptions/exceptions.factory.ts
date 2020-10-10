import { HttpException, InternalServerErrorException } from '@nestjs/common';
import {
  ResourceNotFoundException,
  ManyResourcesNotFoundException,
  ResourceNotUniqueException,
  MissingPropertiesException,
  UnsupportedArgumentMetadataTypeException
} from '.';
import {
  ManyResourcesNotFoundError,
  ResourceNotUniqueError,
  MissingPropertiesError,
  UnsupportedArgumentMetadataTypeError,
  ResourceNotFoundError
} from '../errors';

export class ExceptionsFactory {
  create<T extends Error>(error: T): HttpException {
    if (error instanceof ResourceNotFoundError) {
      return new ResourceNotFoundException(error);
    } else if (error instanceof ManyResourcesNotFoundError) {
      return new ManyResourcesNotFoundException(error);
    } else if (error instanceof ResourceNotUniqueError) {
      return new ResourceNotUniqueException(error);
    } else if (error instanceof MissingPropertiesError) {
      return new MissingPropertiesException(error);
    } else if (error instanceof UnsupportedArgumentMetadataTypeError) {
      return new UnsupportedArgumentMetadataTypeException(error);
    }
    return new InternalServerErrorException(error);
  }
}
