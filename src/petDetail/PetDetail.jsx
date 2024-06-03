import PageContent from "../PageContent.jsx";
import {useCallback, useContext, useEffect, useRef, useState} from "react";
import {useDatabase} from "../lib/db/UseDatabase.jsx";
import style from './petDetail.module.css';
import {UserContext} from "../Layout.jsx";

function byBid(a, b) {
  if (!(a && b)) return 0;
  console.log('comparing', a, b, a.get('price'), b.get('price'));
  return b.get('price') - a.get('price')
}

function PetTicket({pet, id}) {

  const {currentUser} = useContext(UserContext)

  const database = useDatabase();
  const bid = useRef(0);
  const [bids, setBids] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleBid = useCallback(() => {
    if (!(database && currentUser)) return;
    const newBid = {
      id: `${currentUser}-${id}-bid`,
      price: Number(bid.current.value),
      email: currentUser,
      product: id,
    };

    database.collections.bids.find({
      selector: {
        email: {$eq: currentUser},
        product: id
      }
    }).exec()
      .then((list) => {
        for (const oldBid of list) {
          if (oldBid.get('price') > newBid.price && oldBid.get('product')=== id) {
            return alert('You already bid ' + oldBid.get('price') + ' for this pet - no backsies');
          }
        }

        let minBid = 0;
        for (const otherBid of bids) {
          minBid = Math.max(minBid, otherBid.get('price'));
        }
        console.log('min bid is ', minBid);

        if (newBid.price <= minBid) {
          return alert('you must outbid all current bidders; you must big more than ' + minBid);
        }

        database.collections.bids.incrementalUpsert(newBid)
          .then(() => {
            // trigger reload of bids
            setIsLoaded(false);
          }).catch(e => {
          console.log('bid error: ', e);
        })
      });


  }, [id, database, bids, currentUser])

  useEffect(() => {
    if (!isLoaded && database) {
      database.collections.bids.find({
        selector: {
          product: {
            $eq: id
          }
        }
      }).exec().then((productBids) => {
        console.log('got bids:', productBids)
        setBids(productBids);
        setIsLoaded(true);
      })
    }
  }, [isLoaded, id, database])

  if (!pet) {
    return <div><h2>Cannot find pet {id}</h2></div>
  }

  return <div>
    <section className={style.container}>
      <h2>Pet &quot;{pet.get('name')}&quot;</h2>
      <p>{pet.get('description') ?? '(no info)'}</p>
    </section>
    {currentUser ? (
      <section className={style.bid}>
      <p>I ({currentUser}) would pay:</p>
      <div>
        $ <input ref={bid} type='number'/>
      </div>
      <p>for this bundle of joy!</p>
      <div>
        <label>Email address</label>
      </div>
      <div>
        <button type='submit' onClick={handleBid}>Place Bid</button>
      </div>
    </section>) :
      (
        <section className={style.bid}>
          <p>You must be logged in to make a bid.</p>
        </section>
      )
    }

    <ul>
      {bids.sort(byBid).map((bid) => {
        return (
          <li key={bid.id} id={bid.id}>
            Bid: ${bid.get('price')} by {bid.get('email')}
          </li>
        )
      })}
    </ul>
  </div>
}

export function PetDetail({id, goBack}) {
  const database = useDatabase();
  const [isLoaded, setIsLoaded] = useState(false);
  const [pet, setPet] = useState(null);

  useEffect(() => {
    if (!database) return;
    database.collections.products.findByIds([id]).exec().then((map) => {
      setPet(map.get(id));
      setIsLoaded(true);
    })
  })

  return <PageContent title={`Detail for pet id ${id}`}>
    {
    isLoaded ? <PetTicket goBack={goBack} pet={pet} id={id}/> : '...loading...'
  }
    <footer>
      <button onClick={goBack}>Go Back</button>
    </footer>
  </PageContent>
}