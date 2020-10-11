import { Paramtype } from '@nestjs/common';

export class UnsupportedArgumentMetadataTypeError extends Error {
  constructor(readonly paramtype: Paramtype) {
    super(`unsupported ArgumentMetadata type ${paramtype}`);
  }
}
