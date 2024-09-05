import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ActivationUserLog } from './activation-user-log.entity';
import { EntityBase } from './common/entity-base';
import { RefreshToken } from './refresh-token.entity';
import { Role } from './role.entity';

@Entity()
export class User extends EntityBase {
  @Column({
    unique: true,
  })
  username: string;

  @Column()
  password: string;

  @Column({ default: true }) isActive: boolean;

  @OneToMany(() => ActivationUserLog, (log) => log.author)
  activationLogs: ActivationUserLog[];

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshToken[];

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'roleId' })
  role: Role;
}
