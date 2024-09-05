import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { EntityBase } from './common/entity-base';
import { Permission } from './permission.entity';
import { User } from './user.entity';

@Entity()
export class Role extends EntityBase {
  @Column({ unique: true })
  name: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];

  @ManyToMany(() => Permission, (permission) => permission.roles)
  @JoinTable()
  permissions: Permission[];
}
