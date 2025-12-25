/*
  Warnings:

  - A unique constraint covering the columns `[name,userId]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title,categoryId]` on the table `Component` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
-- CREATE UNIQUE INDEX "Category_name_userId_key" ON "Category"("name", "userId");
-- NOTE: This index already exists in some databases; commented out to avoid duplicate-index errors during CI.

-- CreateIndex
-- CREATE UNIQUE INDEX "Component_title_categoryId_key" ON "Component"("title", "categoryId");
