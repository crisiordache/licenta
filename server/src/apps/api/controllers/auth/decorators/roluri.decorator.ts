import { SetMetadata } from '@nestjs/common';
import { RolUtilizator } from 'src/libs/entities/utilizatori/utilizator.entity';

export const CHEI_ROLURI = 'roles';
export const Roluri = (...roluri: RolUtilizator[]) =>
  SetMetadata(CHEI_ROLURI, roluri);
