export const logger = {
    info(message: string, meta = {}){
        console.log(
            JSON.stringify({
                level: 'info',
                message,
                timeStamp: new Date().toISOString(),
                ...meta,
            })
        )
    },

    warn(message: string, meta = {}) {
        console.warn(
            JSON.stringify({
                level: 'warn',
                message,
                timeStamp: new Date().toISOString(),
                ...meta,
            })
        )
    },

    error(message: string, meta = {}) {
        console.error(
            JSON.stringify({
                level: 'error',
                message,
                timeStamp: new Date().toISOString(),
                ...meta,
            })
        )
    }
}