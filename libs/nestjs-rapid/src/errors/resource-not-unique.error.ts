import { Resource } from '../interfaces';

export class ResourceNotUniqueError<T> extends Error {
  constructor(readonly resource: Resource<T>) {
    super(`${resource.name} ${JSON.stringify(resource.value)} already exist`);
  }
}
