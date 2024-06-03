import {useEffect, useRef, useState} from "react";
import db from "./index.js";

export function useDatabase() {
  const database = useRef(null);
  const [dbState, setDbState] = useState(database.current);
  useEffect(() => {
    if (!database.current) {
      db().then(async (newDB) => {
        database.current = newDB;
        await newDB.collections.products.incrementalUpsert({
          id: 'dogID',
          name: 'Cute Puppy',
          description: 'Cute puppy, adorable, chronic groin-biter',
          price: 200
        });
        await newDB.collections.products.incrementalUpsert({
          id: 'catID',
          name: 'Sadistic Kitten',
          description: 'Scratches retina with painfully infected claws',
          price: 200
        });
        setDbState(database.current);
      });
    } else {
      setDbState(database.current);
    }
  }, []);

  return dbState;
}