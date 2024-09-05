import { Column, Entity, ManyToMany } from 'typeorm';
import { Role } from './role.entity';
import { EntityBase } from './common/entity-base';

@Entity()
export class Permission extends EntityBase {
  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];
}
