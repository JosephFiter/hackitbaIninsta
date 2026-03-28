import styles from './HowItWorks.module.css';

const steps = [
  {
    icon: '🔍',
    title: 'Encontrá una promo',
    description: 'Buscá entre las ofertas 2x1, 3x2 o descuentos por cantidad disponibles en tiendas.',
  },
  {
    icon: '🤝',
    title: 'Conectá con alguien',
    description: 'Unite a una oferta publicada o publicá la tuya para que alguien se sume.',
  },
  {
    icon: '💰',
    title: 'Dividí y ahorrá',
    description: 'Comprá juntos, dividan el costo y llévense cada uno lo que necesita.',
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
