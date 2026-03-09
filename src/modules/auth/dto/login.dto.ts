import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'user@los.com', description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password', description: 'User password', minLength: 1 })
  @IsString()
  @MinLength(1, { message: 'Password must not be empty' })
  password: string;
}
