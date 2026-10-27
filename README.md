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
