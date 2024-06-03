import {memo, useCallback, useContext, useRef} from "react";
import {UserContext} from "./Layout.jsx";
import style from "./app.module.css";

function UserBase() {
  const emailRef = useRef();

  const userInfo = useContext(UserContext);

  const logOut = useCallback(() => {
    userInfo.setCurrentUser(null);
  }, [userInfo]);

  const logIn = useCallback(() => {
    userInfo.setCurrentUser(emailRef.current.value);
  }, [userInfo]);

  if (userInfo && userInfo.currentUser) {
    return (
      <div className={style.userContainer}>
       <p className={style.userContainerLabel}>
         Logged on as &quot;{userInfo.currentUser}
       </p>
        <button onClick={logOut}>Log Out</button>
      </div>
    )
  }

  return <div className={style.userContainer}><input type='email' name="email" ref={(e) => {
    emailRef.current = e;
  }}/>
    <button onClick={logIn}>Log In</button>
  </div>

}

export const User = memo(UserBase);