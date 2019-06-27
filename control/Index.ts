import PHPServer from "./PHPServer";
import SQL from "./SQL";
import PHPMyAdmin from "./PHPMyAdmin";

async function main()
{
    const server = new PHPServer();

    if(!await server.start())
    {
        console.error("Failed to start PHP Server");
        process.exit(-1);
    }
    
    if(!await PHPMyAdmin.start())
    {
        console.error("Failed to download PHPMyAdmin");
        process.exit(-1);
    }
    
    if(!await SQL.start())
    {
        console.error("Failed to start MySQL server");
        process.exit(-1);
    }

    console.log("All up and running!");
}

main();