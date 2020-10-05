## Table of Contents

- [Table of Contents](#table-of-contents)
- [Description](#description)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
    - [Entity exist validation](#entity-exist-validation)
        - [Entity exist validation using pipe](#entity-exist-validation-using-pipe)
        - [Manual entity exist validation](#manual-entity-exist-validation)
- [License](#license)

## Description

TypeOrm package for [@nestjs-rapid](../../README.md) library

## Features

- Quickly check if entity exists using pipe or manually

## Installation

```bash
$ npm install @nestjs-rapid/core @nestjs-rapid/typeorm
```

## Usage

### Entity exist validation

Library handles composite primary keys as well as simple ones

#### Entity exist validation using pipe
```typescript
import { EntityExistPipe } from '@nestjs-rapid/typeorm';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UsePipes(new EntityExistPipe(User))   
  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }
}
```

#### Manual entity exist validation
```typescript
import { ResourceNotFoundException } from '@nestjs-rapid/core';
import { EntityExistValidator } from '@nestjs-rapid/typeorm';

const userExistValidator = new EntityExistValidator<User>(User);
try {
  const userExists = await userExistValidator.exist(user);
  if (userExists) {
    // user exists
  } else {
    // user not found
  }
} catch (error){
  if(error instanceof MissingPropertiesError){
    // user has some undefined primary properties
  }
}
```

## License

@nestjs-rapid/typeorm is [MIT licensed](LICENSE)
