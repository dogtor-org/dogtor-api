import moment = require("moment")

type unix = number
export default class Clock {
    private static current_clocks: Map<string, unix> = new Map<string, unix>();

    static start(eventName: string) {
        this.current_clocks.set(eventName, moment().valueOf())
        console.log(`[clock] started ${eventName}`)
    }

    static end(eventName: string) {
        const started_at = this.current_clocks.get(eventName)
        if (started_at === 0) {
            return console.log(`[clock] event name ${eventName} not found`)
        }

        const time = moment(started_at)
        const now = moment().valueOf()
        console.log(`[clock] ended ${eventName} with ${time.diff(now, "seconds", true)}s`)
    }
}