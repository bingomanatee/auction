import style from './head.module.css'


export default function Head({children}) {
  return (
      <header className={style.container}>
        <p className={style.title}>Sample Auction site</p>
        {children}
      </header>
    );

}