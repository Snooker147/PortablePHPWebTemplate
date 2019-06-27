import { writeFileSync, unlinkSync, renameSync } from "fs";
import * as AdmZip from "adm-zip";

import Utils from "./Utils";
import { join } from "path";

const mysqlServer = require("mysql-server");

class SQL
{

    public async start()
    {
        try
        {
            const zipPath = "node_modules/mysql-server/lib/xampp.zip";

            console.log(`Checking ${zipPath}`);

            if(await Utils.fileExists(zipPath))
            {
                console.log("Unpacking mysql server...");

                const adm = new AdmZip(zipPath);
                adm.extractEntryTo("xampp/", "node_modules/mysql-server/lib");
                unlinkSync(zipPath);
            }

            const configPath = "node_modules/mysql-server/lib/xampp/mysql/bin/my.ini.backup";
            console.log(`Updating MySQL ${configPath}...`);

            let cfg = await Utils.readFile(configPath);
            
            console.log("Adding skip-grant-tables and FULLDIR to configuration file...");
            cfg = cfg.replace("[mysqld]", "[mysqld]\nskip-grant-tables");
            cfg = cfg.replace(/#FULLDIR#/g, join(process.cwd(), "node_modules", "mysql-server").replace(/\\/g, "/"));

            writeFileSync("node_modules/mysql-server/lib/xampp/mysql/bin/my.ini", cfg);

            console.log("Done");

            console.log("Starting MySQL server...");
            mysqlServer.start();
            console.log("MySQL server running");

            return true;
        }
        catch(e)
        {
            console.error(`Failed to start MySQL server: ${e}`);
            return false;
        }
    }

    public stop()
    {
        console.log("Stopping MySQL server...");
        mysqlServer.stop();
        console.log("Done");
    }

}

export default new SQL();