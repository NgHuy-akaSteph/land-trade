BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[users] ALTER COLUMN [phone] NVARCHAR(20) NULL;

-- CreateTable
CREATE TABLE [dbo].[social_links] (
    [id] NVARCHAR(1000) NOT NULL,
    [type] NVARCHAR(100) NOT NULL,
    [url] NVARCHAR(1000) NOT NULL,
    [userId] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [social_links_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [isDeleted] BIT NOT NULL CONSTRAINT [social_links_isDeleted_df] DEFAULT 0,
    CONSTRAINT [social_links_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[social_links] ADD CONSTRAINT [social_links_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
