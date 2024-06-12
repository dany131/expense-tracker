import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Injectable } from "@nestjs/common";
import { Tokens } from "@types";


@Injectable()
export class AuthHelper {
  constructor(private configService: ConfigService, private jwtService: JwtService) {
  }

  /** Access & Refresh token generator, OAuth2 Approach*/
  async getTokens(userId: string, role: string): Promise<Tokens> {
    const atSecret = this.configService.get<string>("jwt.accessTokenKey");
    const atExpiry = this.configService.get<string>("jwt.accessExpiry");
    const rtSecret = this.configService.get<string>("jwt.refreshTokenKey");
    const rtExpiry = this.configService.get<string>("jwt.refreshExpiry");

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync({ id: userId, role },
        { secret: atSecret, expiresIn: atExpiry }),
      this.jwtService.signAsync({ id: userId, role },
        { secret: rtSecret, expiresIn: rtExpiry })
    ]);
    return {
      access_token: at,
      refresh_token: rt
    };
  }

  async jwtDecoder(headers: any) {
    const token = headers.authorization.split(" ");
    const decodedJwtAccessToken = this.jwtService.decode(token[1]);
    return decodedJwtAccessToken.sub;
  }

}

