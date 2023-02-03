import moment = require("moment")

export default class Clock {
    constructor() { }

    start(eventName: string): () => { event_name: string, started_at: number } {
        const event_name = eventName
        const started_at = moment().unix()
        return () => {
            return {
                event_name,
                started_at,
            }
        }
    }

    end(start: () => { event_name: string, started_at: number }) {
        const { event_name, started_at } = start()
        const time = moment(started_at)
        const now = moment().unix()
        // TODO fix
        console.log(`[clock] ended ${event_name} with ${time.diff(now, "milliseconds")}ms`)
    }
}