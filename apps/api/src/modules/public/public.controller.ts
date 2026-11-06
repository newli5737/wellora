import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Headers,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { PublicService } from './public.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@ApiTags('Public')
@Controller('public')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get('services')
  @ApiOperation({ summary: 'Lấy danh sách dịch vụ công khai' })
  @ApiResponse({ status: 200, description: 'Danh sách dịch vụ đang hoạt động' })
  async getServices() {
    return this.publicService.getPublishedServices();
  }

  @Get('services/:slug')
  @ApiOperation({ summary: 'Lấy chi tiết dịch vụ theo slug' })
  @ApiResponse({ status: 200, description: 'Chi tiết dịch vụ' })
  @ApiResponse({ status: 404, description: 'Dịch vụ không tồn tại' })
  async getServiceBySlug(@Param('slug') slug: string) {
    return this.publicService.getServiceBySlug(slug);
  }

  @Get('practitioners')
  @ApiOperation({ summary: 'Lấy danh sách bác sĩ công khai' })
  @ApiQuery({ name: 'serviceId', required: false })
  async getPractitioners(@Query('serviceId') serviceId?: string) {
    return this.publicService.getPublishedPractitioners(serviceId);
  }

  @Get('locations')
  @ApiOperation({ summary: 'Lấy danh sách cơ sở phòng khám' })
  async getLocations() {
    return this.publicService.getActiveLocations();
  }

  @Get('availability')
  @ApiOperation({ summary: 'Lấy các khung giờ khả dụng cho dịch vụ' })
  @ApiQuery({ name: 'serviceId', required: true })
  @ApiQuery({ name: 'locationId', required: false })
  @ApiQuery({ name: 'practitionerId', required: false })
  @ApiQuery({ name: 'from', required: true, example: '2026-11-08' })
  @ApiQuery({ name: 'to', required: true, example: '2026-11-14' })
  async getAvailability(
    @Query('serviceId') serviceId: string,
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('locationId') locationId?: string,
    @Query('practitionerId') practitionerId?: string,
  ) {
    return this.publicService.getAvailability({
      serviceId,
      locationId,
      practitionerId,
      from,
      to,
    });
  }

  @Post('appointments')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Gửi yêu cầu đặt lịch hẹn mới' })
  @ApiResponse({ status: 201, description: 'Đặt lịch thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 409, description: 'Khung giờ bị xung đột hoặc đã có người đặt' })
  async createAppointment(
    @Body() dto: CreateAppointmentDto,
    @Headers('x-request-id') requestId?: string,
  ) {
    return this.publicService.createAppointment(dto, requestId);
  }

  @Get('appointments/status/:reference')
  @ApiOperation({ summary: 'Tra cứu trạng thái lịch hẹn theo mã tham chiếu' })
  @ApiResponse({ status: 200, description: 'Thông tin trạng thái lịch hẹn' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy lịch hẹn' })
  async getAppointmentStatus(@Param('reference') reference: string) {
    return this.publicService.getAppointmentStatus(reference);
  }
}
