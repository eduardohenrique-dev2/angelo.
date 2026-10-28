# Angelo Studio — Site & Portal de Links

Site institucional editável com identidade azul elétrico, seções de serviços, portfólio demonstrativo, tema claro/escuro e navegação responsiva. O portal da bio fica em `/links.html`.

## Executar no VS Code

1. Abra esta pasta no VS Code.
2. Abra o terminal e execute:

```bash
npm install
npm run dev
```

Para criar o build de produção:

```bash
npm run build
npm run preview
```

## Stack

Vite + JavaScript modular + CSS customizado com variáveis. Sem backend, WebSocket ou APIs privadas.

## Estrutura

- `index.html`: conteúdo do site principal
- `src/style.css`: identidade visual responsiva
- `src/main.js`: tema, menu, filtros e animações
- `public/links.html`: portal da bio do Instagram
- `public/logo.svg`: símbolo em vetor
- `vite.config.js`: configuração do Vite

## Deploy Vercel

Importe o repositório na Vercel. Framework Preset: Vite. Build Command: `npm run build`. Output Directory: `dist`.

## Antes de publicar

Confirme o número de WhatsApp e o @ do Instagram; substitua os projetos conceituais por cases reais e troque o logo aproximado pelo SVG final do designer.

O repositório contém uma versão modular do front-end Angelo Studio preparada para manutenção no VS Code.

## Atualização V5.2 — 27/10/2026

- Menu hambúrguer editorial em tela cheia no desktop e no celular; atalhos para todas as seções e portal de links.
- Ícones de navegação usando Bootstrap Icons via jsDelivr; a estrutura visual do offcanvas segue padrões do Bootstrap sem importar um framework CSS redundante.
- Todos os destaques verdes do site principal foram substituídos por azul e lavanda, preservando modo claro/escuro.
- Menu com suporte a Escape, navegação por teclado e áreas de toque maiores que 44 px.
- Consulte as licenças e atribuições aplicáveis antes de incorporar ícones baixados do Flaticon Uicons.


## Angelo Studio V6 — 27/10/2026

- Formulário de briefing em `/#orcamento`: serviço, faixa de investimento, prazo e descrição opcional; validação no navegador; redirecionamento ao WhatsApp com texto codificado. A faixa não é uma cotação automática.
- Microinterações leves para botões com mouse fino e suporte a `prefers-reduced-motion`, mantendo os efeitos de revelação anteriores.
- Portal de links `/links.html` redesenhado e unificado ao tema principal; navegação ao formulário e aos projetos.
- SEO: título, descrição, metadados Open Graph/Twitter, `favicon.svg`, imagem de compartilhamento vetorial `og-cover.svg`, robots e geração de sitemap no build. **Algumas redes sociais não suportam SVG em prévias**; exporte `og-cover.svg` para PNG/JPG 1200×630 antes da publicação final e atualize os metadados.
- Cases, depoimentos e métricas possuem estados honestos de **aguardando informações verificadas**. Não publicamos nomes, avaliações ou resultados não autorizados.

### Configuração de SEO em produção

Defina `SITE_URL=https://seudominio.com` no ambiente de build (Vercel → Project Settings → Environment Variables). Na Vercel, o script também aceita `VERCEL_PROJECT_PRODUCTION_URL` quando disponível.

`npm run build` gera `dist/sitemap.xml`, insere links canônicos e URLs absolutas de imagem e atualiza `dist/robots.txt` quando existe domínio configurado. Sem domínio, evita criar sitemap com endereços falsos.

### Cases verdadeiros

Substitua os blocos de espera de `#cases` por projetos **finalizados e autorizados**. Para cada case, documente serviço, desafio, solução, capturas autorizadas, URL pública (se houver) e métricas com período e método. Depoimentos apenas com permissão e atribuição correta.

### Testes recomendados

1. Abra o menu e feche pelo botão, fundo escurecido e tecla Esc.
2. Altere o tema e navegue para `/links.html`; a preferência deve ser preservada.
3. Tente enviar briefing vazio para ver os erros; preencha e confira a mensagem antes de enviar pelo WhatsApp.
4. Filtre os projetos e confira a navegação pelo teclado e no celular.
5. Configure `SITE_URL`, execute `npm run build` e confira `dist/sitemap.xml`.


