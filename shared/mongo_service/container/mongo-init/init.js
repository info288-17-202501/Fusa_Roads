// mongo-init/init.js
db = db.getSiblingDB('fusa_mongo');

if (!db.getCollectionNames().includes('videos')) {
    db.createCollection('videos');
    print('Colección "videos" creada en fusa_mongo');
} else {
    print('La colección "videos" ya existe');
}
