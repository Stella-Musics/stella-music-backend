import { SetMetadata } from "@nestjs/common";

export const API_KEY = "apiKey";
export const ApiKey = (key: string | undefined) => SetMetadata(API_KEY, key);
