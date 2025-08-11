import { IsNotEmpty, IsString } from 'class-validator';

export class verifyOtpDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  otp: string;
}
