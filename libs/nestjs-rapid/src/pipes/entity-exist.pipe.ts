import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { getRepository } from 'typeorm';
import { EntityTarget } from 'typeorm/common/EntityTarget';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';
import { EntityExistValidator } from '../validators/entity-exist.validator';
import { ExceptionsFactory } from '../exceptions';
import { ResourceNotFoundError, UnsupportedArgumentMetadataTypeError } from '../errors';

export class EntityExistPipe<Entity> implements PipeTransform {
  private readonly entityTarget: EntityTarget<Entity>;
  private readonly exceptionsFactory: ExceptionsFactory;

  constructor(entityTarget: EntityTarget<Entity>) {
    this.entityTarget = entityTarget;
    this.exceptionsFactory = new ExceptionsFactory();
  }

  async transform(value: any, argumentMetadata: ArgumentMetadata): Promise<any> {
    const entityMetadata = getRepository(this.entityTarget).metadata;
    const entityExistValidator = new EntityExistValidator<Entity>(this.entityTarget);
    const primary = this.resolvePrimary(value, argumentMetadata, entityMetadata.primaryColumns);
    try {
      if (!(await entityExistValidator.exist(primary))) {
        throw new ResourceNotFoundError({ name: entityMetadata.name, value: primary });
      }
    } catch (error) {
      throw this.exceptionsFactory.create(error);
    }
    return value;
  }

  resolvePrimary(
    value: any,
    argumentMetadata: ArgumentMetadata,
    primaryColumns: ColumnMetadata[]
  ): Entity {
    switch (argumentMetadata.type) {
      case 'param':
        return { [primaryColumns[0].propertyName]: value } as Entity;
      case 'query':
        return primaryColumns.reduce((primary: Entity, column: ColumnMetadata) => {
          primary[column.propertyName] = value[column.propertyName];
          return primary;
        }, {} as Entity) as Entity;
      case 'body':
        return value as Entity;
      default:
        throw this.exceptionsFactory.create(
          new UnsupportedArgumentMetadataTypeError(argumentMetadata.type)
        );
    }
  }
}
