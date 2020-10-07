import { BadRequestException } from '@nestjs/common';

export class ResourceNotFoundException<Resource> extends BadRequestException {
  constructor(resourceName: string, partial: Partial<Resource>) {
    super(`${resourceName} ${JSON.stringify(partial)} not found`);
  }
}
