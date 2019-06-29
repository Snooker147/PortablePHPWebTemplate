import * as CommandExists from "command-exists";
import * as AdmZip from "adm-zip";
import * as Express from "express";
import Fetch from "node-fetch";

import Utils from "../Utils";
import { join } from "path";
import Module from "./Module";
import SCSS from "./SCSS";
import { existsSync } from "fs";

class PHPServer extends Module
{

    private running: boolean = false;
    private server: any = null;

    private styleSource: string = "";
    private scriptSource: string = "";

    public constructor()
    {
        super("phpserver");
    }

    public async start()
    {
        const phpPortable = await Utils.fileExists("bin/php/php.exe");

        if(phpPortable)
        {
            console.log("We've found a portable edition of PHP inside bin/php, delete it if you have PHP already installed on your system.");
        }
        else
        {
            if((await this.installPHP()) === false)
            {
                return false;
            }
        }

        const middle = (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
            const path = req.path;
            const hasDot = path.indexOf(".") !== -1;

            res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private'); // Disable caching

            if(!hasDot && !path.endsWith("/"))
            {
                res.redirect(`${req.url}/`);
            }
            else
            {
                if(path === "/")
                {
                    next();
                    return;
                }
                else if(path === "/compiled.js")
                {
                    res.send(this.scriptSource);
                }
                else if(path === "/compiled.css")
                {
                    SCSS.compile().then(css => {
                        if(css)
                        {
                            this.styleSource = css;
                        }

                        res.contentType("text/css");
                        res.send(this.styleSource);
                    });
                }
                else
                {
                    let filePath = path;

                    if(!hasDot && path.endsWith("/"))
                    {
                        filePath = `${path}/index.php`;
                    }

                    const fl = `www/${filePath}`;
                    
                    if(existsSync(fl))
                    {
                        next();        
                    }
                    else
                    {
                        res.redirect("/404.php");
                    }
                }
            }
            
        };

        return new Promise<boolean>(res => {

            const config: any = {
                port: 8000,
                ini_config: "./php.ini",
                bin: phpPortable ? "bin/php/php.exe" : "php",
                root: "./www",
                middleware: [ middle ],
                output: {
                    ip: false,
                    date: false,
                    os: false,
                    browser: false,
                    device: false,
                    statusCode: false,
                    method: false
                },
                ini_set: {}
            };

            if(phpPortable)
            {
                config.ini_set["extension_dir"] = join(process.cwd(), "bin", "php", "ext");
            }

            try
            {
                this.server = require("node-php-awesome-server")(config);
            }
            catch(e)
            {
                console.log(e);
                res(false);
            }

            this.server.on("error", (e: any) => {
                console.log(e);
                res(false);
            });

            this.server.on("close", () => {
                this.running = false;
            });
            
            this.server.on("connect", () => {
                this.running = true;
                res(true);
            });
        });
    }

    public close()
    {
        this.server.close();
    }

    public checkPHP()
    {
        return new Promise<boolean>(res => {
            CommandExists("php", (err, exists) => {
                if(err)
                {
                    res(false);
                }
                else
                {
                    res(exists);
                }
            });

        });
    }

    public async installPHP()
    {
        if(await this.checkPHP())
        {
            console.log("We've detected PHP installed on your system, carrying on");
            return true;
        }

        console.log("We couldn't find PHP executable installed on your system");
        const answer = await Utils.waitForInput("Do you want to download a portable PHP binaries now? (Y/n) ");

        if(answer.toLowerCase() !== "y")
        {
            console.log("We can't run a PHP website without PHP, install PHP, reset bash and start this app again.");
            return false;
        }

        console.log(`Preparing for download... Platform: ${process.platform}`);

        if(process.platform !== "win32")
        {
            console.log("PHP downloading is currently only avaible on Windows");
            console.log("If you're on Linux use: `apt-get install php` or similiar command to install PHP and then restart this App");
            console.log("If you're using Mac OS download PHP redistributable or build PHP yourself then restart this App");
            console.log("Aborting...");
            return false;
        }

        const is64 = process.arch === "x64";

        console.log(`Using x64 version?: ${is64 ? "yes" : "no"}`);

        const downloadInfo = JSON.parse(await Utils.readFile("bin/download.json"));
        const url = is64 ? downloadInfo.x64 : downloadInfo.x86;

        console.log(`Downloading ${url}...`);
        
        const f = await Fetch(url, {
            method: "GET"
        });

        if(!f.ok)
        {
            console.error(`Failed to download PHP binaries: ${f.statusText}`);
            return false;
        }

        const zip = new AdmZip(await f.buffer());
        
        console.log("Extracting...");

        return new Promise<boolean>(res => {
            zip.extractAllToAsync("bin/php", true, async err => {
                if(err)
                {
                    console.error(`Failed to extract PHP binaries from zip file: ${err}`);
                    res(false);
                }
                else
                {
                    console.log("Done, creating link...");
                    res(true);
                }
            });
        });
    }

    public setScriptString(src: string)
    {
        this.scriptSource = src;
    }

    public setStyleSource(src: string)
    {
        this.styleSource = src;
    }

    public isRunning() { return this.running; }


}

export default new PHPServer();