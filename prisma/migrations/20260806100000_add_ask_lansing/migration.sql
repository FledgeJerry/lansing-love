CREATE TABLE "ChatLog" (
  "id" TEXT NOT NULL,
  "userMessage" TEXT NOT NULL,
  "botResponse" TEXT NOT NULL,
  "flagged" BOOLEAN NOT NULL DEFAULT false,
  "adminNote" TEXT,
  "promoted" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ChatLog_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SiteConfig" (
  "key" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "SiteConfig_pkey" PRIMARY KEY ("key")
);
