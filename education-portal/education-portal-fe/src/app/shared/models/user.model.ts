import { PERMISSION } from '../consts';
import { Role } from './role.model';

export interface AuthResponse {
  username: string;
  role: string;
  accessToken: string;
  refreshToken: string;
  permissions: PERMISSION[];
}

export interface User {
  id: number;
  username: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}
