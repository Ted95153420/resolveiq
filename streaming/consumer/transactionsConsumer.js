/**
 * TEMPORARY RENDER WORKAROUND
 *
 * This consumer was originally intended to run as a true background worker that
 * continuously listens for Kafka / Redpanda messages and writes to the database.
 *
 * However, Render charges for Background Workers, and that cost is currently a
 * constraint for this project.
 *
 * As a workaround, this consumer has been modified to also behave like a very
 * small web service by exposing an HTTP endpoint. This allows it to be deployed
 * on Render as a Web Service instead of a paid Background Worker.
 *
 * IMPORTANT:
 * - The HTTP server in this file exists only to satisfy Render's expectation
 *   that a web service binds to a port.
 * - The real purpose of this process is still to consume Kafka messages.
 * - This is a cost-saving workaround, not the ideal long-term architecture.
 *
 * Longer term, if budget allows, this should probably be moved back to a proper
 * Background Worker style service and the HTTP server removed.
 */

require("dotenv").config();
const { startHttpServer } = require("./startHttpServer");
const { runConsumer } = require("./runConsumer");
const { handleTransactionEvent } = require("./handlers/transactionEventHandler");

const PORT = process.env.PORT || 10001;
startHttpServer(PORT);

runConsumer({
    clientId: "resolveiq-transactions-consumer",
    groupId: "resolveiq-transactions-group",
    topic: "transaction-events",
    handler: handleTransactionEvent,
}).catch((error) => {
    console.error("Consumer failed:", error);

});