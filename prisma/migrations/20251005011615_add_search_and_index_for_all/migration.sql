/*
  Warnings:

  - You are about to alter the column `content` on the `messages` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(1000)` to `Text`.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[listings] ADD [titleSearch] NVARCHAR(1000);

-- AlterTable
ALTER TABLE [dbo].[messages] ALTER COLUMN [content] TEXT NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[transactions] ADD [nameSearch] NVARCHAR(1000);

-- AlterTable
ALTER TABLE [dbo].[users] ADD [nameSearch] NVARCHAR(1000);

-- CreateIndex
CREATE NONCLUSTERED INDEX [listings_titleSearch_idx] ON [dbo].[listings]([titleSearch]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [listings_authorId_isDeleted_createdAt_idx] ON [dbo].[listings]([authorId], [isDeleted], [createdAt]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [listings_latitude_longitude_idx] ON [dbo].[listings]([latitude], [longitude]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [messages_senderId_createdAt_idx] ON [dbo].[messages]([senderId], [createdAt]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [transactions_nameSearch_idx] ON [dbo].[transactions]([nameSearch]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [transactions_customerId_createdAt_idx] ON [dbo].[transactions]([customerId], [createdAt]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [transactions_sellerId_createdAt_idx] ON [dbo].[transactions]([sellerId], [createdAt]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [users_nameSearch_idx] ON [dbo].[users]([nameSearch]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [users_roleId_idx] ON [dbo].[users]([roleId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [users_isDeleted_createdAt_idx] ON [dbo].[users]([isDeleted], [createdAt]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
