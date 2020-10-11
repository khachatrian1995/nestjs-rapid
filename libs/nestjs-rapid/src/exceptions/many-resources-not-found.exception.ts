import { BadRequestException } from '@nestjs/common';
import { ManyResourcesNotFoundError } from '../errors';
import { Resource } from '../interfaces';

export class ManyResourcesNotFoundException extends BadRequestException {
  constructor(resourceNotFoundError: ManyResourcesNotFoundError) {
    const messages = resourceNotFoundError.resources.map((resource: Resource<any>) => {
      return `${resource.name} ${JSON.stringify(resource.value)} not found`;
    });
    super(messages);
  }
}
