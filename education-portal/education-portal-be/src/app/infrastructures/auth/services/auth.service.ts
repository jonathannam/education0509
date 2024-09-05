import {
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common/decorators';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { RefreshToken, User } from 'src/app/entities';
import { EnvironmentConfiguration } from 'src/app/infrastructures/config';
import { Repository } from 'typeorm';
import { TokenPayloadDto } from '../dtos/token-payload.dto';

@Injectable()
export class AuthService {
  /**
   * Refresh Token expire after 5 hours
   */
  private readonly REFRESH_TOKEN_EXPIRE_TIME = 60 * 5;
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService<EnvironmentConfiguration>,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async generateAccessToken(userId: number): Promise<string> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        role: {
          permissions: true,
        },
      },
    });
    const accessToken = await this.jwtService.signAsync({
      user: {
        id: user.id,
        username: user.username,
        role: user.role.name,
        permissions: user.role.permissions.map((p) => p.name),
      },
    });
    return accessToken;
  }

  async validateToken(token: string): Promise<TokenPayloadDto | null> {
    try {
      const payload = await this.jwtService.verifyAsync<TokenPayloadDto>(
        token,
        {
          secret: this.configService.get('jwtSecret'),
        },
      );
      return payload;
    } catch (error) {
      this.logger.error(error);
      return null;
    }
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  async validatePassword(
    plainPassword: string,
    hashPassword: string,
  ): Promise<boolean> {
    const isMatch = await bcrypt.compare(plainPassword, hashPassword);
    return isMatch;
  }

  async createRefreshToken(user: User): Promise<RefreshToken> {
    const expiresAt = new Date();
    expiresAt.setMinutes(
      expiresAt.getMinutes() + this.REFRESH_TOKEN_EXPIRE_TIME,
    );

    const refreshToken = this.refreshTokenRepository.create({
      expiresAt,
      user,
    });

    return await this.refreshTokenRepository.save(refreshToken);
  }

  async verifyRefreshToken(token: string): Promise<RefreshToken> {
    const oldRefreshToken = await this.refreshTokenRepository.findOne({
      where: {
        token: token,
      },
      relations: {
        user: true,
      },
    });

    if (!oldRefreshToken) {
      throw new NotFoundException('Invalid refresh token');
    }

    if (oldRefreshToken.expiresAt <= new Date()) {
      await this.removeRefreshToken(oldRefreshToken);
      throw new UnauthorizedException('Refresh token expired');
    }
    return oldRefreshToken;
  }

  async removeRefreshToken(refreshToken: RefreshToken): Promise<void> {
    await this.refreshTokenRepository.remove(refreshToken);
  }
}
