/**
 * The level of compliance with our defined log levels.
 */
export declare enum Compliance {
    /**
     * For services that fully adhere to our levels. An `ERROR` level event means waking
     * up who is on call in the middle of the night. Logs are forwarded to our log web UI.
     *
     * Use syslog facility `local0`
     */
    Full = "full",
    /**
     * For services that are somewhat compliant with the log levels. An `ERROR` level event
     * is not going to wake anyone up. Logs are forwarded to our log web UI.
     *
     * Use syslog facility `local1`
     */
    Mid = "mid",
    /**
     * For services that have just been converted. Logs are forwarded to our log web UI
     * and treated as plain text messages.
     *
     * Use syslog facility `local2`
     */
    None = "none"
}
