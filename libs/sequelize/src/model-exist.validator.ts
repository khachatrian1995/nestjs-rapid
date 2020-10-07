import { MissingPropertiesError } from '@nestjs-rapid/core';
import { WhereOptions } from 'sequelize';
import { Model as SequelizeModel, ModelCtor } from 'sequelize-typescript';
import { from } from 'rxjs';
import { map, reduce, switchMap } from 'rxjs/operators';

export class ModelExistValidator<Model extends SequelizeModel> {
  constructor(private readonly modelCtor: ModelCtor<Model>) {}

  exist(primary: Partial<Model>): Promise<boolean> {
    const primaryKeyAttributes = this.modelCtor.primaryKeyAttributes;
    const missingProperties = primaryKeyAttributes.filter((attribute: string) => {
      const propertyName = Object.keys(primary).find((propertyName: string) => {
        return propertyName === attribute;
      });
      return !propertyName || !primary[propertyName];
    });
    if (missingProperties.length > 0) {
      throw new MissingPropertiesError(missingProperties);
    }
    return from(primaryKeyAttributes)
      .pipe(
        reduce((whereOptions: WhereOptions, primaryAttribute: string) => {
          whereOptions[primaryAttribute] = primary[primaryAttribute];
          return whereOptions;
        }, {} as WhereOptions),
        switchMap((whereOptions: WhereOptions) => {
          return from(this.modelCtor.findOne({ where: whereOptions })).pipe(
            map((existingModel: Model) => !!existingModel)
          );
        })
      )
      .toPromise();
  }
}
