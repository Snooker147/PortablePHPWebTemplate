import * as FS from "fs";
import * as ReadLine from "readline";

class Utils
{

    private inInterface: ReadLine.Interface = null;

    public constructor()
    {
        this.inInterface = ReadLine.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    public waitForInput(msg: string)
    {
        return new Promise<string>(res => {
            this.inInterface.question(msg, res);
        });
    }

    public readFile(path: string)
    {
        return new Promise<string>(res => {
            FS.readFile(path, { encoding: "utf8" }, (err, data) => {
                if(err)
                {
                    console.error(`Failed to read ${path} file! ${err}`);
                    return res(null);
                }
                
                res(data);
            });
        });
    }

    public fileExists(path: string)
    {
        return new Promise<boolean>(res => {
            FS.exists(path, res);
        });
    }

}

export default new Utils();