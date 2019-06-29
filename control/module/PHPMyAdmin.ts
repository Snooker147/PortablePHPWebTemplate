import Fetch from "node-fetch";
import * as AdmZip from "adm-zip";
import Utils from "../Utils";
import { renameSync, copyFileSync } from "fs";
import { join } from "path";
import Module from "./Module";

class PHPMyAdmin extends Module
{
    private readonly indexPath = "./www/phpmyadmin/index.php";
    private readonly url = "https://www.phpmyadmin.net/downloads/phpMyAdmin-latest-english.zip";

    public constructor()
    {
        super("phpmyadmin");
    }

    public async start()
    {
        if(await Utils.fileExists(this.indexPath))
        {
            console.log("PHP My Admin found, skipping download");
            return true;
        }

        console.log(`Downloading PHPMyAdmin from ${this.url}...`);
        const f = await Fetch(this.url, { method: "GET" });

        if(!f.ok)
        {
            console.error(`Failed to download PHPMyAdmin: ${f.statusText}`);
            return false;
        }

        console.log("Extracting...");

        const admZip = new AdmZip(await f.buffer());
        
        const entry = admZip.getEntries().find(e => {
            if(!e.isDirectory)
            {
                return false;
            }

            return e.entryName.match(/phpMyAdmin-([\d\.]*)-english/g).length > 0;
        });

        if(!entry)
        {
            console.error("Corrupted download of PHPMyAdmin");
            return false;
        }


        if(!admZip.extractEntryTo(entry.entryName, "www"))
        {
            console.error("Failed to extract PHPMyAdmin");
            return false;
        }

        renameSync(`www/${entry.entryName}`, "www/phpmyadmin");
        copyFileSync(join("control", "cfg", "config.inc.php"), "www/phpmyadmin/config.inc.php");

        return true;
    }

}

export default new PHPMyAdmin();