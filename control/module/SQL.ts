import { writeFileSync, unlinkSync, renameSync } from "fs";
import * as AdmZip from "adm-zip";

import Utils from "../Utils";
import { join } from "path";
import Module from "./Module";

const mysqlServer = require("mysql-server");

class SQL extends Module
{

    public constructor()
    {
        super("mysql");
    }

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
            const dstConfigPath = "node_modules/mysql-server/lib/xampp/mysql/bin/my.ini";
            console.log(`Updating MySQL ${configPath}...`);

            if(await Utils.fileExists(dstConfigPath))
            {
                console.log("Config file already exists, skipping updation");
            }
            else
            {
                let cfg = await Utils.readFile(configPath);
                
                console.log("Adding skip-grant-tables and FULLDIR to configuration file...");
                cfg = cfg.replace("[mysqld]", "[mysqld]\nskip-grant-tables");
                cfg = cfg.replace(/#FULLDIR#/g, join(process.cwd(), "node_modules", "mysql-server").replace(/\\/g, "/"));
    
                writeFileSync(dstConfigPath, cfg);
    
                console.log("Done");
            }

            mysqlServer.start();

            return true;
        }
        catch(e)
        {
            console.error(`Failed to start MySQL server: ${e}`);
            return false;
        }
    }

}

export default new SQL();