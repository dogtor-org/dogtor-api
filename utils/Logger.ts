export default class Logger {
    private fields: Map<string, string>

    constructor() { };

    withFields(fields: Map<string, string>) {
        this.fields = fields
    }

    addField(field: string, value: string) {
        this.fields.set(field, value)
    }

    log(message?: string) {
        if (message) {
            this.fields.set("message", message)
        }

        console.log(JSON.stringify(this.fields))
    }

    debug(message?: string) {
        if (process.env.DEBUG_MODE) {
            if (message) {
                this.fields.set("message", message)
            }

            console.log(JSON.stringify(this.fields))
        }
    }
}