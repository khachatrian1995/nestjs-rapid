import { DeepPartial, FindConditions, getRepository, Repository } from 'typeorm';
import { EntityTarget } from 'typeorm/common/EntityTarget';
import { IndexMetadata } from 'typeorm/metadata/IndexMetadata';
import { MissingPropertiesError } from '../errors';

export class EntityUniqueValidator<Entity> {
  private readonly entityRepository: Repository<Entity>;

  constructor(entityTarget: EntityTarget<Entity>) {
    this.entityRepository = getRepository(entityTarget);
  }

  async unique(unique: DeepPartial<Entity>): Promise<boolean> {
    const uniqueIndices: IndexMetadata[] = this.entityRepository.metadata.indices.filter(
      (index: IndexMetadata) => index.isUnique
    );
    const missingProperties: string[] = [];
    for (const uniqueIndex of uniqueIndices) {
      const findConditions: FindConditions<Entity> = {};
      for (const column of uniqueIndex.columns) {
        const propertyName = Object.keys(unique).find((key: string) => {
          return key === column.propertyName;
        });
        if (!propertyName || !unique[propertyName]) {
          missingProperties.push(column.propertyName);
          continue;
        }
        findConditions[propertyName] = unique[propertyName];
      }
      if (missingProperties.length < 1) {
        if (await this.entityRepository.findOne(findConditions)) {
          return false;
        }
      }
    }
    if (missingProperties.length > 0) {
      throw new MissingPropertiesError(missingProperties);
    }
    return true;
  }
}
