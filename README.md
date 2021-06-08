# msiappservice-keyvault
Hello, I hope that you are doing great!

I have created a laboratory that uses the identity headers to acquire an access token. Afterwards, we use that same access token to acquire data from Azure Key Vault.

**Note: If you would like to deploy my code directly to Azure App Service, you can use the following button, this button will create a Linux app service plan on the B1 tier and an app service that runs on node**
  
[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FLuisRivera-Tek%2Fmsiappservice-keyvault%2Fmsi-keyvault%2Ftemplate.json)

**Note: If your using my app service to test MSI, make sure that you are using npm install && node --max-http-header-size=800000 server.js as your Node JS run command**


1) Enable managed identity for your app service:


  ![image](https://user-images.githubusercontent.com/77988455/121253319-349f3300-c866-11eb-807d-275739d41807.png)
  


2) In our code, we will get the Key Vault URIs from environment variables. So first make sure to add the following app settings:

    **Note: Make sure to specify the api-version at the end of your key vault secret's URL. In my case I am using ?api-version=2016-10-01**
    
    ![image](https://user-images.githubusercontent.com/77988455/121261330-d8411100-c86f-11eb-8254-6f938ceff709.png)

    Now we get the environment variables in code:
  
        var keyvault_uri=process.env.KEYVAULT_URL

        var keyvault_secret_uri= process.env.KEYVAULT_SECRET_URL

    ![image](https://user-images.githubusercontent.com/77988455/121253057-e8ec8980-c865-11eb-8b10-2bb80bf91776.png)

3) Now, we need to get the Identity headers:

        var identity_header= process.env.IDENTITY_HEADER;

        var identity_endpoint= process.env.IDENTITY_ENDPOINT;

     ![image](https://user-images.githubusercontent.com/77988455/121253467-60bab400-c866-11eb-9fe3-fbe16a72d172.png)

4) Now, we will use will make a call to the identity_endpoint and pass identity_header in the request. In this case I am using the npm library called "request".
   After acquiring the access token, we will send another http request to keyvault_secret_uri and pass the access token as bearer token in an Authorization Headers:
   
         request(options, function (error, response, body) {
         
         console.error('error:', error); // Print the error if one occurred
         
         console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
         
         console.log('body:', body); 
         
         var jsonBody= JSON.parse(body);
         // Store the access token in a variable an set the keyvault_secret_uri as the URI of the request
         
        
         var access_token= jsonBody.access_token;
         
         var bearer_token="Bearer "+access_token;
         
        
         var options2 = {
         
         url: keyvault_secret_uri,
         
         headers: {
         
        'Authorization': bearer_token
        
         }
         
        }
        
        request(options2, function (error2, response2, body2) {
        
        console.error('error:', error2); 
        
        console.log('statusCode:', response2 && response2.statusCode); // Print the response status code if a response was received
        
        console.log('body:', body2); 
        
        res.send(body2);
        
      
        });
    
    
        });
    
   
      ![image](https://user-images.githubusercontent.com/77988455/121255100-4255b800-c868-11eb-8923-a3750a8069cd.png)
     
     
   5) Go to your Key Vault's access policies on Your_Key_Vault > Access policies and provide access to your Managed Identity's service principal. For system-assigned managed           identities, the name of the service principal is the same as your app service:
            ![image](https://user-images.githubusercontent.com/77988455/121255721-fbb48d80-c868-11eb-8c39-518551189a0a.png)
            
   6)Test the app service by navigating to YourAppsName.azurewebsites.net/msi/keyvault. You should now see the data of your Key Vault secret!
   

      ![image](https://user-images.githubusercontent.com/77988455/121264467-65866480-c874-11eb-8c70-fee4fdad8e28.png)










