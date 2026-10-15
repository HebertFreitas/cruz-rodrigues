# Cruz e Rodrigues — Advocacia

Landing page em React com Vite. Requer Node.js 22.12 ou superior e npm.

## Desenvolvimento

```bash
npm install
npm run dev
```

Abra http://localhost:5173. O Vite atualiza a página ao salvar os arquivos.

## Build e prévia de produção

```bash
npm run build
npm run preview
```

Abra http://localhost:4173. A pasta `dist/` é gerada pelo build; edite os arquivos em `src/`.

## Estrutura

- `src/App.jsx`: composição da página.
- `src/components/`: hero, áreas, cartões, escritório, contato, modal e rodapé.
- `src/practiceAreas.js`: áreas de atuação e links de WhatsApp.
- `src/hooks/useCursorReveal.js`: efeito de luz acompanhando o mouse e revelação completa antes do primeiro scroll, conforme `Advogado Premium.zip`; pausa de 720 ms e suporte a roda, toque e teclado. Movimento reduzido mantém o título estático.
- `src/hooks/usePageMotion.js`: animações, Lenis e limpeza dos efeitos.
- `src/styles.css`: estilos e responsividade.
- `public/assets/`: imagens geradas com referência nos advogados reais; `hero-cutout.png` e `equipe-cutout.png` têm fundo transparente e são as versões em uso.
- `references/`: referências e prompts das imagens.
- `.openai/hosting.json`: configuração do site hospedado, com publicação privada.

As fontes do Google e as imagens de áreas/contato do Cloudinary precisam de conexão à internet.
