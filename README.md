# Welcome to Delilah Restó API!

Hi! in this read me, you can find a guide for installing and using **Delilah Restó API**. 

# Start up
These instructions will allow you to get a copy of the project running on your local machine for development and testing purposes.

## Requirements
In the first place,  you must have node.js on your computer, if you don't have it in this [link](https://nodejs.org/en/) you can get it. Also you must need some editor code. I recommend you you [visual Studio Code](https://code.visualstudio.com/)
With node.js and your editor code in your computer the next step its import the database schema in your MySQL workbench. if you don't have MySQL workbench look at this [link](https://dev.mysql.com/downloads/file/?id=506568).

### import the database schema
For importing the database schema on your MySQL, you only open your workbench and follow these steps:

 1. Open your MySQL workbench. 
 2. In the home screen MySQL Connection: `Create/setup new connection` with name `delilahresto`. Verify that the `Hostname` is `127.0.0.1` and the `Port` `3306`.
 3. Open created connection and provide access credentials
 4. Click `Server` on the main tool bar.
 5. Select  `Data Import`.
 6. In the `Import Options` section, check the `Import from Self-Contained File`.
 7. Click the  `...`  and navigate to where your MySQL backup file is located, select the backup you want to load, and click  `OK`.
 8. Select the `Start Import`  on the bottom right.
 9. Finally refresh schemas in the sidebar left. A schema with the name `delilahresto` should appear.

### connect the database with the project
Open the project in your editor code and open the file `db_connection_data.js` in the `src/database/` folder. You find the  following code: 


const   conf_db_host    = 'localhost',
conf_db_name    = 'delilahresto',
conf_user       = 'root',
conf_password   = '12345',
conf_port       = '3306';
          
 In the code, the code should only change the `conf_user` with your MySQL user and `conf_password` with your MySQL password, the other parameters must keep the default value.
 After configuring and starting the server in the following steps, you should see the following message if the connection to the database was successful.
 
 ![image](https://user-images.githubusercontent.com/82292865/134759011-fb73c317-eb6b-4170-895f-1b0ca107bb05.png)

`Executing (default): SELECT 1+1 AS result`
`Connection has been established successfully`

### install node_modules
the final requirement is to install the required modules, you need to open your **computer terminal** in the Delilah resto folder and run the following command:

    npm install
  when you see the node_modules folder you finished!

# start the server :inbox_tray: 

the server is configured to run on the port 3000, which means the server is listening in the http://localhost:3000, if you want to change the port, you can do it in the server.js.
to start the server you only need to run in your **computer terminal** the following command:

    node src/server.js
> also you can install [nodemon](https://www.npmjs.com/package/nodemon) to work more comfortable

At the root of the project, you can find the folder `docs` with the information about how works the endpoints.

## Authors

### this  API was done by:
-   **Onneller Maestre**  -  _Trabajo Inicial_  -  [OnnellerM](https://github.com/)

## License

This project is under license from  -"MIT"
url: "http://www.apache.org/lice
