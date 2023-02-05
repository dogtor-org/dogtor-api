export default class Logger {
    private fields: Map<string, string>

    constructor(
        private source: string
    ) {
        this.fields = new Map<string, string>
        this.fields.set("source", source)
    };

    withFields(fields: Map<string, string>) {
        this.fields = new Map([...this.fields, ...fields])
    }

    addField(field: string, value: string) {
        this.fields.set(field, value)
    }

    info(message?: string) {
        if (message) {
            this.fields.set("message", message)
        }

        console.log(JSON.stringify(mapToObj(this.fields)))
    }

    error(message?: string) {
        if (message) {
            this.fields.set("error", message)
        }

        console.log(JSON.stringify(mapToObj(this.fields)))
    }

    warn(message?: string) {
        if (message) {
            this.fields.set("warn", message)
        }

        console.log(JSON.stringify(mapToObj(this.fields)))
    }

    panic(message?: string) {
        if (message) {
            this.fields.set("panic", message)
        }

        console.log(JSON.stringify(mapToObj(this.fields)))
    }

    debug(message?: string) {
        if (process.env.DEBUG_MODE) {
            if (message) {
                this.fields.set("message", message)
            }

            console.log(JSON.stringify(mapToObj(this.fields)))
        }
    }
}

function mapToObj(map: Map<string, string>): {} {
    const obj = {}
    for (let [k, v] of map)
        obj[k] = v
    return obj
}