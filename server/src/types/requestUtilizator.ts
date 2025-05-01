import { JwtPayload } from 'src/apps/api/controllers/auth/strategies/jwt.strategy';
import { Request } from 'express';

export interface RequestUtilizator extends Request {
  user: JwtPayload;
}
