import {
  IsBoolean,
  IsEmail,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty({ example: 'b567d14e-1234-4567-89ab-cdef01234567' })
  @IsUUID('all', { message: 'Mã dịch vụ không hợp lệ' })
  @IsNotEmpty({ message: 'Dịch vụ là bắt buộc' })
  serviceId!: string;

  @ApiPropertyOptional({ example: 'b567d14e-1234-4567-89ab-cdef01234567' })
  @IsUUID('all', { message: 'Mã cơ sở không hợp lệ' })
  @IsOptional()
  locationId?: string;

  @ApiPropertyOptional({ example: 'b567d14e-1234-4567-89ab-cdef01234567' })
  @IsUUID('all', { message: 'Mã bác sĩ không hợp lệ' })
  @IsOptional()
  practitionerId?: string;

  @ApiProperty({ example: '2026-11-08T09:00:00.000Z' })
  @IsISO8601({}, { message: 'Thời gian bắt đầu phải là định dạng ISO-8601' })
  @IsNotEmpty({ message: 'Thời gian bắt đầu là bắt buộc' })
  startsAt!: string;

  @ApiProperty({ example: 'Nguyễn Văn A' })
  @IsString({ message: 'Họ tên phải là chuỗi' })
  @IsNotEmpty({ message: 'Họ tên người khám là bắt buộc' })
  @Length(2, 100, { message: 'Họ tên phải từ 2 đến 100 ký tự' })
  patientName!: string;

  @ApiProperty({ example: '0901234567' })
  @IsString({ message: 'Số điện thoại phải là chuỗi' })
  @IsNotEmpty({ message: 'Số điện thoại là bắt buộc' })
  @Matches(/^(0[3|5|7|8|9])[0-9]{8}$/, {
    message: 'Số điện thoại không đúng định dạng (gồm 10 chữ số, ví dụ: 0901234567)',
  })
  patientPhone!: string;

  @ApiPropertyOptional({ example: 'patient@example.com' })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsOptional()
  patientEmail?: string;

  @ApiPropertyOptional({ example: 'Muốn khám buổi sáng' })
  @IsString()
  @IsOptional()
  @Length(0, 500, { message: 'Ghi chú tối đa 500 ký tự' })
  patientNote?: string;

  @ApiProperty({ example: true })
  @IsBoolean({ message: 'Xác nhận đồng ý điều khoản phải là boolean' })
  @IsNotEmpty({ message: 'Vui lòng đồng ý với chính sách và điều khoản' })
  consent!: boolean;
}

