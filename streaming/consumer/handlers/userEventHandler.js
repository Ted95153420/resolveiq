const { createUser } = require("../../../server/services/userService");

async function handleUserEvent(event) {
    if (event.eventType === "user.created") {
        const createdUser = await createUser(event);

        if (createdUser) {
            console.log("User added from event:");
            console.log(createdUser);
        } else {
            console.log(`Duplicate event ignored: ${event.eventId}`);
        }

        return;
    }

    console.log(`Unhandled user event type: ${event.eventType}`);
}

module.exports = { handleUserEvent };