export type BindingContext = {
    res?: {
        [key: string]: any;
    };
}

export type CallbackFunction = (ctx: BindingContext) => void