-- AlterTable
ALTER TABLE "Shape" ADD COLUMN     "radius" INTEGER,
ALTER COLUMN "height" DROP NOT NULL,
ALTER COLUMN "width" DROP NOT NULL;
