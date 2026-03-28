import styles from './HowItWorks.module.css';

const steps = [
  {
    icon: '🏪',
    title: 'Productos del mayorista',
    description: 'Traemos los precios del supermercado mayorista directo a la app. Sin ir ni comprar en grandes cantidades.',
  },
  {
    icon: '🛒',
    title: 'Sumáte al pedido',
    description: 'Elegí cuántas unidades querés y unite a la compra grupal. Cuantos más seamos, antes se completa.',
  },
  {
    icon: '💰',
    title: 'Pagás precio mayorista',
    description: 'Cuando el pedido se completa, cada uno paga solo su parte al precio mayorista. Mucho más barato que el super.',
  },
];

export default function HowItWorks() {
  return (
    <section className={styles.section}>
      <div className="container">
        <h2 className={styles.title}>¿Cómo funciona?</h2>
        <div className={styles.grid}>
          {steps.map((step, index) => (
            <div key={index} className={styles.step}>
              <div className={styles.iconWrapper}>
                <span className={styles.icon}>{step.icon}</span>
                <span className={styles.number}>{index + 1}</span>
              </div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