## V7 — refinamento geral de interface (27/10/2026)

**Stack:** Vite + JavaScript modular + CSS próprio com design tokens. Mantida para não introduzir um framework de aplicação desnecessário em uma landing page estática.

### Mudanças
- CTAs principais com fundo azul forte e **texto branco**; marquee com texto branco.
- Microrótulos com tipografia maior, melhor contraste e tracking controlado.
- Ritmo vertical harmonizado; cards de serviços alinhados inclusive no grid 2×2 a 320px.
- Hero centralizado, com moldura interna consistente.
- Hierarquia do portfólio, estados hover/tap e estado vazio preservados.
- Selects nativos redesenhados visualmente (seta SVG e estados de foco, erro e desabilitado), mantendo acessibilidade e teclado.
- Contador de caracteres visível no briefing (0/500), validação inline, toast, feedback transitório de envio.
- Menu de oito itens em tela cheia com stagger, fechamento por Esc e fundo, foco gerenciado.
- Rodapé completo, atalho flutuante para WhatsApp, suporte a redução de movimentos e preflight de tema para evitar flash.
- O tom de voz, os projetos **conceituais** e a explicação de que as faixas não são preços continuam preservados.

### Projeto editável

```text
index.html
src/main.js
src/style.css
public/links.html
public/logo.svg
public/logo-light.svg
public/favicon.svg
public/og-cover.svg
scripts/generate-seo.mjs
scripts/build-standalone.mjs
package.json
vite.config.js
```

### Comandos

```bash
npm install
npm run dev
npm run build
npm run preview
```

Após `npm run build`:
- `dist/index.html`: página Vite de produção;
- `dist/standalone.html`: arquivo único com JS/CSS embutidos, para abrir localmente;
- `dist/links.html`: página separada do portal de bio.

Fontes do Google e ícones Bootstrap seguem via CDN e precisam de internet para aparência completa. Links para `links.html` requerem esse arquivo ao lado do standalone.

### Testes antes de publicar

1. Testar larguras 320, 375, 390, 768, 1024 e 1440 px.
2. Verificar menu com Tab, Shift+Tab, Esc e clique no backdrop.
3. Verificar contraste dos botões e marquee nos dois temas.
4. Testar filtros, campos vazios, contador em 500 caracteres e redirecionamento WhatsApp sem envio automático.
5. Rodar `npm run build`, Lighthouse e auditoria de contraste no navegador.
6. Configurar `SITE_URL` na Vercel e fornecer projetos, métricas e depoimentos **reais e autorizados** antes de substituir estados de espera.

**Limitação da validação atual:** as verificações de sintaxe/estrutura foram feitas; Lighthouse 90+ e visual em navegador físico não foram medidos aqui.


## V8 — Posicionamento para marketing e portfólio expansível

O site agora fala prioritariamente com social media, gestores de tráfego, agências, profissionais de marketing e infoprodutores. **Sites e landing pages** são o serviço principal; posts, identidade visual e vídeos curtos são serviços complementares.

### Arquivos editados
- `index.html`: novos textos, quatro serviços, faixa de dores, nova seção Sobre, galeria e CTA.
- `src/main.js`: inicialização da galeria, mantendo tema, menu, barra de progresso e WhatsApp.
- `src/marketing.css`: layout responsivo da nova galeria e seções.
- `src/portfolio.js`: dados dos seis projetos demonstrativos e comportamento interativo.
- `public/links.html`: apresentação alinhada ao novo posicionamento.

### Onde substituir os placeholders
- No HTML `#sobre`: substitua `[NOME COMPLETO]`, `[CIDADE]`, `[ANOS DE EXPERIÊNCIA]` e a área indicada para foto. Só publique informações confirmadas.
- Em `src/portfolio.js`, o array `projects` contém seis registros com `title`, `type`, `image`, `link`, `alt`. Substitua `image:null` por uma URL autorizada (preferencialmente asset local em `public/projetos/`). Substitua `link:null` por uma URL de projeto real. Atualize o título e o texto alternativo.
- Os cards sem link exibem **Ver projeto** desabilitado para não direcionar a um case inexistente.
- Remova o aviso de `estudos conceituais` **somente quando** as imagens e projetos reais substituírem os demonstrativos.

