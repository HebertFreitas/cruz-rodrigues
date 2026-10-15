import { practiceAreas } from '../practiceAreas';

export default function ContactDialog({ dialogRef }) {
  const close = () => dialogRef.current?.close();
  const closeOnBackdrop = event => {
    if (event.target !== event.currentTarget) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) close();
  };

  return (
    <dialog ref={dialogRef} id="contact-dialog" aria-labelledby="dialog-title" onClick={closeOnBackdrop} data-lenis-prevent>
      <button className="dialog-close" aria-label="Fechar" type="button" onClick={close}>×</button>
      <p className="eyebrow">Vamos conversar</p>
      <h2 id="dialog-title">Como podemos<br /><em>ajudar você?</em></h2>
      <p>Selecione a área para iniciar uma conversa pelo WhatsApp.</p>
      {practiceAreas.map(area => (
        <a key={area.id} className="contact-choice" href={area.contactUrl} target="_blank" rel="noopener noreferrer" onClick={close}>
          <span><strong>{area.title}</strong><small>{area.contactLabel.replace('Converse com ', '')}</small></span>
          <span aria-hidden="true">↗</span>
        </a>
      ))}
    </dialog>
  );
}
