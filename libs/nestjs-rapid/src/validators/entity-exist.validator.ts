import { DeepPartial, EntityMetadata, FindConditions, getRepository, Repository } from 'typeorm';
import { EntityTarget } from 'typeorm/common/EntityTarget';
import { IndexMetadata } from 'typeorm/metadata/IndexMetadata';

export class EntityExistValidator<Entity> {
  private readonly entityRepository: Repository<Entity>;
  private readonly entityMetadata: EntityMetadata;

  constructor(entityTarget: EntityTarget<Entity>) {
    this.entityRepository = getRepository(entityTarget);
    this.entityMetadata = this.entityRepository.metadata;
  }

  async exist(entity: DeepPartial<Entity>): Promise<boolean> {
    if (
      this.entityMetadata.hasAllPrimaryKeys(entity) &&
      (await this.findOneByPrimaryKeys(entity))
    ) {
      return true;
    } else if (await this.findOneByUniqueKeys(entity)) {
      return true;
    }
    return false;
  }

  async findOneByPrimaryKeys(entity: DeepPartial<Entity>): Promise<Entity | undefined> {
    const findConditions: FindConditions<Entity> = {};
    for (const column of this.entityMetadata.primaryColumns) {
      const propertyName = Object.keys(entity).find((propertyName: string) => {
        return propertyName === column.propertyName;
      });
      if (!propertyName || !entity[propertyName]) {
        return undefined;
      }
      const relationMetadata = column.relationMetadata;
      if (relationMetadata) {
        const entityExistValidator = new EntityExistValidator(relationMetadata.type);
        if (!(await entityExistValidator.exist(entity[propertyName]))) {
          return undefined;
        }
      }
      findConditions[propertyName] = entity[propertyName];
    }
    return this.entityRepository.findOne(findConditions);
  }

  findOneByUniqueKeys(entity: DeepPartial<Entity>): Promise<Entity | undefined> {
    const uniqueIndices: IndexMetadata[] = this.entityMetadata.indices.filter(
      (index: IndexMetadata) => index.isUnique
    );
    for (const uniqueIndex of uniqueIndices) {
      const findConditions: FindConditions<Entity> = {};
      for (const column of uniqueIndex.columns) {
        const propertyName = Object.keys(entity).find((key: string) => {
          return key === column.propertyName;
        });
        if (!propertyName || !entity[propertyName]) {
          break;
        }
        findConditions[propertyName] = entity[propertyName];
      }
      if (Object.keys(findConditions).length !== uniqueIndex.columns.length) {
        continue;
      }
      return this.entityRepository.findOne(findConditions);
    }
    return undefined;
  }
}
