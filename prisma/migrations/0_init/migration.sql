-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "public"."BannerPlacement" AS ENUM ('HOME_HERO', 'HOME_SECTION', 'ALERT', 'PRICING', 'COOPERATION');

-- CreateEnum
CREATE TYPE "public"."BatchStatus" AS ENUM ('DRAFT', 'LOADING', 'LOADED', 'DEPARTED', 'ARRIVED_ULAANBAATAR', 'CLOSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."CargoPriority" AS ENUM ('REGULAR', 'URGENT');

-- CreateEnum
CREATE TYPE "public"."DeliveryStatus" AS ENUM ('REQUESTED', 'ASSIGNED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'FAILED', 'RETURNED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."LeadType" AS ENUM ('COOPERATION', 'CONTACT');

-- CreateEnum
CREATE TYPE "public"."LinkOrderStatus" AS ENUM ('REQUESTED', 'REVIEWING', 'PAYMENT_PENDING', 'ORDERED', 'SELLER_SHIPPED', 'TRACK_CODE_ADDED', 'RECEIVED_AT_EREEN', 'LINKED_TO_PARCEL', 'CANCELLED', 'ISSUE');

-- CreateEnum
CREATE TYPE "public"."NotificationChannel" AS ENUM ('SMS', 'EMAIL', 'PUSH', 'IN_APP');

-- CreateEnum
CREATE TYPE "public"."NotificationStatus" AS ENUM ('PENDING', 'SENT', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."OwnershipClaimStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."ParcelOwnerStatus" AS ENUM ('IDENTIFIED', 'UNIDENTIFIED', 'CLAIM_PENDING');

-- CreateEnum
CREATE TYPE "public"."ParcelStatus" AS ENUM ('REGISTERED', 'RECEIVED_AT_EREEN', 'MEASURED', 'PRICED', 'UNIDENTIFIED', 'READY_FOR_LOADING', 'LOADED', 'DEPARTED_EREEN', 'IN_TRANSIT', 'ARRIVED_ULAANBAATAR', 'SORTING', 'READY_FOR_PICKUP', 'DELIVERY_REQUESTED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'STORAGE_REQUESTED', 'ISSUE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('NOT_REQUIRED', 'UNPAID', 'PARTIAL', 'PAID', 'REFUNDED');

-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'WAREHOUSE_STAFF', 'CUSTOMER', 'COURIER');

-- CreateEnum
CREATE TYPE "public"."StorageStatus" AS ENUM ('REQUESTED', 'APPROVED', 'ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."UserStatus" AS ENUM ('ACTIVE', 'DISABLED');

-- CreateEnum
CREATE TYPE "public"."WarehouseType" AS ENUM ('EREEN', 'ULAANBAATAR', 'OTHER');

-- CreateTable
CREATE TABLE "public"."Address" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "label" TEXT,
    "city" TEXT,
    "district" TEXT,
    "khoroo" TEXT,
    "street" TEXT,
    "detail" TEXT NOT NULL,
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AuditLog" (
    "id" TEXT NOT NULL,
    "actorId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "beforeJson" JSONB,
    "afterJson" JSONB,
    "metadata" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Banner" (
    "id" TEXT NOT NULL,
    "placement" "public"."BannerPlacement" NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "imageUrl" TEXT,
    "href" TEXT,
    "ctaLabel" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Banner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Branch" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Branch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CustomerProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "customerCode" TEXT,
    "defaultBranchId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DeliveryEvent" (
    "id" TEXT NOT NULL,
    "deliveryId" TEXT NOT NULL,
    "status" "public"."DeliveryStatus" NOT NULL,
    "note" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeliveryEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DeliveryRequest" (
    "id" TEXT NOT NULL,
    "parcelId" TEXT NOT NULL,
    "customerId" TEXT,
    "courierId" TEXT,
    "status" "public"."DeliveryStatus" NOT NULL DEFAULT 'REQUESTED',
    "recipientName" TEXT,
    "recipientPhone" TEXT,
    "recipientPhoneNormalized" TEXT,
    "city" TEXT,
    "district" TEXT,
    "addressDetail" TEXT NOT NULL,
    "preferredTime" TEXT,
    "notes" TEXT,
    "deliveryFeeAmount" DECIMAL(14,2),
    "currency" TEXT NOT NULL DEFAULT 'MNT',
    "assignedAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "failedReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeliveryRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Lead" (
    "id" TEXT NOT NULL,
    "type" "public"."LeadType" NOT NULL,
    "name" TEXT,
    "phone" TEXT,
    "phoneNormalized" TEXT,
    "email" TEXT,
    "companyName" TEXT,
    "message" TEXT,
    "monthlyCargoVolume" TEXT,
    "cargoType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LinkOrder" (
    "id" TEXT NOT NULL,
    "customerId" TEXT,
    "customerName" TEXT,
    "customerPhone" TEXT,
    "customerPhoneNormalized" TEXT,
    "productUrl" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "color" TEXT,
    "size" TEXT,
    "notes" TEXT,
    "priority" "public"."CargoPriority" NOT NULL DEFAULT 'REGULAR',
    "status" "public"."LinkOrderStatus" NOT NULL DEFAULT 'REQUESTED',
    "storeName" TEXT,
    "storeOrderNo" TEXT,
    "sellerTrackCodeOriginal" TEXT,
    "sellerTrackCodeNormalized" TEXT,
    "productPriceAmount" DECIMAL(14,2),
    "domesticShippingFee" DECIMAL(14,2),
    "serviceFeeAmount" DECIMAL(14,2),
    "totalAmount" DECIMAL(14,2),
    "currency" TEXT NOT NULL DEFAULT 'CNY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LinkOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."NotificationLog" (
    "id" TEXT NOT NULL,
    "channel" "public"."NotificationChannel" NOT NULL,
    "status" "public"."NotificationStatus" NOT NULL DEFAULT 'PENDING',
    "recipient" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "userId" TEXT,
    "parcelId" TEXT,
    "provider" TEXT,
    "providerRef" TEXT,
    "errorMessage" TEXT,
    "metadata" JSONB,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NotificationLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OwnershipClaim" (
    "id" TEXT NOT NULL,
    "parcelId" TEXT NOT NULL,
    "claimantUserId" TEXT,
    "claimantName" TEXT,
    "claimantPhone" TEXT,
    "claimantPhoneNormalized" TEXT,
    "submittedTrackCode" TEXT,
    "message" TEXT,
    "status" "public"."OwnershipClaimStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "reviewNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OwnershipClaim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Parcel" (
    "id" TEXT NOT NULL,
    "publicCode" TEXT NOT NULL,
    "trackCodeOriginal" TEXT,
    "trackCodeNormalized" TEXT,
    "customerId" TEXT,
    "customerName" TEXT,
    "customerPhone" TEXT,
    "customerPhoneNormalized" TEXT,
    "ownerStatus" "public"."ParcelOwnerStatus" NOT NULL DEFAULT 'IDENTIFIED',
    "status" "public"."ParcelStatus" NOT NULL DEFAULT 'REGISTERED',
    "priority" "public"."CargoPriority" NOT NULL DEFAULT 'REGULAR',
    "paymentStatus" "public"."PaymentStatus" NOT NULL DEFAULT 'UNPAID',
    "cargoType" TEXT,
    "description" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "weightKg" DECIMAL(12,3),
    "weightTon" DECIMAL(12,3),
    "lengthCm" DECIMAL(12,2),
    "widthCm" DECIMAL(12,2),
    "heightCm" DECIMAL(12,2),
    "volumeM3" DECIMAL(12,4),
    "priceAmount" DECIMAL(14,2),
    "currency" TEXT NOT NULL DEFAULT 'MNT',
    "originWarehouseId" TEXT,
    "currentWarehouseId" TEXT,
    "destinationWarehouseId" TEXT,
    "destinationBranchId" TEXT,
    "currentLocationText" TEXT,
    "storageLocation" TEXT,
    "notes" TEXT,
    "internalNotes" TEXT,
    "linkOrderId" TEXT,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Parcel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ParcelEvent" (
    "id" TEXT NOT NULL,
    "parcelId" TEXT NOT NULL,
    "status" "public"."ParcelStatus" NOT NULL,
    "messageMn" TEXT,
    "messageEn" TEXT,
    "locationText" TEXT,
    "metadata" JSONB,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ParcelEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ParcelPhoto" (
    "id" TEXT NOT NULL,
    "parcelId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "fileName" TEXT,
    "mimeType" TEXT,
    "sizeBytes" INTEGER,
    "caption" TEXT,
    "uploadedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ParcelPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ShipmentBatch" (
    "id" TEXT NOT NULL,
    "batchNo" TEXT NOT NULL,
    "status" "public"."BatchStatus" NOT NULL DEFAULT 'DRAFT',
    "originWarehouseId" TEXT NOT NULL,
    "destinationWarehouseId" TEXT,
    "destinationBranchId" TEXT,
    "vehiclePlate" TEXT,
    "driverName" TEXT,
    "driverPhone" TEXT,
    "notes" TEXT,
    "loadedAt" TIMESTAMP(3),
    "departedAt" TIMESTAMP(3),
    "arrivedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShipmentBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ShipmentBatchItem" (
    "id" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "parcelId" TEXT NOT NULL,
    "addedById" TEXT,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShipmentBatchItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StaffProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "employeeCode" TEXT,
    "warehouseId" TEXT,
    "branchId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StaffProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StorageRequest" (
    "id" TEXT NOT NULL,
    "parcelId" TEXT NOT NULL,
    "userId" TEXT,
    "status" "public"."StorageStatus" NOT NULL DEFAULT 'REQUESTED',
    "days" INTEGER,
    "startAt" TIMESTAMP(3),
    "endAt" TIMESTAMP(3),
    "notes" TEXT,
    "feeAmount" DECIMAL(14,2),
    "currency" TEXT NOT NULL DEFAULT 'MNT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StorageRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TariffRule" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "routeCode" TEXT,
    "cargoType" TEXT,
    "priority" "public"."CargoPriority",
    "unit" TEXT NOT NULL,
    "priceAmount" DECIMAL(14,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'CNY',
    "minFeeAmount" DECIMAL(14,2),
    "config" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "effectiveFrom" TIMESTAMP(3),
    "effectiveTo" TIMESTAMP(3),
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TariffRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'CUSTOMER',
    "status" "public"."UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "name" TEXT,
    "phone" TEXT,
    "phoneNormalized" TEXT,
    "email" TEXT,
    "passwordHash" TEXT,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Warehouse" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."WarehouseType" NOT NULL,
    "phone" TEXT,
    "addressMn" TEXT,
    "addressCn" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Warehouse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Address_userId_idx" ON "public"."Address"("userId" ASC);

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "public"."AuditLog"("action" ASC);

-- CreateIndex
CREATE INDEX "AuditLog_actorId_idx" ON "public"."AuditLog"("actorId" ASC);

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "public"."AuditLog"("createdAt" ASC);

-- CreateIndex
CREATE INDEX "AuditLog_entityId_idx" ON "public"."AuditLog"("entityId" ASC);

-- CreateIndex
CREATE INDEX "AuditLog_entityType_idx" ON "public"."AuditLog"("entityType" ASC);

-- CreateIndex
CREATE INDEX "Banner_isActive_idx" ON "public"."Banner"("isActive" ASC);

-- CreateIndex
CREATE INDEX "Banner_placement_idx" ON "public"."Banner"("placement" ASC);

-- CreateIndex
CREATE INDEX "Banner_sortOrder_idx" ON "public"."Banner"("sortOrder" ASC);

-- CreateIndex
CREATE INDEX "Branch_isActive_idx" ON "public"."Branch"("isActive" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "CustomerProfile_customerCode_key" ON "public"."CustomerProfile"("customerCode" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "CustomerProfile_userId_key" ON "public"."CustomerProfile"("userId" ASC);

-- CreateIndex
CREATE INDEX "DeliveryEvent_createdAt_idx" ON "public"."DeliveryEvent"("createdAt" ASC);

-- CreateIndex
CREATE INDEX "DeliveryEvent_deliveryId_idx" ON "public"."DeliveryEvent"("deliveryId" ASC);

-- CreateIndex
CREATE INDEX "DeliveryRequest_courierId_idx" ON "public"."DeliveryRequest"("courierId" ASC);

-- CreateIndex
CREATE INDEX "DeliveryRequest_createdAt_idx" ON "public"."DeliveryRequest"("createdAt" ASC);

-- CreateIndex
CREATE INDEX "DeliveryRequest_customerId_idx" ON "public"."DeliveryRequest"("customerId" ASC);

-- CreateIndex
CREATE INDEX "DeliveryRequest_parcelId_idx" ON "public"."DeliveryRequest"("parcelId" ASC);

-- CreateIndex
CREATE INDEX "DeliveryRequest_status_idx" ON "public"."DeliveryRequest"("status" ASC);

-- CreateIndex
CREATE INDEX "Lead_createdAt_idx" ON "public"."Lead"("createdAt" ASC);

-- CreateIndex
CREATE INDEX "Lead_phoneNormalized_idx" ON "public"."Lead"("phoneNormalized" ASC);

-- CreateIndex
CREATE INDEX "Lead_type_idx" ON "public"."Lead"("type" ASC);

-- CreateIndex
CREATE INDEX "LinkOrder_createdAt_idx" ON "public"."LinkOrder"("createdAt" ASC);

-- CreateIndex
CREATE INDEX "LinkOrder_customerId_idx" ON "public"."LinkOrder"("customerId" ASC);

-- CreateIndex
CREATE INDEX "LinkOrder_customerPhoneNormalized_idx" ON "public"."LinkOrder"("customerPhoneNormalized" ASC);

-- CreateIndex
CREATE INDEX "LinkOrder_sellerTrackCodeNormalized_idx" ON "public"."LinkOrder"("sellerTrackCodeNormalized" ASC);

-- CreateIndex
CREATE INDEX "LinkOrder_status_idx" ON "public"."LinkOrder"("status" ASC);

-- CreateIndex
CREATE INDEX "NotificationLog_channel_idx" ON "public"."NotificationLog"("channel" ASC);

-- CreateIndex
CREATE INDEX "NotificationLog_createdAt_idx" ON "public"."NotificationLog"("createdAt" ASC);

-- CreateIndex
CREATE INDEX "NotificationLog_parcelId_idx" ON "public"."NotificationLog"("parcelId" ASC);

-- CreateIndex
CREATE INDEX "NotificationLog_recipient_idx" ON "public"."NotificationLog"("recipient" ASC);

-- CreateIndex
CREATE INDEX "NotificationLog_status_idx" ON "public"."NotificationLog"("status" ASC);

-- CreateIndex
CREATE INDEX "OwnershipClaim_claimantPhoneNormalized_idx" ON "public"."OwnershipClaim"("claimantPhoneNormalized" ASC);

-- CreateIndex
CREATE INDEX "OwnershipClaim_parcelId_idx" ON "public"."OwnershipClaim"("parcelId" ASC);

-- CreateIndex
CREATE INDEX "OwnershipClaim_status_idx" ON "public"."OwnershipClaim"("status" ASC);

-- CreateIndex
CREATE INDEX "Parcel_createdAt_idx" ON "public"."Parcel"("createdAt" ASC);

-- CreateIndex
CREATE INDEX "Parcel_currentWarehouseId_idx" ON "public"."Parcel"("currentWarehouseId" ASC);

-- CreateIndex
CREATE INDEX "Parcel_customerId_idx" ON "public"."Parcel"("customerId" ASC);

-- CreateIndex
CREATE INDEX "Parcel_customerPhoneNormalized_idx" ON "public"."Parcel"("customerPhoneNormalized" ASC);

-- CreateIndex
CREATE INDEX "Parcel_deletedAt_idx" ON "public"."Parcel"("deletedAt" ASC);

-- CreateIndex
CREATE INDEX "Parcel_destinationBranchId_idx" ON "public"."Parcel"("destinationBranchId" ASC);

-- CreateIndex
CREATE INDEX "Parcel_ownerStatus_idx" ON "public"."Parcel"("ownerStatus" ASC);

-- CreateIndex
CREATE INDEX "Parcel_paymentStatus_idx" ON "public"."Parcel"("paymentStatus" ASC);

-- CreateIndex
CREATE INDEX "Parcel_priority_idx" ON "public"."Parcel"("priority" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Parcel_publicCode_key" ON "public"."Parcel"("publicCode" ASC);

-- CreateIndex
CREATE INDEX "Parcel_status_idx" ON "public"."Parcel"("status" ASC);

-- CreateIndex
CREATE INDEX "Parcel_trackCodeNormalized_idx" ON "public"."Parcel"("trackCodeNormalized" ASC);

-- CreateIndex
CREATE INDEX "ParcelEvent_createdAt_idx" ON "public"."ParcelEvent"("createdAt" ASC);

-- CreateIndex
CREATE INDEX "ParcelEvent_parcelId_idx" ON "public"."ParcelEvent"("parcelId" ASC);

-- CreateIndex
CREATE INDEX "ParcelEvent_status_idx" ON "public"."ParcelEvent"("status" ASC);

-- CreateIndex
CREATE INDEX "ParcelPhoto_parcelId_idx" ON "public"."ParcelPhoto"("parcelId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "ShipmentBatch_batchNo_key" ON "public"."ShipmentBatch"("batchNo" ASC);

-- CreateIndex
CREATE INDEX "ShipmentBatch_createdAt_idx" ON "public"."ShipmentBatch"("createdAt" ASC);

-- CreateIndex
CREATE INDEX "ShipmentBatch_destinationWarehouseId_idx" ON "public"."ShipmentBatch"("destinationWarehouseId" ASC);

-- CreateIndex
CREATE INDEX "ShipmentBatch_originWarehouseId_idx" ON "public"."ShipmentBatch"("originWarehouseId" ASC);

-- CreateIndex
CREATE INDEX "ShipmentBatch_status_idx" ON "public"."ShipmentBatch"("status" ASC);

-- CreateIndex
CREATE INDEX "ShipmentBatchItem_batchId_idx" ON "public"."ShipmentBatchItem"("batchId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "ShipmentBatchItem_batchId_parcelId_key" ON "public"."ShipmentBatchItem"("batchId" ASC, "parcelId" ASC);

-- CreateIndex
CREATE INDEX "ShipmentBatchItem_parcelId_idx" ON "public"."ShipmentBatchItem"("parcelId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "StaffProfile_employeeCode_key" ON "public"."StaffProfile"("employeeCode" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "StaffProfile_userId_key" ON "public"."StaffProfile"("userId" ASC);

-- CreateIndex
CREATE INDEX "StorageRequest_parcelId_idx" ON "public"."StorageRequest"("parcelId" ASC);

-- CreateIndex
CREATE INDEX "StorageRequest_status_idx" ON "public"."StorageRequest"("status" ASC);

-- CreateIndex
CREATE INDEX "StorageRequest_userId_idx" ON "public"."StorageRequest"("userId" ASC);

-- CreateIndex
CREATE INDEX "TariffRule_cargoType_idx" ON "public"."TariffRule"("cargoType" ASC);

-- CreateIndex
CREATE INDEX "TariffRule_isActive_idx" ON "public"."TariffRule"("isActive" ASC);

-- CreateIndex
CREATE INDEX "TariffRule_priority_idx" ON "public"."TariffRule"("priority" ASC);

-- CreateIndex
CREATE INDEX "TariffRule_routeCode_idx" ON "public"."TariffRule"("routeCode" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNormalized_key" ON "public"."User"("phoneNormalized" ASC);

-- CreateIndex
CREATE INDEX "User_role_idx" ON "public"."User"("role" ASC);

-- CreateIndex
CREATE INDEX "User_status_idx" ON "public"."User"("status" ASC);

-- CreateIndex
CREATE INDEX "Warehouse_isActive_idx" ON "public"."Warehouse"("isActive" ASC);

-- CreateIndex
CREATE INDEX "Warehouse_type_idx" ON "public"."Warehouse"("type" ASC);

-- AddForeignKey
ALTER TABLE "public"."Address" ADD CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AuditLog" ADD CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Banner" ADD CONSTRAINT "Banner_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CustomerProfile" ADD CONSTRAINT "CustomerProfile_defaultBranchId_fkey" FOREIGN KEY ("defaultBranchId") REFERENCES "public"."Branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CustomerProfile" ADD CONSTRAINT "CustomerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DeliveryEvent" ADD CONSTRAINT "DeliveryEvent_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DeliveryEvent" ADD CONSTRAINT "DeliveryEvent_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES "public"."DeliveryRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DeliveryRequest" ADD CONSTRAINT "DeliveryRequest_courierId_fkey" FOREIGN KEY ("courierId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DeliveryRequest" ADD CONSTRAINT "DeliveryRequest_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DeliveryRequest" ADD CONSTRAINT "DeliveryRequest_parcelId_fkey" FOREIGN KEY ("parcelId") REFERENCES "public"."Parcel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LinkOrder" ADD CONSTRAINT "LinkOrder_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."NotificationLog" ADD CONSTRAINT "NotificationLog_parcelId_fkey" FOREIGN KEY ("parcelId") REFERENCES "public"."Parcel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."NotificationLog" ADD CONSTRAINT "NotificationLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OwnershipClaim" ADD CONSTRAINT "OwnershipClaim_claimantUserId_fkey" FOREIGN KEY ("claimantUserId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OwnershipClaim" ADD CONSTRAINT "OwnershipClaim_parcelId_fkey" FOREIGN KEY ("parcelId") REFERENCES "public"."Parcel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OwnershipClaim" ADD CONSTRAINT "OwnershipClaim_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Parcel" ADD CONSTRAINT "Parcel_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Parcel" ADD CONSTRAINT "Parcel_currentWarehouseId_fkey" FOREIGN KEY ("currentWarehouseId") REFERENCES "public"."Warehouse"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Parcel" ADD CONSTRAINT "Parcel_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Parcel" ADD CONSTRAINT "Parcel_destinationBranchId_fkey" FOREIGN KEY ("destinationBranchId") REFERENCES "public"."Branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Parcel" ADD CONSTRAINT "Parcel_destinationWarehouseId_fkey" FOREIGN KEY ("destinationWarehouseId") REFERENCES "public"."Warehouse"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Parcel" ADD CONSTRAINT "Parcel_linkOrderId_fkey" FOREIGN KEY ("linkOrderId") REFERENCES "public"."LinkOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Parcel" ADD CONSTRAINT "Parcel_originWarehouseId_fkey" FOREIGN KEY ("originWarehouseId") REFERENCES "public"."Warehouse"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Parcel" ADD CONSTRAINT "Parcel_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ParcelEvent" ADD CONSTRAINT "ParcelEvent_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ParcelEvent" ADD CONSTRAINT "ParcelEvent_parcelId_fkey" FOREIGN KEY ("parcelId") REFERENCES "public"."Parcel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ParcelPhoto" ADD CONSTRAINT "ParcelPhoto_parcelId_fkey" FOREIGN KEY ("parcelId") REFERENCES "public"."Parcel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ParcelPhoto" ADD CONSTRAINT "ParcelPhoto_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ShipmentBatch" ADD CONSTRAINT "ShipmentBatch_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ShipmentBatch" ADD CONSTRAINT "ShipmentBatch_destinationBranchId_fkey" FOREIGN KEY ("destinationBranchId") REFERENCES "public"."Branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ShipmentBatch" ADD CONSTRAINT "ShipmentBatch_destinationWarehouseId_fkey" FOREIGN KEY ("destinationWarehouseId") REFERENCES "public"."Warehouse"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ShipmentBatch" ADD CONSTRAINT "ShipmentBatch_originWarehouseId_fkey" FOREIGN KEY ("originWarehouseId") REFERENCES "public"."Warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ShipmentBatchItem" ADD CONSTRAINT "ShipmentBatchItem_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ShipmentBatchItem" ADD CONSTRAINT "ShipmentBatchItem_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "public"."ShipmentBatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ShipmentBatchItem" ADD CONSTRAINT "ShipmentBatchItem_parcelId_fkey" FOREIGN KEY ("parcelId") REFERENCES "public"."Parcel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StaffProfile" ADD CONSTRAINT "StaffProfile_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "public"."Branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StaffProfile" ADD CONSTRAINT "StaffProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StaffProfile" ADD CONSTRAINT "StaffProfile_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "public"."Warehouse"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StorageRequest" ADD CONSTRAINT "StorageRequest_parcelId_fkey" FOREIGN KEY ("parcelId") REFERENCES "public"."Parcel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StorageRequest" ADD CONSTRAINT "StorageRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TariffRule" ADD CONSTRAINT "TariffRule_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
