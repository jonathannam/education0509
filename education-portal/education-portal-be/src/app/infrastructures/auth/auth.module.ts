import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken, User } from 'src/app/entities';
import { EnvironmentConfiguration } from '../config';
import { AuthService } from './services';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService<EnvironmentConfiguration>) => ({
        global: true,
        secret: configService.get('jwtSecret'),
        signOptions: { expiresIn: '5m' },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([RefreshToken, User]),
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
