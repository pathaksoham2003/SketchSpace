// mongo-init.js

db = db.getSiblingDB('sketch'); // Use or create the 'sketch' database

db.createCollection('mycollection');

db.mycollection.insertMany([
  { name: 'Item 1', description: 'Description for Item 1' },
  { name: 'Item 2', description: 'Description for Item 2' },
]);

print("Database initialization script executed successfully.");
