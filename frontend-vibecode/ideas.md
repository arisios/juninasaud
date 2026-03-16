# Design Brainstorming - Event Booth Management System

## Contexto
Sistema operacional para gestão de eventos presenciais com 5 papéis de usuário. Necessário design mobile-first, moderno e minimalista, inspirado em Vercel, Stripe e Linear. Foco em usabilidade rápida em campo.

---

## Proposta 1: Minimalismo Nórdico com Tipografia Ousada
**Probabilidade: 0.08**

### Design Movement
Minimalismo Nórdico + Tipografia Expressiva (inspirado em design escandinavo e interfaces de ferramentas de produtividade modernas)

### Core Principles
1. **Espaço Negativo Estratégico** - Amplos espaços em branco criam clareza e reduzem cognitivo
2. **Hierarquia Tipográfica Forte** - Contraste agressivo entre display bold e body light
3. **Cores Monocromáticas com Accent Vibrante** - Paleta neutra (cinza/preto/branco) com um accent em azul elétrico
4. **Micro-interações Sutis** - Transições suaves e feedback visual discreto

### Color Philosophy
- **Background**: Branco puro (`#FFFFFF`) com cinza muito claro para cards (`#F8F9FA`)
- **Primary**: Azul elétrico (`#0066FF`) - energia, confiança, ação
- **Text**: Cinza escuro (`#1A1A1A`) para corpo, preto (`#000000`) para títulos
- **Accent**: Verde menta (`#00D9A3`) para sucesso/confirmação
- **Reasoning**: Paleta neutra reduz fadiga visual em operações de campo; accent vibrante destaca ações críticas

### Layout Paradigm
- **Sidebar Colapsável** - Navegação lateral com ícones + texto, colapsável em mobile
- **Cards com Espaçamento Generoso** - Cada seção é um card com padding 24px, gap 16px
- **Grid Assimétrico** - Dashboard com grid 1-2-3 colunas conforme conteúdo, não uniforme
- **Bottom Navigation em Mobile** - Navegação principal em abas na base para thumb-friendly

### Signature Elements
1. **Linhas Diagonais Sutis** - Divisores com ângulo 15° entre seções (clip-path polygon)
2. **Badges Geométricas** - Status com formas: círculo (ativo), quadrado (pendente), triângulo (urgente)
3. **Ícones Stroke Pesado** - Lucide icons com weight 2.5 para destaque visual

### Interaction Philosophy
- **Hover States Minimalistas** - Fundo muda de cor, sem sombra adicional
- **Loading States com Skeleton** - Não usar spinners; mostrar placeholders animados
- **Confirmação Silenciosa** - Toast no canto inferior, auto-dismiss em 3s
- **Drag & Drop Suave** - Feedback visual com sombra elevada e cursor grab

### Animation
- **Entrance**: Fade-in + slide-up 200ms (easing: cubic-bezier(0.4, 0, 0.2, 1))
- **Hover**: Scale 1.02 + shadow elevation 200ms
- **Loading**: Skeleton pulse com opacity 0.6-1.0, 1.5s loop
- **Transitions**: Todas as mudanças de estado em 150-300ms

### Typography System
- **Display**: Geist Sans Bold 32px (títulos de página)
- **Heading**: Geist Sans SemiBold 24px (seções)
- **Subheading**: Geist Sans Medium 16px (cards, labels)
- **Body**: Inter Regular 14px (conteúdo)
- **Caption**: Inter Regular 12px (metadados, timestamps)
- **Line-height**: 1.6 para body, 1.3 para headings

---

## Proposta 2: Glassmorphism Contemporâneo com Gradientes Suaves
**Probabilidade: 0.07**

### Design Movement
Glassmorphism + Neumorphism Moderno (inspirado em iOS 15+, design systems contemporâneos)

### Core Principles
1. **Transparência e Profundidade** - Cards com backdrop-filter blur, criando sensação de camadas
2. **Gradientes Direcionais** - Gradientes sutis de 15-20° para movimento visual
3. **Sombras Elevadas** - Múltiplas sombras para criar profundidade 3D
4. **Bordas Suaves com Blur** - Borders com opacity 0.2 em cor primária

### Color Philosophy
- **Background Base**: Gradiente azul muito claro (`#F0F7FF` → `#F5F0FF`)
- **Primary**: Azul profundo (`#3B82F6`) com gradiente para roxo (`#8B5CF6`)
- **Cards**: Branco com opacity 0.7 + backdrop-filter blur 10px
- **Text**: Cinza escuro (`#1F2937`)
- **Accent**: Laranja quente (`#FB923C`) para alertas
- **Reasoning**: Glassmorphism cria sensação moderna e premium; gradientes suaves guiam atenção

### Layout Paradigm
- **Floating Cards** - Cards não tocam as bordas; margin 8px em mobile, 16px em desktop
- **Stacked Sections** - Seções empilhadas verticalmente com espaçamento generoso (gap 20px)
- **Asymmetric Grid** - Dashboard com 1 coluna larga + 2 colunas estreitas (60-40 split)
- **Floating Action Button** - FAB no canto inferior direito para ações primárias

