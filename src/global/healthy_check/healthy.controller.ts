import { Controller, Get } from "@nestjs/common";

@Controller("/healthy-check")
export class HealthController {
  @Get()
  check(): string {
    return "ok";
  }
}
