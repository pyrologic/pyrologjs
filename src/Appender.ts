/**
 * a generic data appender interface
 */
export interface Appender {
    /**
     * performs further processing of logged data
     * @param logs logged data
     */
    appendLog(...logs: any): void;
}