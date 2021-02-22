USE [aim]
GO
/****** Object:  StoredProcedure [api].[getBuild]    Script Date: 2-9-2019 12:28:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROCEDURE [api].[getBuild] @rootID INT=NULL,@hostID INT=NULL 
AS  
	SET NOCOUNT ON 
	DECLARE @T TABLE  (id INT) 
	IF @hostID IS NOT NULL INSERT @T SELECT id FROM api.items WHERE hostID=@hostID 
	ELSE IF @rootID IS NOT NULL 
	BEGIN 
		SELECT @hostID=hostID FROM om.items WHERE id=@rootID
		;WITH P  (level,id) AS  (   
			SELECT 0,@rootID 
		UNION ALL  
			SELECT level+1,I.id 
			FROM P INNER JOIN api.items I ON I.masterId = P.id and level<50			
		)   
		INSERT @T SELECT DISTINCT id FROM P 
	END 
 
	DECLARE @S TABLE  (id INT) 
	;WITH P  (level,id,srcID) AS  (   
	SELECT 0,I.id,I.srcID FROM api.items I INNER JOIN @T T ON T.id=I.id AND I.srcID IS NOT NULL 
	UNION ALL  
	SELECT level+1,I.id,I.srcID 
	FROM P INNER JOIN api.items I ON I.id=P.srcID and level<50			
	)   
 
	INSERT @S SELECT DISTINCT id FROM P WHERE id NOT IN  (SELECT id FROM @T) 
 
	;WITH P  (level,id) AS  (   
		SELECT 0,id FROM @S 
	UNION ALL  
		SELECT level+1,I.id 
		FROM P INNER JOIN api.items I ON I.masterId = P.id and level<50		
	)   
	--SELECT DISTINCT id FROM P 
 
	INSERT @T SELECT DISTINCT id FROM P WHERE id NOT IN  (SELECT id FROM @T) 
 
	INSERT @T SELECT id FROM  (SELECT DISTINCT I.userID id FROM @T T INNER JOIN api.items I ON I.id=T.id)P WHERE id NOT IN  (SELECT id FROM @T) 
	INSERT @T SELECT id FROM  (SELECT DISTINCT I.hostID id FROM @T T INNER JOIN api.items I ON I.id=T.id)P WHERE id NOT IN  (SELECT id FROM @T) 
	INSERT @T SELECT id FROM  (SELECT DISTINCT I.ownerID id FROM @T T INNER JOIN api.items I ON I.id=T.id)P WHERE id NOT IN  (SELECT id FROM @T) 
	INSERT @T SELECT DISTINCT A.itemID FROM @T T INNER JOIN om.attributes A ON A.id=T.id AND A.itemID IS NOT NULL WHERE A.itemID NOT IN (SELECT id FROM @T) 

	;WITH P  (level,id) AS  (   
		SELECT 0,masterID FROM api.items WHERE id=@rootID 
	UNION ALL  
		SELECT level+1,I.masterID 
		FROM P INNER JOIN api.items I ON I.id = P.id and level<50  
	) 
	INSERT @T SELECT id FROM P WHERE id NOT IN  (SELECT id FROM @T) 
	INSERT @T VALUES (1) 
 
	INSERT @T SELECT DISTINCT id FROM om.attributes WHERE itemID IN  (SELECT id FROM @T) AND id NOT IN  (SELECT id FROM @T) 
 
	SELECT C.id,C.class name FROM  (SELECT DISTINCT I.classID FROM @T T INNER JOIN api.items I ON I.id=T.id)I INNER JOIN om.class C ON C.id=I.classID 
	UNION 
	SELECT C.id,C.class name FROM om.class C WHERE id IN  (1000,1002,1003,1004) 
 
	SELECT F.id,F.name FROM  (SELECT DISTINCT A.fieldID FROM @T T INNER JOIN api.attributes A ON A.id=T.id) A INNER JOIN om.attributeName F ON F.id=A.fieldID 
	UNION 
	SELECT F.id,F.name FROM om.attributeName F WHERE id IN  (3,30) 
 
	SELECT I.* FROM @T T INNER JOIN api.items I ON I.id=T.id AND I.hostID IN (@hostID,1)
	--where I.id in  (3490197) 
	--where I.id=3557810 
 
	SELECT A.aid,A.id,A.name,A.value,A.hostID,A.createdDT,A.modDT,A.userID,A.fieldID,A.itemID FROM @T T INNER JOIN om.attributes A ON A.id=T.id 
	--where T.id in  (3557866) 
	--where a.aid=17876680 
	--where a.id=3557810
GO

[api].[getBuild] @rootID=3549983



