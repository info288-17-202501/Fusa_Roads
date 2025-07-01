// mongo-init/init.js
db = db.getSiblingDB('fusa_roads');

if (!db.getCollectionNames().includes('videos')) {
    db.createCollection('contextos_videos');
    db.createCollection('estados');
    db.createCollection('parametrosPia');
    print('Colección "videos" creada en fusa_mongo');
} else {
    print('La colección "videos" ya existe');
}
