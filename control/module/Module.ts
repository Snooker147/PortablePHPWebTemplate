export default abstract class Module
{

    private readonly name: string;

    public constructor(name: string)
    {
        this.name = name;
    }

    public abstract start(): Promise<boolean>;
    
    public getName() { return this.name; }

}