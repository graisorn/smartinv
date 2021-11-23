CREATE DATABASE smartinvdb
GO
USE smartinvdb
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[products](
    [ProductID] [int] IDENTITY(1,1) NOT NULL,
    [CategoryID] [int] NULL,
    [ProductName] [nvarchar](50) NULL,
    [UnitPrice] [decimal](18, 0) NULL,
    [ProductPicture] [varchar](1024) NULL,
    [UnitInStock] [int] NULL,
    [CreatedDate] [datetime] NULL,
    [ModifiedDate] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
    [ProductID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
)
GO