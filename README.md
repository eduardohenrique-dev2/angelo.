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
