let spicedPg = require("spiced-pg");
let db;

if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    db = spicedPg("postgres:postgres:postgres@localhost:5432/images");
}

exports.getImages = function getImages() {
    return db.query(
        `SELECT *
        FROM images
        ORDER BY id DESC
        LIMIT 12;
        `
    );
};

exports.addNewUpload = function addImage(url, username, title, description) {
    return db.query(
        "INSERT INTO images (url, username, title, description) VALUES ($1, $2, $3, $4) RETURNING *",
        [url, username, title, description]
    );
};

exports.getImageById = function getImageById(id) {
    return db.query(
        `SELECT *
        FROM images
        WHERE id = $1;
        `,
        [id]
    );
};
