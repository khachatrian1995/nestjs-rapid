import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { getRepository } from 'typeorm';
import { IndexMetadata } from 'typeorm/metadata/IndexMetadata';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';
import { EntityTarget } from 'typeorm/common/EntityTarget';
import { EntityUniqueValidator } from '../validators/entity-unique.validator';
import { ExceptionsFactory } from '../exceptions';
import { ResourceNotUniqueError, UnsupportedArgumentMetadataTypeError } from '../errors';

export class EntityUniquePipe<Entity> implements PipeTransform {
  private readonly entityTarget: EntityTarget<Entity>;
  private readonly exceptionsFactory: ExceptionsFactory;

  constructor(entityTarget: EntityTarget<Entity>) {
    this.entityTarget = entityTarget;
    this.exceptionsFactory = new ExceptionsFactory();
  }

  async transform(value: any, argumentMetadata: ArgumentMetadata): Promise<any> {
    if (argumentMetadata.type !== 'body') {
      throw this.exceptionsFactory.create(
        new UnsupportedArgumentMetadataTypeError(argumentMetadata.type)
      );
    }
    try {
      const entityMetadata = getRepository(this.entityTarget).metadata;
      const entityUniqueValidator = new EntityUniqueValidator(this.entityTarget);
      if (!(await entityUniqueValidator.unique(value))) {
        const unique = entityMetadata.indices.map((index: IndexMetadata) => {
          return index.columns.reduce((unique: Partial<Entity>, column: ColumnMetadata) => {
            unique[column.propertyName] = value[column.propertyName];
            return unique;
          }, {} as Entity);
        });
        throw new ResourceNotUniqueError({ name: entityMetadata.name, value: unique });
      }
    } catch (error) {
      throw this.exceptionsFactory.create(error);
    }
    return value;
  }
}
