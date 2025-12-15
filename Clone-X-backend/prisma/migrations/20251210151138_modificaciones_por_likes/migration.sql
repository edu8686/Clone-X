/*
  Warnings:

  - You are about to drop the column `likes` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `likes` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `_UserLikesPost` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_UserLikesPost" DROP CONSTRAINT "_UserLikesPost_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_UserLikesPost" DROP CONSTRAINT "_UserLikesPost_B_fkey";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "likes",
ADD COLUMN     "numLikes" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "likes",
ADD COLUMN     "numLikes" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "public"."_UserLikesPost";

-- CreateTable
CREATE TABLE "Like" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Like_userId_postId_key" ON "Like"("userId", "postId");

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
