const pool = require("../db");

async function hasProcessedEvent(eventId) {
    const result = await pool.query(
        `
        SELECT event_id
        FROM processed_events
        WHERE event_id = $1
        `,
        [eventId]
    );

    return result.rows.length > 0;
}

async function recordProcessedEvent(eventId, eventType) {
    await pool.query(
        `
        INSERT INTO processed_events (event_id, event_type)
        VALUES ($1, $2)
        `,
        [eventId, eventType]
    );
}

module.exports = {
    hasProcessedEvent,
    recordProcessedEvent,
};