import { db } from "@/server/db";

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

export async function writeAuditLog(params: AuditParams) {
  return db.auditLog.create({
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
}
