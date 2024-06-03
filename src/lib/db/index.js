import {
  createRxDatabase,
  addRxPlugin
} from 'rxdb';
import {RxDBDevModePlugin} from 'rxdb/plugins/dev-mode';
import {getRxStorageDexie} from 'rxdb/plugins/storage-dexie';
import {getRxStorageMemory} from "rxdb/plugins/storage-memory";
import productSchema from "./collections/products/schema.js";
import bidSchema from './collections/bids/schema.js';
import {once} from "lodash-es";

// addRxPlugin(RxDBDevModePlugin);

let db;

export default once(async () => {
  if (db) return db;
  db = await newDBfactory();
  return db;
})

async function newDBfactory() {
  return new Promise(async (done, fail) => {
    try {
      const newDatabase = await createRxDatabase({
        name: 'auctions',                   // <- name
        storage: getRxStorageDexie(),       // <- RxStorage
      });

      await newDatabase.addCollections({
        products: productSchema,
        bids: bidSchema,
      })

      setTimeout(() => {
        console.log('four additions');
        newDatabase.collections.products.incrementalUpsert({
          "id": "birdId",
          "name": "Evil Bird",
          "description": "bright tropical parrot stares at you from the depths of hell"
        });
        newDatabase.collections.products.incrementalUpsert({
          "id": "catID",
          "name": "Sadistic Kitten",
          "description": "Scratches retina with painfully infected claws",
          "price": 200
        });
        newDatabase.collections.products.incrementalUpsert({
          "id": "dogID",
          "name": "Cute Puppy",
          "description": "Cute puppy, adorable, chronic groin-biter",
          "price": 200
        });
        newDatabase.collections.products.incrementalUpsert({
          "id": "hippo",
          "name": "Hippo",
          "description": "Hungry Hungry hippo - two tons of joy"
        });
        console.log('added four products')
      }, 4000)

      done(newDatabase);
    } catch (e) {
      fail(e);
    }

  });
}
