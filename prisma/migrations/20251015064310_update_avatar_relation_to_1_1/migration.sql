/*
  Warnings:

  - A unique constraint covering the columns `[avatarId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
BEGIN TRY

BEGIN TRAN;

-- CreateIndex
ALTER TABLE [dbo].[users] ADD CONSTRAINT [users_avatarId_key] UNIQUE NONCLUSTERED ([avatarId]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