### Comportamento e testes
- Desktop: galeria horizontal expande com mouse e clique; apenas um card ativo.
- Tablet: grade de duas colunas.
- Celular: acordeão vertical por toque; apenas um card aberto.
- Teclado: `Tab` e `Enter/Espaço` nos cards; `aria-expanded` atualizado.
- Filtros: Todos, Sites, Posts, Identidade, Vídeos.
- Movimento reduzido: expansão sem transições.
- Cheque tema claro/escuro, menu e formulário em 320px, 375px, 768px, 1024px e 1440px.

Comandos: `npm install`, `npm run dev`, `npm run build`. O script de build existente gera `dist/standalone.html` junto com o build normal. A montagem e a sintaxe foram conferidas estaticamente; testes de navegação real e Lighthouse ainda dependem de execução local.


## Novos posts adicionados ao cadastro do portfólio (27/10/2026)

Sete peças de design fornecidas para a categoria `Posts`: vacinação de cães e gatos, impressora 3D, água para pets, calorão, Kelvin, elenco de basquete e elenco de futsal.

O arquivo `src/portfolio.js` já aponta para os respectivos arquivos `.webp` em `public/projetos/`. **As imagens precisam ser copiadas para essa pasta e versionadas no Git antes do deploy.** Sem elas, o script renderiza o placeholder antigo automaticamente.

A distribuição de imagens é feita no ZIP `angelo-posts-imagens.zip` entregue na conversa. Depois de extrair na raiz do projeto, executar:

```powershell
git add public/projetos
git commit -m "feat: adicionar sete posts ao portfólio"
git push origin main
```

O portfólio preserva os filtros e a expansão. Imagens enviadas são apresentadas como artes gráficas, enquanto as categorias ainda sem materiais continuam marcadas como demonstração. Os links "Ver projeto" permanecem desativados até haver URLs fornecidas.


## Revisão de conteúdo e galeria V9 — 28/10/2026

**Equipe:** Raphael Angelo — Design & identidade visual; Eduardo — Desenvolvimento web & plataformas.

**Identidade:** navy + azul elétrico e marca `angelo.` preservados. Conteúdo reorientado para design, marketing e desenvolvimento web.

**Seções atualizadas:** hero, serviços (cinco), três dores, Sobre com dois profissionais, trabalhos com imagens fornecidas, briefing (seis opções), CTA, contato e SEO.

**Galeria:** `src/portfolio.js` contém somente os sete WebP reais já adicionados a `public/projetos/`. Cada item contém `pos` para controlar `object-position`, com padrão `center top`. Filtros de categorias sem imagens ficam escondidos. No desktop, os cards verticais ficam juntos e expandem no hover; no celular começam fechados e abrem por toque, um de cada vez. O botão **Ampliar** abre um lightbox com fechamento por ESC, clique fora e foco preso. Quando houver uma URL real em `link`, o botão muda para **Ver projeto**.

**Novos arquivos:** `src/studio-v9.css` é carregado por último, após `src/marketing.css`, para padronizar layout, galeria, rodapés de cards, botões flutuantes e lightbox.

**Atalhos:** dois botões circulares de 48px; o de voltar ao topo aparece depois de 400px. A referência de WhatsApp preexistente foi preservada.

**Como usar:** `git pull origin main`, `npm install`, `npm run build`, `npm run dev`.

**Checklist:** testar 320px, 430px, 1440px e paisagem; Safari iOS e safe area; abrir/fechar galeria; teclado (Tab/Enter/Espaço), lightbox (ESC/foco/clique externo), filtros, modo claro/escuro, WhatsApp e barra de progresso.

**Status:** testes estáticos de sintaxe e âncoras concluídos. O build e os testes em navegadores reais ainda precisam ser executados.
