import { Controller, Post, Body, Headers, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Đăng nhập nhân viên / quản trị viên' })
  @ApiResponse({ status: 200, description: 'Đăng nhập thành công, trả về access token.' })
  @ApiResponse({ status: 401, description: 'Thông tin đăng nhập không hợp lệ.' })
  async login(
    @Body() loginDto: LoginDto,
    @Headers('x-request-id') requestId?: string,
  ) {
    return this.authService.login(loginDto, requestId);
  }
}

