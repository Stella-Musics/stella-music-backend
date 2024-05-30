import { Injectable, CanActivate, ExecutionContext, HttpException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { API_KEY } from "./api-key.decorator";

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers["api-key"] as string;
    const comparedApiKey = this.reflector.get<string>(API_KEY, context.getHandler());
    if (!comparedApiKey || !this.validateApiKey(apiKey, comparedApiKey)) {
      throw new HttpException("api key is not valid", 403);
    }

    return true;
  }

  validateApiKey(apiKey: string, requiredApiKey: string): boolean {
    return apiKey === requiredApiKey;
  }
}
