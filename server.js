const express = require('express');
const app = express();
const port = process.env.PORT;
var database_server= process.env.MSI_DATABASE_SERVER
var database= process.env.MSI_DATABASE
var keyvault_uri=process.env.KEYVAULT_URI
var keyvault_secret_uri= process.env.KEYVAULT_SECRET_URI
const request = require('request');
const sql = require('mssql');
const sqlConfig = {
  database: database,
  server: database_server,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: true, // for azure
    trustServerCertificate: false, // change to true for local dev / self-signed certs
  },
  authentication:{
    type:"azure-active-directory-msi-app-service"
  }

}

//Connect to SQL
app.get('/', function (req, res) {
  res.send('Welcome to Luis Rivera MSI Demo! To print all the identity headers naviagte to /msi/headers. To get an access token for Key Vault please go to /msi/keyvault/accesstoken.To get a certificate from Key Vault please go to /msi/keyvault. To print data from my Azure SQL database please go to /msi/AzureSQL')
});

app.get('/msi/headers', function (req, res) {
	
var identity_header= process.env.IDENTITY_HEADER;
var identity_endpoint= process.env.IDENTITY_ENDPOINT;
	
	
  res.send({
	  "identity_header":identity_header,
	  "identity_endpoint": identity_endpoint
	  
  })
});
app.get('/msi/keyvault/accesstoken', function (req, res) {
var msi_response="Empty";
var identity_header= process.env.IDENTITY_HEADER;
var identity_endpoint= process.env.IDENTITY_ENDPOINT +"?resource="+keyvault_uri;
	var options = {
  url: process.env.IDENTITY_ENDPOINT +"?resource="+keyvault_uri,
  headers: {
    'X-IDENTITY-HEADER': identity_header
  }
  
}
request(options, function (error, response, body) {
  console.error('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  console.log('body:', body); // Print the HTML for the Google homepage.
  res.send(response);
  
});
	
	
  
});

app.get('/msi/keyvault', function (req, res) {
  var identity_header= process.env.IDENTITY_HEADER;
  var identity_endpoint= process.env.IDENTITY_ENDPOINT +"?resource="+keyvault_uri;
    var options = {
    url: process.env.IDENTITY_ENDPOINT +"?resource="+keyvault_uri,
    headers: {
      'X-IDENTITY-HEADER': identity_header
    }
    
  }
  request(options, function (error, response, body) {
    console.error('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('body:', body); // Print the HTML for the Google homepage.
    var jsonBody= JSON.parse(body);
    var access_token= jsonBody.access_token;
    var bearer_token="Bearer "+access_token;

    var options2 = {
      url: keyvault_secret_uri,
      headers: {
        'Authorization': bearer_token
      }
    }
  
    request(options2, function (error2, response2, body2) {
      console.error('error:', error2); // Print the error if one occurred
      console.log('statusCode:', response2 && response2.statusCode); // Print the response status code if a response was received
      console.log('body:', body2); // Print the HTML for the Google homepage.
      res.send(body2);
      
    });
    
    
  });

  
    
    
    
  });

  app.get('/msi/AzureSQL', function (req, res) {
    //Connect to SQL
    async function ConnectToSQL ()  {
        try {
            // make sure that any items are correctly URL encoded in the connection string
            await sql.connect(sqlConfig)
            const result = await sql.query`select * from dbo.Songs`
            console.dir(result)
            res.send(result)
          
        } catch (err) {
            console.log("Cannot connect")
            console.log(err)
            res.send(err)
        }
    }
    
    ConnectToSQL();
  });
   
app.listen(port);