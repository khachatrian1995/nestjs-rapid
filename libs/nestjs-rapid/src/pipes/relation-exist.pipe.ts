import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';
import { EntityTarget, getRepository } from 'typeorm';
import { EntityExistValidator } from '../validators/entity-exist.validator';

export class RelationExistPipe<Entity> implements PipeTransform {
  constructor(
    private readonly relationTarget: EntityTarget<any>,
    private readonly relation: (entity: Entity) => any
  ) {}
  async transform(value: any, argumentMetadata: ArgumentMetadata): Promise<any> {
    if (argumentMetadata.type !== 'body') {
      throw new Error(`unsupported ArgumentMetadata type ${argumentMetadata.type}`);
    }
    const relation = this.relation(value);
    if (!relation) {
      return value;
    }
    if (!(await new EntityExistValidator(this.relationTarget).exist(relation))) {
      throw new BadRequestException(
        `${getRepository(this.relationTarget).metadata.name} not found`
      );
    }
    return value;
  }
}
