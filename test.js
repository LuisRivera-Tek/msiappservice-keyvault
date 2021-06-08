const sql = require('mssql')
const sqlConfig = {
  database: "MichaelJacksonSongs",
  server: 'luismsitest.database.windows.net',
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
console.log("Code reached line 2")
async function ConnectToSQL ()  {
    try {
        // make sure that any items are correctly URL encoded in the connection string
        await sql.connect(sqlConfig)
        const result = await sql.query`select * from dbo.Songs`
        console.dir(result)
      
    } catch (err) {
        console.log("Cannot connect")
        console.log(err)
    }
}

ConnectToSQL();