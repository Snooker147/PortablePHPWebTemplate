import PHPServer from "./module/PHPServer";
import SQL from "./module/SQL";
import PHPMyAdmin from "./module/PHPMyAdmin";
import Module from "./module/Module";
import SCSS from "./module/SCSS";

async function main()
{
    console.clear();

    const modules: Module[] = [
        PHPServer,
        PHPMyAdmin,
        SQL,
        SCSS
    ];

    for(const m of modules)
    {
        console.log(`Starting ${m.getName()}...`);

        if(!await m.start())
        {
            console.error(`\x1b[31m --- Failed to start ${m.getName()} ---\x1b[0m`);
            process.exit(-1);
        }

        console.log(`${m.getName()} is running!`);
    }

    console.log("\x1b[32m --- All up and running! ---\x1b[0m");
}

main();