import Head from './head/Head.jsx'
import {useCallback, useState} from "react";
import {PetList} from "./petList/PetList.jsx";
import {PetDetail} from "./petDetail/PetDetail.jsx";
import {Layout} from "./Layout.jsx";
import {User} from "./User.jsx";


function App() {
  const [currentPetID, setCurrentPetId] = useState(null);
  const handleId = useCallback((id) => {
    setCurrentPetId(id)
  }, [setCurrentPetId])

  const goBack = useCallback(() => {
    setCurrentPetId(null)
  }, [setCurrentPetId])

  return (
    <Layout>
      <Head>
        <User/>
      </Head>
      {currentPetID ? (<PetDetail goBack={goBack} id={currentPetID}/>) : (<PetList choose={handleId}/>)}
    </Layout>
  )
}

export default App
