import * as Sass from "node-sass";

import Module from "./Module";
import PHPServer from "./PHPServer";

class SCSS extends Module
{

    public constructor()
    {
        super("scss");
    }

    public async start()
    {
        const css = await this.compile();

        if(css)
        {
            PHPServer.setStyleSource(css);
        }

        return true;
    }

    public compile()
    {
        return new Promise<string>(res => {
            Sass.render({
                file: "./www/style/style.scss",
                sourceMap: false,
            }, (err, result) => {

                if(err)
                {
                    console.log("SASS Error: " + err.message);
                    res(null);
                }
                else
                {
                    res(result.css.toString());
                }
            });
        });
    }

}

export default new SCSS();