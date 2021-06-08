# NodeJS - Authentication/Authorization Middleware

>**The purpose of this repository is intended just for training material and it is not recommended to take this as a reference for production scenarios.**

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fazureossd%2Fappsreadynext-nodejs-easyauth%2Fmaster%2Ftemplate.json)

1. Enable **Authentication/Authorization**, select **App Service Authentication** On, and **Log in with Azure Active Directory**.
2. Select **Express** and save.
3. Request **/** to reproduce a **http 431 status code**, to fix this add this app setting **WEBSITE_AUTH_DISABLE_IDENTITY_FLOW=true**.
4. Request **/user** to reproduce a Http 500 server error.
5. Enable **Application Logs** to review *"Failed to forward request to application. Encountered a System.Net.Http.HttpRequestException exception after 7.878ms with message: The HTTP response headers length exceeded the set limit of 65536 bytes.. Check application logs to verify the application is properly handling HTTP traffic."* 

> **Note**: Review for Kestrel server limits which applies also for middleware container - https://docs.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.server.kestrel.core.kestrelserverlimits?view=aspnetcore-3.1"

## Fixing the issue
1. Since the response headers are exceding the size of 65536 bytes, adding this custom app setting **HEADERS_FIX=true** will use a custom header with less size.

