import { MissingPropertiesError, ResourceNotFoundException } from '@nestjs-rapid/core';
import {
  ArgumentMetadata,
  BadRequestException,
  InternalServerErrorException,
  PipeTransform
} from '@nestjs/common';
import { getRepository } from 'typeorm';
import { EntityTarget } from 'typeorm/common/EntityTarget';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';
import { EntityExistValidator } from './entity-exist.validator';

export class EntityExistPipe<Entity> implements PipeTransform {
  constructor(private readonly entityTarget: EntityTarget<Entity>) {}

  async transform(value: any, argumentMetadata: ArgumentMetadata): Promise<any> {
    const entityMetadata = getRepository(this.entityTarget).metadata;
    const entityExistValidator = new EntityExistValidator<Entity>(this.entityTarget);
    const primary = this.resolvePrimary(value, argumentMetadata, entityMetadata.primaryColumns);
    let entityExist;
    try {
      entityExist = await entityExistValidator.exist(primary);
    } catch (error) {
      if (error instanceof MissingPropertiesError) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException(error);
    }
    if (!entityExist) {
      throw new ResourceNotFoundException(entityMetadata.name, primary);
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
        throw new InternalServerErrorException(
          `unsupported ArgumentMetadata type ${argumentMetadata.type}`
        );
    }
  }
}
