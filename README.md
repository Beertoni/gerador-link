# 📱 Gerador de Link WhatsApp

> Ferramenta gratuita, profissional e otimizada para SEO que gera links diretos para WhatsApp com mensagem personalizada, QR Code e histórico de links recentes.

---

## 🚀 Funcionalidades Implementadas

### ✅ Funcionalidades Principais
- **Gerador de Link** — Cria links no formato `wa.me/numero?text=mensagem`
- **Código de País Automático** — Padrão +55 (Brasil), com suporte a 25+ países
- **Mensagem Personalizada** — Textarea com contador de caracteres (0/500)
- **Validação em Tempo Real** — Valida número por comprimento mínimo por país
- **Pré-visualização do Link** — Atualização em tempo real enquanto digita
- **Botão "Gerar Link"** — Com animação de feedback visual
- **QR Code Automático** — Gerado via `qrcode.js` com cores da marca WhatsApp
- **Download do QR Code** — Baixa como imagem PNG
- **Copiar para Área de Transferência** — Com tooltip "Copiado! ✓" e fallback para browsers antigos
- **Links Recentes** — Últimos 5 links salvos via `localStorage` com timestamps relativos
- **Limpar Histórico** — Remove todos os links salvos

### ✅ UI/UX
- **Design responsivo** — Mobile-first com Tailwind CSS
- **Paleta WhatsApp** — Verde (#25D366), Verde Escuro (#128C7E), Cinza (#075E54)
- **Tipografia Inter** — Google Fonts via CDN
- **Animações suaves** — Fade-in, slide-up, shake para validação
- **Toast notifications** — Feedback de ações (copiar, gerar, etc.)
- **Botão "Voltar ao Topo"** — Aparece após 400px de scroll
- **Menu Mobile** — Hamburger menu responsivo

### ✅ SEO
- **Meta Tags completas** — Title, Description, Keywords, Robots, Canonical
- **Open Graph** — Facebook, WhatsApp preview
- **Twitter Cards** — Large Image Card
- **Schema.org** — WebApplication structured data (JSON-LD)
- **Seção de conteúdo SEO** — ~1.500 palavras em PT-BR sobre o tema
- **FAQ com 5 perguntas** — Accordion `<details>/<summary>` nativo
- **Benefícios com ícones** — 4 cards com keywords naturalmente integradas
- **CTA Banner** — "Comece a usar agora e profissionalize seu atendimento!"

### ✅ AdSense Ready
| Slot ID | Posição | Tamanho | Classe |
|---------|---------|---------|--------|
| `adsense-top` | Abaixo do header | 728×90 (banner) | `ad-slot-banner` |
| `adsense-middle` | Entre gerador e histórico (mobile) | 336×280 | `ad-slot-rect` |
| `adsense-sidebar` | Sidebar direita (desktop) | 300×600 | `ad-slot-sidebar` |
| `adsense-bottom` | Acima do footer | 728×90 (banner) | `ad-slot-banner` |

> **CLS Otimizado:** Todos os slots têm dimensões fixas via CSS (`contain: layout size`) para evitar Cumulative Layout Shift.

### ✅ Páginas Extras (Requeridas para AdSense)
- **`index.html`** — Página principal com o gerador
- **`privacy.html`** — Política de Privacidade completa (LGPD)
- **`terms.html`** — Termos de Uso completos
- **`contact.html`** — Formulário de contato com validação e honeypot anti-spam

---

## 📁 Estrutura de Arquivos

```
/
├── index.html          ← Gerador principal
├── privacy.html        ← Política de Privacidade
├── terms.html          ← Termos de Uso
├── contact.html        ← Página de Contato
├── css/
│   └── style.css       ← Estilos customizados + SEO section + ad slots
└── js/
    └── app.js          ← Lógica principal da aplicação
```

---

## 🛣️ URIs das Páginas

| Página | URI | Descrição |
|--------|-----|-----------|
| Home (Gerador) | `/index.html` | Ferramenta principal |
| Privacidade | `/privacy.html` | Política de Privacidade (LGPD) |
| Termos | `/terms.html` | Termos de Uso |
| Contato | `/contact.html` | Formulário de contato |

---

## 🔧 Como Adicionar o Google AdSense

1. Faça login no [Google AdSense](https://adsense.google.com)
2. Crie unidades de anúncio para cada slot
3. Substitua o conteúdo das `divs` de placeholder pelo código do AdSense:

```html
<!-- Exemplo — substitua o ad-placeholder dentro de #adsense-top -->
<div id="adsense-top" class="ad-slot ad-slot-banner">
  <ins class="adsbygoogle"
       style="display:inline-block;width:728px;height:90px"
       data-ad-client="ca-pub-XXXXXXXXXX"
       data-ad-slot="XXXXXXXXXX"></ins>
  <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
</div>
```

> **Dica:** Não altere as classes CSS dos containers — elas garantem o espaço reservado para evitar CLS.

---

## 📊 Estrutura de Dados (LocalStorage)

**Chave:** `wa_recent_links`

**Formato:**
```json
[
  {
    "phone": "+55 11999998888",
    "url": "https://wa.me/5511999998888?text=Ol%C3%A1!",
    "message": "Olá!",
    "date": 1706000000000
  }
]
```

- Máximo de **5 entradas** (FIFO — mais antigo removido primeiro)
- Sem duplicatas pela mesma URL
- Armazenado apenas no dispositivo do usuário (nunca enviado a servidores)

---

## 🔑 Palavras-chave SEO Mapeadas

| Palavra-chave | Localização |
|---------------|-------------|
| `gerador de link whatsapp` | Title, H1, meta, body |
| `criar link para whats` | H1, body, FAQ |
| `link direto whatsapp` | Description, body |
| `link personalizado whatsapp` | Body, benefits |
| `whatsapp para negócios` | Body, FAQ |
| `link whatsapp com mensagem` | Meta keywords, body |

---

## 📦 Dependências (CDN — sem instalação)

| Biblioteca | Versão | Uso |
|------------|--------|-----|
| [Tailwind CSS](https://tailwindcss.com) | CDN Play | Estilização |
| [QRCode.js](https://github.com/davidshimjs/qrcodejs) | 1.0.0 | Geração de QR Code |
| [Font Awesome](https://fontawesome.com) | 6.5.0 | Ícones |
| [Google Fonts — Inter](https://fonts.google.com/specimen/Inter) | latest | Tipografia |

---

## 🛠️ Próximos Passos Recomendados

- [ ] **Integrar Google Analytics 4** para rastrear conversões e uso
- [ ] **Adicionar Google AdSense real** substituindo os placeholders
- [ ] **Criar sitemap.xml** para facilitar indexação pelo Google
- [ ] **Criar robots.txt** configurado corretamente
- [ ] **Adicionar favicon** (32×32 e 192×192 com ícone do WhatsApp)
- [ ] **Internacionalizar** (i18n) para Inglês e Espanhol
- [ ] **Adicionar Google Search Console** para monitorar performance SEO
- [ ] **Implementar PWA** (Service Worker + manifest.json) para instalação mobile
- [ ] **A/B test** nas CTAs para otimizar conversão
- [ ] **Blog/artigos** sobre WhatsApp Marketing para aumentar autoridade SEO

---

## 🌐 URLs de Produção

> Atualize esta seção após fazer o deploy:

- **Produção:** `https://geradorlinkwhatsapp.com.br/`
- **Privacidade:** `https://geradorlinkwhatsapp.com.br/privacy.html`
- **Termos:** `https://geradorlinkwhatsapp.com.br/terms.html`
- **Contato:** `https://geradorlinkwhatsapp.com.br/contact.html`

---

## ⚖️ Aviso Legal

Este site **não possui afiliação** com o WhatsApp Inc. ou Meta Platforms, Inc.  
WhatsApp® é uma marca registrada da Meta Platforms, Inc.

---

*Feito com ♥ no Brasil 🇧🇷 — 2025*
