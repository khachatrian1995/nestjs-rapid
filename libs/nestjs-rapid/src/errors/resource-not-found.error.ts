import { Resource } from '../interfaces';

export class ResourceNotFoundError<T> extends Error {
  constructor(readonly resource: Resource<T>) {
    super(`${resource.name} ${JSON.stringify(resource.value)} not found`);
  }
}
