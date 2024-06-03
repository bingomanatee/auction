import {useDatabase} from "../lib/db/UseDatabase.jsx";
import {useCallback, useEffect, useRef, useState} from "react";
import PageContent from "../PageContent.jsx";
import styles from "./petList.module.css";

export function PetList({choose}) {
  const database = useDatabase();
  const sub = useRef(null);
  const [products, setProducts] = useState([]);
  const [bids, setBids] = useState([]);

  useEffect(() => {
    console.log(JSON.stringify(products.map(p => p.toJSON())));
  }, [products])

  useEffect(() => {
    if (!database) return;

    const query = database.collections.products.find({
      selector: {
        name: 'Hippo'
      }
    });
    console.log('query is ', query);
    sub.current = query.$.subscribe({
      setProducts(update) {
      console.log('update is ', update)
    },
      complete() {
        console.log('---- completed query')
      },
      error(e) {
        console.log('query error: ', e)
      }
    });

    database.collections.products.find({}).exec().then((data) => {
      console.log('first data:', data);
      setProducts(data);
    })

    return () => {
     if (sub.current) sub.current.unsubscribe();
     sub.current = null;
    }
  }, [setProducts, database]);

  useEffect(() => {
    if (sub.current) sub.current.unsubscribe();
    if (!database) return;
    sub.current = database.collections.bids.find().$.subscribe(setBids);

    return () => {
      if (sub.current) sub.current.unsubscribe();
      sub.current = null;
    }
  }, [setBids, database]);

  return (
    <PageContent title='Welcome to RxDB Evil Pet Auction'>
      <h2>The following evil pets are up for auction</h2>

      <ul>
        {products.map(p => (
          <li className={styles.petItem} key={p.id} onClick={() => choose(p.id)}>
            <b>{p.name}</b> -- {p.description}
          </li>
        ))}
      </ul>
    </PageContent>
  )

}