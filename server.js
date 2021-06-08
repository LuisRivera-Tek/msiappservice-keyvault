const express = require('express');
const app = express();
const port = process.env.PORT;
var database_server= process.env.MSI_DATABASE_SERVER
var database= process.env.MSI_DATABASE
var keyvault_uri=process.env.KEYVAULT_URL
var keyvault_secret_uri= process.env.KEYVAULT_SECRET_URL
const request = require('request');
const sql = require('mssql');


app.get('/', function (req, res) {
  res.send('Welcome to Luis Rivera MSI Demo! To print all the identity headers naviagte to /msi/headers. To get an access token for Key Vault please go to /msi/keyvault/accesstoken.To get data from Key Vault using MSI please go to /msi/keyvault')
});

//Print the MSI headers

app.get('/msi/headers', function (req, res) {
	
var identity_header= process.env.IDENTITY_HEADER;
var identity_endpoint= process.env.IDENTITY_ENDPOINT;
	
	
  res.send({
	  "identity_header":identity_header,
	  "identity_endpoint": identity_endpoint
	  
  })
});


//Listen for requests  on /msi/keyvault/accesstoken and send a request to the identity endpoint with the X-IDENTITY-HEADER header to obatin and print the access token for key vault
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
  console.error('error:', error); 
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  console.log('body:', body); 
  res.send(response);
  
});
	
	
  
});
// Get an access token like before and use it to get a resource from key vault
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
    console.log('body:', body); 
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
      console.error('error:', error2); 
      console.log('statusCode:', response2 && response2.statusCode); // Print the response status code if a response was received
      console.log('body:', body2); 
      res.send(body2);
      
    });
    
    
  });

  
    
    
    
  });


   
app.listen(port);
