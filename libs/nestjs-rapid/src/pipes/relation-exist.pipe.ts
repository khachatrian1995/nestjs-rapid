import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { EntityTarget, getRepository } from 'typeorm';
import { RelationMetadata } from 'typeorm/metadata/RelationMetadata';
import { EntityExistValidator } from '../validators/entity-exist.validator';
import { ExceptionsFactory } from '../exceptions';
import { ResourceNotFoundError, UnsupportedArgumentMetadataTypeError } from '../errors';

export class RelationExistPipe<Entity> implements PipeTransform {
  private readonly entityTarget: EntityTarget<Entity>;
  private readonly entityPropertyName: string;
  private readonly exceptionsFactory: ExceptionsFactory;

  constructor(entityTarget: EntityTarget<Entity>, entityPropertyName: string) {
    this.entityTarget = entityTarget;
    this.entityPropertyName = entityPropertyName;
    this.exceptionsFactory = new ExceptionsFactory();
  }

  async transform(value: any, argumentMetadata: ArgumentMetadata): Promise<any> {
    if (argumentMetadata.type !== 'body') {
      throw this.exceptionsFactory.create(
        new UnsupportedArgumentMetadataTypeError(argumentMetadata.type)
      );
    }
    const entityMetadata = getRepository(this.entityTarget).metadata;
    const relationMetadata = entityMetadata.relations.find((relationMetadata: RelationMetadata) => {
      return relationMetadata.propertyName === this.entityPropertyName;
    });
    if (!relationMetadata) {
      throw new Error(`${this.entityPropertyName} is not a relation of ${entityMetadata.name}`);
    }
    const propertyName = Object.keys(value).find((valuePropertyName: string) => {
      return valuePropertyName === this.entityPropertyName;
    });
    if (!propertyName || !value[propertyName]) {
      throw new Error(`${this.entityPropertyName} should not be null or undefined`);
    }
    const entityExistValidator = new EntityExistValidator(relationMetadata.type);
    try {
      if (!(await entityExistValidator.exist(value[propertyName]))) {
        const relationType = relationMetadata.type;
        const relationName = typeof relationType === 'string' ? relationType : relationType.name;
        throw new ResourceNotFoundError({
          name: relationName,
          value: value[propertyName]
        });
      }
    } catch (error) {
      throw this.exceptionsFactory.create(error);
    }
    return value;
  }
}
