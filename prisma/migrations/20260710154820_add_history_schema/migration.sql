-- CreateTable
CREATE TABLE "entities" (
    "id" SERIAL NOT NULL,
    "entityType" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "altNames" TEXT[],
    "description" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zip" TEXT,
    "lat" DECIMAL(9,6),
    "lng" DECIMAL(9,6),
    "geoSource" TEXT,
    "activeStart" TIMESTAMP(3),
    "activeEnd" TIMESTAMP(3),
    "sourceTier" TEXT NOT NULL DEFAULT 'RC',
    "sourceNote" TEXT,
    "sourceUrl" TEXT,
    "domains" TEXT[],
    "bookChapter" TEXT,
    "timelineEntry" BOOLEAN NOT NULL DEFAULT false,
    "mapPin" BOOLEAN NOT NULL DEFAULT true,
    "familyStory" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "entities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "eventType" TEXT NOT NULL,
    "eventDate" TIMESTAMP(3),
    "eventDateEnd" TIMESTAMP(3),
    "datePrecision" TEXT NOT NULL DEFAULT 'day',
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "lat" DECIMAL(9,6),
    "lng" DECIMAL(9,6),
    "dollarAmount" BIGINT,
    "dollarNote" TEXT,
    "sourceTier" TEXT NOT NULL DEFAULT 'RC',
    "sourceNote" TEXT,
    "sourceUrl" TEXT,
    "domains" TEXT[],
    "timelineVisible" BOOLEAN NOT NULL DEFAULT true,
    "mapVisible" BOOLEAN NOT NULL DEFAULT true,
    "significance" INTEGER NOT NULL DEFAULT 3,
    "bookChapter" TEXT,
    "familyStory" BOOLEAN NOT NULL DEFAULT false,
    "era" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "relationships" (
    "id" SERIAL NOT NULL,
    "fromEntityId" INTEGER,
    "toEntityId" INTEGER,
    "relationshipType" TEXT NOT NULL,
    "description" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "sourceTier" TEXT NOT NULL DEFAULT 'RC',
    "sourceNote" TEXT,
    "sourceUrl" TEXT,
    "isConflict" BOOLEAN NOT NULL DEFAULT false,
    "conflictNote" TEXT,
    "weight" INTEGER NOT NULL DEFAULT 1,
    "visibleOnMap" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "relationships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "context_layers" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "layerType" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "scope" TEXT NOT NULL DEFAULT 'lansing',
    "sourceTier" TEXT NOT NULL DEFAULT 'S',
    "sourceNote" TEXT,
    "sourceUrl" TEXT,
    "colorCode" TEXT,
    "opacity" DECIMAL(3,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "context_layers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_context" (
    "eventId" INTEGER NOT NULL,
    "contextId" INTEGER NOT NULL,

    CONSTRAINT "event_context_pkey" PRIMARY KEY ("eventId","contextId")
);

-- CreateTable
CREATE TABLE "entity_events" (
    "entityId" INTEGER NOT NULL,
    "eventId" INTEGER NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "entity_events_pkey" PRIMARY KEY ("entityId","eventId","role")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "docType" TEXT,
    "sourceName" TEXT,
    "sourceUrl" TEXT,
    "publicationDate" TIMESTAMP(3),
    "sourceTier" TEXT NOT NULL DEFAULT 'S',
    "entityId" INTEGER,
    "eventId" INTEGER,
    "excerpt" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dollar_flows" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "flowType" TEXT,
    "amountCents" BIGINT,
    "fromEntityId" INTEGER,
    "toEntityId" INTEGER,
    "eventId" INTEGER,
    "flowDate" TIMESTAMP(3),
    "flowDateEnd" TIMESTAMP(3),
    "isPublicCost" BOOLEAN NOT NULL DEFAULT false,
    "isPrivateGain" BOOLEAN NOT NULL DEFAULT false,
    "sourceTier" TEXT NOT NULL DEFAULT 'RC',
    "sourceNote" TEXT,
    "sourceUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dollar_flows_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "relationships" ADD CONSTRAINT "relationships_fromEntityId_fkey" FOREIGN KEY ("fromEntityId") REFERENCES "entities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relationships" ADD CONSTRAINT "relationships_toEntityId_fkey" FOREIGN KEY ("toEntityId") REFERENCES "entities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_context" ADD CONSTRAINT "event_context_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_context" ADD CONSTRAINT "event_context_contextId_fkey" FOREIGN KEY ("contextId") REFERENCES "context_layers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entity_events" ADD CONSTRAINT "entity_events_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "entities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entity_events" ADD CONSTRAINT "entity_events_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "entities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dollar_flows" ADD CONSTRAINT "dollar_flows_fromEntityId_fkey" FOREIGN KEY ("fromEntityId") REFERENCES "entities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dollar_flows" ADD CONSTRAINT "dollar_flows_toEntityId_fkey" FOREIGN KEY ("toEntityId") REFERENCES "entities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dollar_flows" ADD CONSTRAINT "dollar_flows_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE SET NULL ON UPDATE CASCADE;
