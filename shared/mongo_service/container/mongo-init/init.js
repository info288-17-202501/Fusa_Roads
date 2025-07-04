// mongo-init/init.js
db = db.getSiblingDB('fusa_roads');

if (!db.getCollectionNames().includes('videos')) {
    db.createCollection('contextos_videos');
    db.createCollection('estados');
    db.createCollection('parametrosPia');
    db.createCollection('modelosIA');
    db.createCollection('parametrosFront');
    print('Las colecciones fueron creadas correctamente');
} else {
    print('No se pudo crear todas las colecciones');
}
