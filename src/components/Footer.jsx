export default function Footer() {
  return (
<footer><div className="footer-main"><a className="footer-brand" href="#top" aria-label="Voltar ao início">Cruz e <span>Rodrigues</span><small>Advocacia Especializada</small></a><nav aria-label="Navegação do rodapé"><a href="#areas-de-atuacao">Atuação</a><a href="#quem-somos">O escritório</a><a href="#contato">Contato</a></nav><a className="back-top" href="#top">Voltar ao topo ↑</a></div><div className="legal"><p>© <span>{new Date().getFullYear()}</span> Cruz e Rodrigues. Todos os direitos reservados.</p><p>Estratégia e compromisso com seus direitos.</p></div></footer>
  );
}
