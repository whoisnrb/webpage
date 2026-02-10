-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "descriptionEn" TEXT,
ADD COLUMN     "featuresEn" TEXT,
ADD COLUMN     "longDescriptionEn" TEXT,
ADD COLUMN     "nameEn" TEXT;

-- CreateTable
CREATE TABLE "JobApplication" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "linkedin" TEXT,
    "areas" TEXT[],
    "motivation" TEXT,
    "cvFile" BYTEA,
    "cvFileName" TEXT,
    "cvMimeType" TEXT,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobApplication_pkey" PRIMARY KEY ("id")
);
