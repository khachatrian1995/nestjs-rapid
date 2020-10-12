import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';
import { getRepository } from 'typeorm';
import { EntityTarget } from 'typeorm/common/EntityTarget';
import { EntityExistValidator } from '../validators/entity-exist.validator';

export class EntityExistPipe<Entity> implements PipeTransform {
  constructor(private readonly entityTarget: EntityTarget<Entity>) {}

  async transform(value: any, argumentMetadata: ArgumentMetadata): Promise<any> {
    const paramtype = argumentMetadata.type;
    if (paramtype !== 'param' && paramtype !== 'body') {
      throw new Error(`unsupported ArgumentMetadata type ${paramtype}`);
    }
    const entityMetadata = getRepository(this.entityTarget).metadata;
    const entity =
      paramtype === 'param' ? { [entityMetadata.primaryColumns[0].propertyName]: value } : value;
    if (!(await new EntityExistValidator(this.entityTarget).exist(entity))) {
      throw new BadRequestException(`${entityMetadata.name} not found`);
    }
    return value;
  }
}