### Signature Elements
1. **Blur Borders** - Bordas com gradient + blur para efeito fluido
2. **Floating Badges** - Status com sombra flutuante e gradiente interno
3. **Animated Gradients** - Gradientes que mudam levemente com hover

### Interaction Philosophy
- **Hover States Elevados** - Cards levantam com sombra maior e blur aumenta
- **Ripple Effect** - Clique gera ripple em cor primária com opacity 0.2
- **Smooth Transitions** - Todas as mudanças em 250ms com easing ease-out
- **Feedback Tátil** - Toast com backdrop blur e gradiente

### Animation
- **Entrance**: Blur-in + scale 0.95→1.0 em 300ms
- **Hover**: Translate Y -2px + shadow elevation 300ms
- **Loading**: Gradient shift com animação de cor, 2s loop
- **Transitions**: 200-300ms com cubic-bezier(0.34, 1.56, 0.64, 1)

### Typography System
- **Display**: Poppins Bold 36px (títulos)
- **Heading**: Poppins SemiBold 24px (seções)
- **Subheading**: Poppins Medium 16px (cards)
- **Body**: Outfit Regular 14px (conteúdo)
- **Caption**: Outfit Regular 12px (metadados)
- **Line-height**: 1.7 para body, 1.2 para headings

---

## Proposta 3: Brutalismo Digital com Tipografia Monoespacial
**Probabilidade: 0.09**

### Design Movement
Brutalismo Digital + Cyberpunk Funcional (inspirado em design de ferramentas de desenvolvedor, interfaces de terminal modernas)

### Core Principles
1. **Estrutura Exposta** - Grids visíveis, bordas definidas, sem suavização excessiva
2. **Tipografia Monoespacial Dominante** - Fonte mono para dados, criando ritmo visual
3. **Alto Contraste** - Cores vibrantes contra fundo escuro
4. **Funcionalidade Acima da Forma** - Cada elemento tem propósito claro

### Color Philosophy
- **Background**: Cinza muito escuro quase preto (`#0F0F0F`)
- **Primary**: Ciano vibrante (`#00F0FF`) - energia, atenção
- **Secondary**: Magenta (`#FF00FF`) - ações secundárias
- **Text**: Branco (`#FFFFFF`) com cinza claro para secundário (`#A0A0A0`)
- **Accent**: Amarelo elétrico (`#FFFF00`) para urgência
- **Reasoning**: Alto contraste facilita leitura em ambientes com luz solar; cores vibrantes mantêm usuário engajado

### Layout Paradigm
- **Grid Rígido 12 Colunas** - Layout baseado em grid visível
- **Bordas Definidas** - Todos os elementos com borda 2px em cor primária
- **Espaçamento Uniforme** - Padding/margin sempre múltiplos de 8px
- **Tabelas Dominantes** - Dados em tabelas com bordas, não cards

### Signature Elements
1. **Bordas Neon** - Bordas com glow effect (box-shadow com cor primária)
2. **Tipografia Monoespacial em Dados** - Números e IDs em Courier New
3. **Ícones Pixelados** - Ícones com estilo retro/pixelado

### Interaction Philosophy
- **Click Feedback Agressivo** - Borda muda de cor, fundo inverte
- **Loading States Visíveis** - Barra de progresso com animação de scan
- **Confirmação Explícita** - Modal com confirmação textual, não apenas toast
- **Keyboard-First** - Navegação por Tab bem definida, focus rings visíveis

### Animation
- **Entrance**: Scan-line effect de cima para baixo em 400ms
- **Hover**: Borda ganha glow, fundo muda em 100ms
- **Loading**: Animação de scan horizontal, 1.5s loop
- **Transitions**: 100-200ms com linear easing

### Typography System
- **Display**: IBM Plex Mono Bold 32px (títulos)
- **Heading**: IBM Plex Mono SemiBold 24px (seções)
- **Subheading**: IBM Plex Mono Medium 16px (cards)
- **Body**: IBM Plex Mono Regular 13px (conteúdo)
- **Data**: Courier New 12px (números, IDs)
- **Line-height**: 1.8 para body, 1.4 para headings

---

## Decisão Final

**Proposta Selecionada: Minimalismo Nórdico com Tipografia Ousada**

### Justificativa
- ✅ Melhor para operações de campo (reduz fadiga visual)
- ✅ Escalável para qualquer quantidade de dados
- ✅ Tipografia forte facilita leitura rápida
- ✅ Cores neutras com accent vibrante mantém foco
- ✅ Alinha com inspirações (Vercel, Stripe, Linear)
- ✅ Mobile-first naturalmente com bottom navigation

### Próximos Passos
1. Configurar tipografia (Geist Sans + Inter)
2. Definir paleta de cores em CSS variables
3. Criar componentes base com design tokens
4. Implementar layout sidebar + bottom nav
5. Construir dashboards por papel de usuário
