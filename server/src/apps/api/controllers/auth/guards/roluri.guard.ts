/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolUtilizator } from 'src/libs/entities/utilizatori/utilizator.entity';
import { CHEI_ROLURI } from '../decorators/roluri.decorator';

@Injectable()
export class RoluriGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roluriNecesare = this.reflector.getAllAndOverride<RolUtilizator[]>(
      CHEI_ROLURI,
      [context.getHandler(), context.getClass()],
    );
    if (!roluriNecesare) {
      return true;
    }
    const { utilizator } = context.switchToHttp().getRequest();
    return roluriNecesare.some((rol) => utilizator.roluri?.include(rol));
  }
}
