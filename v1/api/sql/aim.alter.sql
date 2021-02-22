USE AIM
GO
ALTER FUNCTION [api].[getDefinitionTable](@object_id INT) RETURNS VARCHAR(MAX)   
AS   
BEGIN   
DECLARE @SQL                                NVARCHAR(MAX) = N''   
DECLARE @GenerateFKs                        bit = 1;   
DECLARE @UseSourceCollation                 bit = 1;   
DECLARE @GenerateIdentity                   bit = 1;   
DECLARE @GenerateIndexes                    bit = 1;   
DECLARE @GenerateConstraints                bit = 1;   
DECLARE @GenerateKeyConstraints             bit = 1;   
DECLARE @AssignConstraintNameOfDefaults     bit = 1;   
DECLARE @AddDropIfItExists                  bit = 0;   
   
;WITH index_column AS    
(   
    SELECT    
          ic.[object_id]   
        , ic.index_id   
        , ic.is_descending_key   
        , ic.is_included_column   
        , c.name   
    FROM sys.index_columns ic WITH(NOWAIT)   
    JOIN sys.columns c WITH(NOWAIT) ON ic.[object_id] = c.[object_id] AND ic.column_id = c.column_id   
    WHERE ic.[object_id] = @object_id   
),   
fk_columns AS    
(   
     SELECT    
          k.constraint_object_id   
        , cname = c.name   
        , rcname = rc.name   
    FROM sys.foreign_key_columns k WITH(NOWAIT)   
    JOIN sys.columns rc WITH(NOWAIT) ON rc.[object_id] = k.referenced_object_id AND rc.column_id = k.referenced_column_id    
    JOIN sys.columns c WITH(NOWAIT) ON c.[object_id] = k.parent_object_id AND c.column_id = k.parent_column_id   
    WHERE k.parent_object_id = @object_id and @GenerateFKs = 1   
)   
SELECT @SQL =    
    --------------------  DROP IS Exists --------------------------------------------------------------------------------------------------   
        CASE WHEN @AddDropIfItExists = 1   
        THEN    
            --Drop table if exists   
            CAST(   
                N'IF OBJECT_ID(''' + quotename(OBJECT_schema_name(@object_id)) + N'.' + quotename(OBJECT_NAME(@object_id)) + N''') IS NOT NULL DROP TABLE ' + quotename(OBJECT_schema_name(@object_id)) + N'.' + quotename(OBJECT_NAME(@object_id)) + N';' + NCHAR(13)    
            as nvarchar(max))   
            +   
            --Drop foreign keys   
            ISNULL(((   
                SELECT    
                    CAST(   
                        N'ALTER TABLE ' + quotename(s.name) + N'.' + quotename(t.name) + N' DROP CONSTRAINT ' + RTRIM(f.name) + N';' + NCHAR(13)   
                    as nvarchar(max))   
                FROM sys.tables t   
                INNER JOIN sys.foreign_keys f ON f.parent_object_id = t.object_id   
                INNER JOIN sys.schemas      s ON s.schema_id = f.schema_id   
                WHERE f.referenced_object_id = @object_id   
                FOR XML PATH(N''), TYPE).value(N'.', N'NVARCHAR(MAX)'))   
            ,N'') + NCHAR(13)   
        ELSE   
            --Create if table not exists   
            CAST(   
                N'IF OBJECT_ID(''' + quotename(OBJECT_schema_name(@object_id)) + N'.' + quotename(OBJECT_NAME(@object_id)) + N''') IS NULL '  
            as nvarchar(max)) + NCHAR(13)   
		END    
    +   
    --------------------- CREATE TABLE -----------------------------------------------------------------------------------------------------------------   
    CAST(   
            N'BEGIN ' + NCHAR(13)+ N'CREATE TABLE ' + quotename(OBJECT_schema_name(@object_id)) + N'.' + quotename(OBJECT_NAME(@object_id)) + NCHAR(13) + N'(' + NCHAR(13) + STUFF((   
            SELECT    
                CAST(   
                    NCHAR(9) + N',' + quotename(c.name) + N' ' +    
                    CASE WHEN c.is_computed = 1   
                        THEN N' AS ' + cc.[definition]    
                        ELSE UPPER(tp.name) +    
                            CASE WHEN tp.name IN(N'varchar', N'char', N'varbinary', N'binary', N'text')   
                                    THEN N'(' + CASE WHEN c.max_length = -1 THEN N'MAX' ELSE CAST(c.max_length AS NVARCHAR(5)) END + N')'   
                                    WHEN tp.name IN(N'nvarchar', N'nchar', N'ntext')   
                                    THEN N'(' + CASE WHEN c.max_length = -1 THEN N'MAX' ELSE CAST(c.max_length / 2 AS NVARCHAR(5)) END + N')'   
                                    WHEN tp.name IN(N'datetime2', N'time2', N'datetimeoffset')    
                                    THEN N'(' + CAST(c.scale AS NVARCHAR(5)) + N')'   
                                    WHEN tp.name = N'decimal'    
                                    THEN N'(' + CAST(c.[precision] AS NVARCHAR(5)) + N',' + CAST(c.scale AS NVARCHAR(5)) + N')'   
                                ELSE N''   
                            END +   
                            CASE WHEN c.collation_name IS NOT NULL and @UseSourceCollation = 1 THEN N' COLLATE ' + c.collation_name ELSE N'' END +   
                            CASE WHEN c.is_nullable = 1 THEN N' NULL' ELSE N' NOT NULL' END +   
                            CASE WHEN dc.[definition] IS NOT NULL THEN CASE WHEN @AssignConstraintNameOfDefaults = 1 THEN N' CONSTRAINT ' + quotename(dc.name) ELSE N'' END + N' DEFAULT' + dc.[definition] ELSE N'' END +    
                            CASE WHEN ic.is_identity = 1 and @GenerateIdentity = 1 THEN N' IDENTITY(' + CAST(ISNULL(ic.seed_value, N'0') AS NCHAR(1)) + N',' + CAST(ISNULL(ic.increment_value, N'1') AS NCHAR(1)) + N')' ELSE N'' END    
                    END + NCHAR(13)   
                AS nvarchar(Max))   
            FROM sys.columns c WITH(NOWAIT)   
                INNER JOIN sys.types tp WITH(NOWAIT) ON c.user_type_id = tp.user_type_id   
                LEFT JOIN sys.computed_columns cc WITH(NOWAIT) ON c.[object_id] = cc.[object_id] AND c.column_id = cc.column_id   
                LEFT JOIN sys.default_constraints dc WITH(NOWAIT) ON c.default_object_id != 0 AND c.[object_id] = dc.parent_object_id AND c.column_id = dc.parent_column_id   
                LEFT JOIN sys.identity_columns ic WITH(NOWAIT) ON c.is_identity = 1 AND c.[object_id] = ic.[object_id] AND c.column_id = ic.column_id   
            WHERE c.[object_id] = @object_id   
            ORDER BY c.column_id   
            FOR XML PATH(N''), TYPE).value(N'.', N'NVARCHAR(MAX)'), 1, 2, NCHAR(9) + N' ')   
    as nvarchar(max))   
    +    
	  
    ---------------------- Key Constraints ----------------------------------------------------------------   
    CAST(   
        case when @GenerateKeyConstraints <> 1 THEN N'' ELSE    
            ISNULL((SELECT NCHAR(9) + N', CONSTRAINT ' + quotename(k.name) + N' PRIMARY KEY ' + ISNULL(kidx.type_desc, N'') + N'(' +    
                       (SELECT STUFF((   
                             SELECT N', ' + quotename(c.name) + N' ' + CASE WHEN ic.is_descending_key = 1 THEN N'DESC' ELSE N'ASC' END   
                             FROM sys.index_columns ic WITH(NOWAIT)   
                             JOIN sys.columns c WITH(NOWAIT) ON c.[object_id] = ic.[object_id] AND c.column_id = ic.column_id   
                             WHERE ic.is_included_column = 0   
                                 AND ic.[object_id] = k.parent_object_id    
                                 AND ic.index_id = k.unique_index_id        
                             FOR XML PATH(N''), TYPE).value(N'.', N'NVARCHAR(MAX)'), 1, 2, N''))   
                + N')' + NCHAR(13)   
                FROM sys.key_constraints k WITH(NOWAIT) LEFT JOIN sys.indexes kidx ON   
                    k.parent_object_id = kidx.object_id and k.unique_index_id = kidx.index_id   
                WHERE k.parent_object_id = @object_id    
                    AND k.[type] = N'PK'), N'') + N')'  + NCHAR(13)   
        END    
    as nvarchar(max))   
    +    
    --------------------- FOREIGN KEYS -----------------------------------------------------------------------------------------------------------------   
    CAST(   
        ISNULL((SELECT(   
            SELECT NCHAR(13) +   
             N'ALTER TABLE ' + + quotename(OBJECT_schema_name(@object_id)) + N'.' + quotename(OBJECT_NAME(@object_id)) + + N' WITH'    
            + CASE WHEN fk.is_not_trusted = 1    
                THEN N' NOCHECK'    
                ELSE N' CHECK'    
              END +    
              N' ADD CONSTRAINT ' + quotename(fk.name)  + N' FOREIGN KEY('    
              + STUFF((   
                SELECT N', ' + quotename(k.cname) + N''   
                FROM fk_columns k   
                WHERE k.constraint_object_id = fk.[object_id]   
                FOR XML PATH(N''), TYPE).value(N'.', N'NVARCHAR(MAX)'), 1, 2, N'')   
               + N')' +   
              N' REFERENCES ' + quotename(SCHEMA_NAME(ro.[schema_id])) + N'.' + quotename(ro.name) + N'('   
              + STUFF((   
                SELECT N', ' + quotename(k.rcname) + N''   
                FROM fk_columns k   
                WHERE k.constraint_object_id = fk.[object_id]   
                FOR XML PATH(N''), TYPE).value(N'.', N'NVARCHAR(MAX)'), 1, 2, N'')   
               + N')'   
            + CASE    
                WHEN fk.delete_referential_action = 1 THEN N' ON DELETE CASCADE'    
                WHEN fk.delete_referential_action = 2 THEN N' ON DELETE SET NULL'   
                WHEN fk.delete_referential_action = 3 THEN N' ON DELETE SET DEFAULT'    
                ELSE N''    
              END   
            + CASE    
                WHEN fk.update_referential_action = 1 THEN N' ON UPDATE CASCADE'   
                WHEN fk.update_referential_action = 2 THEN N' ON UPDATE SET NULL'   
                WHEN fk.update_referential_action = 3 THEN N' ON UPDATE SET DEFAULT'     
                ELSE N''    
              END    
            + NCHAR(13) + N'ALTER TABLE ' + + quotename(OBJECT_schema_name(@object_id)) + N'.' + quotename(OBJECT_NAME(@object_id)) + + N' CHECK CONSTRAINT ' + quotename(fk.name)  + N'' + NCHAR(13)   
        FROM sys.foreign_keys fk WITH(NOWAIT)   
        JOIN sys.objects ro WITH(NOWAIT) ON ro.[object_id] = fk.referenced_object_id   
        WHERE fk.parent_object_id = @object_id   
        FOR XML PATH(N''), TYPE).value(N'.', N'NVARCHAR(MAX)')), N'')   
    as nvarchar(max))   
    +    
    --------------------- INDEXES ----------------------------------------------------------------------------------------------------------   
    CAST(   
        ISNULL(((SELECT   
             NCHAR(13) + N'CREATE' + CASE WHEN i.is_unique = 1 THEN N' UNIQUE ' ELSE N' ' END    
                    + i.type_desc + N' INDEX ' + quotename(i.name) + N' ON ' + + quotename(OBJECT_schema_name(@object_id)) + N'.' + quotename(OBJECT_NAME(@object_id)) + + N'(' +   
                    STUFF((   
                    SELECT N', ' + quotename(c.name) + N'' + CASE WHEN c.is_descending_key = 1 THEN N' DESC' ELSE N' ASC' END   
                    FROM index_column c   
                    WHERE c.is_included_column = 0   
                        AND c.index_id = i.index_id   
                    FOR XML PATH(N''), TYPE).value(N'.', N'NVARCHAR(MAX)'), 1, 2, N'') + N')'     
                    + ISNULL(NCHAR(13) + N'INCLUDE(' +    
                        STUFF((   
                        SELECT N', ' + quotename(c.name) + N''   
                        FROM index_column c   
                        WHERE c.is_included_column = 1   
                            AND c.index_id = i.index_id   
                        FOR XML PATH(N''), TYPE).value(N'.', N'NVARCHAR(MAX)'), 1, 2, N'') + N')', N'')  + NCHAR(13)   
            FROM sys.indexes i WITH(NOWAIT)   
            WHERE i.[object_id] = @object_id   
                AND i.is_primary_key = 0   
                AND i.[type] in(1,2)   
                and @GenerateIndexes = 1   
            FOR XML PATH(N''), TYPE).value(N'.', N'NVARCHAR(MAX)')   
        ), N'')   
    as nvarchar(max))   
	+ NCHAR(13) + N'END' + NCHAR(13)  
	RETURN CONVERT(TEXT,@sql)   
END 

GO

ALTER FUNCTION [fn].[CharAtIndex](@line VARCHAR(5000),@pos TINYINT,@delimeter CHAR(1) = ' ')   
RETURNS VARCHAR(255)   
AS   
BEGIN   
	DECLARE @Result VARCHAR(255)   
	DECLARE @charpos INT   
	DECLARE @i INT   
	SET @i=0   
	WHILE @i<@pos   
	BEGIN   
		SET @i=@i+1;   
		SET @charpos = CHARINDEX(@delimeter,@line)   
		SET @line=SUBSTRING(@line,@charpos+1,99999)   
	END   
	SET @charpos = CHARINDEX(@delimeter,@line+@delimeter)   
	SET @Result=SUBSTRING(@line,0,@charpos)   
	RETURN @Result   
END 

GO

ALTER PROCEDURE [api].[getItemPivot] @where VARCHAR(MAX), @cols VARCHAR(MAX), @order VARCHAR(MAX) = ''   
AS   
	DECLARE @query  AS NVARCHAR(MAX)   
	set @query = 'SELECT id,idx,itemname,subject,state,startDT,endDT,finishDT,' + @cols + ' from    
				(   
					select id,idx,itemname,subject,state,startDT,endDT,finishDT,name,value from omv.fields I WHERE '+@where+'   
				) x   
				pivot    
				(   
					max(value)   
					for name in(' + @cols + ')   
				) p    
				'+@order   
	--print @query   
	execute(@query); 

GO

ALTER PROCEDURE [api].[setBlur] @host VARCHAR(50)=NULL,@sessionId VARCHAR(50)=NULL,@uid CHAR(128)=NULL,@ip VARCHAR(50)=NULL,@deviceUID VARCHAR(150)=NULL   
AS   
	RETURN  
	--SET NOCOUNT ON; SET TEXTSIZE 2147483647   
	--DECLARE @HostID INT,@UserID INT,@CurIP VARCHAR(50),@DeviceID INT,@tlogID INT   
	--SELECT @userID=userID,@hostID=hostID FROM api.hostAccountGet(@host,@sessionID)   
	--UPDATE auth.userLoginLocLog SET BlurDT=GETUTCDATE() WHERE UserID=@UserID AND EndDT IS NULL   
	--UPDATE auth.hostLogin SET hasFocus=NULL,onblurDt=GETUTCDATE() WHERE userID=@userID AND id=@hostID   
	--IF @DeviceUID IS NULL RETURN   
	--SELECT @DeviceID=DeviceID FROM auth.device WHERE DeviceUID=@DeviceUID    
	--IF @DeviceID IS NULL BEGIN INSERT auth.device(deviceUID,ip) VALUES(@DeviceUID,@ip) SET @deviceID=@@identity END   
	--SELECT @tlogID=aid FROM auth.deviceLog WHERE DeviceID=@DeviceID AND UserID=@userID AND CONVERT(DATE,startDT)=CONVERT(DATE,GETUTCDATE())   
	--IF @tlogID IS NULL INSERT auth.deviceLog(DeviceID,UserID,startDT,endDT) VALUES(@DeviceID,@userID,GETUTCDATE(),GETUTCDATE())   
	--ELSE UPDATE auth.deviceLog SET endDT=GETUTCDATE() WHERE aid=@tlogID 

GO

ALTER PROCEDURE [api].[setFocus] @host VARCHAR(50)=NULL,@sessionId VARCHAR(50)=NULL,@uid CHAR(128)=NULL,@IP VARCHAR(50)=NULL,@deviceUID VARCHAR(150)=NULL   
AS   
	RETURN  
	--SET NOCOUNT ON;	SET TEXTSIZE 2147483647   
	--DECLARE @HostID INT,@UserID INT,@CurIP VARCHAR(50),@DeviceID INT,@tlogID INT   
	----EXEC auth.userGet @sessionId=@sessionId, @host=@host, @groupID=@groupID OUTPUT, @hostID=@hostID OUTPUT, @userID=@userID OUTPUT   
	--SELECT @userID=userID,@hostID=hostID FROM api.hostAccountGet(@host,@sessionID)   
	--SELECT @CurIP=IP FROM auth.userLoginLocLog WHERE UserID=@UserID AND EndDT IS NULL   
	--IF @CurIP IS NULL OR @CurIP<>@IP   
	--BEGIN   
	--	UPDATE auth.userLoginLocLog SET EndDT=BlurDT WHERE UserID=@UserID AND EndDT IS NULL   
	--	INSERT auth.userLoginLocLog(UserID,IP,StartDT) VALUES(@UserID,@IP,GETUTCDATE())   
	--END   
	--UPDATE auth.hostLogin SET hasFocus=1,onfocusDt=GETUTCDATE() WHERE userID=@userID AND id=@hostID   
	--SELECT @userID UserID,@hostID HostID   
	--IF @DeviceUID IS NULL RETURN   
	--SELECT @DeviceID=DeviceID FROM auth.device WHERE DeviceUID=@DeviceUID    
	--IF @DeviceID IS NULL BEGIN INSERT auth.device(deviceUID,ip) VALUES(@DeviceUID,@ip) SET @deviceID=@@identity END   
	--SELECT @tlogID=aid FROM auth.deviceLog WHERE DeviceID=@DeviceID AND UserID=@userID AND CONVERT(DATE,startDT)=CONVERT(DATE,GETUTCDATE())   
	--IF @tlogID IS NULL INSERT auth.deviceLog(DeviceID,UserID,startDT,endDT) VALUES(@DeviceID,@userID,GETUTCDATE(),GETUTCDATE())   
	--ELSE UPDATE auth.deviceLog SET endDT=GETUTCDATE() WHERE aid=@tlogID 

GO

ALTER PROCEDURE [api].[setItemProperty] @id VARCHAR(10),@name VARCHAR(10), @value VARCHAR(500)   
AS   
	IF @value>'' SET @value=''''+@value+''''; ELSE SET @value='NULL'   
	--PRINT 'UPDATE om.items SET '+@name+'='+@value+' WHERE id='+@id  
	EXEC('UPDATE om.items SET '+@name+'='+@value+' WHERE id='+@id) 

GO

ALTER TRIGGER [om].[attributesUpdate] ON [om].[attributes] AFTER UPDATE   
AS   
	SET NOCOUNT ON;   
	return  
	IF UPDATE(value)OR UPDATE(itemID) INSERT aimhis.om.attributes(aid,value,itemID,modifiedById) SELECT aid,value,itemID,modUserID FROM inserted 

GO

ALTER TRIGGER [om].[itemsDelete] ON [om].[items] AFTER DELETE   
AS   
	SET NOCOUNT ON;   
	DELETE om.attributes from deleted D WHERE om.attributes.id = D.id   
	DELETE om.attributes from deleted D WHERE om.attributes.id = D.masterId AND om.attributes.fieldid = D.classid AND om.attributes.valueid = D.id   
	UPDATE om.items SET om.items.hasChildren = om.items.hasChildren-1    
	FROM deleted I   
	WHERE om.items.id = I.masterId   
   
	INSERT freeid(id) SELECT id FROM deleted   
   
	UPDATE om.attributes SET deletedDt=GETDATE()    
	FROM deleted I WHERE om.attributes.itemId=I.id 

GO

ALTER TRIGGER [om].[itemsInsert] ON [om].[items] AFTER INSERT   
AS   
	SET NOCOUNT ON;   
	--INSERT auth.users(id) SELECT id FROM inserted WHERE classId=1000   
	INSERT auth.host(id,name) SELECT id,name FROM inserted WHERE classId=1001   
	INSERT auth.hostDomain(id,domain) SELECT id,name+'.aliconnect.nl' FROM inserted WHERE classId=1001 

GO

ALTER VIEW [api].[host]   
AS   
	SELECT P.* FROM( SELECT I.keyname,F.id,F.name,F.value FROM om.attributes F INNER JOIN om.items I ON I.deletedDT IS NULL AND I.classid=1002 AND I.keyname IS NOT NULL AND F.id = I.id )    
	X PIVOT(max(value) FOR name in(color)) P 

GO

ALTER VIEW [api].[listitems]   
AS   
	SELECT I.id,I.name,I.classID,I.state,I.obj,I.stock,I.discount,I.msrp,I.hasChildren,I.idx,I.modifiedDT   
	FROM om.items I WHERE I.deletedDT IS NULL 

GO

ALTER VIEW [api].[msg]   
AS   
	SELECT    
		M.Subject   
		,MT.toID   
		,FU.name AS FromName   
		,M.CreatedDt   
		,SendDT   
		,ReadDt   
		,NotifyDt   
		,M.itemId   
		,M.msg   
		,M.hostID   
		,M.pri   
		,M.aid   
	FROM    
		om.msg M    
		INNER JOIN om.msgTo MT ON MT.msgaid = M.aid    
		INNER JOIN auth.users FU ON FU.id = M.fromID 

GO

ALTER VIEW [api].[Users]   
AS   
	-- wordt gebruikt in: Beheer applicatie   
	SELECT I.id,I.name,U.password    
	FROM om.items I   
	INNER JOIN auth.users U ON U.id = I.id AND I.classid=1000 AND I.deletedDT IS NULL 

GO

ALTER VIEW [auth].[accountId]   
AS   
	SELECT I.ToID AS UserID,F.id AS AccountID,F.HostID,F.ItemID AS GroupID    
	FROM om.items I   
		INNER JOIN om.attributes F ON I.classID=1004 AND I.id=F.id AND F.classID=1103 AND F.itemID IS NOT NULL 

GO

ALTER VIEW [auth].[email]   
AS  
SELECT aid,id,CONVERT(VARCHAR(250),value) email,userID,CASE WHEN userID=id THEN modDT ELSE NULL END AS verifiedDt FROM om.attributes WHERE fieldID=30 

GO

ALTER VIEW [auth].[hostMailserver]   
AS   
	SELECT   
		H.id hostID   
		,D.Domain   
		,D.aid AS domainId   
		,S.SMTPHost   
		,SMTPSecure   
		,S.SMTPPort AS Port   
		,username+'@'+A.host AS Username   
		,A.Password   
		,H.email ReplyToEmail   
		,H.emailName ReplyToName   
		,H.Basecolor   
		,H.name AS Hostname   
	FROM   
		auth.hostDomain D   
		INNER JOIN auth.host H ON H.id = D.id    
		INNER JOIN auth.mailAccount A ON A.aid = H.mailAccountAid   
		INNER JOIN auth.mailServer S ON S.host = A.host 

GO

ALTER VIEW [om].[class] 
AS 
SELECT id,hostID,srcID,masterID,name,name class,config  
FROM om.items WHERE srcID=masterID AND srcID=0 
 

GO

ALTER VIEW [om].[field] AS  
SELECT * FROM om.attributeName 

GO

ALTER VIEW [om].[fields] AS SELECT * FROM om.attributes GO 

GO

ALTER VIEW [omv].[fields]    
AS   
	SELECT  I.id,I.idx,I.classID,I.fromID,I.toID,I.srcID,I.hostID,I.startDT,I.endDT,I.finishDT,I.state,I.name AS itemname,I.subject,IV.aid,IV.name,IV.value,IV.itemId,IV.hostID AS fieldHostId   
	FROM om.items I   
		INNER JOIN om.attributes IV ON IV.id = I.id --AND I.deletedDT IS NULL 

GO

ALTER FUNCTION [om].[tagname](@id INT) RETURNS varchar(200)   
AS   
BEGIN   
	DECLARE @tagname VARCHAR(500)   
	;WITH P(level,id,masterID,name,tag,title,srcID,tagname) AS    
	(    
		SELECT 0,I.id,I.masterID,I.name,I.tag,I.title,I.srcID,CONVERT(VARCHAR(500),ISNULL(C.tag,'')+ISNULL(CASE WHEN ISNUMERIC(I.tag)=1 THEN right('000'+convert(varchar(3),I.tag),3) ELSE I.tag END,''))   
		FROM om.items I    
		INNER JOIN om.items C ON C.id = I.srcID    
		WHERE I.id=@id AND(C.tag IS NOT NULL OR I.tag IS NOT NULL)   
		UNION ALL   
		SELECT level+1,I.id,I.masterID,I.name,I.tag,I.title,I.srcID,CONVERT(VARCHAR(500),ISNULL(C.tag,'')+ISNULL(CASE WHEN ISNUMERIC(I.tag)=1 THEN right('000'+convert(varchar(3),I.tag),3) ELSE I.tag END,'')+'.'+P.tagname)   
		FROM om.items I    
		INNER JOIN P ON I.id=P.masterID   
		INNER JOIN om.items C ON C.id = I.srcID AND(C.tag IS NOT NULL OR I.tag IS NOT NULL)   
	)    
	SELECT @tagname=tagname	FROM P    
	RETURN @tagname   
END 

GO

ALTER FUNCTION [om].[itemChilds](@itemId INT)RETURNS TABLE    
AS   
RETURN    
(   
	WITH P( id,level,masterId,name,classID,startDT,endDT,finishDT,deletedDT,state,srcID) AS(    
	--SELECT ISNULL(I.detailId,I.id),0,I.masterId,I.name,I.classID,I.startDT,I.endDT,I.finishDT,I.deletedDT,I.state,I.srcID   
	SELECT I.id,0,I.masterId,I.name,I.classID,I.startDT,I.endDT,I.finishDT,I.deletedDT,I.state,I.srcID   
	FROM om.items I   
	WHERE I.id = @itemId   
	UNION ALL   
	SELECT I.id,level+1,I.masterId,I.name,I.classID,I.startDT,I.endDT,I.finishDT,I.deletedDT,I.state,I.srcID   
	FROM P INNER JOIN om.items I ON I.masterId = P.id and level<8   
	)    
	SELECT * FROM P   
) 

GO

ALTER FUNCTION [om].[itemMasters](	@itemId INT ) RETURNS TABLE    
AS   
RETURN(   
	WITH P( id,level,masterId,name)    
	AS(SELECT ISNULL(I.detailId,I.id),0,I.masterId,I.name FROM om.items I WHERE I.id = @itemId   
	UNION ALL    
	SELECT ISNULL(I.detailId,I.id),level+1,I.masterId,I.name   
	FROM  P INNER JOIN om.items I ON I.id = P.masterID and level<8 )    
	SELECT * FROM P WHERE level>0   
) 

GO

ALTER PROCEDURE [api].[addItemUserVisit] @id INT,@userID int--,@hostID int=NULL   
AS   
	IF NOT EXISTS(SELECT 0 FROM om.itemuservisit WHERE id=@id AND userID=@userID)    
		INSERT om.itemuservisit(id,userID,firstvisitDt,lastvisitDT,cnt)    
		VALUES(@id,@userID,GETUTCDATE(),GETUTCDATE(),0)   
	ELSE    
		UPDATE om.itemuservisit SET cnt=cnt+1,lastvisitDT=GETUTCDATE() WHERE id=@id AND userID=@userID 

GO

ALTER PROCEDURE [api].[addItemWord] @word VARCHAR(50),@id INT,@cnt TINYINT AS   
	DECLARE @wordID INT   
	SELECT @wordID=id FROM om.word WHERE word=@word   
	IF @wordID IS NULL BEGIN INSERT om.word(word) VALUES(@word) SET @wordID=@@identity END   
	INSERT om.wordItem(wordID,itemID,cnt) VALUES(@wordID,@id,@cnt) 

GO

ALTER PROCEDURE [api].[getAttribute] @id INT,@name VARCHAR(100)=NULL, @fieldID INT=NULL,@value VARCHAR(500)=NULL OUTPUT, @itemID INT=NULL OUTPUT   
AS   
	SELECT @value=value,@itemID=itemID FROM om.attributes WHERE id=@id AND name=@name 

GO

ALTER PROCEDURE [api].[getDeviceData] @deviceID INT = NULL, @deviceUID VARCHAR(200)= NULL,@appUID VARCHAR(200)=NULL   
AS   
	SET NOCOUNT ON   
	--DECLARE @sql VARCHAR(MAX)   
	--SELECT @sql=sql FROM auth.app WHERE uid=@deviceUID   
	--IF @sql IS NOT NULL EXEC(@sql)   
	--SELECT * FROM auth.app WHERE id=@deviceID--uid=@deviceUID   
	SELECT @deviceUID=uid FROM om.items WHERE id=@deviceID 
	SELECT * FROM auth.app WHERE uid=@deviceUID   
	SELECT TOP 1 aid,documentname FROM aim.auth.appprintqueue WHERE uid IN(@deviceUID,@appUID) AND printDT IS NULL ORDER BY createDt; 

GO

ALTER PROCEDURE [api].[getItem] @id INT=NULL OUTPUT,@hostId INT,@schema VARCHAR(50)=NULL,@class VARCHAR(50)=NULL,@classId INT=NULL,@tag VARCHAR(50)=NULL,@keyname VARCHAR(50)=NULL,@title VARCHAR(500)=NULL,@toId INT=NULL   
AS  
	IF @schema IS NOT NULL SET @class=@schema  
	IF @classId IS NULL SELECT @classId=id FROM om.class WHERE class=@class   
	IF @classId IS NULL BEGIN SELECT @classId=MAX(id)+1 FROM om.class INSERT om.class(id,class) VALUES(@classId,@class) END   
	IF @id IS NOT NULL AND NOT EXISTS(SELECT 0 FROM om.items WHERE id=@id) --SELECT 0 FROM om.items WHERE id=3562758  
	BEGIN  
		SET IdENTITY_INSERT om.items ON  
		INSERT om.items(classId,id,title)VALUES(@classId,@id,@title)  
		SET IdENTITY_INSERT om.items OFF  
	END  
	IF @id IS NOT NULL UPDATE om.items SET hostId=ISNULL(@hostId,hostId),keyname=ISNULL(@keyname,keyname),tag=ISNULL(@tag,tag),toId=ISNULL(@toId,toId) WHERE id=@id  
	IF @id IS NULL AND @tag IS NOT NULL SELECT @id=id FROM om.items WHERE deletedDT IS NULL AND hostId=@hostId AND classId=@classId AND tag=@tag   
	IF @id IS NULL AND @keyName IS NOT NULL SELECT @id=id FROM om.items WHERE deletedDT IS NULL AND hostId=@hostId AND classId=@classId AND keyname=@keyName  
	IF @id IS NULL BEGIN INSERT om.items(hostId,classId,tag,keyname)VALUES(@hostId,@classId,@tag,@keyname) SET @id=SCOPE_IdENTITY() END 

GO

ALTER PROCEDURE [api].[getItemNetwork] @id INT,@host VARCHAR(50) = NULL,@sessionId VARCHAR(50) = NULL   
AS   
	SET NOCOUNT ON   
	SET TEXTSIZE 2147483647   
	SET DATEFORMAT DMY   
	--DECLARE @groupID INT,@hostID INT,@userID INT,@accountId INT   
	--SELECT @groupID=groupID,@hostID=hostID,@userID=userID,@accountID=accountID FROM api.hostAccountGet(@host,@sessionId)   
	--EXEC auth.userGet @sessionId,@host,@groupID OUTPUT,@hostID OUTPUT,@userID OUTPUT   
	DECLARE @T TABLE(fromID INT,toID INT,level TINYINT)   
	   
	;WITH P( fromID,toID,level) AS(    
		SELECT fromID,toID,1 FROM om.link WHERE fromID = @id    
		UNION ALL   
		SELECT I.fromID,I.toID,level+1   
		FROM P INNER JOIN om.link I ON I.fromID = P.toID AND level<2    
	)    
	INSERT @T SELECT * FROM P   
	;WITH P( fromID,toID,level) AS(    
		SELECT fromID,toID,1 FROM om.link WHERE toID = @id    
		UNION ALL   
		SELECT I.fromID,I.toID,level+1   
		FROM P INNER JOIN om.link I ON I.toID = P.toID AND level<3   
	)    
	INSERT @T SELECT * FROM P   
		   
	;WITH P( fromID,toID,level) AS(    
		SELECT I.id,I.itemId,1    
		FROM om.attributes I WHERE id = @id AND I.itemID IS NOT NULL   
		UNION ALL   
		SELECT I.id,I.itemId,level+1   
		FROM om.attributes I    
		INNER JOIN P ON I.id = P.toID AND level<2 AND I.itemID IS NOT NULL   
	)    
	INSERT @T SELECT * FROM P   
	;WITH P( fromID,toID,level) AS(    
		SELECT I.itemId,I.id,1    
		FROM om.attributes I WHERE itemId = @id AND I.itemID IS NOT NULL   
		UNION ALL   
		SELECT I.itemId,I.id,level+1   
		FROM om.attributes I    
		INNER JOIN P ON I.itemId = P.toID AND level<2 AND I.itemID IS NOT NULL   
	)    
	INSERT @T SELECT * FROM P   
	SELECT DISTINCT I.id [key],I.name text,I.classID    
	FROM @T T   
	INNER JOIN om.items I ON I.id IN(T.toID,T.fromID)   
	SELECT * FROM @T --WHERE fromID IS NOT NULL 

GO

ALTER PROCEDURE [api].[setItem] @id INT,@submit BIT=0,@moduserID INT=NULL,@hostID INT=NULL  
AS  
	SET NOCOUNT ON  
	DECLARE @pos INT,@msgID INT,@pageID INT,@www BIT,@footerID INT,@aid INT,@classID INT,@ItemID INT,@ItemHostID INT,@SiteID INT,@AccountID INT,@userID INT,@groupID INT,@ToID INT,@FromID INT,@SrcID INT,@ContactID INT,@CompanyID INT,@PersonID INT,@value VARCHAR(500),@name VARCHAR(500),@website VARCHAR(500),@config VARCHAR(MAX),@keyname VARCHAR(500),@email VARCHAR(500),@email1 VARCHAR(500),@email2 VARCHAR(500),@jobtitle VARCHAR(500),@displayname VARCHAR(500),@givenname VARCHAR(500),@middlename VARCHAR(500),@surname VARCHAR(500),@surname2 VARCHAR(500),@companyname VARCHAR(500),@company VARCHAR(500),@msg VARCHAR(MAX)  
	SELECT @www=www,@ClassID=classID,@UserID=UserID,@ToID=ToID,@FromID=FromID,@ItemHostID=HostID,@SrcID=SrcID,@keyname=keyname,@name=name,@config=Config FROM om.items WHERE id=@id  
	--IF @classID=1000 -- Persoon  
	--BEGIN  
	--	SET @value=fn.getAttribute(@id,'EmailAddresses2Address')  
	--	IF @Value>'' EXEC auth.setEmail @email=@value,@id=@id  
	--END  
	--ELSE IF @classID=1004 BEGIN  
	--	IF @HostID=1 AND @www<>1 UPDATE om.items SET www=1 WHERE id=@id  
	--	IF @ItemHostID<>1   
	--	BEGIN  
	--		SELECT @email=ISNULL(EmailAddresses0Address,EmailAddresses2Address),@email1=EmailAddresses0Address,@email2=EmailAddresses2Address,@jobtitle=JobTitle,@displayname=displayname,@surname=surname,@middlename=middlename,@givenname=givenname,@companyname=companyname,@company=company  
	--		FROM(SELECT F.id,F.name,F.value FROM om.fields F WHERE id=@id) X   
	--		PIVOT(max(value) FOR name in(EmailAddresses0Address,EmailAddresses2Address,JobTitle,DisplayName,Surname,GivenName,MiddleName,CompanyName,Company)) P1   
	--		IF @email IS NOT NULL  
	--		BEGIN  
	--			--IF fn.getAttribute(@personID,'msgContactAddSendDT') IS NULL  
	--			--BEGIN  
	--			--	SELECT @msg=ISNULL(@msg+',','')+api.mailMsgGet('msgContactAdd')  
	--			--	--EXEC api.setAttribute @id=@PersonID,@name='msgContactAddSendDT',@Value=GETUTCDATE()  
	--			--END  
	--			SELECT TOP 1 @aid=aid,@personID=id FROM auth.email WHERE email IN(@email1,@email2)  
	--			IF @aid IS NULL  
	--			BEGIN  
	--				INSERT auth.email(email)VALUES(@email)  
	--				SET @aid=scope_identity()  
	--			END  
	--			IF @personID IS NULL SET @personID=@toID  
	--			IF @personID IS NULL   
	--			BEGIN  
	--				SET @name=ISNULL(@name,@email)  
	--				INSERT om.items(hostID,classID,name) VALUES(1,1000,@name)  
	--				SET @personID=scope_identity()  
	--				IF @surname IS NULL  
	--				BEGIN  
	--					SELECT @surname=@name,@pos=CHARINDEX('-',@name)  
	--					IF @pos>0 SELECT @surname2=LTRIM(SUBSTRING(@surname,@pos+1,999)),@surname=RTRIM(SUBSTRING(@surname,0,@pos))  
	--					SET @pos=CHARINDEX(' ',@surname)  
	--					IF @pos>0  
	--					BEGIN  
	--						SELECT @givenname=SUBSTRING(@surname,0,@pos),@surname=SUBSTRING(@surname,@pos+1,99999),@pos=0  
	--						WHILE CHARINDEX(' ',@surname,@pos)>0 SET @pos=CHARINDEX(' ',@surname,@pos)+1  
	--						IF @pos>0 SELECT @middlename=SUBSTRING(@surname,0,@pos-1),@surname=SUBSTRING(@surname,@pos,99999)  
	--					END  
	--					SET @surname=@surname+ISNULL(' - '+@surname2,'')  
	--				END  
	--				IF @surname>'' EXEC api.setAttribute @id=@PersonID,@name='Surname',@Value=@surname  
	--				IF @givenname>'' EXEC api.setAttribute @id=@PersonID,@name='GivenName',@Value=@givenname  
	--				IF @middlename>'' EXEC api.setAttribute @id=@PersonID,@name='MiddleName',@Value=@middlename  
	--				EXEC api.setAttribute @id=@PersonID,@name='EmailAddresses2Address',@Value=@email  
	--				UPDATE auth.email SET id=@PersonID WHERE email=@email  
	--			END  
	--			IF @toID IS NULL EXEC api.setAttribute @id=@id,@name='DisplayName',@itemID=@personID  
	--			IF @email1 IS NOT NULL AND NOT EXISTS(SELECT 0 FROM auth.email WHERE email=@email1) INSERT auth.email(id,email) VALUES(@personID,@email1)  
	--			IF @email2 IS NOT NULL AND NOT EXISTS(SELECT 0 FROM auth.email WHERE email=@email2) INSERT auth.email(id,email) VALUES(@personID,@email2)  
	--			--IF fn.getAttribute(@personID,'accountMailSendDT') IS NULL  
	--			--BEGIN  
	--			--	SELECT @msg=ISNULL(@msg+',','')+api.mailMsgGet('mailAliconnectAccountAdd')  
	--			--	--EXEC api.setAttribute @id=@PersonID,@name='accountMailSendDT',@Value=GETUTCDATE()  
	--			--END  
	--			--IF ISNULL(@toID,0)<>@personID  
	--			--BEGIN  
	--			--	EXEC api.setAttribute @id=@id,@hostID=@hostID,@name='DisplayName',@classID=1000,@itemID=@personID,@idname='toID'  
	--			--	SET @toID=@personID  
	--			--END  
	--		END  
	--		--SELECT @fromID=ISNULL(srcID,id) FROM api.items WHERE id=@fromID  
	--		--IF @srcID IS NULL AND @toID IS NOT NULL AND @fromID IS NOT NULL SELECT @srcID=I.ID FROM api.items I WHERE classID=1004 AND hostID=1 AND toID=@toID AND fromID=@fromID  
	--		--IF @srcID IS NOT NULL AND @srcID<>@id UPDATE om.items SET srcID=@srcID WHERE id=@id  
	--		IF @srcID IS NULL  
	--		BEGIN  
	--			IF @fromID IS NOT NULL SELECT @companyID=srcID FROM api.items WHERE id=@fromID  
	--			IF @companyID IS NOT NULL   
	--			BEGIN  
	--				SELECT TOP 1 @srcID=id FROM api.items WHERE hostID=1 AND classID=1004 AND fromID=@companyID AND toID=@personID  
	--				IF @srcID IS NULL   
	--				BEGIN  
	--					INSERT om.items(hostID,classID,name) VALUES(1,1004,@name)  
	--					SET @srcID=scope_identity()  
	--					EXEC api.setAttribute @id=@srcID,@name='Company',@itemID=@companyID  
	--					EXEC api.setAttribute @id=@srcID,@name='DisplayName',@itemID=@personID  
	--					EXEC api.setAttribute @id=@srcID,@name='JobTitle',@value=@jobtitle  
	--				END  
	--				UPDATE om.items SET srcID=@srcID WHERE id=@id  
	--			END  
	--		END  
			  
	--		--IF @srcID IS NULL AND @toID IS NOT NULL AND @fromID IS NOT NULL SELECT @srcID=I.ID FROM api.items I WHERE classID=1004 AND hostID=1 AND toID=@toID AND fromID=@fromID  
	--		--IF @srcID IS NULL AND @email IS NOT NULL SELECT @srcID=I.ID FROM api.items I INNER JOIN om.fields F ON I.classID=1004 AND I.hostID=1 AND F.id=I.id AND F.name='EmailAddresses0Address' AND F.value=@email  
	--		--IF @srcID IS NULL AND @email2 IS NOT NULL SELECT @srcID=I.ID FROM api.items I INNER JOIN om.fields F ON I.classID=1004 AND I.hostID=1 AND F.id=I.id AND F.name='EmailAddresses2Address' AND F.value=@email2  
	--		--IF @srcID IS NOT NULL AND @srcID<>@id UPDATE om.items SET srcID=@srcID WHERE id=@id  
	--		----IF @personID IS NOT NULL AND(@srcID IS NULL OR @srcID<>@personID) UPDATE om.items SET srcID=@personID WHERE id=@id  
	--		--IF @msg IS NOT NULL EXEC api.addMail @ToID=@personID,@hostID=@HostID,@pri=1,@subject='Een account',@msg=@msg--@name='mailAliconnectAccountAdd'  
	--	END  
	--	SELECT TOP 1 @groupID=itemID,@userID=UserID,@ModUserID=ModUserId,@aid=aid FROM om.fields WHERE id=@id AND classID=1103 AND hostID=@ItemHostID  
	--	IF @groupID IS NOT NULL BEGIN  
	--		IF NOT EXISTS(select 0 from auth.users where id=@personID)   
	--		BEGIN  
	--			INSERT auth.users(id) VALUES(@personID)  
	--			--EXEC api.addMail @AccountId=@id,@hostID=@HostID,@name='mailAliconnectAccountAdd'  
	--		END  
	--		SET @userID=@personID  
	--	END  
	--	RETURN  
	--	SELECT @id id,@name name,@msg msg,@aid aid,@groupID groupID,@personID personID,@userID userID,@ItemHostID itemHostID,@companyID companyID,@email email,@email2 email2,@srcID srcID,@toID toID,@fromID fromID   
	--	RETURN   
  
	--	-- STOP  
	--	--RETURN  
	--	--DECLARE @rights VARCHAR(10)  
	--	--SELECT TOP 1 @aid=aid,@rights=rights FROM om.fields WHERE id=@id AND classID=1103 AND hostID=@hostID  
	--	--IF @aid IS NOT NULL   
	--	--BEGIN  
	--	--	IF NOT EXISTS(select 0 from auth.users where id=@toid)   
	--	--	BEGIN  
	--	--		INSERT auth.users(id) VALUES(@ToID)  
	--	--		EXEC api.addMail @AccountId=@id,@hostID=@HostID,@name='mailAliconnectAccountAdd'  
	--	--	END  
	--	--	IF @rights IS NULL  
	--	--	BEGIN  
	--	--		UPDATE om.fields SET rights='1' WHERE aid=@aid  
	--	--		EXEC api.addMail @AccountId=@id,@hostID=@HostID,@name='mailHostGroupAdd'  
	--	--	END  
	--	--END  
	--	--IF @CompanyID IS NULL  
	--	--BEGIN  
	--	--	SELECT @CompanyID=itemID FROM om.fields WHERE id=@id AND name='Company'  
	--	--	SET @Company=ISNULL(@Company,@companyname)  
	--	--	IF @CompanyID IS NULL AND @company IS NOT NULL SELECT @CompanyID=id FROM api.items WHERE classid=1002 and name=@company  
	--	--	IF @CompanyID IS NULL SELECT @CompanyID=I.fromID FROM api.items I INNER JOIN om.fields F ON F.id=I.id AND I.classid=1004 AND I.ToID=@PersonID and F.name='EmailAddresses0Address' and value=@email  
	--	--	IF @CompanyID IS NULL SELECT @CompanyID=I.fromID FROM api.items I INNER JOIN om.fields F ON F.id=I.id AND I.classid=1004 AND I.ToID=@PersonID and F.name='EmailAddresses2Address' and value=@email  
	--	--	IF @CompanyID IS NULL SELECT @CompanyID=I.fromID FROM api.items I INNER JOIN om.fields F ON F.id=I.id AND I.classid=1004 and F.name='EmailAddresses2Address' and value=@email  
	--	--	IF @CompanyID IS NULL SELECT @CompanyID=I.fromID FROM api.items I INNER JOIN om.fields F ON F.id=I.id AND I.classid=1004 and F.name='EmailAddresses0Address' and value=@email2  
	--	--	IF @CompanyID IS NULL SELECT @CompanyID=I.fromID FROM api.items I INNER JOIN om.fields F ON F.id=I.id AND I.classid=1004 and F.name='EmailAddresses2Address' and value=@email2  
	--	--	IF @CompanyID IS NULL AND @company IS NOT NULL   
	--	--	BEGIN  
	--	--		INSERT om.items(hostID,classID,name) VALUES(1,1002,@companyname)  
	--	--		SET @CompanyID=scope_identity()  
	--	--		EXEC api.setAttribute @id=@CompanyID,@name='CompanyName',@Value=@company  
	--	--	END  
	--	--END  
	--	--IF @FromID IS NULL OR @ToID IS NULL OR @CompanyID<>@FromID OR @PersonID<>@ToID  
	--	--BEGIN  
	--	--	UPDATE om.items SET FromID=@CompanyID,ToID=@PersonID WHERE id=@id  
	--	--	--EXEC api.setAttribute @id=@id,@hostID=1,@name='DisplayName',@ClassID=1000,@ItemID=@PersonID  
	--	--	--EXEC api.setAttribute @id=@id,@hostID=1,@name='Company',@ClassID=1002,@ItemID=@CompanyID  
	--	--END  
	--	--SELECT TOP 1 @groupID=itemID,@userID=UserID,@ModUserID=ModUserId,@aid=aid FROM om.fields WHERE id=@id AND classID=1103 AND hostID=@hostID  
	--	--IF @GroupID IS NOT NULL  
	--	--BEGIN  
	--	--	IF NOT EXISTS(select 0 from auth.users where id=@toid)   
	--	--	BEGIN  
	--	--		INSERT auth.users(id) VALUES(@PersonID)  
	--	--		EXEC api.addMail @AccountID=@AccountID,@HostID=@id,@name='mailAliconnectAccountAdd'  
	--	--	END  
	--	--	IF @userID IS NULL  
	--	--	BEGIN  
	--	--		UPDATE om.fields SET userID=@ModUserID WHERE aid=@aid  
	--	--		EXEC api.addMail @AccountId=@id,@name='mailHostGroupAdd'  
	--	--	END  
	--	--END  
  
  
	--END  
  
	----SELECT @classid,@hostid,@keyname,@srcid,@id  
  
	--ELSE IF @classID=1002 BEGIN -- Company  
  
  
	--	IF @ItemHostID<>1  
	--	BEGIN  
	--		IF @srcID IS NULL  
	--		BEGIN  
	--			SET @value=fn.getAttribute(@id,'BusinessHomePage')  
	--			IF @value IS NOT NULL SELECT @srcID=I.ID FROM api.items I INNER JOIN om.fields F ON I.classID=1002 AND I.www=1 AND I.hostID=1 AND F.id=I.id AND F.name='BusinessHomePage' AND F.value=@value  
	--			IF @srcID IS NOT NULL AND @srcID<>@id EXEC api.setAttribute @id=@id,@idname='srcID',@itemID=@srcID  
	--		END  
	--		IF @srcID IS NULL  
	--		BEGIN  
	--			SET @value=fn.getAttribute(@id,'EmailAddresses1Address')  
	--			IF @value IS NOT NULL SELECT @srcID=I.ID FROM api.items I INNER JOIN om.fields F ON I.classID=1002 AND I.www=1 AND I.hostID=1 AND F.id=I.id AND F.name='EmailAddresses1Address' AND F.value=@value  
	--			IF @srcID IS NOT NULL AND @srcID<>@id EXEC api.setAttribute @id=@id,@idname='srcID',@itemID=@srcID  
	--		END  
	--		RETURN  
	--	END  
	--	UPDATE om.items SET www=1 WHERE id=@id  
	--	IF @KeyName IS NOT NULL   
	--	BEGIN  
  
  
  
	--		SELECT @aid=aid,@contactID=itemID FROM om.fields WHERE id=@id AND name='Owner'  
	--		IF @contactID IS NULL BEGIN  
	--			SELECT @contactID=userID FROM om.items WHERE id=@id  
	--			IF @contactID IS NOT NULL EXEC api.setAttribute @id=@id,@name='Owner',@itemID=@contactID  
	--		END  
  
	--		--SELECT @ItemHostID,@KeyName,@aid,@contactID RETURN  
  
  
  
	--		IF @contactID IS NULL RETURN  
  
	--		SELECT @UserID=ToID,@fromID=fromID,@toID=toID FROM api.items WHERE id=@contactID  
	--		--SELECT @UserID,@contactID,@ItemHostID,@KeyName,@aid,@contactID RETURN  
	--		IF @UserID IS NULL RETURN  
	--		SELECT @AccountID=id FROM api.items WHERE hostID=@id AND classID=1004 AND srcID=@contactID  
	--		IF @AccountID IS NULL  
	--		BEGIN  
	--		--SELECT @UserID,@contactID,@ItemHostID,@KeyName,@aid,@contactID RETURN -- DEBUG  
	--			SET @value=fn.getAttribute(@contactID,'EmailAddresses0Address')  
	--		--SELECT @value,@UserID,@contactID,@ItemHostID,@KeyName,@aid,@contactID RETURN -- DEBUG  
	--			IF @value IS NULL SET @value=fn.getAttribute(@toID,'EmailAddresses0Address')  
	--			--SELECT 'TEST',@value,@contactID,@toID,@fromID  
	--			IF @value IS NULL RETURN  
	--			--SELECT 'TEST',@classID  
	--			INSERT om.items(hostID,classID,srcID,fromID,toID,name)   
	--			SELECT @id,1004,@contactID,fromID,toID,name  
	--			FROM api.items WHERE id=@contactID  
	--			SET @AccountID=scope_identity()  
	--			EXEC api.setAttribute @id=@AccountID,@hostID=@id,@name='EmailAddresses0Address',@value=@value  
	--			EXEC api.setAttribute @id=@AccountID,@hostID=@id,@name='DisplayName',@itemID=@toID  
	--			EXEC api.setAttribute @id=@AccountID,@hostID=@id,@name='Company',@itemID=@fromID  
	--		END  
	--		EXEC api.getItemLink @hostID=@id,@classID=0,@masterID=@id,@keyname='ceo',@idx=1,@detailID=@accountID  
	--		UPDATE om.items SET userID=@userID WHERE id=@id  
	--		EXEC api.getItemLink @hostID=@id,@classID=1162,@keyname='maintask',@name='Organisatie taken',@id=@itemId OUTPUT  
	--		EXEC api.getItemLink @hostID=@id,@classID=0,@masterID=@id,@keyname='maintask',@name='Organisatie taken',@idx=1,@detailID=@itemId  
	--		EXEC api.getItemLink @hostID=@id,@classID=1004,@keyname='support',@name='Support Aliconnect',@srcID=2750880,@id=@itemId OUTPUT  
	--		IF NOT EXISTS(SELECT 0 FROM auth.users WHERE id=@UserID)   
	--		BEGIN  
	--			INSERT auth.users(id) VALUES(@UserID)  
	--			EXEC api.addMail @AccountID=@AccountID,@HostID=@id,@name='mailAliconnectAccountAdd'  
	--		END  
	--		--SELECT @GroupID=ItemID FROM om.fields WHERE id=@UserID AND F.hostID=@HostID AND F.classID=1103  
	--		--IF @GroupID IS NULL  
	--		SELECT @groupID=id FROM api.items WHERE classID=1103 AND hostID=@id AND name='Admin'  
	--		IF @groupID IS NULL  
	--		BEGIN  
	--			EXEC api.getItemLink @hostID=@id,@classID=1103,@name='Admin',@id=@groupID OUTPUT  
	--			--INSERT om.items(hostID,classID,name) VALUES(@id,1103,'Admin')  
	--			--SELECT @groupID=scope_identity()  
	--			INSERT auth.groupClass(groupID,classID,config) SELECT @groupID,classID,config FROM auth.groupClass WHERE groupID=2619989 -- aliconnect Admin  
	--			EXEC api.addMail @AccountID=@UserID,@HostID=@HostID,@name='mailToOwnerGroupAdminAdd'  
	--		END  
	--		EXEC api.setAttribute @id=@AccountID,@hostID=@id,@name='groupID',@value='Admin',@ItemID=@groupID,@classID=1103,@moduserID=@userID,@rights='R'  
	--		--SELECT @groupID  
	--		--RETURN  
	--		--IF NOT EXISTS(SELECT 0 FROM om.fields WHERE id=@AccountID AND hostID=@id AND classID=1103)  
	--		--BEGIN  
	--		--	--SELECT @AccountID,@id,@userID,@HostID,@groupid  
	--		--	EXEC api.setAttribute @id=@AccountID,@hostID=@id,@name='groupID',@value='Admin',@ItemID=@groupID,@classID=1103,@moduserID=@userID,@rights='R'  
	--		--	EXEC api.addMail @AccountID=@AccountID,@HostID=@id,@name='mailHostGroupAdd'  
	--		--END  
	--		--IF NOT EXISTS(SELECT 0 FROM om.fields WHERE id=@id AND classID=1004 AND rights>'')  
	--		--BEGIN  
	--		--	EXEC api.setAttribute @id=@id,@hostID=1,@name='owner',@value='X',@ItemID=@AccountID,@UserID=@PersonID,@classID=1004  
	--		--	EXEC api.addMail @AccountID=@AccountID,@HostID=@id,@name='mailToOwnerAccountAdd'  
	--		--END  
	--		--SELECT @keyname  
  
  
	--		RETURN  
  
  
	--		UPDATE om.fields SET rights='R',moduserID=@userID WHERE id=@id AND name IN('owner','hostName')  
	--		SET @KeyName=REPLACE(REPLACE(@KeyName,' ',''),'.','')  
	--		IF NOT EXISTS(SELECT 0 FROM auth.host WHERE id=@id) INSERT auth.host(id,mailAccountAid) VALUES(@id,2)  
	--		--BEGIN  
	--		--	INSERT auth.host(id,mailAccountAid) VALUES(@id,2)  
	--		--	EXEC api.addMail @AccountID=@UserID,@HostID=@HostID,@name='mailToOwnerHostAdd'  
	--		--END  
	--		IF @Config IS NULL UPDATE om.items SET config=I.config FROM(SELECT config FROM om.items WHERE id=1) I WHERE om.items.id=@id  
	--		--RETURN  
	--		--SELECT @SiteID=id FROM api.items WHERE hostID=@id AND classID=1091 AND DetailID IS NULL  
	--		EXEC api.getItemLink @hostID=@id,@classID=1091,@keyName=@keyname,@hasChildren=1,@masterID=@id,@id=@siteID  OUTPUT  
	--		EXEC api.setAttribute @id=@SiteID,@hostID=@id,@name='Company',@classID=1002,@itemID=@id  
	--		EXEC api.getItemLink @hostID=@id,@classID=1092,@masterID=@SiteID,@keyname='Welkom',@idx=0,@state='published',@id=@pageID  OUTPUT  
	--		UPDATE om.items SET www=1,startDT=GETUTCDATE() WHERE id=@pageID  
	--		--SELECT @hostid,@id,@SiteID,@pageID  
	--		EXEC api.setAttribute @id=@pageID,@hostID=@id,@name='Website',@value='Website',@classID=1091,@typeID=11,@itemID=@SiteID  
	--		EXEC api.setAttribute @id=@pageID,@hostID=@id,@name='Title',@value='Welkom'  
	--		EXEC api.setAttribute @id=@pageID,@hostID=@id,@name='Description',@value='Welkom op deze site.'  
	--		EXEC api.getItemLink @hostID=@id,@classID=1092,@masterID=@SiteID,@keyname='Footer',@idx=99,@state='published',@id=@footerID  OUTPUT  
	--		EXEC api.setAttribute @id=@footerID,@hostID=@id,@name='Webpage',@value='Webpage',@classID=1092,@typeID=11,@itemID=@SiteID  
	--		EXEC api.getItemLink @hostID=@id,@classID=1092,@masterID=@footerID,@keyname='Contact',@idx=0,@state='published',@id=@itemID  OUTPUT  
	--		EXEC api.setAttribute @id=@itemID,@hostID=@id,@name='Webpage',@value='Webpage',@classID=1092,@typeID=11,@itemID=@footerID  
	--		--EXEC api.addMail @AccountID=@UserID,@HostID=@HostID,@name='mailToOwnerSiteAdded'  
	--		--IF NOT EXISTS(SELECT 0 FROM api.items WHERE hostID=@id AND masterID=@AccountID AND DetailID=@SiteID AND classid=1091)  
	--		--	INSERT om.items(hostID,classID,masterID,detailID,name) VALUES(@id,1091,@AccountID,@SiteID,@Keyname)  
	--	END  
	--END 

GO

ALTER PROCEDURE [auth].[addUserMsg] @userID INT,@name VARCHAR(50),@itemID INT=NULL,@byID INT=NULL    
AS   
	IF NOT EXISTS(SELECT 0 FROM auth.userMsg WHERE userID=@userID AND name=@name AND ISNULL(itemID,0)=ISNULL(@itemID,0))    
		INSERT auth.userMsg(userID,name,itemID,createdByID)VALUES(@userID,@name,@itemID,@byID) 

GO

ALTER PROCEDURE [auth].[delCompany] @name VARCHAR(100)   
AS   
	DECLARE @id INT   
	SELECT @id=id FROM om.items WHERE hostID=1 AND classID=1002 AND name=@name   
	IF @id IS NULL RETURN   
	DELETE om.items WHERE id=@id    
	DELETE om.items WHERE fromID=@id    
	DELETE om.items WHERE srcID=@id 

GO

ALTER PROCEDURE [mail].[getQueue]   
AS   
	SELECT TOP 1   
		M.aid   
		,M.msg   
		,S.SMTPHost   
		,S.SMTPSecure   
		,S.SMTPPort AS Port   
		--,H.name AS Hostname   
		--,H.Basecolor   
		--,ISNULL(M.hostname,'aliconnect') hostname   
		,A.username+'@'+A.host AS Username   
		,A.username+'@'+A.host AS FromEmail   
		,M.Hostname   
		,A.Password   
		,CONVERT(TEXT,M.Subject) Subject   
		,A.name ReplyToName   
		--,M.ToId   
		--,TE.email ToEmail   
		--,TE.name ToName   
		--,'mailer@aliconnect.nl' FromEmail   
		--,'Aliconnect' FromName   
		--,'mailer@aliconnect.nl' ReplyToEmail   
		--,'Aliconnect' ReplyToName   
	FROM   
		mail.queue M    
		--LEFT OUTER JOIN auth.host H ON H.id = M.hostID   
		LEFT OUTER JOIN auth.mailAccount A ON A.host = 'aliconnect.nl' AND A.username = 'mailer'   
		LEFT OUTER JOIN auth.mailServer S ON S.host = A.host   
		--LEFT OUTER JOIN auth.useremail TE ON TE.hostID=H.id AND TE.userID=M.toID   
	WHERE   
		M.sendDT IS NULL   
	ORDER BY M.pri,M.aid 

GO

ALTER PROCEDURE [shop].[getPurchaseOrders] @clientId INT,@hostID INT   
AS   
	SET NOCOUNT ON   
	DECLARE @T TABLE(quant INT,extra VARCHAR(500),id INT,obj VARCHAR(MAX),ArtNr VARCHAR(100),cp FLOAT,pd FLOAT,Lev VARCHAR(100),LevId INT)   
	INSERT @T   
	SELECT R.quant,R.extra,I.id,I.obj,ArtNr,P.cp,P.pd,VS.value AS Lev,VS.itemId AS LevId   
	FROM om.orderrow R   
	INNER JOIN om.items I ON I.id = R.itemId AND R.clientId=@clientId AND R.hostID=@hostID AND orderedDT IS NULL   
	INNER JOIN(SELECT id,name,value FROM om.attributes I ) X   
	PIVOT( MAX(value) FOR name IN(ArtNr,cp,pd,sc,cd) ) P ON P.id = I.id    
	INNER JOIN om.attributes VS ON VS.id=I.id AND VS.name='Supplier' --AND VS.itemId IS NOT NULL   
	--SELECT * FROM @T   
	SELECT * FROM(SELECT id,name,value FROM om.attributes I WHERE id=@hostID) X    
	PIVOT(MAX(value) FOR name IN(CompanyName,CompanyEmail,CompanyEmailInvoice,BusinessAddressStreet,BusinessAddressNumber,BusinessAddressAdd,BusinessAddressPostalCode,BusinessAddressCity,BusinessAddressTown,BusinessAddressState,BusinessAddressCountry,OtherAddressStreet,OtherAddressNumber,OtherAddressAdd,OtherAddressPostalCode,OtherAddressCity,OtherAddressTown,OtherAddressState,OtherAddressCountry,BTWnr)) P2    
	SELECT *,21 AS btw FROM    
	(SELECT id,name,value FROM om.attributes I INNER JOIN(SELECT DISTINCT LevId  FROM @T) T ON T.LevId=I.id) X    
	PIVOT(MAX(value) FOR name IN(CompanyName,CompanyEmail,CompanyEmailInvoice,BusinessAddressStreet,BusinessAddressNumber,BusinessAddressAdd,BusinessAddressPostalCode,BusinessAddressCity,BusinessAddressTown,BusinessAddressState,BusinessAddressCountry,OtherAddressStreet,OtherAddressNumber,OtherAddressAdd,OtherAddressPostalCode,OtherAddressCity,OtherAddressTown,OtherAddressState,OtherAddressCountry,BTWnr)) P2    
	--SELECT    
	--	T.LevId AS id,   
	--	P.*,   
	--	21 btw,   
	--	0 betkort   
	    
	--FROM(SELECT DISTINCT LevId FROM @T) T   
	--INNER JOIN om.items I ON I.id = T.LevId   
	--INNER JOIN    
	--ON P.id = I.id    
	SELECT obj,cp amount,pd discount,quant,ArtNr,'' unit,LevId FROM @T   
	UPDATE om.orderrow SET orderedDT=GETUTCDATE() WHERE clientId=@clientId AND hostID=@hostID AND orderedDT IS NULL   
	UPDATE om.items SET om.items.quant=ISNULL(om.items.quant,0)+T.quant FROM @T T WHERE om.items.id = T.id 

GO

ALTER VIEW [api].[items]     
AS    
	SELECT --*    
		I.id PrimaryKey,    
		I.ParentFolderId,  
		I.SourceObjectId,  
		I.idx ChildIndex,    
		CONVERT(VARCHAR(50),CAST(D.createdDT AS DATETIMEOFFSET),127) CreatedDateTime,    
		CONVERT(VARCHAR(50),CAST(D.modifiedDT AS DATETIMEOFFSET),127) LastModifiedDateTime,    
		CONVERT(VARCHAR(50),CAST(D.startDT AS DATETIMEOFFSET),127) StartDateTime,    
		CONVERT(VARCHAR(50),CAST(D.endDT AS DATETIMEOFFSET),127) EndDateTime,    
		CONVERT(VARCHAR(50),CAST(D.finishDT AS DATETIMEOFFSET),127) FinishDateTime,    
		I.id,    
		LOWER(CONVERT(VARCHAR(200),I.uid))uid,    
		LOWER(CONVERT(VARCHAR(200),I.secret))secret,    
		I.detailID,    
		I.masterID,    
		I.idx,    
		ISNULL(I.detailID,I.id)itemID,    
		D.hostID,    
		D.nr,    
		D.sourceID,    
		D.keyID,    
		D.srcID,    
		D.inherit,    
		I.inheritedID,    
		D.fromID,    
		D.toID,    
		D.ownerID,    
		D.userID,    
		D.classID,    
		D.Tag,    
		ISNULL(D.tagName,om.tagname(I.id)) tagname,    
		D.keyname,    
		CONVERT(VARCHAR(50),D.keyname) UniqueKey,    
		D.name,    
		D.title title,    
		D.description,    
		CONVERT(TEXT,D.subject) subject,    
		CONVERT(TEXT,D.summary) summary,    
		CONVERT(VARCHAR(50),CAST(D.createdDT AS DATETIMEOFFSET),127) createdDT,    
		CONVERT(VARCHAR(50),CAST(D.modifiedDT AS DATETIMEOFFSET),127) modifiedDT,    
		CONVERT(VARCHAR(50),CAST(D.startDT AS DATETIMEOFFSET),127) startDT,    
		CONVERT(VARCHAR(50),CAST(D.endDT AS DATETIMEOFFSET),127) endDT,    
		CONVERT(VARCHAR(50),CAST(D.finishDT AS DATETIMEOFFSET),127) finishDT,    
		CONVERT(VARCHAR(50),CAST(D.indexDT AS DATETIMEOFFSET),127) indexDT,    
		D.www,    
		D.state,    
		D.categorie,    
		D.selected,    
		D.groupname,    
		D.files,    
		D.msgCnt,    
		D.hasChildren,    
		D.geolocatie,    
		D.geolocatie location,    
		D.createdByID,    
		D.modifiedByID,    
		D.cp,    
		D.discount,    
		D.msrp,    
		D.findtext,    
		D.obj,    
		D.stock,    
		D.readID,    
		D.writeID,    
		D.filterfields,    
		D.childClassNr,    
		D.ClassNr,    
		D.activeCnt,    
		CONVERT(TEXT,D.config) itemConfig,    
		D.value    
	FROM om.items I    
	INNER JOIN om.items D ON D.id=ISNULL(I.detailID,I.id) AND I.deletedDT IS NULL AND D.deletedDT IS NULL --AND D.classID IS NOT NULL--> 0 --AND I.classID > 0 

GO

ALTER PROCEDURE [api].[setItemAttributeCount] @itemID INT,@fieldID INT=NULL,@value VARCHAR(MAX),@attributeName VARCHAR(100)=NULL,@StandardOutput VARCHAR(50)=NULL,@Quality VARCHAR(50)=NULL  
AS  
	DECLARE @count INT  
	--,@StandardOutput VARCHAR(50),@Quality VARCHAR(50),@MinRawValue FLOAT,@MinEngValue FLOAT,@MaxEngValue FLOAT,@MaxRawValue FLOAT,@MaxValidValue FLOAT,@MinValidValue FLOAT,@Hysteresis FLOAT,@engValue FLOAT  
  
	SET @count = CASE WHEN @value IS NULL THEN 0 WHEN @value>'' THEN 1 ELSE -1 END  
	IF @attributeName IS NOT NULL  
	BEGIN  
		IF NOT EXISTS(SELECT 0 FROM om.field WHERE name=@attributeName) INSERT om.field(name)VALUES(@attributeName)  
		SELECT @fieldID=id FROM om.field WHERE name=@attributeName  
	END  
	IF @fieldID IS NULL SET @fieldID=1738  
  
  
	--SELECT @StandardOutput=value FROM om.attributes WHERE id=@itemID AND fieldID=1889  
  
  
	--IF @value>'' AND ISNUMERIC(@value)=1  
	--BEGIN  
	--	SELECT @MinValidValue=value FROM om.attributes WHERE id=@itemID AND fieldID=1883  
	--	SELECT @MaxValidValue=value FROM om.attributes WHERE id=@itemID AND fieldID=1882  
	--	SET @Quality='Valid'  
	--	IF @MinValidValue>@value OR @MaxValidValue<@value SET @Quality='NotValid'  
	--	ELSE  
	--	BEGIN  
	--		EXEC api.setAttribute @id=@itemID,@fieldID=@fieldID,@value=@value  
	--		EXEC api.setAttribute @id=@itemID,@fieldID=1547,@value=@Quality  
	--		--SELECT @Quality=value FROM om.attributes WHERE id=@itemID AND fieldID=1547  
  
	--		SELECT @MinRawValue=value FROM om.attributes WHERE id=@itemID AND fieldID=1878  
	--		IF @MinRawValue IS NOT NULL  
	--		BEGIN  
	--			SELECT @MaxRawValue=value FROM om.attributes WHERE id=@itemID AND fieldID=1881  
	--			SELECT @MinEngValue=value FROM om.attributes WHERE id=@itemID AND fieldID=1879  
	--			SELECT @MaxEngValue=value FROM om.attributes WHERE id=@itemID AND fieldID=1880  
	--			SET @engValue=(@MaxEngValue-@MinEngValue)/(@MaxRawValue-@MinRawValue)*(@Value-@MinRawValue)+@MinEngValue  
	--		END  
  
	--		--SELECT @Hysteresis=value FROM om.attributes WHERE id=@itemID AND fieldID=1884  
	--	END  
	--END  
  
  
	DECLARE @TM TABLE(level INT,id INT)  
	;WITH P(level,id) AS(  
		SELECT   
			0,@itemId  
		UNION ALL    
		SELECT   
			level+1,I.masterId  
			FROM  P INNER JOIN om.items I ON I.id = P.id and level<50 AND I.masterID IS NOT NULL  
	)  
	INSERT @TM SELECT * FROM P   
  
	INSERT om.itemAttributeCount(itemID,fieldID)  
	SELECT T.id,@fieldID   
	FROM @TM T  
	LEFT OUTER JOIN om.itemAttributeCount IAC ON IAC.itemID=T.id AND IAC.fieldID=@fieldID  
	WHERE IAC.fieldID IS NULL  
  
	UPDATE om.itemAttributeCount SET attributeCount=attributeCount+@count  
	FROM @TM T  
	WHERE om.itemAttributeCount.itemID=T.id AND om.itemAttributeCount.fieldID=@fieldID  
	  
	SELECT T.*,IAC.*,@attributeName as attributeName,I.classID,I.class,GETUTCDATE() AS ts,@StandardOutput StandardOutput, @Quality Quality  
	FROM @TM T  
	INNER JOIN api.citems I ON I.id=T.id  
	INNER JOIN om.itemAttributeCount IAC ON IAC.itemID=T.id AND IAC.fieldID=@fieldID  
	ORDER BY T.level  
  
	--SELECT I.id,I.title,I.name,A.*   
	--FROM api.items I  
	--LEFT OUTER JOIN(SELECT id,name,value FROM om.attributes WHERE fieldID IN(1883,1882,1878,1881,1879,1880))X PIVOT(MAX(value)FOR name IN(MinValidValue,MaxValidValue,MinRawValue,MaxRawValue,MinEngValue,MaxEngValue)) A ON A.id=I.id  
	--WHERE I.id=@itemID  
  
	--SELECT D.id,D.title,D.name,@engValue Value,A.*   
	--FROM api.items I  
	--INNER JOIN api.items D ON D.id=I.detailID  
	--LEFT OUTER JOIN(SELECT id,name,value FROM om.attributes WHERE fieldID IN(1888,1889,1875,1876,1884,1892,1893))X PIVOT(MAX(value)FOR name IN(AttributeType,ValueType,LowWarning,HighWarning,LowAlarm,HighAlarm,Hysteresis)) A ON A.id=D.id  
	--WHERE I.masterID=@itemID 

GO

ALTER PROCEDURE [api].[setItemAttributeId] @classID INT=NULL,@itemID INT=NULL  
AS   
	DECLARE @T TABLE(aid INT,name VARCHAR(500) collate Latin1_General_CS_AI)   
	INSERT @T   
	SELECT aid,name   
	FROM om.attributes   
	WHERE fieldid IS NULL AND id IN(SELECT id FROM om.items WHERE classID=@classID OR id=@itemID)   
	SELECT * FROM @T  
  
	INSERT om.field(name)   
	SELECT DISTINCT name FROM @T WHERE name NOT IN(SELECT name FROM om.field)   
	UPDATE om.attributes SET om.attributes.fieldID=F.id FROM @T T INNER JOIN om.field F ON F.name=T.name    
	WHERE om.attributes.aid=T.aid AND om.attributes.fieldID IS NULL 

GO

ALTER PROCEDURE [api].[setItemMerge] @oldid INT, @newid INT    
AS    
	UPDATE om.attributes SET id=@newid WHERE id=@oldid    
	UPDATE om.attributes SET itemid=@newid WHERE itemid=@oldid    
	UPDATE om.items SET toID=@newid WHERE toid=@oldid    
	UPDATE om.items SET fromID=@newid WHERE fromid=@oldid    
	UPDATE om.items SET srcID=@newid WHERE srcid=@oldid    
	UPDATE om.items SET hostID=@newid WHERE hostid=@oldid    
	UPDATE om.items SET masterID=@newid WHERE masterID=@oldid    
	UPDATE om.link SET fromid=@newid WHERE fromid=@oldid    
	UPDATE om.link SET toid=@newid WHERE toid=@oldid    
	UPDATE auth.email set id=@newid WHERE id=@oldid    
	DELETE om.items WHERE id=@oldid 

GO

ALTER PROCEDURE [auth].[delAccount] @email VARCHAR(100)=NULL,@userID INT=NULL   
AS   
	IF @userID IS NULL SELECT @userID=id FROM auth.email WHERE email=@email   
	IF @userid IS NULL RETURN   
	--UPDATE om.items SET srcID = NULL where srcID IN(SELECT id FROM om.items WHERE hostID=1 AND classID=1004 AND toID=@userID)   
	UPDATE om.items SET deletedDT=GETUTCDATE() WHERE hostID=1 AND classID=1004 AND toID=@userID   
	UPDATE om.items SET deletedDT=GETUTCDATE() WHERE id=@userID   
	--DELETE auth.users WHERE id=@userID   
	--DELETE om.items WHERE id=@userID   
	--DELETE auth.email WHERE id=@userID 

GO

ALTER PROCEDURE [auth].[getPerson] @email VARCHAR(500),@PersonID INT OUTPUT   
AS   
	DECLARE @aid INT   
	SELECT @aid=aid,@personId=id FROM auth.email WHERE email=@email   
	IF @aid IS NULL   
	BEGIN   
		INSERT auth.email(email) VALUES(@email)   
		SET @aid=@@identity    
	END   
	IF @PersonID IS NULL   
	BEGIN   
		INSERT om.items(classID,name,hostID,www) VALUES(1000,@email,1,1)   
		SET @PersonID=scope_identity()   
		UPDATE auth.email SET id=@PersonID WHERE aid=@aid   
	END 

GO

ALTER PROCEDURE [auth].[setEmail] @email VARCHAR(500),@id INT=NULL   
AS   
	DECLARE @aid INT,@PersonID INT,@ClassID INT,@SrcID INT   
	SELECT @aid=aid,@PersonID=id FROM auth.email WHERE email=@email   
	IF @aid IS NULL INSERT auth.email(email,id) VALUES(@email,@id)   
	SELECT @ClassID=ClassID,@SrcID=SrcID FROM om.items WHERE id=@ID   
	IF @ClassID=1000 SET @SrcID=@Id   
	IF @PersonID IS NULL UPDATE auth.email SET id=@SrcID WHERE aid=@aid 

GO

ALTER TRIGGER [om].[itemsUpdate] ON [om].[items] AFTER UPDATE,INSERT   
AS   
	SET NOCOUNT ON;   
	IF UPDATE(hasChildren) AND EXISTS(SELECT 0 FROM om.items WHERE detailId IN(SELECT id FROM inserted))   
		UPDATE om.items SET om.items.hasChildren=I.hasChildren   
		FROM inserted I    
		WHERE om.items.detailId = I.id   
	IF UPDATE(clone)    
	BEGIN   
		UPDATE OM.items SET deletedDT=GETUTCDATE() WHERE id IN( 
			SELECT CC.id--,CC.masterId,CC.inheritedId--,CC.inheritedId,C.id 
			FROM inserted I   
			INNER JOIN api.items CC ON CC.masterId=I.id AND CC.inheritedId IS NOT NULL  
			LEFT OUTER JOIN api.items C ON C.masterID=ISNULL(I.inheritedID,I.srcID) AND C.masterId IS NOT NULL    
				AND C.masterId<>ISNULL(C.srcID,0) 
				AND ISNULL(C.selected,1)=1 
				AND ISNULL(I.selected,1)=1 
				AND CC.inheritedId=C.id 
			WHERE I.clone=1 AND ISNULL(I.selected,1)=1 AND C.id IS NULL 
		) 
 
		DECLARE @T TABLE(masterID INT,id INT,selected BIT,inheritedId INT,idx INT)   
		INSERT @T 
		SELECT I.id masterID,CC.id id,C.selected,C.id inheritedId,C.idx   
		FROM inserted I   
		INNER JOIN api.items C ON C.masterID=ISNULL(I.inheritedID,I.srcID) AND C.masterId IS NOT NULL    
			--AND I.srcId IS NOT NULL    
			AND C.masterId<>ISNULL(C.srcID,0)    
			AND ISNULL(C.selected,1)=1    
			AND ISNULL(I.selected,1)=1    
			--AND I.clone=1 AND ISNULL(I.selected,1)=1 --OR I.clone=1)   
		LEFT OUTER JOIN api.items CC ON CC.masterId=I.id AND CC.inheritedId IS NOT NULL AND CC.inheritedId=C.id   
		WHERE I.clone=1 AND ISNULL(I.selected,1)=1   
 
		--Maak kinderen aan die nog niet bestaan   
		IF EXISTS(SELECT 0 FROM @T WHERE id IS NULL) --AND ISNULL(C.selected,1)=1)   
			INSERT om.items(inheritedId,masterId,hostId,userId,classId,srcId,idx,selected,groupname,files,state,categorie,startDt,endDt,finishDt,filterfields,inherit)   
			SELECT C.id,T.masterID,C.hostId,C.userId,C.classId,C.srcID,C.idx,T.selected,C.groupname,C.files,C.state,C.categorie,C.startDt,C.endDt,C.finishDt,C.filterfields,1   
			FROM @T T   
			INNER JOIN api.items C ON C.id=T.inheritedId AND T.id IS NULL   
   
		--Update kinderen    
		IF EXISTS(SELECT 0 FROM inserted I WHERE id IN(SELECT masterID FROM om.items WHERE deletedDT IS NULL AND ISNULL(inheritedID,srcID) IS NOT NULL AND ISNULL(om.items.selected,1)=1))   
		UPDATE om.items SET clone=1,idx=C.idx,title=ISNULL(C.title,'NO TITLE'),summary=C.summary,subject=C.subject,tag=C.tag,hasChildren=C.hasChildren,classID=C.classID,name=C.name   
		--,srcID=CASE WHEN inheritedID IS NOT NULL THEN C.srcID ELSE om.items.srcID END   
		FROM(   
			SELECT C.id,CC.idx,CC.title,CC.subject,CC.summary,CC.tag,CC.srcID,CC.hasChildren,CC.classID,CC.name   
			FROM inserted I   
			INNER JOIN om.items C ON C.masterID=I.id AND C.deletedDT IS NULL AND ISNULL(C.selected,1)=1   
			INNER JOIN om.items CC ON CC.id=C.inheritedID   
		) C WHERE om.items.id = C.id   
	END   
	--IF UPDATE(startDT)OR UPDATE(endDT)OR UPDATE(finishDT) INSERT aimhis.om.items(id,startDT,endDT,finishDT,modifiedById) SELECT id,startDT,endDT,finishDT,modifiedById FROM inserted 

GO

ALTER VIEW [api].[Account]  
AS  
	SELECT I.id,I.toID userID,I.hostID,IG.id AS groupID,I.title,IG.title AS groupTitle,I.startDT,I.endDT,AM.value as Email  
	FROM api.items I   
		INNER JOIN om.attributes A ON A.id = I.id AND A.fieldID=1228 AND I.classID=1004   
		INNER JOIN api.items IG ON IG.id = A.itemID  
		LEFT OUTER JOIN om.attributes AM ON AM.id = I.id AND AM.fieldID=931 

GO

ALTER VIEW [api].[attributes]   
AS   
	SELECT F.name,ISNULL(ISNULL(CONVERT(TEXT,I.title),SI.title),A.value)value,A.id,A.hostID,A.createdDT,A.modDT AS modifiedDT,A.modUserID AS modifiedByID,A.userID,A.aid,A.fieldID,A.itemID,A.classID   
	FROM om.attributes A   
	INNER JOIN om.field F ON F.id=A.fieldID  
	LEFT OUTER JOIN api.items I ON I.id=A.itemID  
	LEFT OUTER JOIN api.items SI ON SI.id=ISNULL(I.detailID,I.srcID) 

GO

ALTER VIEW [api].[citems]     
AS    
	SELECT    
		I.*,    
		C.name class,    
		C.name AS [schema],    
		C.name ClassName,    
		--CONVERT(TEXT,C.config) config,    
		ISNULL(S.title,S.name) typical    
	FROM api.items I  
	LEFT OUTER JOIN om.items C ON C.id=I.classID    
	LEFT OUTER JOIN api.items S ON S.id=I.srcID  
	--LEFT OUTER JOIN api.items M ON M.id=I.masterID 

GO

ALTER VIEW [api].[item]    
AS   
	SELECT * FROM api.items   

GO

ALTER VIEW [api].[itemdetails]   
AS    
	SELECT F.itemId fieldmasterID,I.*    
	FROM om.attributes F    
	INNER JOIN api.items I ON F.typeid=11 AND I.id=F.id 

GO

ALTER VIEW [auth].[account]   
AS   
	SELECT I.name,I.subject,I.summary,I.FromID AS CompanyID,I.ToID AS UserID,I.id AS AccountID,I.HostID,F.ItemID AS GroupID,E.value AS email    
	FROM api.items I   
		INNER JOIN om.attributes F ON I.id=F.id AND F.classID=1103 AND F.itemID IS NOT NULL    
		INNER JOIN om.attributes E ON I.id=E.id AND E.fieldID=931   
	WHERE I.classID=1004 

GO

ALTER VIEW [auth].[useremail]   
AS   
	select   
		LC.hostID,U.id AS userID,ACFE.value AS email,AC.name   
	from   
		api.items LC   
		INNER JOIN api.items AC ON    
			AC.id=LC.srcID AND LC.classID=1100 AND AC.classID=1004   
		INNER JOIN auth.users U ON    
			U.id=AC.toID   
		INNER JOIN om.attributes ACFE ON   
			ACFE.id=AC.id AND ACFE.name='BusinessEmail' 

GO

ALTER VIEW [cfg].[msg] AS   
	SELECT I.keyname name,I.name AS title,I.subject,I.summary,P.msg,P.errmsg,P.mailmsg   
	FROM(SELECT id,name,value FROM om.attributes WHERE fieldID IN(730,1429,1437))x pivot(max(value)for name in(keyname,subject,summary,msg,errmsg,mailmsg)) P   
	INNER JOIN api.items I ON I.id=P.id AND I.classID=1010 

GO

ALTER VIEW [item].[csp] AS    
			SELECT I.*,'csp'[schema],F.users,F.cspnummer,F.volgnummer,F.QuoteNr,F.WkIn,F.Deadline,F.startPE,F.Status,F.Customer,F.Site,F.Area,F.Machine,F.Layout,F.Project,F.System,F.Scope,F.Request,F.ProjectKlasse,F.PlannerBB,F.ProjectleiderPE,F.UrenGeschat,F.UrenWerkelijk,F.PEPDgereed,F.DescriptionME,F.DescriptionHW,F.DescriptionSW,F.DocFDS,F.DocDiagrams,F.DocTest,F.TestDescription,F.TestRequiredMachineParts,F.TestAssemblerRequired,F.TestFAT,F.Eng_me,F.Eng_hw,F.Eng_sw,F.Eng_pli,F.Materiaal,F.Aandacht,F.Uitgang,F.Risico,F.Fase,F.convManual,F.PartsManualMatri,F.PartsManual,F.VervangenMatriBook,F.SpecialUserServiceManual,F.Elektro660,F.TrackFrame600,F.FarmPacker601,F.Transfer,F.Denester,F.Infeed,F.Accumulator,F.Mobane,F.MaxipackContiflow,F.Loader,F.PackingLane,F.FarmPackerM70M55,F.AutopackMr40,F.MR10,F.Traystacker,F.TestDatum,F.Testtijd,F.FAT,F.FATdatum,F.Monteur,F.Opmerkingen,F.Aanbeveling,F.Gereed    
			FROM api.items I    
            LEFT OUTER JOIN(SELECT id fielditemid,name,value FROM om.attributes WHERE fieldID IN(1223,1428,1006,606,998,1457,1456,1458,1273,718,1455,959,1280,793,1174,618,1272,1241,639,702,621,1295,1027,751,573,689,1461,683,1026,1207,1418)) X PIVOT(MAX(value)FOR name IN(users,cspnummer,volgnummer,QuoteNr,WkIn,Deadline,startPE,Status,Customer,Site,Area,Machine,Layout,Project,System,Scope,Request,ProjectKlasse,PlannerBB,ProjectleiderPE,UrenGeschat,UrenWerkelijk,PEPDgereed,DescriptionME,DescriptionHW,DescriptionSW,DocFDS,DocDiagrams,DocTest,TestDescription,TestRequiredMachineParts,TestAssemblerRequired,TestFAT,Eng_me,Eng_hw,Eng_sw,Eng_pli,Materiaal,Aandacht,Uitgang,Risico,Fase,convManual,PartsManualMatri,PartsManual,VervangenMatriBook,SpecialUserServiceManual,Elektro660,TrackFrame600,FarmPacker601,Transfer,Denester,Infeed,Accumulator,Mobane,MaxipackContiflow,Loader,PackingLane,FarmPackerM70M55,AutopackMr40,MR10,Traystacker,TestDatum,Testtijd,FAT,FATdatum,Monteur,Opmerkingen,Aanbeveling,Gereed)) F ON I.id=F.fielditemid   
            WHERE I.classID=2102 

GO

ALTER VIEW [item].[task] AS SELECT I.*,'task'[schema],F.users,F.prio,F.Master,F.Project,F.Vraagstelling,F.Uitwerking,F.Owner,F.Calc,F.Work,F.Voltooid FROM api.items I    
            LEFT OUTER JOIN(SELECT id fielditemid,name,value FROM om.attributes WHERE fieldID IN(806,980,1406,1193,639,1209,940,1318,1454)) X PIVOT(MAX(value)FOR name IN(users,prio,Master,Project,Vraagstelling,Uitwerking,Owner,Calc,Work,Voltooid)) F ON I.id=F.fielditemid   
            WHERE I.classID=1162 

GO

ALTER VIEW [om].[itemSrc]    
AS   
WITH P(level,id,srcID) AS(    
		SELECT 0,I.id,I.id   
		FROM api.items I    
		--WHERE I.srcID IS NOT NULL   
	UNION ALL   
		SELECT level+1,P.id,I.srcID   
		FROM api.items I    
		INNER JOIN P ON I.id=P.srcID AND level<10   
	)    
	SELECT * FROM P WHERE srcID IS NOT NULL 

GO

ALTER VIEW [om].[itemvisit]   
AS   
	SELECT I.id,I.name,I.findtext,I.keyname,I.classID,I.state,I.obj,I.idx,V.lastvisitDT,V.userID--,V.hostID   
	FROM om.itemuservisit V   
	INNER JOIN api.items I ON I.id=V.id 

GO

ALTER FUNCTION [api].[fieldget](@id INT,@fieldID INT) RETURNS VARCHAR(MAX)    
AS   
BEGIN   
	DECLARE @value VARCHAR(MAX)   
	SET @value=NULL   
	;WITH P(level,id,srcID) AS(    
		SELECT 0,I.id,I.srcID    
		FROM api.items I    
		WHERE I.id=@id    
	UNION ALL   
		SELECT level+1,I.id,I.srcID   
		FROM api.items I    
		INNER JOIN P ON I.id=P.srcID   
	)    
	SELECT @value=ISNULL(@value,F.value)   
	FROM P    
	INNER JOIN om.attributes F ON F.id=P.id AND F.fieldID=@fieldID   
	RETURN @value   
END 

GO

ALTER FUNCTION [fn].[getAttribute](@id INT,@attributeName VARCHAR(500)) RETURNS VARCHAR(MAX)    
AS   
BEGIN   
	DECLARE @value VARCHAR(MAX)   
	DECLARE @fieldID INT  
	SELECT @fieldID=id FROM om.field WHERE name=@attributeName  
	SET @value=NULL   
	;WITH P(level,id,srcID) AS(    
		SELECT 0,I.id,I.srcID    
		FROM api.items I    
		WHERE I.id=@id    
	UNION ALL   
		SELECT level+1,I.id,I.srcID   
		FROM api.items I    
		INNER JOIN P ON I.id=P.srcID   
	)    
	SELECT @value=ISNULL(@value,F.value)   
	FROM P    
	INNER JOIN om.attributes F ON F.id=P.id AND F.fieldID=@fieldID   
	RETURN @value   
END 

GO

ALTER FUNCTION [api].[getChildren](@itemId INT,@level INT) RETURNS TABLE    
AS   
RETURN (   
	WITH P( id,level,masterId,name)    
	AS (    
		SELECT ISNULL(I.detailId,I.id),0,I.masterId,I.name   
			FROM api.items I   
			WHERE I.id = @itemId   
		UNION ALL   
		SELECT ISNULL(I.detailId,I.id),level+1,I.masterId,I.name   
		FROM P INNER JOIN api.items I ON I.masterId = P.id and level<@level   
	)    
	SELECT  * FROM P   
) 

GO

ALTER FUNCTION [api].[getHost](@host VARCHAR(50)) RETURNS TABLE AS RETURN(   
	SELECT H.id AS HostID,H.keyname AS HostName,H.name CompanyName,H.itemConfig config   
	FROM    
		api.items H   
		INNER JOIN auth.host AH ON AH.id = H.id   
		LEFT OUTER JOIN auth.hostdomain HD ON HD.domain=@host AND HD.id=H.id   
		LEFT OUTER JOIN api.items S ON S.classID=1091 AND H.id=S.hostID   
	WHERE    
		H.hostID=1 AND H.classId=1002 AND(AH.name+'.aliconnect.nl'=@host OR S.keyname+'.aliconnect.nl'=@host OR HD.domain=@host)   
) 

GO

ALTER FUNCTION [api].[itemAttributes](@id INT) RETURNS TABLE    
AS    
RETURN(   
	WITH P( id,srcId,level) AS(    
		SELECT id,srcId,0 FROM api.items WHERE id = @id    
		UNION ALL   
		SELECT I.id,I.srcId,level+1 FROM P INNER JOIN api.items I ON I.id = P.srcId AND level<8   
	)   
	SELECT P.id,name,value    
	FROM P INNER JOIN om.attributes F ON F.id=P.id   
) 

GO

ALTER PROCEDURE [api].[delItem] @id VARCHAR(50), @userID INT=NULL, @hostID INT=NULL   
AS   
	SET NOCOUNT ON   
	;WITH P( id,level,masterId,name)    
	AS (    
		SELECT I.id,0,I.masterId,I.name   
			FROM api.items I   
			WHERE I.id = @id   
		UNION ALL   
		SELECT I.id,level+1,I.masterId,I.name   
		FROM P INNER JOIN api.items I ON I.masterId = P.id    
	)    
	UPDATE om.items SET deletedDT=GETUTCDATE(),deletedById=@userID WHERE id IN(SELECT id FROM P)   
	SELECT CONVERT(VARCHAR(20),@hostID)+'/'+RIGHT(@id, 3)+'/'+@id AS path 

GO

ALTER PROCEDURE [api].[getDeviceTree] @hostID INT=NULL,@hostUID VARCHAR(50)=NULL,@deviceUID VARCHAR(100)=NULL,@deviceID INT=NULL,@name VARCHAR(50)   
AS   
   
 	;WITH P(level, id, name) AS(    
		SELECT 0,id,name FROM api.items WHERE id=@deviceID   
		UNION ALL   
		SELECT level+1,I.id,I.name FROM P INNER JOIN api.items I ON I.masterID = P.id AND level<7   
	)   
	SELECT @deviceID=id FROM P WHERE name=@name   
   
	--DECLARE @id INT   
	--SELECT @id=I.id FROM api.items I INNER JOIN api.items H ON H.id=@hostID AND H.uid=@hostUID AND I.uid=@deviceUID--I.keyname=@name   
	--IF @deviceID IS NULL SELECT @deviceID=I.id FROM api.items I WHERE I.classID=2107 AND I.uid=@deviceUID   
   
	SELECT D.name typical,P.idx,D.id--,F.name,F.value title,F.typeID,F.aid    
	FROM api.items P    
	INNER JOIN api.items D ON P.masterID=@deviceID AND D.id=P.detailID    
	--LEFT OUTER JOIN om.attributes F ON F.id = D.id AND F.typeID IN(1,2)    
	ORDER BY P.keyname,D.name,P.idx--,F.name 

GO

ALTER PROCEDURE [api].[getHostIndex] @hostID INT=NULL,@host VARCHAR(50)=NULL,@httpdomainhost VARCHAR(50)=NULL,@key VARCHAR(50)=NULL,@appName VARCHAR(50)=NULL,@pagename VARCHAR(50)=NULL,@app BIT=null,@page BIT=null   
AS   
	DECLARE @appID INT,@pageID INT,@hostUID VARCHAR(50),@appUID VARCHAR(50),@title VARCHAR(500),@description VARCHAR(MAX),@files VARCHAR(MAX)   
	--SELECT * FROM auth.app WHERE convert(varchar(50),uid)=@key   
	IF @key IS NOT NULL SELECT @appID=id,@appUID=uid,@appName=name,@hostID=hostID FROM auth.app WHERE convert(varchar(50),uid)=@key   
	IF @hostID IS NULL SELECT @hostID=id FROM auth.host H WHERE H.name=@host OR(@host IS NULL AND H.domain=@httpdomainhost)   
	--SELECT @hostID   
	IF @app=1 AND @appID IS NULL SELECT @appID=id,@appUID=uid,@appName=name FROM auth.app WHERE hostID=@hostID AND name=isnull(@appName,'')   
	IF @app=1 AND @appID IS NULL SELECT @appID=id,@appUID=uid,@appName=name FROM auth.app WHERE hostID=@hostID AND name=''   
	ELSE IF @page=1 AND @pagename IS NOT NULL SELECT TOP 1 @pageID=id,@pagename=name,@description=subject,@files=files FROM api.items WHERE hostID=@hostID AND classID=1092 AND keyname IS NOT NULL AND keyname=@pagename   
	ELSE IF @page=1 SELECT TOP 1 @pageID=id,@pagename=name,@description=subject,@files=files FROM api.items WHERE hostID=@hostID AND classID=1092    
	--SELECT @hostID=id FROM auth.host WHERE name=@host OR(@host IS NULL AND domain=@domain)   
	--SELECT @hostID hostID,@hostUID hostUID,@appID appID,@appUID appUID   
	SELECT TOP 1    
	CONVERT(VARCHAR(50),H.uid) hostUID,H.id hostID,H.name host,@appID appID,@appUID appUID,@appName appName,@pageID pageID,@pagename title,@description description,@files files   
	FROM auth.host H    
	WHERE H.id=@hostID --OR H.name=@host OR(@host IS NULL AND H.domain=@domain) 

GO

ALTER PROCEDURE [api].[getItemAttributes] @id INT=NULL    
AS    
	--get all item properties from source tree  
	SET NOCOUNT ON;SET TEXTSIZE 2147483647;    
	;WITH P ( id,srcID,level) AS (     
		SELECT id,srcID,0 FROM api.items WHERE id=@id     
		UNION ALL    
		SELECT I.id,I.srcID,level+1 FROM P INNER JOIN api.items I ON I.id = P.srcID AND level<20    
	)    
	SELECT P.level    
		,@id id    
		,A.aid    
		,A.www    
		,A.name    
		,ISNULL(CONVERT(TEXT,I.name),A.value) as value    
		,A.userID    
		,A.itemID    
		,A.hostID    
		,A.rights    
		,A.modDt    
		,A.moduserID    
	FROM    
		P    
		INNER JOIN om.attributes A ON A.id = P.id     
		LEFT OUTER JOIN api.items I ON I.id = A.itemID     
	WHERE    
		A.value>'' OR I.name>''     
	ORDER BY level DESC 

GO

ALTER PROCEDURE [api].[getItemFile]     
	@sessionId VARCHAR(50) = NULL,     
	@host VARCHAR(500) = NULL,    
	@hostID INT = NULL,    
	@userID INT = NULL,    
	@hostname VARCHAR(500) = NULL,    
	@name VARCHAR(500) = NULL,    
	@path VARCHAR(500) = NULL,    
	@root VARCHAR(500) = NULL,    
	@src VARCHAR(500) = NULL,    
	@srcs VARCHAR(500) = NULL,    
	@size VARCHAR(500) = NULL,    
	@ext VARCHAR(500) = NULL,    
	@type VARCHAR(500) = NULL,    
	@id VARCHAR(10) = NULL,    
	@sync BIT = NULL,    
	@itemId VARCHAR(10) = NULL,    
	@lastModifiedDate VARCHAR(500) = NULL    
AS    
	SET NOCOUNT ON    
	SET DATEFORMAT DMY    
	DECLARE @groupID INT, @uid UNIQUEIDENTIFIER, @prefix VARCHAR(250)    
	IF @hostID IS NULL SELECT @groupID=groupID,@hostID=hostID,@userID=userID FROM  api.hostAccountGet(@host,@sessionID);     
	--EXEC auth.userGet @sessionId=@sessionId, @host=@host, @groupID=@groupID OUTPUT, @hostID=@hostID OUTPUT, @userID=@userID OUTPUT    
	SELECT @host=keyname FROM api.items WHERE id=@hostID    
	--SET @host=REPLACE(REPLACE(REPLACE(@host,'.aliconnect',''),'.nl',''),'.','')    
	IF ISNULL(@id,0) = 0    
	BEGIN    
		SET @uid = newid()    
		SET @src='/shared/'+CONVERT(VARCHAR(10),@hostID)+'/'+RIGHT(@itemId, 3)+'/'+@itemId+'/'+REPLACE(CONVERT(VARCHAR(250),@uid),'-','')+'/'+REPLACE(@name,' ','_')    
		INSERT om.files (uid,itemId,userID,hostID,host,name,ext,type,src,srcs,size,lastModifiedDate)     
		SELECT @uid,@itemId,@userID,@hostID,@hostname,@name,@ext,@type,@src,ISNULL(@srcs,@src),@size,ISNULL(@lastModifiedDate,GETUTCDATE())    
		SET @id=@@IDENTITY    
	END    
	    
	SELECT F.id,type,ext,CONVERT(VARCHAR(250),uid) as uid,host,name,src,srcs,size,lastModifiedDate--,OD.token    
	FROM om.files F    
	--LEFT OUTER JOIN auth.onedrive OD ON OD.id=1    
	WHERE F.id = @id 

GO

ALTER PROCEDURE [api].[getItemLink] @hostID INT=NULL,@detailID INT=NULL,@srcID INT=NULL,@classID INT=NULL,@class VARCHAR(500)=NULL,@keyid INT=NULL,@key VARCHAR(500)=NULL,@keyname VARCHAR(500)=NULL,@hasChildren BIT=NULL,@id INT=NULL OUTPUT,@name VARCHAR(500)=NULL,@state VARCHAR(500)=NULL,@idx INT=NULL,@masterID INT=NULL   
AS   
	SET NOCOUNT ON;   
	SET @id=NULL   
	IF @class IS NOT NULL IF ISNUMERIC(@class)=1 SET @classID=@class ELSE SELECT @classID=id FROM om.class WHERE class=@class    
	--IF @key IS NOT NULL IF ISNUMERIC(@key)=1 SET @keyID=@key ELSE SET @keyname=@key    
	SET @key=ISNULL(@key,@keyname)   
	IF @id IS NULL AND @key IS NOT NULL SELECT TOP 1 @id=id FROM api.items WHERE hostID=@hostID AND classID=@classID AND keyName=@key --AND masterID=ISNULL(@masterID,masterID)   
	IF @id IS NULL AND @key IS NOT NULL SELECT TOP 1 @id=id FROM api.items WHERE hostID=@hostID AND classID=@classID AND name=@key --AND masterID=ISNULL(@masterID,masterID)   
	IF @id IS NULL AND @keyID IS NOT NULL SELECT TOP 1 @id=id FROM api.items WHERE hostID=@hostID AND classID=@classID AND keyID=@keyID --ND masterID=ISNULL(@masterID,masterID)   
   
	--select @id   
	--return    
	IF @id IS NULL   
	BEGIN   
		INSERT om.items(hostID,classID,keyID,keyName)    
		VALUES(@hostID,@classID,@keyID,@key)   
		SET @id = scope_identity()   
	END   
	UPDATE om.items SET masterID=ISNULL(@masterID,masterID),name=ISNULL(ISNULL(@name,@key),name),hasChildren=ISNULL(@hasChildren,hasChildren),idx=ISNULL(@idx,idx),detailID=ISNULL(@detailID,detailID),srcID=ISNULL(@srcID,srcID),state=ISNULL(@state,state) WHERE id=@id 

GO

ALTER PROCEDURE [api].[getItemModelTree] @id INT   
AS   
	SET NOCOUNT ON   
	;WITH P( id,detailID,srcID,masterID,level,path) AS(    
		SELECT id,detailID,srcID,null,1,CONVERT(VARCHAR(5000),'')    
		FROM api.items    
		WHERE id = @id AND selected=1   
		UNION ALL   
		SELECT I.id,I.detailID,I.srcID,P.id,level+1,CONVERT(VARCHAR(5000),path+STR(I.idx))    
		FROM P   
		INNER JOIN api.items I ON I.masterID = ISNULL(P.detailID,P.id) AND level<10 AND ISNULL(selected,1)=1--AND ISNULL(I.selected,1)=1    
		INNER JOIN api.items D ON D.id = ISNULL(I.detailID,I.id)    
	)    
	SELECT I.id as itemID,I.name,P.masterID,P1.*--,P.level,I.idx   
	FROM P   
	INNER JOIN api.items I ON I.id = P.id   
	INNER JOIN api.items D ON D.id=ISNULL(I.detailID,I.id)    
	LEFT OUTER JOIN om.class C ON C.id = D.classID   
	INNER JOIN(SELECT I.id,F.name,F.value FROM om.attributes F INNER JOIN P I ON F.id IN(I.id,I.srcID)) X PIVOT(max(value) FOR name in(w,h,depth,x,y,z,r,rx,ry,rz,children,shape,geo,dx,dy,dz,fx,PowerKVA,Air,Water)) P1 ON P1.id=I.id    
	where path is not null   
	ORDER BY path 

GO

ALTER PROCEDURE [api].[getItemTree] @id INT,@host VARCHAR(50) = NULL,@sessionId VARCHAR(50) = NULL   
AS   
	SET NOCOUNT ON   
	SET TEXTSIZE 2147483647   
	--DECLARE @groupID INT, @hostID INT, @userID INT, @detailID INT,@path VARCHAR(MAX), @rw BIT   
	--EXEC auth.userGet @sessionId=@sessionId, @host=@host, @groupID=@groupID OUTPUT, @hostID=@hostID OUTPUT, @userID=@userID OUTPUT   
	--IF @id IS NULL SET @id = @userID   
	--DECLARE @T TABLE(level TINYINT,id INT,name VARCHAR(250),class VARCHAR(250),groupname VARCHAR(250),idx INT,detailID INT,classID INT,srcID INT,selected BIT, disabled BIT, menuitem BIT, hasChildren BIT, fields TEXT)   
	DECLARE @T TABLE(id INT,detailID INT,masterID INT,classID INT,srcID INT,level TINYINT,path VARCHAR(5000),files VARCHAR(MAX))   
	DECLARE @T2 TABLE(id INT,srcID INT,files VARCHAR(MAX), level INT)   
	;WITH P( id,detailID,masterID,classID,srcID,level,path,files)    
	AS(    
		SELECT id,detailID,null,classID,srcID,1,CONVERT(VARCHAR(5000),''),files   
		FROM api.items   
		WHERE id = @id    
		UNION ALL   
		SELECT I.id,I.detailID,P.id,I.classID,I.srcID,level+1,CONVERT(VARCHAR(5000),path+STR(I.idx)),I.files    
		FROM P INNER JOIN api.items I ON I.masterID = P.id AND level<6 AND ISNULL(I.selected,1)=1   
	)    
	INSERT @T SELECT * FROM P   
	--SELECT * FROM @T RETURN   
	;WITH P( id, srcID, files, level)    
	AS(    
		SELECT srcID,srcID,files,0    
		FROM @T   
		UNION ALL   
		SELECT P.id,I.srcID,ISNULL(P.files,I.files),level+1   
		FROM P INNER JOIN api.items I ON I.id=P.srcID   
	)    
	INSERT @T2 SELECT * FROM P   
	SELECT I.id,I.name,I.files   
	FROM(SELECT DISTINCT id FROM @T2) T   
	INNER JOIN api.items I ON T.id=I.id   
	--UPDATE @T SET files=P.files FROM(SELECT id itemID,files FROM @T2 where files is not null) P WHERE id=P.itemId   
	SELECT T.id,name,value   
	FROM(SELECT DISTINCT id,srcID,level FROM @T2) T   
	INNER JOIN om.attributes F ON T.srcID=F.id --AND name IN('Product','')   
	ORDER BY T.level DESC   
	SELECT I.id,I.name,I.files,I.masterID,I.srcID,T.level   
	FROM(SELECT id,level FROM @T) T   
	INNER JOIN api.items I ON T.id=I.id   
	ORDER BY level,I.masterID,I.idx   
	SELECT T.id,name,value   
	FROM(SELECT DISTINCT id FROM @T) T   
	INNER JOIN om.attributes F ON T.id=F.id --AND name IN('Product')   
	RETURN   
	--SELECT 	P.id,A.name,A.value   
	--FROM   
	--	@T2 P   
	--	INNER JOIN api.items I ON I.id=P.id   
	--	INNER JOIN om.attributes A ON A.id IN(I.detailID,I.id,I.srcID,I.toID,I.FromID) AND A.name > '' AND A.value > ''    
	--WHERE A.value>''   
	--SELECT C.id,C.config FROM(SELECT DISTINCT classID FROM @T) T INNER JOIN om.class C ON C.id=T.classID   
	SELECT P.level,P.masterID,I.id,I.name,I.files,I.state,I.startDT,I.endDT,I.finishDT,D.groupname,I.idx,I.detailID,D.classID,I.srcID,D.hasChildren,P.files sFiles   
	FROM @T P   
	INNER JOIN api.items I ON I.id = P.id --AND I.deletedDT IS NULL   
	INNER JOIN om.items D ON D.id=ISNULL(I.detailID,I.id) AND D.deletedDT IS NULL   
	--where D.name like 'vkl%'   
	ORDER BY path 

GO

ALTER PROCEDURE [api].[getUserItems]  @UserID INT, @HostID INT   
AS   
	SET NOCOUNT ON   
	DECLARE @T TABLE(id INT,lastvisitDT DATETIME)   
	INSERT @T SELECT TOP 500 id,lastvisitDT FROM om.itemuservisit WHERE userID=@userID ORDER BY lastvisitDT DESC   
	INSERT @T SELECT TOP 500 id,lastvisitDT FROM om.itemuservisit WHERE userID<>@userID AND id NOT IN(SELECT id FROM @T) ORDER BY lastvisitDT DESC   
	SELECT I.id,I.name,I.classID,I.state,I.obj,I.idx,T.lastvisitDT    
	FROM @T T    
	INNER JOIN api.items I ON I.id=T.id AND I.hostID=@HostID 

GO

ALTER PROCEDURE [api].[setAttribute]    
	@id INT=NULL,@fieldID INT=NULL,@www BIT=NULL,@aid INT=NULL OUTPUT,@max INT=0   
	,@hostID INT=NULL,@keyNr INT=NULL,@keyId INT=NULL,@keyname VARCHAR(50)=NULL   
	,@class VARCHAR(50)=NULL,@idname VARCHAR(50)=NULL,@tag VARCHAR(50)=NULL, @createdDT VARCHAR(50)=NULL, @valueSource VARCHAR(50)=NULL   
	,@schema VARCHAR(50)=NULL -- deprecated   
	,@userID INT=NULL   
	,@moduserID INT=NULL -- deprecated   
	,@modifiedByID INT=NULL   
	,@type VARCHAR(50)=NULL,@rights VARCHAR(50)=NULL,@typeid INT=NULL,@value VARCHAR(MAX)=NULL  
	,@name VARCHAR(MAX)=NULL  
	,@title VARCHAR(MAX)=NULL  
	,@find BIT=NULL,@filter BIT=NULL,@classID INT=NULL,@attributeItemID INT=NULL   
	,@itemId VARCHAR(10)=NULL  
	,@kop TINYINT=NULL, @idx INT=NULL,@isnull BIT=NULL,@sessionID VARCHAR(50)=NULL,@host VARCHAR(50)=NULL,@modifiedDT VARCHAR(50)=NULL    
AS    
	SET NOCOUNT ON    
	DECLARE @itemclassID INT,@EmailAid INT,@personID INT,@ToID INT,@FromID INT,@SrcID INT,@email VARCHAR(200),@isProperty BIT    
	IF @title IS NOT NULL SET @name = @title  
   
	SET @modifiedByID=ISNULL(@modifiedByID,@moduserID)   
   
	IF @schema IS NOT NULL SET @class=@schema -- @schema deprecated   
   
	IF NOT @name>'' RETURN    
    
	SELECT @fieldID=id,@isProperty=isProperty FROM om.field WHERE name=@name    
	--SELECT 	@fieldID,@isProperty   
   
	IF @fieldID IS NULL BEGIN INSERT om.field (name) VALUES (@name) SET @fieldID=scope_identity() END    
    
	IF @hostID=1 SET @www=1    
	IF @hostID IS NULL SELECT @hostID=hostid FROM om.items WHERE id=@id    
  
  
    
	--select @hostID    
	IF @class IS NOT NULL   
	BEGIN  
		SELECT @classID=id FROM om.class WHERE class=@class    
		IF @classID IS NULL   
		BEGIN  
			SELECT @classID = MAX(id)+1 FROM om.class  
			INSERT om.class(id,class) VALUES(@classID,@class)  
		END  
	END  
	IF @classID IS NOT NULL AND @itemID IS NULL -- This propertie is a relation property, it is set but no relation itemID is set. So the relation object must be foud    
	BEGIN    
		IF @tag IS NOT NULL -- a keyid is set, so object with classID with keyid must be selectd    
			SELECT @itemID=id,@value=title FROM api.items WHERE hostID=@hostID AND classID=@classID AND tag=@tag   
		ELSE IF @keyID IS NOT NULL -- a keyid is set, so object with classID with keyid must be selectd    
			SELECT @itemID=id,@value=ISNULL(@value,name) FROM api.items WHERE hostID=@hostID AND classID=@classID AND keyID=@keyID    
		ELSE IF @keyname IS NOT NULL -- a keyname is set, so object with classID with keyname must be selectd    
			SELECT @itemID=id,@value=ISNULL(@value,name) FROM api.items WHERE hostID=@hostID AND classID=@classID AND keyname=@keyname    
		ELSE IF @keyNr IS NOT NULL	-- idem with KeyNr    
			SELECT @itemID=id,@value=ISNULL(@value,name) FROM api.items WHERE hostID=@hostID AND classID=@classID AND nr=@keyNr    
		IF @itemID IS NULL AND @value IS NOT NULL -- If Value supplied then the object must be created if not exist    
		BEGIN    
			-- First check if object exists with key equal to @value    
				SELECT @itemID=id,@value=ISNULL(@value,name) FROM api.items WHERE hostID=@hostID AND classID=@classID AND keyname=@value    
			-- If still not find then look for name equal to @value    
			IF @itemID IS NULL     
				SELECT @itemID=id,@value=ISNULL(@value,name) FROM api.items WHERE hostID=@hostID AND classID=@classID AND name=@value    
			-- If classID is acccount (class=1000) then do not create object, also clear idname     
			IF @itemID IS NULL AND @classID IN (1000) SET @idname = NULL    
			-- Stil object not found then create    
			ELSE IF @itemID IS NULL     
			BEGIN    
				INSERT api.items(hostID,classID,name,nr,keyID,keyName) SELECT @hostID,@classID,@value,@keyNr,@keyID,ISNULL(@keyName,@value)    
				SET @itemId=scope_identity()    
			END    
		END    
	END    
	ELSE IF @itemID IS NOT NULL SELECT @classID=classID,@value=name FROM om.items WHERE id=@itemID    
	IF @idname IS NOT NULL     
	BEGIN    
		IF @itemID IS NOT NULL EXEC('UPDATE om.items SET '+@idname+'='+@itemID+' WHERE id='+@id)    
		ELSE EXEC api.setItemProperty @id=@id,@name=@idname,@value=@value    
		--IF @value>'' EXEC('UPDATE om.items SET '+@idname+'='''+@value+''' WHERE id='+@id)    
		--ELSE EXEC('UPDATE om.items SET '+@idname+'=NULL WHERE id='+@id)    
	END    
	ELSE IF @isProperty=1    
	BEGIN    
		--PRINT 'A'   
		EXEC api.setItemProperty @id=@id,@name=@name,@value=@value    
		--RETURN    
	END   
    
	--BEGIN    
	--	IF @value>'' EXEC('UPDATE om.items SET '+@name+'='''+@value+''' WHERE id='+@id)    
	--	ELSE EXEC('UPDATE om.items SET '+@name+'=NULL WHERE id='+@id)    
	--END    
	IF @max=0    
	BEGIN   
		IF @aid IS NULL SELECT @aid=aid FROM om.attributes WHERE id=@id AND fieldID=@fieldID AND hostID=@hostID AND itemID=@itemID --AND hostID=@hostID ??  
		IF @aid IS NULL SELECT @aid=aid FROM om.attributes WHERE id=@id AND fieldID=@fieldID AND hostID=@hostID AND ISNULL(userID,0)IN(@userID,0) AND(rights IS NULL OR moduserID=@moduserID)    
		IF @aid IS NULL AND @hostID IS NULL SELECT @aid=aid FROM om.attributes WHERE id=@id AND fieldID=@fieldID   
	END   
	--IF @aid IS NULL SELECT @aid=aid FROM om.attributes WHERE id=@id AND name=@name   
	IF @aid IS NOT NULL AND @isnull=1 RETURN    
	  
    
	--select @aid    
	--IF @aid IS NOT NULL AND @typeID IS NULL AND ISNULL(@value,'')='' BEGIN DELETE om.attributes WHERE aid=@aid RETURN END    
	    
	--IF @value='' AND @typeID IS NULL RETURN    
	--IF @value='' AND @aid IS NULL RETURN    
	IF @aid IS NULL BEGIN INSERT om.attributes(id,name,fieldID) VALUES(@id,@name,@fieldID) SET @aid = scope_identity() END    
  
	UPDATE om.attributes SET     
		hostID=@hostID,    
		modUserId=ISNULL(@modifiedByID,@userID),    
		userID=ISNULL(@userID,0),    
		modDt=GETUTCDATE(),    
		typeID=@typeID,    
		fieldID=@fieldID,    
		rights=@rights,    
		value=@value,    
		filter=@filter,    
		classID=@classID,    
		itemId=@itemId,    
		kop=@kop,    
		idx=@idx,    
		www=@www     
	WHERE     
		aid=@aid    
    
	UPDATE om.items SET modifiedDT=GETUTCDATE() WHERE id=@id    
	IF @itemID IS NOT NULL AND @UserID IS NOT NULL EXEC api.addItemUserVisit @id=@itemId,@userID=@UserID--,@hostID=@hostID    
	IF @id IS NOT NULL AND @UserID IS NOT NULL EXEC api.addItemUserVisit @id=@id,@userID=@UserID--,@hostID=@hostID    
   
	--EXEC api.addItemUserVisit @id=@id,@userID=@userID[api].[setAttribute] 
 

GO

ALTER PROCEDURE [api].[setItemChildIdx] @id INT   
AS   
	--SELECT id,ROW_NUMBER() OVER(ORDER BY idx) AS idx FROM api.items WHERE masterID=@id   
	UPDATE om.items SET om.items.idx=I.idx-1 from(SELECT id,ROW_NUMBER() OVER(ORDER BY idx) AS idx FROM api.items WHERE masterID=@id) I WHERE om.items.id=I.id   
	DECLARE @hasChildren BIT   
	IF EXISTS(SELECT 0 FROM api.items WHERE masterID=@id) SET @hasChildren=1 ELSE SET @hasChildren=0   
	UPDATE om.items SET hasChildren=@hasChildren WHERE id=@id 

GO

ALTER PROCEDURE [api].[setItemIdx] @id INT   
AS   
	--SELECT id,idx,ROW_NUMBER()OVER(ORDER BY ISNULL(ISNULL(title,name),keyname)) AS rowNr FROM api.items WHERE masterID=@id   
	UPDATE om.items SET om.items.idx=I.idx-1 from(SELECT id,ROW_NUMBER() OVER(ORDER BY ISNULL(ISNULL(title,name),keyname)) AS idx FROM api.items WHERE masterID=@id) I WHERE om.items.id=I.id   
	DECLARE @hasChildren BIT   
	IF EXISTS(SELECT 0 FROM api.items WHERE masterID=@id) SET @hasChildren=1 ELSE SET @hasChildren=0   
	UPDATE om.items SET hasChildren=@hasChildren WHERE id=@id 

GO

ALTER PROCEDURE [auth].[addHost] @companyName VARCHAR(50),@hostname VARCHAR(50),@ownerID INT,@domain VARCHAR(50)=NULL   
AS   
	DECLARE @companyID INT,@siteID INT   
	SELECT @companyID=id FROM api.items WHERE hostID=1 AND classID=1002 AND name=@companyName   
	IF NOT EXISTS(SELECT 0 FROM auth.host WHERE id=@companyID) INSERT auth.host(id)VALUES(@companyID)   
	UPDATE auth.host SET name=ISNULL(@hostname,name),domain=ISNULL(@domain,domain),mailAccountAid=ISNULL(mailAccountAid,2) WHERE id=@companyID   
	SELECT id,name FROM auth.host WHERE id=@companyID   
	SELECT @companyName,@hostname,@ownerID,@companyID   
	RETURN   
	SET NOCOUNT ON   
	--DECLARE @pos INT,@msgID INT,@pageID INT,@www BIT,@footerID INT,@aid INT,@classID INT,@ItemID INT,@ItemHostID INT,@SiteID INT,@AccountID INT,@userID INT,@groupID INT,@ToID INT,@FromID INT,@SrcID INT,@ContactID INT,@CompanyID INT,@PersonID INT,@value VARCHAR(500),@name VARCHAR(500),@website VARCHAR(500),@config VARCHAR(MAX),@keyname VARCHAR(500),@email VARCHAR(500),@email1 VARCHAR(500),@email2 VARCHAR(500),@jobtitle VARCHAR(500),@displayname VARCHAR(500),@givenname VARCHAR(500),@middlename VARCHAR(500),@surname VARCHAR(500),@surname2 VARCHAR(500),@companyname VARCHAR(500),@company VARCHAR(500),@msg VARCHAR(MAX)   
	/*   
	IF @ItemHostID<>1   
	BEGIN   
		IF @srcID IS NULL   
		BEGIN   
			SET @value=api.fieldget(@id,'BusinessHomePage')   
			IF @value IS NOT NULL SELECT @srcID=I.ID FROM api.items I INNER JOIN om.attributes F ON I.classID=1002 AND I.www=1 AND I.hostID=1 AND F.id=I.id AND F.name='BusinessHomePage' AND F.value=@value   
			IF @srcID IS NOT NULL AND @srcID<>@id EXEC api.setAttribute @id=@id,@idname='srcID',@itemID=@srcID   
		END   
		IF @srcID IS NULL   
		BEGIN   
			SET @value=api.fieldget(@id,'EmailAddresses1Address')   
			IF @value IS NOT NULL SELECT @srcID=I.ID FROM api.items I INNER JOIN om.attributes F ON I.classID=1002 AND I.www=1 AND I.hostID=1 AND F.id=I.id AND F.name='EmailAddresses1Address' AND F.value=@value   
			IF @srcID IS NOT NULL AND @srcID<>@id EXEC api.setAttribute @id=@id,@idname='srcID',@itemID=@srcID   
		END   
		RETURN   
	END   
	UPDATE om.items SET www=1 WHERE id=@id   
	IF @KeyName IS NOT NULL    
	BEGIN   
		SELECT @aid=aid,@contactID=itemID FROM om.attributes WHERE id=@id AND name='owner'   
		IF @contactID IS NULL RETURN   
		SELECT @UserID=ToID,@fromID=fromID,@toID=toID FROM api.items WHERE id=@contactID   
		IF @UserID IS NULL RETURN   
		SELECT @AccountID=id FROM api.items WHERE hostID=@id AND classID=1004 AND srcID=@contactID   
		IF @AccountID IS NULL   
		BEGIN   
			SET @value=api.fieldget(@contactID,'EmailAddresses0Address')   
			IF @value IS NULL SET @value=api.fieldget(@toID,'EmailAddresses0Address')   
			SELECT 'TEST',@value,@contactID,@toID,@fromID   
			IF @value IS NULL RETURN   
			SELECT 'TEST',@classID   
			INSERT om.items(hostID,classID,srcID,fromID,toID,name)    
			SELECT @id,1004,@contactID,fromID,toID,name   
			FROM api.items WHERE id=@contactID   
			SET @AccountID=scope_identity()   
			EXEC api.setAttribute @id=@AccountID,@hostID=@id,@name='EmailAddresses0Address',@value=@value   
			EXEC api.setAttribute @id=@AccountID,@hostID=@id,@name='DisplayName',@itemID=@toID   
			EXEC api.setAttribute @id=@AccountID,@hostID=@id,@name='Company',@itemID=@fromID   
		END   
		EXEC api.getItemLink @hostID=@id,@classID=0,@masterID=@id,@keyname='ceo',@idx=1,@detailID=@accountID   
		UPDATE om.items SET userID=@userID WHERE id=@id   
		EXEC api.getItemLink @hostID=@id,@classID=1162,@keyname='maintask',@name='Organisatie taken',@id=@itemId OUTPUT   
		EXEC api.getItemLink @hostID=@id,@classID=0,@masterID=@id,@keyname='maintask',@name='Organisatie taken',@idx=1,@detailID=@itemId   
		EXEC api.getItemLink @hostID=@id,@classID=1004,@keyname='support',@name='Support Aliconnect',@srcID=2750880,@id=@itemId OUTPUT   
		IF NOT EXISTS(SELECT 0 FROM auth.users WHERE id=@UserID)    
		BEGIN   
			INSERT auth.users(id) VALUES(@UserID)   
			EXEC mail.send @AccountID=@AccountID,@HostID=@id,@name='mailAliconnectAccountAdd'   
		END   
		--SELECT @GroupID=ItemID FROM om.attributes WHERE id=@UserID AND F.hostID=@HostID AND F.classID=1103   
		--IF @GroupID IS NULL   
		SELECT @groupID=id FROM api.items WHERE classID=1103 AND hostID=@id AND name='Admin'   
		IF @groupID IS NULL   
		BEGIN   
			EXEC api.getItemLink @hostID=@id,@classID=1103,@name='Admin',@id=@groupID OUTPUT   
			--INSERT om.items(hostID,classID,name) VALUES(@id,1103,'Admin')   
			--SELECT @groupID=scope_identity()   
			INSERT auth.groupClass(groupID,classID,config) SELECT @groupID,classID,config FROM auth.groupClass WHERE groupID=2619989 -- aliconnect Admin   
			EXEC mail.send @AccountID=@UserID,@HostID=@HostID,@name='mailToOwnerGroupAdminAdd'   
		END   
		EXEC api.setAttribute @id=@AccountID,@hostID=@id,@name='groupID',@value='Admin',@ItemID=@groupID,@classID=1103,@moduserID=@userID,@rights='R'   
		--SELECT @groupID   
		--RETURN   
		--IF NOT EXISTS(SELECT 0 FROM om.attributes WHERE id=@AccountID AND hostID=@id AND classID=1103)   
		--BEGIN   
		--	--SELECT @AccountID,@id,@userID,@HostID,@groupid   
		--	EXEC api.setAttribute @id=@AccountID,@hostID=@id,@name='groupID',@value='Admin',@ItemID=@groupID,@classID=1103,@moduserID=@userID,@rights='R'   
		--	EXEC mail.send @AccountID=@AccountID,@HostID=@id,@name='mailHostGroupAdd'   
		--END   
		--IF NOT EXISTS(SELECT 0 FROM om.attributes WHERE id=@id AND classID=1004 AND rights>'')   
		--BEGIN   
		--	EXEC api.setAttribute @id=@id,@hostID=1,@name='owner',@value='X',@ItemID=@AccountID,@UserID=@PersonID,@classID=1004   
		--	EXEC mail.send @AccountID=@AccountID,@HostID=@id,@name='mailToOwnerAccountAdd'   
		--END   
		--SELECT @keyname   
		UPDATE om.attributes SET rights='R',moduserID=@userID WHERE id=@id AND name IN('owner','hostName')   
		SET @KeyName=REPLACE(REPLACE(@KeyName,' ',''),'.','')   
		IF NOT EXISTS(SELECT 0 FROM auth.host WHERE id=@id) INSERT auth.host(id,mailAccountAid) VALUES(@id,2)   
		--BEGIN   
		--	INSERT auth.host(id,mailAccountAid) VALUES(@id,2)   
		--	EXEC mail.send @AccountID=@UserID,@HostID=@HostID,@name='mailToOwnerHostAdd'   
		--END   
		IF @Config IS NULL UPDATE om.items SET config=I.config FROM(SELECT config FROM om.items WHERE id=1) I WHERE om.items.id=@id   
		--RETURN   
		--SELECT @SiteID=id FROM api.items WHERE hostID=@id AND classID=1091 AND DetailID IS NULL   
		EXEC api.getItemLink @hostID=@id,@classID=1091,@keyName=@keyname,@hasChildren=1,@masterID=@id,@id=@siteID  OUTPUT   
		EXEC api.setAttribute @id=@SiteID,@hostID=@id,@name='Company',@classID=1002,@itemID=@id   
		EXEC api.getItemLink @hostID=@id,@classID=1092,@masterID=@SiteID,@keyname='Welkom',@idx=0,@state='published',@id=@pageID  OUTPUT   
		UPDATE om.items SET www=1,startDT=GETUTCDATE() WHERE id=@pageID   
		--SELECT @hostid,@id,@SiteID,@pageID   
		EXEC api.setAttribute @id=@pageID,@hostID=@id,@name='Website',@value='Website',@classID=1091,@typeID=11,@itemID=@SiteID   
		EXEC api.setAttribute @id=@pageID,@hostID=@id,@name='Title',@value='Welkom'   
		EXEC api.setAttribute @id=@pageID,@hostID=@id,@name='Description',@value='Welkom op deze site.'   
		EXEC api.getItemLink @hostID=@id,@classID=1092,@masterID=@SiteID,@keyname='Footer',@idx=99,@state='published',@id=@footerID  OUTPUT   
		EXEC api.setAttribute @id=@footerID,@hostID=@id,@name='Webpage',@value='Webpage',@classID=1092,@typeID=11,@itemID=@SiteID   
		EXEC api.getItemLink @hostID=@id,@classID=1092,@masterID=@footerID,@keyname='Contact',@idx=0,@state='published',@id=@itemID  OUTPUT   
		EXEC api.setAttribute @id=@itemID,@hostID=@id,@name='Webpage',@value='Webpage',@classID=1092,@typeID=11,@itemID=@footerID   
		--EXEC mail.send @AccountID=@UserID,@HostID=@HostID,@name='mailToOwnerSiteAdded'   
		--IF NOT EXISTS(SELECT 0 FROM api.items WHERE hostID=@id AND masterID=@AccountID AND DetailID=@SiteID AND classid=1091)   
		--	INSERT om.items(hostID,classID,masterID,detailID,name) VALUES(@id,1091,@AccountID,@SiteID,@Keyname)   
	END   
	*/ 

GO

ALTER PROCEDURE [auth].[getEmail] @email VARCHAR(500),@id INT=NULL OUTPUT   
AS   
	DECLARE @aid INT,@PersonID INT,@ClassID INT,@SrcID INT   
	SELECT @aid=aid,@PersonID=I.id FROM auth.email E LEFT OUTER JOIN api.items I ON I.id=E.id AND E.email=@email   
	IF @aid IS NULL BEGIN INSERT auth.email(email,id) VALUES(@email,@id) SET @aid=@@identity END   
	--IF @id IS NULL AND @PersonID IS NULL SELECT @id=I.id FROM api.items I INNER JOIN om.attributes F ON F.id=I.id AND I.classid=1000 AND F.name='EmailAddresses2Address' and value=@email   
	--IF @id IS NULL AND @PersonID IS NULL SELECT @id=I.ToID FROM api.items I INNER JOIN om.attributes F ON F.id=I.id AND I.classid=1004 AND F.name='EmailAddresses0Address' and value=@email   
	--IF @id IS NULL AND @PersonID IS NULL SELECT @id=I.ToID FROM api.items I INNER JOIN om.attributes F ON F.id=I.id AND I.classid=1004 AND F.name='EmailAddresses2Address' and value=@email   
	--IF @id IS NULL AND @PersonID IS NULL SELECT @id=I.ToID FROM api.items I INNER JOIN om.attributes F ON F.id=I.id AND I.classid=1100 AND F.name='EmailAddresses0Address' and value=@email   
	--IF @id IS NULL AND @PersonID IS NULL SELECT @id=I.ToID FROM api.items I INNER JOIN om.attributes F ON F.id=I.id AND I.classid=1100 AND F.name='EmailAddresses2Address' and value=@email   
	IF @id IS NOT NULL AND @PersonID IS NULL UPDATE auth.email SET id=@id WHERE aid=@aid   
	IF @PersonID IS NOT NULL SET @id=@personID 

GO

ALTER VIEW [api].[msgAll]   
AS   
	SELECT M.name,CONVERT(TEXT,M.msg) as msg,CONVERT(TEXT,M.mailmsg) as mailmsg,CONVERT(TEXT,M.errmsg) as errmsg,S.*    
	FROM cfg.msg M    
	CROSS JOIN auth.hostMailserver S 

GO

ALTER FUNCTION [api].[getHostAccount](@host VARCHAR(50),@sessionId VARCHAR(50)) RETURNS @T TABLE(HostID INT,UserID INT,HostName VARCHAR(200),GroupID INT,AccountID INT,UserName VARCHAR(200)) AS    
BEGIN   
	DECLARE @HostID INT,@DomainID INT,@UserID INT,@GroupID INT,@AccountID INT,@UserName VARCHAR(200),@HostName VARCHAR(200)   
	SELECT @hostID=hostID,@HostName=HostName FROM api.hostGet(@host)   
	--SELECT @hostId=id,@domainId = aid FROM auth.hostdomain WHERE domain=@host   
	--IF @hostId IS NULL SELECT @hostId=id FROM om.items WHERE classid=1002 AND @host=keyname+'.aliconnect.nl'   
	SELECT @userId=U.id,@UserName=I.name   
	FROM auth.hostLoginSession HL   
	INNER JOIN auth.users U ON U.id = HL.userId AND U.password IS NOT NULL   
	INNER JOIN api.items I ON I.id=U.id   
	WHERE HL.sessionId = @sessionId AND(HL.hostid = @hostId OR HL.keepSignedIn=1)    
	SET @groupId=0   
	SELECT @accountId=AccountID,@groupId=GroupID FROM auth.account WHERE UserID=@UserID AND HostID=@HostID AND groupID IS NOT NULL   
	INSERT @T VALUES(@HostID,@UserID,@HostName,@GroupID,@AccountID,@UserName)   
	RETURN   
END 

GO

ALTER FUNCTION [api].[getAccountState](@accountID INT) RETURNS TABLE    
AS   
RETURN   
(   
	SELECT I.id,S.value AS periode,S.createdDT,S.modifiedDT  
	FROM api.items I   
		CROSS JOIN(SELECT MAX(aid)aid FROM om.attributes A WHERE id=@accountID AND fieldID=1952) A  
		INNER JOIN api.attributes S ON S.aid=A.aid  
		--INNER JOIN api.items IG ON IG.id = A.itemID  
		--LEFT OUTER JOIN om.attributes AM ON AM.id = I.id AND AM.fieldID=931  
	WHERE I.id=@accountID  
) 

GO

ALTER FUNCTION [api].[userItems](@userID INT) RETURNS TABLE     
AS    
RETURN     
(    
	SELECT    
		V.lastvisitDT,    
		V.LastVisitDT LastVisitDateTime,    
		I.* 
	FROM api.citems I    
	LEFT OUTER JOIN om.itemUserVisit V ON V.id=I.id AND V.userID=@userID    
) 
 
 
 

GO

ALTER PROCEDURE [api].[addItem]    
	@hostID INT=NULL,   
	@userID INT=NULL,   
	@accountID INT=NULL,   
	@id INT=NULL OUTPUT,   
	@schema VARCHAR(250)=NULL,   
	@name VARCHAR(250)=NULL,   
	@keyname VARCHAR(250)=NULL,   
	@tag VARCHAR(250)=NULL,   
	@title VARCHAR(250)=NULL,   
	@subject VARCHAR(250)=NULL,   
	@summary VARCHAR(250)=NULL,   
	@filterfields VARCHAR(8000)=NULL,   
	@value VARCHAR(8000)=NULL,   
	@keyID VARCHAR(250)=NULL,   
	@sourceID INT=NULL,   
	@values VARCHAR(250)=NULL,   
	@masterID INT=NULL,   
	@classID INT=NULL,   
	@clone BIT=NULL,   
	@detailID INT = NULL,   
	@modifiedByID INT = NULL,   
	@idx INT = NULL,   
	@srcID INT = NULL,   
	@www BIT=null,   
	--@classname VARCHAR(100)=NULL,   
	@parentId INT = NULL,   
	@host VARCHAR(50) = NULL,   
	@finishDT VARCHAR(50) = NULL,   
	@startDT VARCHAR(50) = NULL,   
	@endDT VARCHAR(50) = NULL,   
	@sessionId VARCHAR(50) = NULL,    
	@where VARCHAR(100) = NULL,   
	@find BIT = NULL -- Geeft aan of gekeken moet worden naar keyid of keyname. Als deze worden gevonden dan niet toevoegen   
AS   
	SET NOCOUNT ON   
	IF @id IS NOT NULL RETURN   
	IF @classID IS NULL AND @schema IS NOT NULL   
	BEGIN   
		SELECT @classID=id FROM om.class WHERE class=@schema   
		IF @classID IS NULL    
		BEGIN   
			SELECT @classID=MAX(id)+1 FROM om.class   
			INSERT om.class(id,class) VALUES(@classID,@schema)   
		END 
	END 
	IF @classID IS NULL RETURN 
	IF @id IS NULL AND @keyID IS NOT NULL SELECT @id=id FROM api.items WHERE hostID=@hostID AND classID=@classID AND keyID=@keyID   
	IF @id IS NULL AND @keyName IS NOT NULL SELECT @id=id FROM api.items WHERE hostID=@hostID AND classID=@classID AND keyName=@keyName   
	IF @id IS NULL AND @tag IS NOT NULL AND @masterID IS NOT NULL SELECT @id=id FROM api.items WHERE masterID=@masterID AND classID=@classID AND tag=@tag   
 
	--IF @find IS NOT NULL AND @keyID IS NOT NULL SELECT @id=id FROM api.items WHERE hostID=@hostID AND classID=@classID AND keyID=@keyID   
	--IF @find IS NOT NULL AND @id IS NULL AND @keyName IS NOT NULL SELECT @id=id FROM api.items WHERE hostID=@hostID AND classID=@classID AND keyName=@keyName   
	--IF @find IS NOT NULL AND @id IS NULL AND @tag IS NOT NULL SELECT @id=id FROM api.items WHERE hostID=@hostID AND classID=@classID AND tag=@tag   
  	IF @id IS NOT NULL RETURN 
 
	DECLARE @dt CHAR(10),@groupID INT,@moduserID INT,@nr INT,@fclassID INT,@childClassNr INT, @classNr INT   
	IF @srcID IS NOT NULL AND @classID IS NULL SELECT @classID = classID FROM om.items WHERE id = @srcID   
	IF @srcID IS NOT NULL SELECT @schema = name FROM om.items WHERE id = @srcID   
	IF @schema IS NULL SELECT @schema = class FROM om.class WHERE id = @classID   
	   
	--IF @id IS NOT NULL SET @masterID = @id   
	IF @masterID IS NOT NULL    
	BEGIN   
		IF @idx IS NULL    
		BEGIN   
			SET @idx=1   
			SELECT @idx=MAX(ISNULL(idx,0))+1 FROM api.items WHERE masterID=@masterID    
		END   
		UPDATE om.items set hasChildren = 1 where id=@masterID or id=@parentId   
	END   
	IF @masterID IS NOT NULL    
	BEGIN   
		IF @srcID<>@masterID    
		BEGIN   
			IF @srcID IS NULL    
				SELECT @nr=MAX(CONVERT(INT,tag)) FROM api.items WHERE tag IS NOT NULL AND ISNUMERIC(tag)=1 AND masterID=@masterID AND classID=@classID   
			ELSE    
				SELECT @nr=MAX(CONVERT(INT,tag)) FROM api.items WHERE tag IS NOT NULL AND ISNUMERIC(tag)=1 AND masterID=@masterID AND srcID=@srcID    
			SET @nr=ISNULL(@nr,0)+1   
			--IF @nr<1000 SET @tag=right('000'+convert(varchar(3),@nr),3) ELSE SET @tag=@nr   
		END   
	END   
	ELSE    
	BEGIN   
		IF @srcID IS NULL   
			SELECT @nr=MAX(CONVERT(INT,tag)) FROM api.items WHERE tag IS NOT NULL AND ISNUMERIC(tag)=1 AND hostID=@hostID AND classID=@classID   
		ELSE    
			SELECT @nr=MAX(CONVERT(INT,tag)) FROM api.items WHERE tag IS NOT NULL AND ISNUMERIC(tag)=1 AND hostID=@hostID AND srcID=@srcID    
		--IF @nr IS NOT NULL SET @nr=right('000',convert(varchar(3),@nr+1))   
		IF @nr IS NOT NULL    
		BEGIN   
			SET @nr=ISNULL(@nr,0)+1   
			--IF @nr<1000 SET @tag=right('000'+convert(varchar(3),@nr),3) ELSE SET @tag=@nr   
		END   
	END   
   
	DECLARE @i INT   
   
	INSERT om.items(sourceID,finishDT,startDT,endDT,selected,childClassNr,ClassNr,tag,masterID,parentId,detailID,idx,hostID,userID,createdById,ownerID,modifiedByID,classID,srcID,keyname,name,clone,www)--,files,state,categorie,startDT,endDT,finishDT,filterfields)    
	VALUES(@sourceID,@finishDT,@startDT,@endDT,CASE WHEN @classID=2107 AND @masterID<>ISNULL(@srcID,0) THEN 1 ELSE null END,@childClassNr,@ClassNr,@nr,@masterID,@parentId,@detailID,@idx,@hostID,ISNULL(@userID,0),@moduserID,@moduserID,@moduserID,@classID,@srcID,@keyname,@name,@clone,@www) 
	SET @id = SCOPE_IDENTITY()   
	IF @srcID IS NOT NULL EXEC api.setAttribute @id=@id,@name='Source',@hostID=@hostID,@ItemID=@SrcID,@classID=@fclassid   
	IF @masterID IS NOT NULL EXEC api.setAttribute @id=@id,@name='Master',@hostID=@hostID,@ItemID=@masterID,@classID=@fclassid 

GO

ALTER PROCEDURE [api].[addMail] @hostID INT=NULL,@host VARCHAR(50)=NULL,@ToID INT=NULL,@AccountId INT=NULL,@email VARCHAR(50)=NULL,@name varchar(200)=NULL,@subject varchar(200)=NULL,@hostname varchar(200)=NULL,@ItemID VARCHAR(10)=NULL,@content VARCHAR(MAX)=NULL,@msg VARCHAR(MAX)=NULL,@pri INT=null  
AS  
	SET NOCOUNT ON  
	DECLARE @srcid INT,@title VARCHAR(500),@companyname VARCHAR(500),@contactname VARCHAR(500),@summary VARCHAR(500),@basecolor varchar(50)  
	--IF @HostID IS NULL SELECT @HostID=hostid FROM om.items WHERE id=@accountID  
	IF @HostID IS NULL SELECT @HostID=id FROM api.items WHERE classID=1002 AND keyname=@host  
	IF @HostID IS NULL SET @hostID=1  
	SELECT @hostname=keyname,@companyname=name FROM om.items WHERE id=@HostID  
	IF @AccountID IS NULL SELECT @AccountID=AccountID FROM auth.account WHERE hostID=@hostID AND UserID=@ToID  
	SELECT @contactname=title FROM api.items WHERE id=@accountID  
  
	IF @email IS NULL SELECT @email=value FROM om.fields WHERE id=@AccountID AND fieldID=931--name='EmailAddresses0Address'  
	IF @email IS NULL SELECT @email=value FROM om.fields WHERE id=@AccountID AND fieldID=1118--name='EmailAddresses2Address'  
	--IF @email IS NULL SELECT @email=value FROM om.fields WHERE id=@srcID AND name='EmailAddresses0Address'  
	--IF @email IS NULL SELECT @email=value FROM om.fields WHERE id=@srcID AND name='EmailAddresses2Address'  
	IF @email IS NULL SELECT @email=value FROM om.fields WHERE id=@ToID AND fieldID=1118---name='EmailAddresses2Address'  
	SELECT @basecolor=value FROM om.fields WHERE id=@HostID AND fieldID=741--name='basecolor'  
  
	IF @msg IS NULL  
	BEGIN  
		SELECT @subject=subject,@summary=summary,@msg=mailmsg FROM cfg.msg WHERE name=@name  
		IF @ItemID IS NOT NULL SELECT @Subject=name,@summary=summary FROM om.items WHERE id=@itemID  
		--SET @msg='{"mail":1,"FromEmail":"mailer@alicon.nl","FromName":"Aliconnect Max","ReplyToEmail":"max@alicon.nl", "ReplyToName":"Max","to":"'+@email+'","Basecolor":"#fafafa","Domain":"alicon.aliconnect.nl","Hostname":"alicon","Subject":"'+ISNULL(@subject,'')+'","Summary":"'+ISNULL(@summary,'')+'","mailbody":{"content":"'+ISNULL(@msg,'')+'","ItemID":0'+ISNULL(@ItemID,'')+'}}'  
		SET @msg=REPLACE(ISNULL(@msg,''),'"','\"')  
		SET @msg=REPLACE(@msg,CHAR(13)+CHAR(10),'</p><p>')  
		SET @msg=REPLACE(@msg,CHAR(10),'<br>')  
		SET @msg='{"content":"'+ISNULL(@msg,'')+'","ItemID":"'+ISNULL(@ItemID,'')+'"}'  
	END  
	SET @email='max@alicon.nl';  
	SET @msg='{"to":"'+isnull(@email,'')+'","bcc":"max@alicon.nl","Subject":"'+ISNULL(@subject,'')+'","msgs":{"content":"Beste '+ISNULL(@contactname,'')+',"},'+@msg+'}'  
	SET @msg=REPLACE(@msg,'email',ISNULL(@email,''))  
	SET @msg=REPLACE(@msg,'domain',ISNULL(@hostname,''))  
	SET @msg=REPLACE(@msg,'subject',ISNULL(@subject,''))  
	SET @msg=REPLACE(@msg,'summary',ISNULL(@summary,''))  
	SET @msg=REPLACE(@msg,'toname',ISNULL(@contactname,''))  
	SET @msg=REPLACE(@msg,'content',ISNULL(@content,''))  
	SET @msg=REPLACE(@msg,'companyname',ISNULL(@companyname,''))  
	--SET @msg='{"mail":1,"FromEmail":"mailer@alicon.nl","to":"'+@email+'","Basecolor":"#fafafa","Domain":"alicon.aliconnect.nl","Hostname":"alicon","Subject":"'+ISNULL(@subject,'')+'","Summary":"'+ISNULL(@summary,'')+'","mailbody":{"content":"'+ISNULL(@msg,'')+'"}}'  
	--SELECT @hostID,@accountID,@msg  
	IF @msg IS NOT NULL INSERT mail.queue(host,msg,pri) VALUES(@host,@msg,@pri) 

GO

ALTER PROCEDURE [api].[getAccount] @email VARCHAR(500)=NULL, @hostName VARCHAR(50)=NULL, @groupName VARCHAR(50)=NULL, @password VARCHAR(50)=NULL, @hostId INT=NULL OUTPUT, @userId INT=NULL OUTPUT, @accountId INT=NULL OUTPUT, @groupId INT=NULL OUTPUT,@verified BIT=NULL OUTPUT,@pwOk BIT=NULL OUTPUT,@select BIT=NULL  
AS  
	DECLARE @userName VARCHAR(500),@accountName VARCHAR(500),@userUid VARCHAR(128),@hostUid VARCHAR(128),@accountUid VARCHAR(128),@groupUid VARCHAR(128)  
	IF @hostId IS NULL SELECT @hostId=id FROM api.items WHERE hostID=1 AND classID=1002 AND keyname=@hostName  
	IF @hostName IS NULL SELECT @hostName=keyname FROM api.items WHERE id=@hostId  
	IF @userId IS NOT NULL SELECT @email=value,@verified=CASE WHEN id=userId THEN 1 ELSE 0 END FROM api.attributes WHERE id=@userId AND fieldId=30  
	ELSE SELECT @userId=id,@verified=CASE WHEN id=userId THEN 1 ELSE 0 END FROM om.attributes WHERE fieldId=30 AND value=@email  
	IF @password IS NOT NULL SELECT @pwOk=pwdcompare(@password,password)FROM auth.users WHERE id=@userId  
	SELECT @accountId=I.id,@groupId=A.itemId,@accountName=I.title,@groupName=A.value  
		FROM api.items I  
		INNER JOIN api.attributes A ON I.hostId=@hostId AND A.id=I.id AND A.fieldId=3 AND I.toId=@userId  
	SELECT @userName=title FROM api.items WHERE id=@userId  
	SELECT @accountName=ISNULL(title,@userName) FROM api.items WHERE id=@accountId  
	SELECT @hostUid=uid FROM api.items WHERE id=@hostId  
	SELECT @userUid=uid FROM api.items WHERE id=@userId  
	SELECT @accountUid=uid FROM api.items WHERE id=@accountId  
	SELECT @groupUid=uid FROM api.items WHERE id=@groupId  
  
	IF @select IS NOT NULL SELECT @email email,@userName userName,@hostName hostName, @accountName accountName,@groupName groupName, @verified verified, @pwOk pwOk, @userId userID, @hostId hostID, @accountId accountID, @groupId groupID, @hostUid hostUID, @userUid userUID, @accountUid accountUID, @groupUid groupUID 
 

GO

ALTER PROCEDURE [api].[getBuild] @rootID INT=NULL,@hostID INT=NULL  
AS   
	SET NOCOUNT ON  
	DECLARE @T TABLE(id INT)  
	IF @hostID IS NOT NULL INSERT @T SELECT id FROM api.items WHERE hostID=@hostID  
	ELSE IF @rootID IS NOT NULL  
	BEGIN  
		SELECT @hostID=hostID FROM om.items WHERE id=@rootID 
		;WITH P(level,id) AS(    
			SELECT 0,@rootID  
		UNION ALL   
			SELECT level+1,I.id  
			FROM P INNER JOIN api.items I ON I.masterId = P.id and level<50			 
		)    
		INSERT @T SELECT DISTINCT id FROM P  
	END  
  
	DECLARE @S TABLE(id INT)  
	;WITH P(level,id,srcID) AS(    
	SELECT 0,I.id,I.srcID FROM api.items I INNER JOIN @T T ON T.id=I.id AND I.srcID IS NOT NULL  
	UNION ALL   
	SELECT level+1,I.id,I.srcID  
	FROM P INNER JOIN api.items I ON I.id=P.srcID and level<50			 
	)    
  
	INSERT @S SELECT DISTINCT id FROM P WHERE id NOT IN(SELECT id FROM @T)  
  
	;WITH P(level,id) AS(    
		SELECT 0,id FROM @S  
	UNION ALL   
		SELECT level+1,I.id  
		FROM P INNER JOIN api.items I ON I.masterId = P.id and level<50		 
	)    
	--SELECT DISTINCT id FROM P  
  
	INSERT @T SELECT DISTINCT id FROM P WHERE id NOT IN(SELECT id FROM @T)  
  
	INSERT @T SELECT id FROM(SELECT DISTINCT I.userID id FROM @T T INNER JOIN api.items I ON I.id=T.id)P WHERE id NOT IN(SELECT id FROM @T)  
	INSERT @T SELECT id FROM(SELECT DISTINCT I.hostID id FROM @T T INNER JOIN api.items I ON I.id=T.id)P WHERE id NOT IN(SELECT id FROM @T)  
	INSERT @T SELECT id FROM(SELECT DISTINCT I.ownerID id FROM @T T INNER JOIN api.items I ON I.id=T.id)P WHERE id NOT IN(SELECT id FROM @T)  
	INSERT @T SELECT DISTINCT A.itemID FROM @T T INNER JOIN om.attributes A ON A.id=T.id AND A.itemID IS NOT NULL WHERE A.itemID NOT IN(SELECT id FROM @T)  
 
	;WITH P(level,id) AS(    
		SELECT 0,masterID FROM api.items WHERE id=@rootID  
	UNION ALL   
		SELECT level+1,I.masterID  
		FROM P INNER JOIN api.items I ON I.id = P.id and level<50   
	)  
	INSERT @T SELECT id FROM P WHERE id NOT IN(SELECT id FROM @T)  
	INSERT @T VALUES(1)  
  
	INSERT @T SELECT DISTINCT id FROM om.attributes WHERE itemID IN(SELECT id FROM @T) AND id NOT IN(SELECT id FROM @T)  
  
	SELECT C.id,C.class name FROM(SELECT DISTINCT I.classID FROM @T T INNER JOIN api.items I ON I.id=T.id)I INNER JOIN om.class C ON C.id=I.classID  
	UNION  
	SELECT C.id,C.class name FROM om.class C WHERE id IN(1000,1002,1003,1004)  
  
	SELECT F.id,F.name FROM(SELECT DISTINCT A.fieldID FROM @T T INNER JOIN api.attributes A ON A.id=T.id) A INNER JOIN om.attributeName F ON F.id=A.fieldID  
	UNION  
	SELECT F.id,F.name FROM om.attributeName F WHERE id IN(3,30)  
  
	SELECT I.* FROM @T T INNER JOIN api.items I ON I.id=T.id AND I.hostID IN(@hostID,1) 
	--where I.id in(3490197)  
	--where I.id=3557810  
  
	SELECT A.aid,A.id,A.name,A.value,A.hostID,A.createdDT,A.modDT,A.userID,A.fieldID,A.itemID FROM @T T INNER JOIN om.attributes A ON A.id=T.id  
	--where T.id in(3557866)  
	--where a.aid=17876680  
	--where a.id=3557810 

GO

ALTER PROCEDURE [api].[getItemMessage]   
	@a VARCHAR(20) = NULL,    
	@host VARCHAR(100) = NULL,   
	@sessionId VARCHAR(100) = NULL,   
	@uid CHAR(128)=NULL,   
	@id INT = NULL,   
	@toId INT = NULL,   
	@hostID INT = NULL,   
	@userID INT = NULL,   
	@accountId INT = NULL,   
	@pri INT = NULL,   
	@groupID INT = NULL,   
	@domainId INT = NULL,   
	@sendDT DATETIME = NULL,   
	@aid INT = NULL,   
	@fromId INT = NULL,   
	@fav BIT = NULL,   
	@sentOn VARCHAR(250) = NULL,   
	@from VARCHAR(250) = NULL,   
	@to VARCHAR(250) = NULL,   
	@cc VARCHAR(250)= NULL,   
	@subject VARCHAR(250)= NULL,   
	@msg  VARCHAR(MAX)= NULL,   
	@content VARCHAR(MAX)= NULL,   
	@email  VARCHAR(MAX)= NULL,   
	@msgname  VARCHAR(100)= NULL,   
	@files VARCHAR(MAX)= NULL,   
	@all BIT= NULL   
AS   
	SET NOCOUNT ON   
	SET TEXTSIZE 2147483647   
	SET DATEFORMAT DMY   
	DECLARE @classID INT   
	--IF @userID IS NULL SELECT @groupID=groupID,@hostID=hostID,@userID=userID,@accountID=accountID FROM api.hostAccountGet(@host,@sessionId)   
	--SELECT * FROM api.hostAccountGet('moba.aliconnect.nl','btmb5dogbhg25tmsrvd6cp8mn7')   
	DECLARE @T TABLE(id INT,new TINYINT)   
	--EXEC auth.userGet @sessionId=@sessionId, @host=@host, @groupID=@groupID OUTPUT, @hostID=@hostID OUTPUT, @userID=@userID OUTPUT, @accountId=@accountId OUTPUT, @domainId=@domainId OUTPUT   
	IF @fromId IS NOT NULL SET @userID = @fromId   
	   
	IF @a='sharedusers'   
	BEGIN   
		SELECT U.name,IU.fav,U.id userID, IU.id   
		FROM om.itemFav IU   
		INNER JOIN auth.users U ON U.id = IU.userID AND IU.id=@id   
	END   
	ELSE IF @a='get'   
	BEGIN   
		SELECT M.createdDT,FU.name AS FromName,M.msg,FU.id AS FromId,M.aid    
		FROM om.msg M    
		INNER JOIN auth.users FU ON FU.id = M.fromId AND M.itemid = @id AND pri IS NULL   
		ORDER BY createdDT    
		UPDATE om.itemFav SET sendMsgDt = NULL WHERE id = @id AND userID = @userID   
		UPDATE api.msg SET readDt=GETUTCDATE() WHERE itemId=@id AND toId = @userID AND readDt IS NULL   
	END   
	ELSE IF @a='userlist'   
	BEGIN   
		INSERT @T(id)   
		select F.id   
		from om.itemfav F   
		inner join api.items I ON F.userID=@accountId AND I.id=F.id AND I.hostID=@hostID --AND(F.notifiedDt IS NULL OR F.notifiedDt<I.modifiedDT)   
		left outer join om.itemUserVisit V ON V.id=I.id AND V.userID=@userID   
		WHERE I.modifiedDT>V.lastvisitDT OR V.lastvisitDT IS NULL   
		SELECT I.name,I.subject,I.modifiedDT,I.id   
		FROM @T T   
		INNER JOIN om.items I ON I.id=T.id   
		--SELECT * FROM api.msg WHERE toId = @userID AND readDt IS NULL AND hostID = @hostID   
	END   
	ELSE IF @a='check'   
	BEGIN   
		INSERT @T(id,new)   
		SELECT F.id,CASE WHEN F.notifiedDt IS NULL OR F.notifiedDt<I.modifiedDT THEN 1 ELSE 0 END   
		FROM om.itemfav F   
		INNER JOIN api.items I ON    
			F.userID=@accountId    
			AND I.id=F.id    
			AND I.hostID=@hostID    
			AND(@all=1 OR F.notifiedDt IS NULL OR F.notifiedDt<I.modifiedDT)   
			AND I.modifiedByID<>@userID   
		LEFT OUTER JOIN om.itemUserVisit V ON V.id=I.id AND V.userID=@userID --AND V.hostID=@hostID   
		WHERE I.modifiedDT>V.lastvisitDT OR V.lastvisitDT IS NULL   
		SELECT I.*,T.new   
		FROM @T T   
		INNER JOIN api.listitems I ON I.id=T.id --AND T.new=1   
		UPDATE om.itemFav SET notifiedDt=GETUTCDATE()   
		FROM @T T   
		WHERE om.itemFav.userID=@accountId AND om.itemFav.id=T.id AND T.new=1   
	END   
	ELSE IF @a='send'   
	BEGIN   
		IF @from IS NOT NULL SELECT @userID=id FROM auth.email WHERE email=@from   
		IF @subject IS NULL AND @id IS NOT NULL SELECT @subject = name FROM om.items WHERE id = @id    
		IF @hostID IS NULL AND @id IS NOT NULL SELECT @hostID=hostID FROM om.items WHERE id=@id   
		IF @msgname IS NOT NULL SELECT @msg=msg,@subject=subject from cfg.msg WHERE name=@msgname   
   
		   
		--IF @accountID IS NULL SELECT @accountID=I.id FROM om.attributes F INNER JOIN om.items I ON I.id=F.id AND I.classid=1004 AND F.name='EmailAddresses0Address' AND F.value=@from   
   
		IF @accountID IS NULL SELECT @accountID=I.id FROM om.items I WHERE I.hostID=@hostID AND I.classID=1004 AND I.toID=@userID--I.id=F.id AND I.classid=1004 AND F.name='EmailAddresses0Address' AND F.value=@from   
		--select @userID,@hostID,@accountID   
		--return   
   
		IF @accountID IS NULL RETURN   
   
		IF NOT EXISTS(SELECT 0 FROM om.itemFav WHERE id=@id AND userID=@accountID) INSERT om.itemFav(userID,id,fav) VALUES(@accountID,@id,1)   
		INSERT om.msg(itemId,domainId,hostID,fromId,pri,subject,msg,files) VALUES(ISNULL(@id,@userID),@domainId,@hostID,ISNULL(@fromId,@userID),@pri,@subject,@msg,@files)   
		--SET @aid = scope_identity()   
		--IF @toId IS NOT NULL    
		--	INSERT om.msgTo(msgAid,toId,sendDT)    
		--	VALUES(@aid,@toId,@sendDT)   
		--ELSE IF @id IS NOT NULL   
		--BEGIN   
		--	INSERT om.msgTo(msgAid,toId,sendDT)    
		--	SELECT @aid,userID,@sendDT   
		--	FROM om.itemFav F   
		--	WHERE id=@id AND userID <> ISNULL(@fromId,@userID) AND sendMsgDt IS NULL   
		--	SET @msg = '{"Subject":"'+@subject+'","msgs":{"name":"'+@subject+'","content":"Er staat nieuwe informatie over dit onderwerp op Aliconnect portal","href":"'+@host+'"}}'   
		--	INSERT mail.queue(toId,domainId,msg)   
		--	SELECT F.userID,@domainId,@msg   
		--	FROM om.itemFav F   
		--	LEFT OUTER JOIN auth.hostLogin L ON    
		--		L.id = @hostID AND L.userID = F.userID   
		--	WHERE   
		--		F.id=@id AND F.userID <> ISNULL(@fromId,@userID) AND sendMsgDt IS NULL    
		--		AND L.hasFocus IS NULL   
		--	UPDATE om.itemFav SET sendMsgDt = GETUTCDATE() WHERE id = @id AND userID <> @userID AND sendMsgDt IS NULL   
		--END   
		SELECT @msg AS msg   
	-- api.msgGet @a='send',@id=2407466,@host='alicon.nl',@fromId=265090,@toId=2407409,@subject='TEST',@msg='{"content":"TEST"}'   
	END   
	ELSE IF @a='del'   
	BEGIN   
		DELETE om.msg WHERE aid=@aid   
		DELETE om.msgTo WHERE msgaid=@aid   
	END   
	ELSE IF @a='toggle'   
	BEGIN   
		--SELECT @accountId = id FROM api.items WHERE classID=1100 AND srcID=@userID AND hostID=@hostID    
		DELETE om.itemFav WHERE userID = @accountId AND id=@id   
		IF @fav=1    
		BEGIN   
			SELECT @classID=classID FROM om.items WHERE id=@id   
			IF @classID=1004   
			BEGIN   
				EXEC api.setAttribute @id=@id,@name='Fav',@hostID=@hostID,@userID=@HostID,@www=1,@value='Fav'   
				--EXEC api.setAttribute @id=2698395,@name='Fav',@hostID=2347355,@userID=2347355,@www=1   
			 --   DECLARE @ContactID INT,@SrcID INT,@JobTitle VARCHAR(200),@name VARCHAR(200)   
				----SELECT @hostID=hostID,@accountID=accountID FROM api.hostAccountGet('$post->host','$post->sessionID')   
				--SELECT @ToID=ToID,@FromID=FromID,@JobTitle=subject,@name=name FROM api.items WHERE id=@id   
				--SELECT @ContactID=id FROM api.items WHERE hostID=@hostID AND FromID=@FromID AND ToID=@ToID AND classID=1100   
				--IF @ContactID IS NULL   
				--BEGIN   
				--	INSERT om.items(ClassID,HostID,FromID,ToID,name) VALUES(1100,@hostID,@FromID,@ToID,@name)   
				--	SET @ContactID=scope_identity()   
				--END   
				--UPDATE om.items SET srcID=@id WHERE id=@ContactID   
				--EXEC api.setAttribute @id=@ContactID,@name='DisplayName',@hostID=@hostID,@ClassID=1000,@ItemID=@ToID   
				--EXEC api.setAttribute @id=@ContactID,@name='Company',@hostID=@hostID,@ClassID=1002,@ItemID=@FromID   
				--EXEC api.setAttribute @id=@ContactID,@name='JobTitle',@hostID=@hostID,@Value=@JobTitle   
				--SET @id=@ContactID   
				SELECT @id AS id--,@hostID hostID   
			END   
			ELSE INSERT om.itemFav(userID,id,fav) VALUES(@accountId,@id,1)   
		END   
	END 

GO

ALTER PROCEDURE [api].[getTree] @id INT 
AS 
	DECLARE @T TABLE(level int,id int) 
	;WITH P(level,id) AS( 
		SELECT 0,@id 
		UNION ALL 
		SELECT level+1,I.id 
		FROM P INNER JOIN api.items I ON I.masterID=P.id AND level<50 --AND ISNULL(I.selected,1)=1 
	) 
	--SELECT * FROM P WHERE id IN(3564680, 3564681, 3564682, 3564683) 
 
	INSERT @T SELECT * FROM P 
 
	--SELECT * FROM api.citems WHERE id IN(3564680, 3564681, 3564682, 3564683) or detailID IN(3564680, 3564681, 3564682, 3564683) 
 
	--SELECT * FROM @T WHERE id IN(3564680, 3564681, 3564682, 3564683) 
 
	--SELECT P.level,I.*  
	SELECT P.level,I.id,I.detailID,name,title,masterID,srcID,classID,I.[schema],I.class,modifiedDT,I.idx,ISNULL(I.selected,1)selected 
	FROM @T P INNER JOIN api.citems I ON I.id = P.id 
	--WHERE I.id IN(3564680, 3564681, 3564682, 3564683) 
	ORDER BY level,I.idx 
 
	;WITH P(level,id,srcID) AS(SELECT 0,I.id,I.id FROM @T I UNION ALL SELECT level+1,P.id,ISNULL(I.inheritedID,I.srcID) FROM api.items I INNER JOIN P ON I.id=P.srcID AND level<20) 
	SELECT P.id,A.aid,A.id attributeItemID,A.name,A.value,A.itemID,CONVERT(VARCHAR(50),A.modifiedDT,127)modifiedDT,A.userID  
	FROM P INNER JOIN api.attributes A ON A.id=P.srcID AND A.value IS NOT NULL AND P.srcID IS NOT NULL  
	AND A.name IN( 
		'ReadAddress', 
		'ReadAddressBit', 
		'ReadAddressLength', 
		'ReadLength', 
		'ReadRegister', 
		'IPAddress', 
		'Port', 
		'PollInterval', 
		'Community', 
		'Unit', 
		'Title', 
		'AttributeType', 
		'SignalType', 
 
		'Value', 
		'State', 
		'Disconnected', 
		--'Connected', 
		--'CriticalFailure', 
		--'NonCriticalFailure', 
		--'Locking', 
		--'Maintenance', 
		--'Running', 
		--'RunningMode', 
		--'Security', 
		--'PreWarning_1', 
		--'PreWarning_2', 
		--'PreWarning_3', 
		--'Measurement_1', 
		--'Measurement_2', 
		--'Measurement_3', 
		--'Measurement_4', 
		--'Measurement_5', 
		--'MeasurementErrorFlag', 
 
 
 
		'Low', 
		'High', 
		'Enum', 
		'RawMin', 
		'RawMax', 
 
		'MinRawValue', 
		'MaxRawValue', 
 
		'MinEngValue', 
		'MaxEngValue', 
 
		'MinValidValue', 
		'MaxValidValue', 
		'Deadband', 
		'Hysteresis', 
		'OID', 
		'Quality') 
	ORDER BY P.level DESC 

GO

ALTER PROCEDURE [auth].[addAccount] @accountID INT=NULL,@publicCompanyID INT=NULL,@email VARCHAR(50)=NULL,@hostID INT=NULL,@companyID INT=NULL,@byID INT=NULL,@groupID INT=NULL,@companyName VARCHAR(200)=NULL,@hostname VARCHAR(50)=NULL   
AS   
	SET NOCOUNT ON   
    DECLARE  @errMsg VARCHAR(250),@DisplayName VARCHAR(250),@domain VARCHAR(250),@userID INT,@ownerID INT,@contactID INT,@homeID INT, @publicContactID INT,@aid INT,@siteID INT,@contactName VARCHAR(200),@groupName VARCHAR(200),@userName VARCHAR(200),@byName VARCHAR(200)   
	BEGIN TRY    
		EXEC api.getAttribute @id=@hostID,@name='CompanyName',@value=@hostName OUTPUT   
				-- COMPANY ========================================================================================================   
		IF @publicCompanyID IS NOT NULL   
		BEGIN   
			SELECT @userID=userID,@hostName=keyname FROM om.items WHERE id=@publicCompanyID   
			IF @userID IS NULL RETURN--RAISERROR('No UserID',15,0)    
			IF @hostName IS NULL RETURN--RAISERROR('No HostName',15,0)    
			EXEC api.getAttribute @id=@publicCompanyID,@name='CompanyName',@value=@companyName OUTPUT   
			EXEC api.getAttribute @id=@publicCompanyID,@name='domain',@value=@domain OUTPUT   
			EXEC api.getAttribute @id=@userID,@name='EmailAddresses2Address',@value=@email OUTPUT   
			IF @email IS NULL RETURN--RAISERROR('No Email',15,0)    
			--UPDATE om.items SET config=NULL where id=2789066   
			--UPDATE om.items SET config=H.config FROM(SELECT id,config FROM om.items WHERE id=1) H WHERE om.items.id=@publicCompanyID   
			--SELECT @userID=userID,@hostName=keyname FROM om.items WHERE id=@publicCompanyID   
			IF NOT EXISTS(SELECT 0 FROM auth.host WHERE id=@publicCompanyID) INSERT auth.host(id)VALUES(@publicCompanyID)   
			UPDATE auth.host SET name=@hostName,domain=@domain,mailAccountAid=ISNULL(mailAccountAid,2) WHERE id=@publicCompanyID   
			-- GROUP   
			SELECT @groupID=id FROM api.items WHERE hostID=@publicCompanyID AND classID=1103 AND name='Admin' -- get Admin groupID   
			IF @groupID IS NULL SELECT TOP 1 @groupID=id FROM api.items WHERE hostID=@publicCompanyID AND classID=1103 -- get first available groupID   
			IF @groupID IS NULL -- Create Group Admin   
			BEGIN   
				INSERT om.items(hostID,classID,name)VALUES(@publicCompanyID,1103,'Admin')   
				SET @groupID=SCOPE_IDENTITY()   
			END   
			SELECT @groupName=name FROM om.items WHERE id=@groupID   
			-- SITE   
			SELECT @siteID=id FROM api.items WHERE classID=1091 AND masterID=@publicCompanyID   
			IF @siteID IS NULL    
			BEGIN   
				INSERT om.items(hostID,classID,name,masterID)VALUES(@publicCompanyID,1091,@companyName,@publicCompanyID)   
				SET @siteID=SCOPE_IDENTITY()   
			END   
			UPDATE om.items SET keyname=ISNULL(@hostName,keyname) WHERE id=@siteID   
			SELECT @hostname=keyname FROM om.items WHERE id=@siteID   
			SELECT TOP 1 @homeID=id FROM api.items WHERE classID=1092 AND masterID=@siteID ORDER BY idx   
			IF @homeID IS NULL    
			BEGIN   
				INSERT om.items(hostID,classID,name,masterID)VALUES(@publicCompanyID,1092,'Home',@siteID)   
				SET @homeID=SCOPE_IDENTITY()   
			END   
			   
			--Account   
			SELECT @accountID=id FROM api.items WHERE hostID=@publicCompanyID AND classID=1004 AND fromID=@publicCompanyID AND toID=@userID   
			--SELECT @publicCompanyID,@userID,@accountID RETURN   
			IF @accountID IS NULL   
			BEGIN   
				INSERT om.items(hostID,classID,name) VALUES(@publicCompanyID,1004,@displayName)   
				SET @accountID=SCOPE_IDENTITY()    
			END   
			EXEC api.setAttribute @id=@accountID,@name='DisplayName',@itemID=@userID,@classID=1000,@idname='toID'   
			EXEC api.setAttribute @id=@accountID,@name='Company',@itemID=@publicCompanyID,@classID=1002,@idname='fromID'   
			EXEC api.setAttribute @id=@accountID,@name='EmailAddresses0Address',@value=@email   
			EXEC api.setAttribute @id=@accountID,@name='groupId',@itemID=@groupID,@classID=1103   
		END   
		IF @accountID IS NOT NULL   
		BEGIN   
			SELECT @hostID=hostID,@publicContactID=srcID,@companyID=fromID,@userID=toID FROM om.items WHERE id=@accountID   
			SELECT @publicCompanyID=CASE WHEN hostID<>1 THEN srcID ELSE id END FROM om.items WHERE id=@companyID   
			EXEC api.getAttribute @id=@accountID,@name='EmailAddresses0Address',@value=@email OUTPUT   
			EXEC api.getAttribute @id=@accountID,@name='DisplayName',@value=@DisplayName OUTPUT   
			IF @publicContactID IS NULL   
			BEGIN   
				-- Create Public Company if not exists   
				IF @publicCompanyID IS NULL   
				BEGIN   
					EXEC api.getAttribute @id=@accountID,@name='Company',@value=@companyName OUTPUT,@itemID=@companyID OUTPUT   
					--IF @companyName IS NULL RAISERROR('Missing CompanyName',15,0)    
					SELECT @publicCompanyID=id FROM api.items WHERE hostID=1 AND classID=1002 AND name=@companyName   
					IF @publicCompanyID IS NULL    
					BEGIN   
						INSERT om.items(hostID,classID,name,www)VALUES(1,1002,@companyName,1)   
						SET @publicCompanyID=SCOPE_IDENTITY()   
					END   
					UPDATE om.items SET www=1 WHERE id=@publicCompanyID   
					UPDATE om.items SET srcID=@publicCompanyID WHERE id=@companyID   
				END   
				IF @email IS NULL RAISERROR('Missing Email',15,0)    
				SELECT @aid=aid,@userID=I.id FROM auth.email E LEFT OUTER JOIN api.items I ON I.id=E.id WHERE email=@email   
				IF @aid IS NULL BEGIN   
					INSERT auth.email(email)VALUES(@email)   
					SET @aid=scope_identity()   
				END   
				IF @userID IS NULL BEGIN   
					INSERT om.items(hostID,classID,name,www)VALUES(1,1000,@DisplayName,1)   
					SET @userID=scope_identity()   
					UPDATE auth.email SET id=@userID WHERE aid=@aid   
					EXEC api.setAttribute @id=@userID,@name='EmailAddresses2Address',@value=@email   
					INSERT auth.users(id)VALUES(@userID)   
				END   
				EXEC api.setAttribute @id=@accountID,@name='DisplayName',@itemID=@userID,@classID=1000,@idname='toID'   
				SELECT @publicContactID=id FROM api.items WHERE hostID=1 AND classID=1004 AND fromID=@publicCompanyID AND toID=@userID   
				IF @publicContactID IS NULL   
				BEGIN   
					INSERT om.items(hostID,classID,name,www)VALUES(1,1004,@DisplayName,1)    
					SET @publicContactID=SCOPE_IDENTITY()    
					EXEC api.setAttribute @id=@publicContactID,@name='DisplayName',@itemID=@userID,@classID=1000,@value=@displayName,@idname='toID'   
					EXEC api.setAttribute @id=@publicContactID,@name='Company',@itemID=@publicCompanyID,@classID=1002,@idname='fromID'   
					EXEC api.setAttribute @id=@publicContactID,@name='EmailAddresses0Address',@value=@email   
				END   
				UPDATE om.items SET www=1 WHERE id=@publicContactID   
				UPDATE om.items SET srcID=@publicContactID WHERE id=@accountID   
				--IF @ownerID IS NULL EXEC auth.addUserMsg @userID=@userID,@name='nocompanyowner',@itemID=@publicCompanyID,@byID=@byID   
			END   
			--select @publicContactID,@userID return   
			IF NOT EXISTS(SELECT id FROM auth.users WHERE id=@userID) INSERT auth.users(id)VALUES(@userID)   
			SELECT @userName=name FROM om.items WHERE id=@userID   
			EXEC api.setAttribute @id=@publicContactID,@name='groupId',@classID=1103,@itemID=2619989   
			EXEC api.getAttribute @id=@publicCompanyID,@name='owner',@itemID=@ownerID OUTPUT   
			--SELECT @ownerid,@publicCompanyID   
			EXEC api.getAttribute @id=@accountID,@name='groupId',@itemID=@groupID OUTPUT   
			DELETE auth.userMsg WHERE userID=@userID AND name='nocompanyowner'   
			EXEC auth.addUserMsg @userID=@userID,@name='newcontact',@itemID=@accountID,@byID=@byID   
			EXEC auth.addUserMsg @userID=@userID,@name='newpubliccontact',@itemID=@publicContactID,@byID=@byID   
			IF @groupID IS NOT NULL EXEC auth.addUserMsg @userID=@userID,@name='newaccount',@itemID=@accountID,@byID=@byID   
			EXEC auth.addUserMsg @userID=@userID,@name='newuser',@itemID=@userID,@byID=@byID   
			IF @ownerID IS NULL    
				EXEC auth.addUserMsg @userID=@userID,@name='nocompanyowner',@itemID=@publicCompanyID,@byID=@byID   
		END   
		-- AFRONDEN   
		SELECT @byName=name FROM om.items WHERE id=ISNULL(@byID,@userID)   
		SELECT H.id hostID,H.keyname host,H.name hostName,@companyID companyID,C.name companyName,@publicCompanyID publicCompanyID,@domain domain,@userID userID,U.name userName,@displayName displayName,@groupID groupID,G.name groupName,@siteID siteID,@homeID homeID,@publicContactID publicContactID,@accountID accountID,@byID byID,@email email   
		,BA.name byName,BA.subject byJobName, BA.summary AS byCompany   
		FROM api.items H    
		LEFT OUTER JOIN api.items PC ON PC.id=@publicCompanyID   
		LEFT OUTER JOIN api.items C ON C.id=@companyID   
		LEFT OUTER JOIN api.items U ON U.id=@userID   
		LEFT OUTER JOIN api.items G ON G.id=@groupID   
		LEFT OUTER JOIN auth.account BA ON BA.hostID=H.id AND BA.userID=@byID   
		--api.items AC ON AC.hostID=@publicCompanyID AND BA.classID=1004 AND BA.toID=@userID   
		--LEFT OUTER JOIN api.items AB ON AB.hostID=@publicCompanyID AND BA.classID=1004 AND BA.toID=@userID   
		WHERE H.id=@hostID   
		SELECT M.*,I.name AS byName,R.name AS itemName,T.name AS toName,F.name AS fromName,H.name AS hostName ,H.keyname AS host   
		FROM auth.userMsg M    
			LEFT OUTER JOIN api.items I ON I.id=M.createdByID    
			LEFT OUTER JOIN api.items R ON R.id=M.itemID    
			LEFT OUTER JOIN api.items T ON T.id=R.toID    
			LEFT OUTER JOIN api.items F ON F.id=R.fromID    
			LEFT OUTER JOIN api.items H ON H.id=R.hostID    
		WHERE M.userID=@userID AND M.sendDT IS NULL   
		--DELETE auth.userMsg WHERE name='newaccount' AND itemID=2773170   
		--SELECT * FROM auth.userMsg WHERE name='newaccount' AND itemID=2773170   
		RETURN   
	END TRY   
	BEGIN CATCH   
		SET @errMsg = ERROR_MESSAGE()   
		RAISERROR(@errMsg, 15, 0)   
		RETURN   
	END CATCH   
	RETURN 

GO

ALTER PROCEDURE [auth].[getAccount] @email VARCHAR(500)=NULL, @hostName VARCHAR(50)=NULL, @groupName VARCHAR(50)=NULL, @password VARCHAR(50)=NULL, @hostId INT=NULL OUTPUT, @userId INT=NULL OUTPUT, @accountId INT=NULL OUTPUT, @groupId INT=NULL OUTPUT,@verified BIT=NULL OUTPUT,@pwOk BIT=NULL OUTPUT,@select BIT=NULL  
AS  
	DECLARE @userName VARCHAR(500),@accountName VARCHAR(500),@userUid VARCHAR(128),@hostUid VARCHAR(128),@accountUid VARCHAR(128),@groupUid VARCHAR(128)  
	,@user_secret VARCHAR(128)  
 
	IF @hostId IS NULL SELECT @hostId=id FROM api.items WHERE hostID=1 AND classID=1002 AND keyname=@hostName  
	IF @hostName IS NULL SELECT @hostName=keyname FROM api.items WHERE id=@hostId  
	IF @userId IS NOT NULL SELECT @email=value,@verified=CASE WHEN id=userId THEN 1 ELSE 0 END FROM om.attributes WHERE id=@userId AND fieldId=30  
	ELSE SELECT @userId=id,@verified=CASE WHEN id=userId THEN 1 ELSE 0 END FROM om.attributes WHERE fieldId=30 AND value=@email  
	IF @password IS NOT NULL SELECT @pwOk=pwdcompare(@password,password)FROM auth.users WHERE id=@userId  
	SELECT @accountId=I.id,@groupId=A.itemId,@accountName=I.title,@groupName=A.value  
		FROM api.items I  
		INNER JOIN api.attributes A ON I.hostId=@hostId AND A.id=I.id AND A.fieldId=3 AND I.toId=@userId  
	SELECT @userName=title FROM api.items WHERE id=@userId  
	SELECT @accountName=ISNULL(title,@userName) FROM api.items WHERE id=@accountId  
	SELECT @hostUid=uid FROM api.items WHERE id=@hostId  
	IF @userId IS NOT NULL 
	BEGIN 
		SELECT @userUid=uid,@user_secret=secret FROM api.items WHERE id=@userId  
		IF @user_secret IS NULL 
		BEGIN 
			SET @user_secret=newid() 
			UPDATE om.items SET secret=@user_secret WHERE id=@userId  
		END 
		SELECT @accountUid=uid FROM api.items WHERE id=@accountId  
		SELECT @groupUid=uid FROM api.items WHERE id=@groupId  
	END 
  
	IF @select IS NOT NULL  
		SELECT  
			@email email, 
			@userName userName, 
			@hostName hostName,  
			@accountName accountName, 
			@groupName groupName,  
			@verified verified,  
			@pwOk [pwdcompare],  
			@userId userID,  
			@hostId hostID,  
			@accountId accountID,  
			@groupId groupID,  
			@hostUid hostUID,  
			@userUid userUID,  
			@user_secret user_secret,  
			@accountUid accountUID,  
			@groupUid groupUID 

GO

ALTER PROCEDURE [auth].[getContact] @accountID INT=NULL,@email VARCHAR(50)=NULL,@hostID INT=NULL,@publicCompanyID INT=NULL,@companyID INT=NULL,@byID INT=NULL,@groupID INT=NULL,@companyName VARCHAR(200)=NULL,@hostname VARCHAR(50)=NULL,@domain VARCHAR(50)=NULL   
AS   
	SET NOCOUNT ON   
    DECLARE @userID INT,@ownerID INT,@contactID INT,@homeID INT, @publicContactID INT,@aid INT,@siteID INT,@contactName VARCHAR(200),@groupName VARCHAR(200),@userName VARCHAR(200),@byName VARCHAR(200)   
	-- ========================================================================================================   
	-- HAS CompanyID   
	--IF @hostID IS NOT NULL SET @publicCompanyID = @hostID   
	IF @publicCompanyID IS NOT NULL   
	BEGIN   
		EXEC api.getAttribute @id=@publicCompanyID,@name='hostName',@value=@hostname OUTPUT   
		EXEC api.getAttribute @id=@publicCompanyID,@name='owner',@itemID=@ownerID OUTPUT   
		EXEC api.getAttribute @id=@publicCompanyID,@name='CompanyName',@value=@companyName OUTPUT   
		EXEC api.getAttribute @id=@ownerID,@name='EmailAddresses0Address',@value=@email OUTPUT   
		SELECT @userID=toID FROM om.items WHERE id=@ownerID   
		--SELECT @ownerID,@email,@hostname,@companyName   
		--RETURN   
	END   
	-- ========================================================================================================   
	-- User and Email   
	IF @email IS NULL AND @accountID IS NOT NULL SELECT @email=value FROM om.attributes WHERE id=@accountID AND fieldID=931   
	IF @email IS NULL RAISERROR('Missing Email',15,0)    
	--SELECT @accountID RETURN   
	--SELECT @contactName=value,@userID=itemID FROM om.attributes WHERE id=@accountID AND fieldID=921   
	SELECT @aid=aid,@userID=id FROM auth.email WHERE email=@email   
	IF @aid IS NULL   
	BEGIN   
		INSERT auth.email(email)VALUES(@email)   
		SET @aid=scope_identity()   
	END   
	IF @userID IS NULL    
	BEGIN   
		INSERT om.items(classID,name,hostID)VALUES(1000,@email,1)   
		SET @userID=scope_identity()   
		UPDATE auth.email SET id=@userID WHERE aid=@aid   
		EXEC api.setAttribute @id=@userID,@name='EmailAddresses2Address',@value=@email   
	END   
	IF NOT EXISTS(SELECT id FROM auth.users WHERE id=@userID) INSERT auth.users(id)VALUES(@userID)   
	SELECT @userName=name FROM om.items WHERE id=@userID   
	DELETE auth.userMsg WHERE userID=@userID   
	EXEC auth.addUserMsg @userID=@userID,@name='newuser',@itemID=@userID,@byID=@byID   
	-- ========================================================================================================   
	-- Company and host   
	IF @accountID IS NOT NULL SELECT @companyID=itemID FROM om.attributes WHERE id=@accountID AND fieldID=740   
	IF @companyID IS NOT NULL SELECT @publicCompanyID=srcID FROM om.items WHERE id=@companyID   
	IF @publicCompanyID IS NULL AND @domain IS NOT NULL SELECT @publicCompanyID=id FROM api.items WHERE hostID=1 AND classID=1002 AND keyname=@domain   
	IF @publicCompanyID IS NULL AND @companyName IS NOT NULL SELECT @publicCompanyID=id FROM api.items WHERE hostID=1 AND classID=1002 AND name=@companyName   
	IF @publicCompanyID IS NULL AND @companyName IS NULL RAISERROR('Missing @publicCompanyID and @companyName',15,0)    
	IF @publicCompanyID IS NULL    
	BEGIN   
		INSERT om.items(classID,name)VALUES(1002,@companyName)   
		SET @publicCompanyID=SCOPE_IDENTITY()   
		UPDATE om.items SET hostID=@publicCompanyID WHERE id=@publicCompanyID   
	END   
	IF @companyName IS NOT NULL UPDATE om.items SET userID=@userID WHERE id=@publicCompanyID   
	IF @companyName IS NOT NULL EXEC auth.addUserMsg @userID=@userID,@name='newowner',@itemID=@publicCompanyID,@byID=@byID   
	SELECT @hostID=ISNULL(@hostID,@publicCompanyID),@companyName=name FROM om.items WHERE id=@publicCompanyID   
	--select @hostID   
	--RETURN   
	IF NOT EXISTS(SELECT 0 FROM auth.host WHERE id=@hostID) INSERT auth.host(id)VALUES(@hostID)   
	UPDATE om.items SET keyname=ISNULL(@domain,keyname) WHERE id=@hostID   
	UPDATE auth.host SET name=ISNULL(@hostname,name),domain=ISNULL(@domain,domain),mailAccountAid=ISNULL(mailAccountAid,2) WHERE id=@hostID   
	SELECT @domain=domain FROM auth.host WHERE id=@hostID   
	-- ========================================================================================================   
	-- Group   
	IF @accountID IS NOT NULL AND @groupID IS NULL SELECT @groupID=itemID FROM om.attributes WHERE id=@accountID AND classID=1103--fieldID=1228   
	IF @accountID IS NOT NULL AND @groupID IS NULL RETURN -- Account data but no group, so no account creation   
	IF @groupID IS NULL SELECT @groupID=id FROM api.items WHERE hostID=@hostID AND classID=1103 AND name='Admin' -- get Admin groupID   
	IF @groupID IS NULL SELECT TOP 1 @groupID=id FROM api.items WHERE hostID=@hostID AND classID=1103 -- get first available groupID   
	IF @groupID IS NULL -- Create Group Admin   
	BEGIN   
		INSERT om.items(hostID,classID,name)VALUES(@hostID,1103,'Admin')   
		SET @groupID=SCOPE_IDENTITY()   
	END   
	SELECT @groupName=name FROM om.items WHERE id=@groupID   
	-- ========================================================================================================   
	-- Site   
	SELECT @siteID=id FROM api.items WHERE classID=1091 AND masterID=@hostID   
	IF @siteID IS NULL    
	BEGIN   
		INSERT om.items(hostID,classID,name,masterID)VALUES(@hostID,1091,@companyName,@hostID)   
		SET @siteID=SCOPE_IDENTITY()   
	END   
	UPDATE om.items SET keyname=ISNULL(@hostName,keyname) WHERE id=@siteID   
	SELECT @hostname=keyname FROM om.items WHERE id=@siteID   
	SELECT TOP 1 @homeID=id FROM api.items WHERE classID=1092 AND masterID=@siteID ORDER BY idx   
	IF @homeID IS NULL    
	BEGIN   
		INSERT om.items(hostID,classID,name,masterID)VALUES(@hostID,1092,'Home',@siteID)   
		SET @homeID=SCOPE_IDENTITY()   
	END   
	-- ========================================================================================================   
	-- PublicContact   
	SELECT @contactName=name FROM om.items WHERE id=@userID   
	SELECT @publicContactID=id FROM api.items WHERE hostID=1 AND classID=1004 AND fromID=@publicCompanyID AND toID=@userID   
	IF @publicContactID IS NULL    
	BEGIN    
		INSERT om.items(hostID,classID,name,www)VALUES(1,1004,@contactName,1)    
		SET @publicContactID=SCOPE_IDENTITY()    
		EXEC api.setAttribute @id=@publicContactID,@name='DisplayName',@itemID=@userID,@idname='toID'   
		EXEC api.setAttribute @id=@publicContactID,@name='Company',@itemID=@publicCompanyID,@idname='fromID'   
		EXEC api.setAttribute @id=@publicContactID,@name='EmailAddresses0Address',@value=@email   
	END   
	EXEC auth.addUserMsg @userID=@userID,@name='newcontact',@itemID=@publicContactID,@byID=@byID   
	-- ========================================================================================================   
	-- Account   
	SELECT @companyID=ISNULL(@companyID,@hostID)   
	IF @accountID IS NULL SELECT @accountID=id FROM api.items WHERE hostID=@hostID AND classID=1004 AND toID=@userID AND fromID=@companyID   
	IF @accountID IS NULL    
	BEGIN    
		INSERT om.items(hostID,classID,name)VALUES(@hostID,1004,@contactName)   
		SET @accountID=SCOPE_IDENTITY()   
		EXEC api.setAttribute @id=@accountID,@name='DisplayName',@itemID=@userID,@idname='toID'   
		EXEC api.setAttribute @id=@accountID,@name='Company',@itemID=@companyID,@idname='fromID'   
		EXEC api.setAttribute @id=@accountID,@name='EmailAddresses0Address',@value=@email   
	END   
	UPDATE om.items SET srcID=@publicContactID WHERE id=@accountID   
	IF @groupID IS NOT NULL EXEC auth.addUserMsg @userID=@userID,@name='newaccount',@itemID=@accountID,@byID=@byID   
	SELECT @byName=name FROM om.items WHERE id=ISNULL(@byID,@userID)   
	SELECT @hostID hostID,@hostname hostName,@companyID companyID,@companyName companyName,@domain domain,@userID userID,@userName userName,@groupID groupID,@groupName groupName,@siteID siteID,@homeID homeID,@publicContactID publicContactID,@accountID accountID,@byID byID,@email email,@byName byName   
	SELECT M.*,I.name AS byName,R.name AS itemName,T.name AS toName,F.name AS fromName,H.name AS hostName    
	FROM auth.userMsg M    
		LEFT OUTER JOIN api.items I ON I.id=M.createdByID    
		LEFT OUTER JOIN api.items R ON R.id=M.itemID    
		LEFT OUTER JOIN api.items T ON T.id=R.toID    
		LEFT OUTER JOIN api.items F ON F.id=R.fromID    
		LEFT OUTER JOIN api.items H ON H.id=R.hostID    
	WHERE M.userID=@userID AND M.sendDT IS NULL 

GO

ALTER PROCEDURE [auth].[getUser] @email VARCHAR(50),@userID INT OUTPUT    
AS   
	DECLARE @aid INT   
	SELECT @aid=aid,@userID=id FROM auth.email WHERE email=@email   
	IF @aid IS NULL   
	BEGIN   
		INSERT auth.email(email)VALUES(@email)   
		SET @aid=scope_identity()   
	END   
	IF @userID IS NULL    
	BEGIN   
		INSERT om.items(classID,name,hostID)VALUES(1000,@email,1)   
		SET @userID=scope_identity()   
		UPDATE auth.email SET id=@userID WHERE aid=@aid   
		EXEC api.setAttribute @id=@userID,@name='EmailAddresses2Address',@value=@email   
	END   
	IF NOT EXISTS(SELECT id FROM auth.users WHERE id=@userID) INSERT auth.users(id)VALUES(@userID) 

GO

ALTER PROCEDURE [auth].[setHostUser] @hostID INT=NULL,@userID INT=NULL,@deviceID INT=NULL,@accountID INT=NULL,@groupID INT=NULL     
AS  
	DECLARE @Periode INT  
	SET @Periode =DATEPART(year,GETUTCDATE())*100+DATEPART(month,GETUTCDATE())  
	IF @hostID IS NOT NULL AND @accountID IS NOT NULL EXEC api.setAttribute @id=@accountID,@hostID=1,@modifiedByID=@userID,@name='Periode',@max=0,@class='Periode',@value=@Periode   --AND NOT EXISTS(SELECT 0 FROM om.attributes WHERE id=@deviceID AND itemID=@userID) INSERT om.attributes(id,itemID)VALUES(@deviceID,@userID)  
	--IF @userID IS NOT NULL   
	--BEGIN   
	--	UPDATE auth.hostLogin SET loginDt=GETUTCDATE() WHERE userID=@userID AND id=@hostID   
	--	DECLARE @dt DATETIME, @periode INT   
	--	SET @dt = GETUTCDATE()   
	--	SET @periode = DATEPART(year,@dt)*100+DATEPART(month,@dt)   
	--	IF NOT EXISTS(SELECT 0 FROM auth.hostLoginLog WHERE hostID=@hostID AND userID=@userID AND periode=@periode) INSERT auth.hostLoginLog(hostID,userID,periode,cnt,firstLoginDt,lastLoginDt) VALUES(@hostID,@userID,@periode,1,@dt,@dt)   
	--	ELSE UPDATE auth.hostLoginLog SET lastLoginDt=@dt WHERE hostID=@hostID AND userID=@userID AND periode=@periode   
	--END 

GO

ALTER PROCEDURE [mail].[addItem] @hostID INT=NULL,@host VARCHAR(50)=NULL,@ToID INT=NULL,@AccountId INT=NULL,@email VARCHAR(50)=NULL,@name varchar(200)=NULL,@subject varchar(200)=NULL,@hostname varchar(200)=NULL,@ItemID VARCHAR(10)=NULL,@content VARCHAR(MAX)=NULL,@msg VARCHAR(MAX)=NULL,@pri INT=null   
AS   
	SET NOCOUNT ON   
	DECLARE @srcid INT,@title VARCHAR(500),@companyname VARCHAR(500),@contactname VARCHAR(500),@summary VARCHAR(500),@basecolor varchar(50)   
	--IF @HostID IS NULL SELECT @HostID=hostid FROM om.items WHERE id=@accountID   
	IF @HostID IS NULL SELECT @HostID=id FROM api.items WHERE classID=1002 AND keyname=@host   
	IF @HostID IS NULL SET @hostID=1   
	SELECT @hostname=keyname,@companyname=name FROM om.items WHERE id=@HostID   
	IF @AccountID IS NULL SELECT @AccountID=AccountID FROM auth.account WHERE hostID=@hostID AND UserID=@ToID   
	SELECT @contactname=title FROM api.items WHERE id=@accountID   
   
	IF @email IS NULL SELECT @email=value FROM om.attributes WHERE id=@AccountID AND fieldID=931--name='EmailAddresses0Address'   
	IF @email IS NULL SELECT @email=value FROM om.attributes WHERE id=@AccountID AND fieldID=1118--name='EmailAddresses2Address'   
	--IF @email IS NULL SELECT @email=value FROM om.attributes WHERE id=@srcID AND name='EmailAddresses0Address'   
	--IF @email IS NULL SELECT @email=value FROM om.attributes WHERE id=@srcID AND name='EmailAddresses2Address'   
	IF @email IS NULL SELECT @email=value FROM om.attributes WHERE id=@ToID AND fieldID=1118---name='EmailAddresses2Address'   
	SELECT @basecolor=value FROM om.attributes WHERE id=@HostID AND fieldID=741--name='basecolor'   
   
	IF @msg IS NULL   
	BEGIN   
		SELECT @subject=subject,@summary=summary,@msg=mailmsg FROM cfg.msg WHERE name=@name   
		IF @ItemID IS NOT NULL SELECT @Subject=name,@summary=summary FROM om.items WHERE id=@itemID   
		--SET @msg='{"mail":1,"FromEmail":"mailer@alicon.nl","FromName":"Aliconnect Max","ReplyToEmail":"max@alicon.nl", "ReplyToName":"Max","to":"'+@email+'","Basecolor":"#fafafa","Domain":"alicon.aliconnect.nl","Hostname":"alicon","Subject":"'+ISNULL(@subject,'')+'","Summary":"'+ISNULL(@summary,'')+'","mailbody":{"content":"'+ISNULL(@msg,'')+'","ItemID":0'+ISNULL(@ItemID,'')+'}}'   
		SET @msg=REPLACE(ISNULL(@msg,''),'"','\"')   
		SET @msg=REPLACE(@msg,CHAR(13)+CHAR(10),'</p><p>')   
		SET @msg=REPLACE(@msg,CHAR(10),'<br>')   
		SET @msg='{"content":"'+ISNULL(@msg,'')+'","ItemID":"'+ISNULL(@ItemID,'')+'"}'   
	END   
	SET @email='max@alicon.nl';   
	SET @msg='{"to":"'+isnull(@email,'')+'","bcc":"max@alicon.nl","Subject":"'+ISNULL(@subject,'')+'","msgs":{"content":"Beste '+ISNULL(@contactname,'')+',"},'+@msg+'}'   
	SET @msg=REPLACE(@msg,'email',ISNULL(@email,''))   
	SET @msg=REPLACE(@msg,'domain',ISNULL(@hostname,''))   
	SET @msg=REPLACE(@msg,'subject',ISNULL(@subject,''))   
	SET @msg=REPLACE(@msg,'summary',ISNULL(@summary,''))   
	SET @msg=REPLACE(@msg,'toname',ISNULL(@contactname,''))   
	SET @msg=REPLACE(@msg,'content',ISNULL(@content,''))   
	SET @msg=REPLACE(@msg,'companyname',ISNULL(@companyname,''))   
	--SET @msg='{"mail":1,"FromEmail":"mailer@alicon.nl","to":"'+@email+'","Basecolor":"#fafafa","Domain":"alicon.aliconnect.nl","Hostname":"alicon","Subject":"'+ISNULL(@subject,'')+'","Summary":"'+ISNULL(@summary,'')+'","mailbody":{"content":"'+ISNULL(@msg,'')+'"}}'   
	--SELECT @hostID,@accountID,@msg   
	IF @msg IS NOT NULL INSERT mail.queue(host,msg,pri) VALUES(@host,@msg,@pri) 

GO

ALTER PROCEDURE [api].[addItemFav] @id INT,@AccountID INT   
AS   
	IF NOT EXISTS(SELECT 0 FROM om.itemFav WHERE id=@id AND UserID=@AccountID)    
	BEGIN   
		DECLARE @GroupID INT,@HostID INT,@UserID INT,@SrcID INT   
   
		SELECT @HostID=HostID FROM om.items WHERE id=@id   
   
		INSERT om.itemFav(id,userID,fav,updateDt) VALUES(@id,@AccountID,1,GETUTCDATE())    
   
		SELECT @HostID=HostID,@SrcID=SrcID FROM api.items WHERE id=@AccountID   
		SELECT @groupID=itemID FROM om.attributes WHERE id=@accountID AND fieldID=1228   
   
		IF @GroupID IS NULL   
		BEGIN   
			SELECT @groupID=id FROM api.items WHERE classID=1103 AND hostID=@HostID AND name='Admin'   
			UPDATE om.items SET KeyID=@GroupID WHERE id=@AccountID   
			EXEC mail.addItem @AccountID=@AccountID,@HostID=@HostID,@name='mailHostAccountAdd'   
			IF NOT EXISTS(SELECT 0 FROM auth.users WHERE id=@SrcID)   
			BEGIN   
				INSERT auth.users(id) VALUES(@srcID)   
				EXEC mail.addItem @AccountID=@AccountID,@HostID=@HostID,@name='mailAliconnectAccountAdd'   
			END   
		END   
		EXEC mail.addItem @AccountID=@AccountID,@HostID=@HostID,@ItemID=@id,@name='mailItemAccountAdd'   
	END   
	ELSE    
		UPDATE om.itemFav SET updateDt=GETUTCDATE() WHERE id=@id AND UserID=@AccountID 

GO

ALTER PROCEDURE [api].[setAccount] @email VARCHAR(500), @userName VARCHAR(500)=NULL, @hostName VARCHAR(50), @groupName VARCHAR(50),@accountName VARCHAR(50)=NULL, @password VARCHAR(50)=NULL, @hostId INT=NULL OUTPUT, @userId INT=NULL OUTPUT, @accountId INT=NULL OUTPUT, @groupId INT=NULL OUTPUT,@select BIT=NULL,@pwOk BIT=NULL,@verified BIT=NULL , @userUid VARCHAR(50)=NULL  
AS   
	DECLARE @emailAid INT   
	SET IDENTITY_INSERT om.items ON; 
 
	IF NOT EXISTS(SELECT 0 FROM om.items WHERE id=1000) INSERT om.items(id,classID,masterID,srcID,hostID,name)VALUES(1000,0,0,0,0,'Account')   
	IF NOT EXISTS(SELECT 0 FROM om.items WHERE id=1002) INSERT om.items(id,classID,masterID,srcID,hostID,name)VALUES(1002,0,0,0,0,'Company')   
	IF NOT EXISTS(SELECT 0 FROM om.items WHERE id=1003) INSERT om.items(id,classID,masterID,srcID,hostID,name)VALUES(1003,0,0,0,0,'Group')   
	IF NOT EXISTS(SELECT 0 FROM om.items WHERE id=1004) INSERT om.items(id,classID,masterID,srcID,hostID,name)VALUES(1004,0,0,0,0,'Contact')   
	IF @userId IS NOT NULL AND NOT EXISTS(SELECT 0 FROM om.items WHERE id=@userId) INSERT om.items(id,classID,uid)VALUES(@userId,1000,@userUID) 
	SET IDENTITY_INSERT om.items OFF;   
 
	IF NOT EXISTS(SELECT 0 FROM om.attributeName WHERE id=30)   
	BEGIN   
		SET IdENTITY_INSERT om.attributeName ON   
		INSERT om.attributeName(id,name)VALUES(30,'Email')   
		SET IdENTITY_INSERT om.attributeName OFF   
	END   
	IF NOT EXISTS(SELECT 0 FROM om.attributeName WHERE id=3)   
	BEGIN   
		SET IdENTITY_INSERT om.attributeName ON   
		INSERT om.attributeName(id,name)VALUES(3,'groupId')   
		SET IdENTITY_INSERT om.attributeName OFF   
	END   
	SET @userName=ISNULL(@userName,@email)   
	EXEC api.getAccount @email=@email, @hostName=@hostName, @groupName=@groupName, @password=@password, @hostId=@hostId OUTPUT, @userId=@userId OUTPUT, @accountId=@accountId OUTPUT, @groupId=@groupId OUTPUT,@pwOk=@pwOk OUTPUT   
	EXEC api.getItem @id=@hostId OUTPUT,@hostId=1,@title=@hostName,@keyname=@hostName,@classId=1002   
	EXEC api.getItem @id=@userId OUTPUT,@hostId=@hostId,@title=@userName,@classId=1000   
	EXEC api.getItem @id=@groupId OUTPUT,@hostId=@hostId,@title=@groupName,@classId=1003   
	EXEC api.getItem @id=@accountId OUTPUT,@hostId=@hostId,@title=@userName,@classId=1004   
	IF NOT EXISTS(SELECT 0 FROM auth.users WHERE id=@userId) INSERT auth.users(id)VALUES(@userId)   
	IF EXISTS(SELECT 0 FROM om.attributes WHERE fieldId=30 AND value=@email)   
		UPDATE om.attributes SET id=@userId,userId=@userId WHERE fieldId=30 AND value=@email   
	ELSE    
		EXEC api.setAttribute @id=@userId,@fieldId=30,@value=@email   
	EXEC api.setAttribute @id=@accountId,@fieldId=3,@itemId=@groupId,@classId=1003   
	EXEC api.setAttribute @id=@accountId,@name='Gebruiker',@itemId=@userId,@classId=1000,@idname='toId'   
	UPDATE om.items SET title=@userName,name=@userName WHERE id IN(@userId,@accountId)   
	UPDATE om.items SET title=@groupName WHERE id=@groupId   
	IF @password IS NOT NULL UPDATE auth.users SET password=pwdencrypt(@password) WHERE id=@userID   
	IF @select IS NOT NULL SELECT @email email,@hostName hostName, @groupName groupName, @userId userId, @hostId hostId, @accountId accountId, @groupId groupId 
 

GO

ALTER PROCEDURE [auth].[getHostUser] @hostID INT=NULL,@userID INT=NULL,@deviceID INT=NULL,@accountID INT=NULL,@groupID INT=NULL   
AS   
	SET NOCOUNT ON  
	IF @deviceID IS NOT NULL AND @userID IS NOT NULL EXEC api.setAttribute @id=@deviceID,@itemID=@userID,@name='User',@max=0  --AND NOT EXISTS(SELECT 0 FROM om.attributes WHERE id=@deviceID AND itemID=@userID) INSERT om.attributes(id,itemID)VALUES(@deviceID,@userID)  
	IF @deviceID IS NOT NULL AND @hostID IS NOT NULL EXEC api.setAttribute @id=@deviceID,@itemID=@hostID,@name='Host',@max=0  --AND NOT EXISTS(SELECT 0 FROM om.attributes WHERE id=@deviceID AND itemID=@hostID) INSERT om.attributes(id,itemID)VALUES(@deviceID,@hostID)  
	  
	SET NOCOUNT OFF   
    SELECT TOP 1 CONVERT(TEXT,H.itemConfig) AS host,H.keyname AS name , ISNULL(S.files,H.files)files,S.id siteID   
	FROM api.items H    
	LEFT OUTER JOIN api.items S ON S.masterID=H.id AND S.classID=1091 AND S.startDT IS NOT NULL   
	WHERE H.id=@hostID   
   
	EXEC auth.setHostUser @hostID=@hostID,@userID=@userID,@deviceID=@deviceID,@accountID=@accountID,@groupID=@groupID  
   
	--SELECT U.name,G.name AS groupName, U.id,A.id AS accountID,G.id AS groupID--,A.hostID   
	--FROM api.items U   
	--LEFT OUTER JOIN api.items A ON A.toID=U.id AND A.hostID=@hostID AND A.classID=1004   
	--INNER JOIN om.attributes F ON F.id=A.id AND F.classID=1103 AND F.itemID IS NOT NULL   
	--INNER JOIN api.items G ON G.id=F.itemID    
	----SELECT I.name,I.id,F.itemID groupID,F.value AS groupName FROM api.items I INNER JOIN om.attributes F ON I.hostID=@hostID AND I.toID=@userID AND I.classID=1004 AND I.id=F.id AND F.classID=1103 AND F.itemID IS NOT NULL   
	--WHERE U.id=@userID   
   
	--RETURN   
   
   
	--SELECT id,lower(C.class)class,CONVERT(TEXT,ISNULL(C.config,'{}')) config FROM om.class C WHERE C.classHostID IN(1,@hostID) 

GO
