## Table of Contents

- [Table of Contents](#table-of-contents)
- [Description](#description)
- [Packages](#packages)
- [Running demo applications](#running-demo-applications)
- [License](#license)

## Description

Library for [NestJS Framework](https://github.com/nestjs/nest)  based applications

## Packages

- [@nestjs-rapid/core](libs/core) - core package
- [@nestjs-rapid/typeorm](libs/typeorm) - entity validation for typeorm
- [@nestjs-rapid/sequelize](libs/sequelize) - model validation for sequelize

## Running demo applications

TypeOrm demo

```bash
# start mysql container
$ docker-compose -f apps/typeorm-demo/docker-compose.yml up -d

# run application
$ nest start typeorm-demo

# at last stop mysql container
$ docker-compose -f apps/typeorm-demo/docker-compose.yml down
```

Sequelize demo

```bash
# start mysql container
$ docker-compose -f apps/sequelize-demo/docker-compose.yml up -d

# run application
$ nest start sequelize-demo

# at last stop mysql container
$ docker-compose -f apps/sequelize-demo/docker-compose.yml down
```

## License

@nestjs-rapid is [MIT licensed](LICENSE)
