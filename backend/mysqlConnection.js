const mysql = require('mysql');   // import driver js mysql pour Node => nodemysql
require('dotenv').config() ;     // plugin pour charger variable d'environnement depuis .env


// Params de la connection avec infos de la database créée et masquage des données sensibles
const mysqlConnection = mysql.createConnection({ 
  host     : process.env.HOST,             // changer le code ici avec l'adresse mysql cree en ligne
  user     : process.env.USER,            // MySQLonline username
  password : process.env.PASSWORD,       // MySQLonline password
  database : process.env.DATABASENAME,  //nom db créé en ligne 28 (si code l-28 absent commenter cette ligne)
  port: 3307                           // port de MySql en local (port de pma)
});
//console.log(mysqlConnection);

// etablissement de la connection avec le serveur mysql | état de la connection et gestion erreur
mysqlConnection.connect( (err) => { 
    if (err) {
      console.error('erreur de connection: ' + err.stack);
      return;
    }
    console.log('database '+ mysqlConnection.state);
    console.log('connecté à mysql avec l\'id ' + mysqlConnection.threadId);
});


module.exports = mysqlConnection; 

/*MODULE DE CONNECTION AVEC SERVER MYSQL*/