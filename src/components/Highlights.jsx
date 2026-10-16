import CountUp from './CountUp';

// Provisional figures for layout review; replace with verified office data before publication.
const highlights = [
  { value: '+500', label: 'Processos acompanhados' },
  { value: '+1.200', label: 'Clientes atendidos' },
  { value: '+300', label: 'Conquistas judiciais' },
  { value: '02', label: 'Profissionais jurídicos' },
];

export default function Highlights() {
  return (
    <section className="highlights" id="nosso-compromisso" aria-labelledby="highlights-title">
      <svg className="highlights-map" viewBox="0 0 1000 540" fill="none" aria-hidden="true" focusable="false">
        <defs>
          <pattern id="highlights-hatching" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(42)">
            <path d="M0 0V12" stroke="currentColor" strokeWidth="3" />
          </pattern>
        </defs>
        <g fill="url(#highlights-hatching)">
          <path d="m40 128 31-31 51-12 22-26 54-10 29 18 34-12 27 17-8 34-30 16-12 28-36 2-23 29-25 1-12 30 22 19 9 34-22 1-24-34-24-13-12-34-30-18-10-26Z" />
          <path d="m235 30 51-13 42 14-14 44-34 27-34-16-19-27Z" />
          <path d="m195 260 26-16 40 14 22 26 38 10 21 34-18 35-26 19-8 46-23 39-13 39-17-10-8-45-16-28-4-46-21-25-10-44Z" />
          <path d="m449 125 17-25 28-4 10-26 27 9 7 27 30 2 8 25-30 15-25-5-20 15-28-3-12 18-25-9Z" />
          <path d="m461 183 32-18 41 7 33 24 34 5 15 36-20 29-21 14-7 48-23 32-23 11-20-24-12-44-25-18-18-38-8-30Z" />
          <path d="m564 105 37-35 61-5 34-25 57 10 32-8 31 25 39-7 26 27 43 13 25 36 34 2 21 29-15 25-43-5-23 20-31-10-12 33-30 4-9 31-27-7-18-35-27-15-20 18-23-29-31-5-13-33-34-5-21-19-33 1-18-22-28 1Z" />
          <path d="m678 241 23 8 10 39-13 28-14-26Zm63 63 25 10 16 26 30 4 17 21-16 10-31-16-22-3-16-25Zm-155 41 12-14 6 26-10 29-12-4Zm159-127 11 4 6 29-9 14-10-20Zm150-54 13 9-5 25-12 13-5-10Z" />
          <path d="m808 392 29-28 39 5 23-12 26 23 12 37-13 24-38-7-26 13-43-16-16-20Zm132 56 10 1 5 21-13 7Zm32-38 10-12 5 23-16 17-8-3Z" />
        </g>
      </svg>
      <div className="highlights-inner">
        <p className="eyebrow">Nossa trajetória</p>
        <h2 id="highlights-title">Dedicação que constrói<br />resultados <em>expressivos.</em></h2>
        <div className="highlights-rule" aria-hidden="true" />
        <dl className="highlights-grid">
          {highlights.map(({ value, label }) => (
            <div className="highlight-card" key={label}>
              <dt>{label}</dt>
              <dd aria-label={value}><CountUp value={value} /></dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
