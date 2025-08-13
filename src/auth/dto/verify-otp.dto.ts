import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyOtpDto {
  @IsNotEmpty()
  @IsString()
  userId:string

  @IsNotEmpty()
  @IsString()
  otp: string;
}
