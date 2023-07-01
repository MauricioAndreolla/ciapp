var normalizedPath = require("path").join(__dirname, "./migrations");
var migrationsArray = [];
require("fs").readdirSync(normalizedPath).forEach(function(file) {
    migrationsArray.push(require("./migrations/" + file));
});

module.exports = migrationsArray;
