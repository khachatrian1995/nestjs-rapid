import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Album } from '../albums/album.entity';

@Entity()
@Unique(['firstName', 'lastName'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @OneToMany(() => Album, (album: Album) => album.user)
  albums: Album[];
}
