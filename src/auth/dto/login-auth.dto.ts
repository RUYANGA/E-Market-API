import { IsNotEmpty, IsString } from 'class-validator';

export class loginAuthDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
