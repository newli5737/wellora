import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AppointmentStatus } from '@prisma/client';

export class UpdateAppointmentStatusDto {
  @ApiProperty({ enum: AppointmentStatus, example: AppointmentStatus.CONFIRMED })
  @IsEnum(AppointmentStatus, { message: 'Trạng thái lịch hẹn không hợp lệ' })
  @IsNotEmpty({ message: 'Trạng thái mới là bắt buộc' })
  status!: AppointmentStatus;

  @ApiPropertyOptional({ example: 'Khách hàng bận đột xuất' })
  @IsString({ message: 'Lý do phải là chuỗi' })
  @IsOptional()
  @MaxLength(300, { message: 'Lý do tối đa 300 ký tự' })
  reason?: string;
}

