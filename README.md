# Automation Integration Manager Node

AIM stands for Automation Integration Manager and is a development of [Alicon](https://alicon.aliconnect.nl) and designed by [Max van Kampen](https://www.linkedin.com/in/maxvankampen/).

We supply a cloud service on [aliconnect.nl](https://aliconnect.nl) that contains:
1. A data warehouse in the cloud that can preserve a client configurable datamodel. It includes object oriented inheritance for complex breakdown structures.
1. A data management server with OData REST API and WebSocket service for realtime data access by client web applications and services
1. Multifactorauthentication for secure and private data storage for accounts and companies
1. A no-code SaaS client application to work with your persponal and company data

For custom software development we supply:
1. A [API](https://aliconnect.github.io/api/) library for filebased and localhost client applications
1. A [Node](https://aliconnect.github.io/aim/) library for factory and machine control applications with realtime visualisation that run on- or offline
1. An [Software Development Kit](https://aliconnect.github.io/sdk/) for software development with the AIM Framework

Our target is to offer this framework to developers over the world to supply a software development kit that includes a complete webapplication environment that can be extended with custom solutions.

> As for today this Framework is **under construction** and is **not for public use**. Our primairy target is to complete the authentication flow and domain registration. First release is te be expected end august 2021.

# Installation

```cmd
npm install @aliconnect/aim
```



```
📁 aliconnect
  📁 node_modules
  📁 webroot
    🖹 web.config
    📁 sites
      📁 schiphol
        📁 station
```


web.config
```
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
	<system.webServer>
		<rewrite>
			<rules>
        <rule name="IsNoSiteFile" stopProcessing="true">
					<match url="sites|shared" negate="true" />
          <conditions logicalGrouping="MatchAny">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" />
					</conditions>
				</rule>
        <rule name="IsApi" stopProcessing="true">
          <match url="^api.*" />
          <action type="Rewrite" url="api/index.php" appendQueryString="true" />
        </rule>
        <rule name="IsSiteDomain">
          <match url=".*" />
          <conditions>
            <add input="{HTTP_HOST}" pattern="^(.+?)\." />
					</conditions>
          <action type="Rewrite" url="sites/{C:1}{REQUEST_URI}" appendQueryString="true" />
				</rule>
        <rule name="IsDomainRoot" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAny">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" />
            <add input="{REQUEST_FILENAME}index.html" matchType="IsFile" />
            <add input="{REQUEST_FILENAME}index.php" matchType="IsFile" />
            <add input="{REQUEST_FILENAME}/index.html" matchType="IsFile" />
            <add input="{REQUEST_FILENAME}/index.php" matchType="IsFile" />
          </conditions>
        </rule>
        <rule name="Root" stopProcessing="true">
					<match url=".*" />
          <action type="Rewrite" url="index.php" appendQueryString="true" />
				</rule>
			</rules>
		</rewrite>
		<httpProtocol>
			<customHeaders>
				<clear />
        <add name="Access-Control-Allow-Origin" value="*" />
			</customHeaders>
		</httpProtocol>
		<staticContent>
			<mimeMap fileExtension=".log" mimeType="text/plain; charset=utf-8" />
			<mimeMap fileExtension=".md" mimeType="text/markdown" />
			<mimeMap fileExtension=".yml" mimeType="text/plain; charset=utf-8" />
			<mimeMap fileExtension=".yaml" mimeType="text/plain; charset=utf-8" />
			<mimeMap fileExtension=".obj" mimeType="application/octet-stream" />
			<mimeMap fileExtension=".3ds" mimeType="model/3ds_binary" />
		</staticContent>
		<defaultDocument>
			<files>
				<clear />
				<add value="index.php" />
        <add value="index.html" />
			</files>
		</defaultDocument>
	</system.webServer>
</configuration>
```

verdere instructie volgt
