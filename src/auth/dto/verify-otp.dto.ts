import { IsNotEmpty, IsString } from 'class-validator';

export class verifyOtpDto {
  @IsNotEmpty()
  @IsString()
  otp: string;
}
