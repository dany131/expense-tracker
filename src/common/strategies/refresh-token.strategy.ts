import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, "jwt-refresh") {

  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get("jwt.refreshTokenKey"),
      passReqToCallback: true
    });
  }

  validate(req: Request, payload: any) {
    const refreshToken = req.get("authorization").replace("Bearer", "").trim();
    return {
      ...payload,
      refreshToken
    };
  }

}