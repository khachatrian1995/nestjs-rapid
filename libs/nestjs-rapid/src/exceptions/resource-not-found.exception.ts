import { BadRequestException } from '@nestjs/common';
import { ResourceNotFoundError } from '../errors';

export class ResourceNotFoundException<T> extends BadRequestException {
  constructor(resourceNotFoundError: ResourceNotFoundError<T>) {
    super(resourceNotFoundError.message);
  }
}
