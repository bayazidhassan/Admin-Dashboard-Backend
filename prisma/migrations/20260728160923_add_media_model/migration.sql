-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "storedPath" TEXT NOT NULL,
    "publicUrl" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "thumbnail" TEXT,
    "altText" TEXT,
    "title" TEXT,
    "uploadedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
