USE [aimhis]
GO
/****** Object:  UserDefinedFunction [dbo].[InlineMax]    Script Date: 22-2-2021 17:19:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
go

create schema his
go
create schema item
go
create schema corona
go
create schema om
go


GO
--UPDATE corona.reg SET departure = cast(date as datetime) + cast(departure as datetime)
CREATE FUNCTION [dbo].[InlineMax](@val1 int, @val2 int)
returns int
as
begin
  if @val1 > @val2
    return @val1
  return isnull(@val2,@val1)
end

GO
/****** Object:  UserDefinedFunction [dbo].[InlineMin]    Script Date: 22-2-2021 17:19:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE FUNCTION [dbo].[InlineMin](@val1 int, @val2 int)
returns int
as
begin
  if @val1 < @val2
    return @val1
  return isnull(@val2,@val1)
end

GO
/****** Object:  Table [corona].[reg]    Script Date: 22-2-2021 17:19:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [corona].[reg](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[code] [uniqueidentifier] NULL,
	[date] [date] NULL,
	[arrival] [time](7) NULL,
	[departure] [datetime] NULL,
	[preferred_username] [varchar](500) NULL,
	[email] [varchar](500) NULL,
	[phone_number] [varchar](500) NULL,
	[data] [text] NULL,
 CONSTRAINT [PK_log] PRIMARY KEY CLUSTERED
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[camfile]    Script Date: 22-2-2021 17:19:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[camfile](
	[ts] [timestamp] NOT NULL,
	[camId] [bigint] NULL,
	[startDateTime] [datetime] NULL,
	[duration] [bigint] NULL,
	[filename] [varchar](500) NULL,
 CONSTRAINT [PK_camfile] PRIMARY KEY CLUSTERED
(
	[ts] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[qr]    Script Date: 22-2-2021 17:19:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[qr](
	[code] [uniqueidentifier] NOT NULL,
	[email] [varchar](500) NULL,
	[tag] [varchar](500) NULL,
	[data] [text] NULL,
 CONSTRAINT [PK_qr] PRIMARY KEY CLUSTERED
(
	[code] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[reg]    Script Date: 22-2-2021 17:19:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[reg](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[code] [uniqueidentifier] NULL,
	[datum] [date] NULL,
	[aankomst] [time](7) NULL,
	[vertrek] [time](7) NULL,
	[preferred_username] [varchar](500) NULL,
	[email] [varchar](500) NULL,
	[phone_number] [varchar](500) NULL,
	[data] [text] NULL,
 CONSTRAINT [PK_log] PRIMARY KEY CLUSTERED
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [his].[export]    Script Date: 22-2-2021 17:19:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [his].[export](
	[client_id] [bigint] NOT NULL,
	[id] [bigint] NOT NULL,
	[export_dt] [datetime] NULL,
	[periode] [int] NULL CONSTRAINT [DF_export_periode]  DEFAULT (datepart(year,getdate())*(100)+datepart(month,getdate())),
 CONSTRAINT [PK_export] PRIMARY KEY CLUSTERED
(
	[client_id] ASC,
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [his].[link]    Script Date: 22-2-2021 17:19:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [his].[link](
	[ts] [timestamp] NOT NULL,
	[address] [varchar](500) NULL,
	[url] [varchar](8000) NULL,
	[createdDateTime] [datetime] NULL CONSTRAINT [DF_link_createdDateTime]  DEFAULT (getdate()),
	[userId] [bigint] NULL,
 CONSTRAINT [PK_link] PRIMARY KEY CLUSTERED
(
	[ts] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [his].[req]    Script Date: 22-2-2021 17:19:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [his].[req](
	[ts] [timestamp] NOT NULL,
	[createdDT] [datetime] NULL CONSTRAINT [DF_req_createdDT]  DEFAULT (getdate()),
	[client_id] [bigint] NULL,
	[aud] [bigint] NULL,
	[sub] [bigint] NULL,
	[method] [varchar](10) NULL,
	[url] [varchar](max) NULL,
	[periode] [int] NULL CONSTRAINT [DF_req_periode]  DEFAULT (datepart(year,getdate())*(100)+datepart(month,getdate())),
	[id] [bigint] NULL,
	[host] [varchar](50) NULL,
 CONSTRAINT [PK_requests] PRIMARY KEY CLUSTERED
(
	[ts] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [item].[attribute]    Script Date: 22-2-2021 17:19:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [item].[attribute](
	[ID] [bigint] NOT NULL,
	[ItemID] [bigint] NULL,
	[NameID] [int] NULL,
	[HostID] [bigint] NULL,
	[CreatedDateTime] [datetime] NULL CONSTRAINT [DF_attribute_CreatedDateTime]  DEFAULT (getutcdate()),
	[LastModifiedDateTime] [datetime] NULL,
	[LastModifiedByID] [bigint] NULL,
	[UserID] [bigint] NULL,
	[LinkID] [bigint] NULL,
	[ClassID] [bigint] NULL,
	[Scope] [varchar](500) NULL,
	[Data] [varchar](max) NULL,
	[Value] [nvarchar](max) NULL,
	[DeletedDateTime] [datetime] NULL,
	[ts] [timestamp] NOT NULL,
 CONSTRAINT [PK_attribute] PRIMARY KEY CLUSTERED
(
	[ts] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [om].[attributes]    Script Date: 22-2-2021 17:19:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [om].[attributes](
	[ts] [timestamp] NOT NULL,
	[aid] [int] NULL,
	[value] [varchar](max) NULL,
	[itemID] [int] NULL,
	[userID] [int] NULL,
	[modifiedDT] [datetime] NULL CONSTRAINT [DF_attributes_modifiedDT]  DEFAULT (getutcdate()),
	[modifiedById] [int] NULL,
 CONSTRAINT [PK_attributes] PRIMARY KEY CLUSTERED
(
	[ts] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [om].[event]    Script Date: 22-2-2021 17:19:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [om].[event](
	[ts] [timestamp] NOT NULL,
	[LogID] [bigint] IDENTITY(1,1) NOT NULL,
	[LogDateTime] [datetime] NULL CONSTRAINT [DF_event_LogDateTime_1]  DEFAULT (getutcdate()),
	[ID] [bigint] NULL,
	[AttributeID] [bigint] NULL,
	[ItemID] [bigint] NULL,
	[UserID] [bigint] NULL,
	[Value] [varchar](max) NULL,
	[Method] [varchar](500) NULL,
	[Step] [varchar](50) NULL,
	[Data] [varchar](max) NULL,
	[Path] [varchar](max) NULL,
	[Tag] [varchar](50) NULL,
 CONSTRAINT [PK_event] PRIMARY KEY CLUSTERED
(
	[ts] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [om].[items]    Script Date: 22-2-2021 17:19:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [om].[items](
	[ts] [timestamp] NOT NULL,
	[id] [int] NOT NULL,
	[startDt] [datetime] NULL,
	[endDt] [datetime] NULL,
	[finishDT] [datetime] NULL,
	[userID] [int] NULL,
	[modifiedDT] [datetime] NULL CONSTRAINT [DF_items_modifiedDT]  DEFAULT (getutcdate()),
	[modifiedByID] [int] NULL,
 CONSTRAINT [PK_items] PRIMARY KEY CLUSTERED
(
	[ts] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [om].[requests]    Script Date: 22-2-2021 17:19:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [om].[requests](
	[ts] [timestamp] NOT NULL,
	[createdDT] [datetime] NULL CONSTRAINT [DF_requests_createdDT]  DEFAULT (getutcdate()),
	[client_id] [bigint] NULL,
	[aud] [bigint] NULL,
	[sub] [bigint] NULL,
	[method] [varchar](10) NULL,
	[url] [varchar](max) NULL,
 CONSTRAINT [PK_requests] PRIMARY KEY CLUSTERED
(
	[ts] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  View [corona].[vw]    Script Date: 22-2-2021 17:19:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE VIEW [corona].[vw]
AS
SELECT C.*,
cast(C.date as datetime) + cast(C.arrival as datetime) startDatetime,
--cast(C.date as datetime) + cast(C.departure as datetime) endDatetime,
C.departure endDatetime,
QR.email AS locationEmail,
QR.tag AS locationTag
FROM corona.reg C
LEFT OUTER JOIN dbo.qr QR ON QR.code = C.code

GO
/****** Object:  StoredProcedure [corona].[analyse]    Script Date: 22-2-2021 17:19:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [corona].[analyse] @email VARCHAR(500), @date DATETIME
AS
--	SELECT DISTINCT email FROM corona.reg C WHERE C.date>=@date AND C.email=@email
	DECLARE @C TABLE (
		level TINYINT,
		code uniqueidentifier,
		sourceStartDatetime DATETIME,
		sourceEndDatetime DATETIME,
		sourceEmail VARCHAR(500),
		startDatetime DATETIME,
		endDatetime DATETIME,
		email VARCHAR(500),
		contactStartDatetime DATETIME,
		contactEndDatetime DATETIME,
		kans TINYINT,
		sourceKans TINYINT
	)

	INSERT @C (level,code,startDatetime,endDatetime,email,kans)
	SELECT 0, C.code, C.startDatetime, C.endDatetime, C.email, 100
	FROM corona.vw C
	WHERE C.date>=@date AND C.email=@email


	DECLARE @i TINYINT
	SET @i=1
	WHILE @i<10
	BEGIN
		INSERT @C
		SELECT @i, C1.code, P.startDatetime, P.endDatetime, P.email,  C1.startDatetime, C1.endDatetime, C1.email
			,CASE WHEN C1.startDatetime > P.startDatetime THEN C1.startDatetime ELSE P.startDatetime END
			,CASE WHEN C1.endDatetime < P.endDatetime THEN C1.endDatetime ELSE P.endDatetime END
			,P.kans * dbo.InlineMin(200,DATEDIFF(minute, CASE WHEN C1.startDatetime > P.startDatetime THEN C1.startDatetime ELSE P.startDatetime END, CASE WHEN C1.endDatetime < P.endDatetime THEN C1.endDatetime ELSE P.endDatetime END)) / 200
			,P.kans
		FROM @C P
		INNER JOIN corona.vw C1 ON
			C1.code = P.code
			AND C1.endDatetime >= P.startDatetime
			AND C1.startDatetime <= P.endDatetime
			AND C1.email NOT IN (SELECT DISTINCT email FROM @C)

		INSERT @C
		SELECT @i, C1.code, NULL, NULL, NULL,  C1.startDatetime, C1.endDatetime, C1.email
			,CASE WHEN C1.startDatetime > P.startDatetime THEN C1.startDatetime ELSE P.startDatetime END
			,CASE WHEN C1.endDatetime < P.endDatetime THEN C1.endDatetime ELSE P.endDatetime END
			,P.kans
			,P.kans
		FROM @C P
		INNER JOIN corona.vw C1 ON
			P.level = @i
			AND C1.email = P.email
			AND C1.startDatetime >= P.endDatetime

		SET @i = @i+1
	END

	SELECT
	level
	,sourceEmail
	,DATEDIFF (day, @date, contactStartDatetime) AS days
	--,CAST (contactStartDatetime AS DATE) AS datum
	,CAST (contactEndDatetime - contactStartDatetime AS TIME) AS duration
	,email
	,kans
	,sourceKans
	FROM @c P
	WHERE P.level>0
	AND sourceEmail IS NOT NULL

GO
