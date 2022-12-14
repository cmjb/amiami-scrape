-- CreateTable
CREATE TABLE "Figure" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Figure_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Figure_code_key" ON "Figure"("code");
