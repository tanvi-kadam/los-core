import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class LoginDto {
  @ApiProperty({ example: "admin@test.com", description: "User email" })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: "password123",
    description: "User password",
    minLength: 1,
  })
  @IsString()
  @MinLength(1, { message: "Password must not be empty" })
  password: string;

  @ApiProperty({
    example: "los-core",
    description: "JWT issuer (iss) required by API gateway",
  })
  @IsString()
  iss: string;
}
