import style from './pageContent.module.css';


export default function PageContent ({title, children}) {
  return <section className={style.container}>
    <h1 className={style.title}>{title}</h1>
    <div className={style.inner}>
      {children}
    </div>
  </section>
}