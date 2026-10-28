# angelo. Studio Digital

Site do estúdio formado por **Raphael Angelo** (design) e **Eduardo** (desenvolvimento).

> Você cuida da estratégia. A gente cuida do digital.

## Estrutura

```text
index.html
src/
  main.js                 # tema e formulário de briefing WhatsApp
  site.css                # todo o layout, temas, espaçamento e responsividade
  menu.css                # menu minimalista
  menu.js                 # foco, navegação e scroll lock
  portfolio.js            # sete posts e lightbox
  floating-actions.css    # dois atalhos circulares
  floating-actions.js     # botão de topo e progresso
  scroll.js               # GSAP + ScrollTrigger + Lenis (com fallback)
  intro.js                # intro do símbolo e ciclo de vida intro:done
public/
  projetos/               # sete imagens WebP reais
  logo.svg
  logo-light.svg
  favicon.svg
  og-cover.svg
  links.html
scripts/
  generate-seo.mjs
  build-standalone.mjs
```

Nenhum framework de interface adicional foi instalado. Os scripts de movimento são carregados **por CDN com versões fixas**: GSAP 3.12.5, ScrollTrigger 3.12.5 e Lenis 1.1.13. Se não estiverem disponíveis, layout, menu, tema, filtros e briefing continuam acessíveis e utilizáveis.

## Desenvolver e publicar

```bash
npm install
npm run dev
npm run build
npm run preview
```

O build também gera `dist/standalone.html` e as rotas estáticas. Como o HTML independente pode depender das fontes/CDNs, conectividade de rede é recomendada.

## Posicionamento e conteúdo

- Hero: “Seu marketing merece um digital à altura.”
- Serviços: Sites & landing pages, Plataformas & sistemas web, Identidade visual, Criação de posts e Vídeos curtos.
- Dores: conteúdo, site profissional e identidade.
- Sobre: Raphael Angelo e Eduardo; dois cartões de equipe.
- Trabalhos: somente os sete WebPs em `public/projetos/`; filtros sem categoria preenchida são ocultados.
- Briefing: seis serviços, faixa de investimento indicada pelo próprio visitante e prazo desejado. O estúdio **não recebe** essas informações antes da pessoa confirmar no WhatsApp.
- Contato: Instagram e WhatsApp já existentes; nenhum telefone adicional.

## Galeria

`src/portfolio.js` possui `title`, `type`, `label`, `image`, `link`, `alt` e `pos` (object-position). Desktop usa expansão ao passar o mouse; mobile, acordeão vertical com apenas um card aberto, inicialmente todos fechados. Enter e Espaço ativam o botão do card. O lightbox fecha com Esc ou clique fora e retém foco. Sem URL real, o botão “Ampliar” abre a imagem.

## Motion e acessibilidade

`src/scroll.js` exporta:
`initSmoothScroll`, `initReveals`, `initHero`, `initMarquee`, `initGallery`, `initCTA` e `initHeader`.

Lenis roda somente em desktop sem preferência por redução de movimento; dispositivos de toque usam scroll nativo. As animações de entrada trabalham com transform e opacity, parallax e transições de scroll com scrub usam ScrollTrigger. A seção final usa clip-path. O conteúdo fica **visível sem JavaScript**.

## Checklist de aceite

- [ ] Visualizar em 320px, 430px, 768px e 1440px.
- [ ] Confirmar que nenhuma seção cria faixas vazias, sobreposições ou rolagem horizontal.
- [ ] Abrir o menu, navegar com teclado e fechar com Esc.
- [ ] Conferir tema claro/escuro e ausência de flash.
- [ ] Testar filtros, acordeão touch, hover e lightbox.
- [ ] Confirmar os sete WebPs e o botão Ampliar.
- [ ] Verificar briefing/WhatsApp (sem envio automático).
- [ ] Verificar barra de progresso, âncoras e botão voltar ao topo (>400px).
- [ ] Testar iPhone Safari (safe area), Android Chrome, paisagem e preferência por movimento reduzido.
- [ ] Executar `npm run build` e Lighthouse antes da publicação.

A sintaxe JavaScript, os seletores principais, os caminhos dos WebPs e as âncoras foram auditados por leitura estática. A compilação Vite e os testes visuais em browsers ainda exigem execução no ambiente local.

## Intro de abertura — Etapa 6

A intro aparece a cada abertura ou recarga, inclusive na restauração do histórico (bfcache), sem usar cookies ou sessionStorage.

- `index.html`: SVG do símbolo embutido com a geometria de `public/logo.svg`, estilos críticos inline no início de `<body>` e classe `js` aplicada antecipadamente.
- `src/intro.js`: `initIntro()`, `skipIntro()`, `finishIntro()`, tratamento de ESC, foco, `inert`, trava de rolagem, controle de tempo e emissão do evento `intro:done`.
- `src/main.js`: animações do hero e da página aguardam `intro:done`.
- Sem JavaScript: a intro permanece oculta; em falhas após a classe `js`, o CSS libera visualmente a tela em 3 segundos.
- Usuários com movimento reduzido recebem a marca estática durante 600ms e saída rápida por opacidade.
- Overlay em `100dvh`, sobre o header, sem imagens, vídeos ou dependências adicionais.

### Testes da intro

- [ ] Abertura inicial e recarga exibem a intro novamente
- [ ] O traço branco reproduz a geometria exata do logo
- [ ] O ponto azul cai, quica e volta ao tamanho normal
- [ ] O nome e a assinatura entram antes da expansão azul
- [ ] A tela é liberada em aproximadamente 2,2s, sempre em até 4s
- [ ] Botão Pular encerra imediatamente e libera o scroll
- [ ] ESC encerra imediatamente e devolve o foco
- [ ] No modo reduzido a marca fica estática, sem parallax ou expansão
- [ ] Simulação 3G (DevTools), inclusive com scripts CDN bloqueados
- [ ] iPhone Safari: `100dvh`, área segura e intro sem flash
- [ ] JavaScript desativado: hero visível, intro ausente
- [ ] Os botões flutuantes só aparecem após a intro
- [ ] O hero só começa a animar depois de `intro:done`

As rotinas de término, Pular e ESC foram verificadas por simulação de DOM. A validação de renderização e timing deve ser feita no navegador.
