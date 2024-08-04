type PersistFunction = (msg: any, ...args: any) => void | Promise<void>;

export class Log {
    private readonly persist: PersistFunction;

    constructor(persist: PersistFunction) {
        this.persist = persist;
    }

    debug<T>(obj: T) {
        console.dir(obj, {depth: 3});
    }

    error<T>(msg: T, ...args: any[]) {
        this.persist(msg, ...args);
        console.error(msg, ...args);
    }

    info<T>(msg: T, ...args: any[]) {
        this.persist(msg, ...args);
        console.log(msg, ...args);
    }
}
