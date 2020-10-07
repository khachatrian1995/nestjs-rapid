## Table of Contents

- [Table of Contents](#table-of-contents)
- [Description](#description)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
    - [Model exist validation](#model-exist-validation)
        - [Model exist validation using pipe](#model-exist-validation-using-pipe)
        - [Manual model exist validation](#manual-model-exist-validation)
- [License](#license)

## Description

Sequelize package for [@nestjs-rapid](../../README.md) library

## Features

- Quickly check if model exists using pipe or manually

## Installation

```bash
$ npm install @nestjs-rapid/core @nestjs-rapid/sequelize
```

## Usage

### Model exist validation

Library handles composite primary keys as well as simple ones

#### Model exist validation using pipe
```typescript
import { ModelExistPipe } from '@nestjs-rapid/sequelize';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UsePipes(new ModelExistPipe(User))   
  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }
}
```

#### Manual model exist validation
```typescript
import { ResourceNotFoundException } from '@nestjs-rapid/core';
import { ModelExistValidator } from '@nestjs-rapid/sequelize';

const userExistValidator = new ModelExistValidator<User>(User);
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

@nestjs-rapid/sequelize is [MIT licensed](LICENSE)
