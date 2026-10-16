import { practiceAreas } from '../practiceAreas';
import PracticeCard from './PracticeCard';

export default function PracticeAreas() {
  return (
<section className="practice" id="areas-de-atuacao" aria-labelledby="practice-title">
<div className="section-label" id="practice-title"><i aria-hidden="true"></i>Áreas de atuação<span>01 — O que fazemos</span></div>
<div className="cards" role="list">
{practiceAreas.map((area, index) => <PracticeCard key={area.id} area={area} index={index} total={practiceAreas.length} />)}


</div>
</section>
  );
}
