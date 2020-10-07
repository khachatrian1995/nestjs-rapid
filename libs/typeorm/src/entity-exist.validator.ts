import { MissingPropertiesError } from '@nestjs-rapid/core';
import { FindConditions, getRepository } from 'typeorm';
import { EntityTarget } from 'typeorm/common/EntityTarget';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';
import { from } from 'rxjs';
import { map, reduce, switchMap } from 'rxjs/operators';

export class EntityExistValidator<Entity> {
  private readonly entityRepository;

  constructor(private readonly entityTarget: EntityTarget<Entity>) {
    this.entityRepository = getRepository(entityTarget);
  }

  exist(primary: Partial<Entity>): Promise<boolean> {
    const primaryColumns = this.entityRepository.metadata.primaryColumns;
    const missingProperties = primaryColumns
      .filter((column: ColumnMetadata) => {
        const propertyName = Object.keys(primary).find((propertyName: string) => {
          return propertyName === column.propertyName;
        });
        return !propertyName || !primary[propertyName];
      })
      .map((column: ColumnMetadata) => column.propertyName);
    if (missingProperties.length > 0) {
      throw new MissingPropertiesError(missingProperties);
    }
    return from(primaryColumns)
      .pipe(
        reduce((findConditions: FindConditions<Entity>, column: ColumnMetadata) => {
          findConditions[column.propertyName] = primary[column.propertyName];
          return findConditions;
        }, {} as FindConditions<Entity>),
        switchMap((findConditions: FindConditions<Entity>) => {
          return from(this.entityRepository.findOne(findConditions)).pipe(
            map((existingEntity: Entity) => !!existingEntity)
          );
        })
      )
      .toPromise();
  }
}
