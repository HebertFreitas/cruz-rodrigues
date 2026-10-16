import { practiceAreas } from '../practiceAreas';
import useTeamReveal from '../hooks/useTeamReveal';

const lawyers = [
  {
    id: 'marlon-henrique',
    name: 'Marlon Henrique',
    area: practiceAreas.find(area => area.id === 'criminal'),
    position: 'left',
    introduction: 'Uma defesa começa com escuta, análise e atenção a cada detalhe.',
    description: 'Marlon Henrique atua na área criminal, com foco na defesa de direitos e no acompanhamento de cada etapa da demanda. Seu trabalho parte da compreensão do caso para construir uma orientação clara e uma estratégia adequada à situação de cada cliente.',
    commitments: ['Defesa técnica na esfera criminal', 'Análise cuidadosa de cada caso', 'Orientação e acompanhamento próximo'],
  },
  {
    id: 'marlon-cruz',
    name: 'Marlon Cruz',
    area: practiceAreas.find(area => area.id === 'civil'),
    position: 'right',
    introduction: 'Clareza para decidir. Cuidado para proteger os seus interesses.',
    description: 'Marlon Cruz atua na área cível, orientando pessoas em questões que envolvem seus direitos e as relações da vida civil. Com atenção às particularidades de cada demanda, busca conduzir conflitos e decisões com responsabilidade e comunicação acessível.',
    commitments: ['Orientação em questões de Direito Cível', 'Análise de conflitos e interesses', 'Comunicação clara em cada etapa'],
  },
];

export default function About() {
  const sectionRef = useTeamReveal();

  return (
    <section ref={sectionRef} className="team-section" id="quem-somos" aria-labelledby="about-title">
      <header className="team-heading" data-team-reveal>
        <p className="eyebrow">Conheça os advogados</p>
        <h2 id="about-title">Pessoas que se dedicam<br />a defender <em>os seus direitos.</em></h2>
        <p>Conheça quem está ao seu lado, da primeira conversa à condução do seu caso.</p>
      </header>
      <div className="lawyer-list">
        {lawyers.map(lawyer => (
          <article className="lawyer-profile" key={lawyer.id} aria-labelledby={`${lawyer.id}-title`}>
            <div className={`lawyer-portrait lawyer-portrait--${lawyer.position}`} data-team-reveal>
              <img src="/assets/equipe-cutout.png" alt={`${lawyer.name}, de terno e braços cruzados`} loading="lazy" decoding="async" />
            </div>
            <div className="lawyer-content" data-team-reveal>
              <p className="eyebrow">{lawyer.area.title}</p>
              <h3 id={`${lawyer.id}-title`}>{lawyer.name}</h3>
              <p className="lawyer-introduction">{lawyer.introduction}</p>
              <ul className="lawyer-commitments">
                {lawyer.commitments.map(commitment => <li key={commitment}><span aria-hidden="true">✓</span>{commitment}</li>)}
              </ul>
              <p className="lawyer-description">{lawyer.description}</p>
              <a className="button lawyer-contact" href={lawyer.area.contactUrl} target="_blank" rel="noopener noreferrer">
                Converse com {lawyer.name}<span aria-hidden="true">↗</span>
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
