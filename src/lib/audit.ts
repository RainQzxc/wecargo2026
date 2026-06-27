import { db } from "@/server/db";
import { logger } from "@/lib/logger";

interface AuditParams {
  actorId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  before?: unknown;
  after?: unknown;
  metadata?: unknown;
  ipAddress?: string;
  userAgent?: string;
}

// Fire-and-forget audit write. Errors are swallowed so audit failures never
// block the operation that triggered them.
export async function writeAuditLog(params: AuditParams): Promise<void> {
  try {
    await db.auditLog.create({
      data: {
        actorId: params.actorId,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        beforeJson: params.before ? (params.before as object) : undefined,
        afterJson: params.after ? (params.after as object) : undefined,
        metadata: params.metadata ? (params.metadata as object) : undefined,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
      },
    });
  } catch (err) {
    logger.captureException("audit", err, { action: params.action });
  }
}
