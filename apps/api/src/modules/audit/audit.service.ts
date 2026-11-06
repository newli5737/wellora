import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

export interface CreateAuditRecord {
  actorId?: string;
  actorRole?: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, unknown>;
  requestId?: string;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private readonly prisma: PrismaService) {}

  async record(data: CreateAuditRecord): Promise<void> {
    try {
      // Redact any potentially sensitive keys in metadata
      let sanitizedMetadata: string | null = null;
      if (data.metadata) {
        const copy = { ...data.metadata };
        delete copy.password;
        delete copy.passwordHash;
        delete copy.token;
        delete copy.phone;
        delete copy.email;
        delete copy.note;
        delete copy.patientNote;
        sanitizedMetadata = JSON.stringify(copy);
      }

      await this.prisma.auditEvent.create({
        data: {
          actorId: data.actorId,
          actorRole: data.actorRole,
          action: data.action,
          entityType: data.entityType,
          entityId: data.entityId,
          metadata: sanitizedMetadata,
          requestId: data.requestId,
        },
      });
    } catch (err) {
      // Audit failure must not crash business transaction, but should be logged
      this.logger.error(`Failed to record audit event for ${data.entityType}:${data.entityId}: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }
}
