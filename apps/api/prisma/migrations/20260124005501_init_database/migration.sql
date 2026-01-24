-- DropForeignKey
ALTER TABLE "Component" DROP CONSTRAINT "Component_categoryId_fkey";

-- AddForeignKey
ALTER TABLE "Component" ADD CONSTRAINT "Component_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
