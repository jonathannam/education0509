import { SetMetadata } from '@nestjs/common';
import { PERMISSION } from 'src/app/infrastructures/constants';

export const PERMISSIONS_KEY = 'permission';
export const Authorize = (...permissions: PERMISSION[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
