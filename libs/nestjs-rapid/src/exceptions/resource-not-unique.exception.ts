import { BadRequestException } from '@nestjs/common';
import { ResourceNotUniqueError } from '../errors';

export class ResourceNotUniqueException<T> extends BadRequestException {
  constructor(resourceNotUniqueError: ResourceNotUniqueError<T>) {
    super(resourceNotUniqueError.message);
  }
}
