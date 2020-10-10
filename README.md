**nestjs-rapid** is a tiny library for [NestJS](https://github.com/nestjs/nest) which will take over the routine of validating your [TypeOrm](https://typeorm.io) entities

## Features

- Ensure entity record exists using `EntityExistPipe`
- Ensure entity is unique with `EntityUniquePipe`

## Getting Started

### Prerequisites

nestjs-rapid lives on top of the [NestJS](https://docs.nestjs.com) and requires [TypeOrm](https://docs.nestjs.com/techniques/database) to be set up

### Installing

```bash
$ npm install --save nestjs-rapid
```

## Usage

Use `EntityExistPipe` to ensure entity record exists. It searches for existing record by primary key and if it doesn't find one throws informative BadRequestException

Lets say we have user entity with single primary column

```typescript
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;
}
```

We can apply `EntityExistPipe` on the route parameter to make sure user exists

```typescript
import { EntityExistPipe } from 'nestjs-rapid';

// route parameter path name must repeat entity primary property name. In this case id
@UsePipes(new EntityExistPipe(User))
@Get(':id')
findOne(@Param('id') userId: string): Promise<User> {
  // user with id equal to userId exists
}
```

Primary key could also be composite

```typescript
@Entity()
export class UserDialog {
  @PrimaryColumn()
  userId: string;

  @PrimaryColumn()
  dialogId: string;
}
```

This kind of data can be sent to the server using query parameters or POST request body. We are able to validate them too in the same manner

```typescript
// query must contain userId and dialogId parameters
@UsePipes(new EntityExistPipe(UserDialog))
@Get()
findOne(@Query() query: Pick<UserDialog, userId | dialogId>): Promise<UserDialog> {
  // ...
}

// userDialog must contain userId and dialogId properties
@UsePipes(new EntityExistPipe(UserDialog))
@Post()
findOne(@Body() userDialog: Partial<UserDialog>): Promise<UserDialog> {
  // ...
}
```

`EntityExistPipe` throws informative BadRequestException for such cases

- Entity record not found
- There was missing or undefined primary columns
- Primary column which links to another table was not found

Use `EntityUniquePipe` to ensure entity is unique.
It works in conjunction with TypeOrm unique columns.
First it searches for existing record with the same unique columns
and if it finds one throws informative BadRequestException.

Lets add few unique columns to `User`

```typescript
@Entity()
@Unique(['firstName', 'lastName'])
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;
}
```

Then you can check if `User` is unique

```typescript
import { EntityUniquePipe } from 'nestjs-rapid';

// user must contain firstName and lastName properties
@UsePipes(new EntityUniquePipe(User))
@Post()
create(@Body() user: Partial<User>): Promise<User> {
  // ...
}
```

`EntityUniquePipe` throws informative BadRequestException for such cases

- Entity is not unique
- There was missing or undefined unique columns

## Running demo

```bash
# start mysql container
$ docker-compose -f apps/demo/docker-compose.yml up -d

# run application
$ nest start demo

# at last stop mysql container
$ docker-compose -f apps/demo/docker-compose.yml down
```

## License

nestjs-rapid is [MIT licensed](LICENSE)
