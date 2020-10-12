import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';
import { getRepository } from 'typeorm';
import { EntityTarget } from 'typeorm/common/EntityTarget';
import { EntityExistValidator } from '../validators/entity-exist.validator';

export class EntityUniquePipe<Entity> implements PipeTransform {
  constructor(private readonly entityTarget: EntityTarget<Entity>) {}

  async transform(value: any, argumentMetadata: ArgumentMetadata): Promise<any> {
    if (argumentMetadata.type !== 'body') {
      throw new Error(`unsupported ArgumentMetadata type ${argumentMetadata.type}`);
    }
    if (await new EntityExistValidator(this.entityTarget).exist(value)) {
      const entityMetadata = getRepository(this.entityTarget).metadata;
      throw new BadRequestException(`${entityMetadata.name} already exists`);
    }
    return value;
  }
}
