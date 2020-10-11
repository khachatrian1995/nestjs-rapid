import { DeepPartial, FindConditions, getRepository, Repository } from 'typeorm';
import { EntityTarget } from 'typeorm/common/EntityTarget';
import {
  MissingPropertiesError,
  ResourceNotFoundError,
  ManyResourcesNotFoundError
} from '../errors';
import { Resource } from '../interfaces';

export class EntityExistValidator<Entity> {
  private readonly entityRepository: Repository<Entity>;

  constructor(entityTarget: EntityTarget<Entity>) {
    this.entityRepository = getRepository(entityTarget);
  }

  async exist(primary: DeepPartial<Entity>): Promise<boolean> {
    const findConditions: FindConditions<Entity> = {};
    const missingProperties: string[] = [];
    const absentResources: Resource<any>[] = [];
    for (const column of this.entityRepository.metadata.primaryColumns) {
      const propertyName = Object.keys(primary).find((propertyName: string) => {
        return propertyName === column.propertyName;
      });
      if (!propertyName || !primary[propertyName]) {
        missingProperties.push(column.propertyName);
        continue;
      }
      const relationMetadata = column.relationMetadata;
      if (relationMetadata) {
        const relationExist = await new EntityExistValidator(relationMetadata.type).exist(
          primary[propertyName]
        );
        if (!relationExist) {
          const relationType = relationMetadata.type;
          const relationName = typeof relationType === 'string' ? relationType : relationType.name;
          absentResources.push({ name: relationName, value: primary[propertyName] });
          continue;
        }
      }
      findConditions[propertyName] = primary[propertyName];
    }
    if (missingProperties.length > 0) {
      throw new MissingPropertiesError(missingProperties);
    }
    if (absentResources.length == 1) {
      throw new ResourceNotFoundError(absentResources[0]);
    }
    if (absentResources.length > 1) {
      throw new ManyResourcesNotFoundError(absentResources);
    }
    return !!(await this.entityRepository.findOne(findConditions));
  }
}
