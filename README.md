**nestjs-rapid** is a tiny library made to speed up your development using [NestJS](https://github.com/nestjs/nest) framework

## Features

- Validate [TypeOrm](https://typeorm.io) entities using `EntityExistPipe`, `EntityUniquePipe` and `RelationExistPipe`

## Getting Started

### Prerequisites

[NestJS](https://docs.nestjs.com) and [TypeOrm](https://docs.nestjs.com/techniques/database) are required

### Installing

```bash
$ npm install --save nestjs-rapid
```

## Usage

`EntityExistPipe` ensures entity record exists, otherwise throws `BadRequestException`

Consider `Customer` entity with a single primary column

```typescript
@Entity()
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;
}
```

Apply `EntityExistPipe` on the route parameter to make sure `customer` record exists

```typescript
import { EntityExistPipe } from 'nestjs-rapid';

// route parameter path name must repeat entity primary property name. In this case id
@UsePipes(new EntityExistPipe(Customer))
@Get(':id')
findOne(@Param('id') customerId: string): Promise<Customer> {
  // customer with id equal to customerId exists
}
```

Composite primary keys and relation columns are also supported

> Note: You can apply `EntityExistPipe` on `param` or `body` route parameters

`EntityUniquePipe` ensures entity record is unique, otherwise throws `BadRequestException`

Suppose we have `Manufacturer` entity

```typescript
@Entity()
@Unique(['name'])
export class Manufacturer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;
}
```

Then you can check if `Manufacturer` is unique

```typescript
import { EntityUniquePipe } from 'nestjs-rapid';

@UsePipes(new EntityUniquePipe(Manufacturer))
@Post()
create(@Body() manufacturer: Partial<Manufacturer>):Promise<Manufacturer> {
  // manufacturer has unique name
}
```

Relation columns are also supported

> Note: You can use `EntityUniquePipe` with POST requests only

`RelationExistPipe` ensures entity relation exists, otherwise throws `BadRequestException`

Lets say we have `Product` entity with relation property `manufacturer`

```typescript
@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Manufacturer, (manufacturer: Manufacturer) => manufacturer.products)
  manufacturer: Manufacturer;
}
```

To confirm that `manufacturer` exists write

```typescript
import { RelationExistPipe } from 'nestjs-rapid';

// pass in relation type and lambda that returns relation property
@UsePipes(new RelationExistPipe(Manufacturer, (product: Product) => product.manufacturer))
@Post()
create(@Body() product: Omit<Product, 'id'>): Promise<Product> {
  // product manufacturer exists
}
```

Explore [demo](apps/demo) project to see more examples

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
