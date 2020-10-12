import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Manufacturer } from '../manufacturers/manufacturer.entity';

@Entity()
@Unique(['code'])
@Unique(['name', 'manufacturer'])
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  code: string;

  @Column()
  name: string;

  @ManyToOne(() => Manufacturer, (manufacturer: Manufacturer) => manufacturer.products)
  manufacturer: Manufacturer;
}
