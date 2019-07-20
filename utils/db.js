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

// exports.getImageById = function getImageById(id) {
//     return db.query(
//         `SELECT *
//         FROM images
//         WHERE id = $1;
//         `,
//         [id]
//     );
// };

exports.getImageById = function getImageById(id) {
    return db.query(
        `  SELECT *, (
        SELECT id
        FROM images
        WHERE id < $1
        ORDER BY id DESC
        LIMIT 1)
        as prev_id,
        (
        SELECT id FROM images
        WHERE id > $1
        ORDER BY id ASC
        LIMIT 1)
        as next_id
        FROM images
        WHERE id = $1;
        `,
        [id]
    );
};

exports.getComment = function getComment(image_id) {
    return db.query(
        "SELECT * FROM comments WHERE image_id=$1 ORDER BY created_at DESC",
        [image_id]
    );
};

exports.postComment = function postComment(image_id, commenter, comment) {
    return db.query(
        "INSERT INTO comments (image_id, commenter, comment) VALUES ($1, $2, $3) RETURNING *",
        [image_id, commenter, comment]
    );
};

exports.getMoreImages = function getMoreImages(lowestId) {
    return db.query(
        "SELECT * FROM images WHERE id < $1 ORDER BY created_at DESC LIMIT 12",
        [lowestId]
    );
};

// from the encounter
// SELECT * FROM images
// WHERE id<$1
// ORDER BY id DESC
// LIMIT 20
//
// SELECT id FROM images
// ORDER BY id DESC
// LIMIT 1
//
// do a subquery
// SELECT *, (
//     SELECT id FROM images
//     ORDER BY id ASC
//     LIMIT 1
//
// ) AS "lowestId" FROM images
// WHERE id < 10
// ORDER BY id DESC
// LIMIT 20
