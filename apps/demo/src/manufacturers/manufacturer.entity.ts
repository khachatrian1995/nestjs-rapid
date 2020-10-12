import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Product } from '../products/product.entity';

@Entity()
@Unique(['name'])
export class Manufacturer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => Product, (product: Product) => product.manufacturer)
  products: Product[];
}
