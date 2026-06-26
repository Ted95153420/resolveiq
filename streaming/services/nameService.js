const firstNames = [
    "Oliver",
    "George",
    "Arthur",
    "Harry",
    "Jack",
    "Charlie",
    "Thomas",
    "William",
    "James",
    "Henry",
    "Edward",
    "Noah",
    "Leo",
    "Oscar",
    "Alfie",
    "Theodore",
    "Freddie",
    "Archie",
    "Joshua",
    "Alexander",
    "Amelia",
    "Olivia",
    "Isla",
    "Ava",
    "Emily",
    "Sophia",
    "Grace",
    "Lily",
    "Freya",
    "Ella",
    "Evie",
    "Charlotte",
    "Mia",
    "Poppy",
    "Sophie",
    "Isabella",
    "Rosie",
    "Ruby",
    "Harper",
    "Elsie"
];

const lastNames = [
    "Smith",
    "Jones",
    "Taylor",
    "Brown",
    "Williams",
    "Wilson",
    "Johnson",
    "Davies",
    "Patel",
    "Wright",
    "Walker",
    "White",
    "Edwards",
    "Green",
    "Hall",
    "Thomas",
    "Roberts",
    "Khan",
    "Lewis",
    "Clarke",
    "Jackson",
    "Wood",
    "Turner",
    "Martin",
    "Cooper",
    "Hill",
    "Ward",
    "Morris",
    "Moore",
    "Clark",
    "Lee",
    "King",
    "Baker",
    "Harrison",
    "Morgan",
    "Allen",
    "Scott",
    "Phillips",
    "Watson",
    "Parker"
];

function getRandomItem(items) {
    return items[Math.floor(Math.random() * items.length)];
}

function getRandomFirstName() {
    return getRandomItem(firstNames);
}

function getRandomLastName() {
    return getRandomItem(lastNames);
}

function generateRandomFullName() {
    return `${getRandomFirstName()} ${getRandomLastName()}`;
}

module.exports = {
    generateRandomFullName,
    getRandomFirstName,
    getRandomLastName,
};