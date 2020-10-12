import { CreateDateColumn, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Customer } from '../customers/customer.entity';
import { Product } from '../products/product.entity';

@Entity()
export class Order {
  @ManyToOne(() => Customer, { primary: true })
  @JoinColumn()
  customer: Customer;

  @ManyToOne(() => Product, { primary: true })
  @JoinColumn()
  product: Product;

  @CreateDateColumn()
  date: Date;
}
