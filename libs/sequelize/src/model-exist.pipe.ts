import { MissingPropertiesError, ResourceNotFoundException } from '@nestjs-rapid/core';
import {
  ArgumentMetadata,
  BadRequestException,
  InternalServerErrorException,
  PipeTransform
} from '@nestjs/common';
import { Model as SequelizeModel, ModelCtor } from 'sequelize-typescript';
import { ModelExistValidator } from './model-exist.validator';

export class ModelExistPipe<Model extends SequelizeModel> implements PipeTransform {
  constructor(private readonly modelCtor: ModelCtor<Model>) {}

  async transform(value: any, argumentMetadata: ArgumentMetadata): Promise<any> {
    const modelExistValidator = new ModelExistValidator(this.modelCtor);
    const primary = this.resolvePrimary(
      value,
      argumentMetadata,
      this.modelCtor.primaryKeyAttributes
    );
    let modelExist;
    try {
      modelExist = await modelExistValidator.exist(primary);
    } catch (error) {
      if (error instanceof MissingPropertiesError) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException();
    }
    if (!modelExist) {
      throw new ResourceNotFoundException(this.modelCtor.name, primary);
    }
    return value;
  }

  resolvePrimary(
    value: any,
    argumentMetadata: ArgumentMetadata,
    primaryKeyAttributes: string[]
  ): Model {
    switch (argumentMetadata.type) {
      case 'param':
        return { [primaryKeyAttributes[0]]: value } as Model;
      case 'query':
        return primaryKeyAttributes.reduce((primary: Model, attribute: string) => {
          primary[attribute] = value[attribute];
          return primary;
        }, {} as Model) as Model;
      case 'body':
        return value as Model;
      default:
        throw new InternalServerErrorException(
          `unsupported ArgumentMetadata type ${argumentMetadata.type}`
        );
    }
  }
}
