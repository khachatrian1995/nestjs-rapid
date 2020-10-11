import { Resource } from '../interfaces';

export class ManyResourcesNotFoundError extends Error {
  constructor(readonly resources: Resource<any>[]) {
    super();
    const message = resources.reduce((result: string, resource: Resource<any>) => {
      return result.concat(`${resource.name} ${JSON.stringify(resource.value)} not found\n`);
    }, '');
    super(message);
  }
}
