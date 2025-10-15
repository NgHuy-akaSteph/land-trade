BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[users] (
    [id] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(100) NOT NULL,
    [fullName] NVARCHAR(255) NOT NULL,
    [password] NVARCHAR(500) NOT NULL,
    [roleId] NVARCHAR(1000) NOT NULL,
    [phone] NVARCHAR(20) NOT NULL,
    [avatarId] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [users_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [isDeleted] BIT NOT NULL CONSTRAINT [users_isDeleted_df] DEFAULT 0,
    CONSTRAINT [users_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [users_email_key] UNIQUE NONCLUSTERED ([email]),
    CONSTRAINT [users_phone_key] UNIQUE NONCLUSTERED ([phone])
);

-- CreateTable
CREATE TABLE [dbo].[roles] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [roles_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [isDeleted] BIT NOT NULL CONSTRAINT [roles_isDeleted_df] DEFAULT 0,
    CONSTRAINT [roles_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [roles_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[listings] (
    [id] NVARCHAR(1000) NOT NULL,
    [title] NVARCHAR(255) NOT NULL,
    [address] NVARCHAR(1000) NOT NULL,
    [price] FLOAT(53) NOT NULL,
    [description] TEXT,
    [direction] NVARCHAR(1000) NOT NULL,
    [frontage] FLOAT(53),
    [depth] FLOAT(53),
    [area] FLOAT(53) NOT NULL,
    [latitude] FLOAT(53),
    [longitude] FLOAT(53),
    [authorId] NVARCHAR(1000) NOT NULL,
    [propTypesId] NVARCHAR(1000) NOT NULL,
    [status] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [listings_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [isDeleted] BIT NOT NULL CONSTRAINT [listings_isDeleted_df] DEFAULT 0,
    CONSTRAINT [listings_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[property_types] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [property_types_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [isDeleted] BIT NOT NULL CONSTRAINT [property_types_isDeleted_df] DEFAULT 0,
    CONSTRAINT [property_types_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [property_types_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[images] (
    [id] NVARCHAR(1000) NOT NULL,
    [url] NVARCHAR(3000) NOT NULL,
    [listingId] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [images_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [isDeleted] BIT NOT NULL CONSTRAINT [images_isDeleted_df] DEFAULT 0,
    CONSTRAINT [images_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[transactions] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [listingId] NVARCHAR(1000) NOT NULL,
    [customerId] NVARCHAR(1000) NOT NULL,
    [sellerId] NVARCHAR(1000) NOT NULL,
    [price] FLOAT(53) NOT NULL,
    [status] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [transactions_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [isDeleted] BIT NOT NULL CONSTRAINT [transactions_isDeleted_df] DEFAULT 0,
    CONSTRAINT [transactions_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[messages] (
    [id] NVARCHAR(1000) NOT NULL,
    [senderId] NVARCHAR(1000) NOT NULL,
    [receiverId] NVARCHAR(1000) NOT NULL,
    [content] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [messages_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [isDeleted] BIT NOT NULL CONSTRAINT [messages_isDeleted_df] DEFAULT 0,
    CONSTRAINT [messages_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[users] ADD CONSTRAINT [users_roleId_fkey] FOREIGN KEY ([roleId]) REFERENCES [dbo].[roles]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[users] ADD CONSTRAINT [users_avatarId_fkey] FOREIGN KEY ([avatarId]) REFERENCES [dbo].[images]([id]) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[listings] ADD CONSTRAINT [listings_authorId_fkey] FOREIGN KEY ([authorId]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[listings] ADD CONSTRAINT [listings_propTypesId_fkey] FOREIGN KEY ([propTypesId]) REFERENCES [dbo].[property_types]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[images] ADD CONSTRAINT [images_listingId_fkey] FOREIGN KEY ([listingId]) REFERENCES [dbo].[listings]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[transactions] ADD CONSTRAINT [transactions_listingId_fkey] FOREIGN KEY ([listingId]) REFERENCES [dbo].[listings]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[transactions] ADD CONSTRAINT [transactions_customerId_fkey] FOREIGN KEY ([customerId]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[transactions] ADD CONSTRAINT [transactions_sellerId_fkey] FOREIGN KEY ([sellerId]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[messages] ADD CONSTRAINT [messages_senderId_fkey] FOREIGN KEY ([senderId]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[messages] ADD CONSTRAINT [messages_receiverId_fkey] FOREIGN KEY ([receiverId]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
