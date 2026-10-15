export default function PracticeCard({ area, index, total }) {
  return (
    <article className="practice-card" id={area.id} role="listitem" style={{ '--order': index + 1 }}>
      <div className="card-surface">
        <div className="card-image">
          <img src={area.image} alt={area.imageAlt} loading="lazy" />
          <span className="card-number">{String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
        </div>
        <div className="card-body">
          <h2><a href={`#${area.id}`}>{area.title} <span aria-hidden="true">↗</span></a></h2>
          <div className="card-details">
            <p>{area.description}</p>
            <div className="chips">{area.chips.map(chip => <span key={chip}>{chip}</span>)}</div>
            <a className="text-link" href={area.contactUrl} target="_blank" rel="noopener noreferrer">
              {area.contactLabel} <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
