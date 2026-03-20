# Documento de Requisitos de Produto (PRD) - Weather Dashboard

## Visão Geral

O Weather Dashboard é uma nova página integrada à aplicação existente que permite aos usuários visualizar informações climáticas em tempo real. A funcionalidade resolve a necessidade de consultar rapidamente o clima atual e previsões futuras de qualquer cidade do mundo, com uma experiência visual premium inspirada no design da Apple — minimalista, elegante e impressionante.

O diferencial está na experiência do usuário: animações fluidas, tipografia refinada, uso inteligente de gradientes e uma interface que se adapta às condições climáticas exibidas, criando uma conexão emocional com o usuário.

## Objetivos

- **Experiência Visual Impressionante**: Interface que surpreende e encanta os usuários com design de alta qualidade inspirado na Apple
- **Usabilidade Intuitiva**: Usuário consegue visualizar o clima em menos de 3 segundos após acessar a página (via geolocalização) ou após digitar uma cidade
- **Informação Completa**: Exibir dados climáticos atuais, previsão horária (24h) e previsão para 7 dias em uma única tela
- **Acesso Universal**: Página pública sem necessidade de autenticação

## Histórias de Usuário

### Usuário com Geolocalização Disponível
Como usuário final, eu quero que a página detecte automaticamente minha localização para que eu veja o clima da minha cidade imediatamente ao acessar a página.

### Usuário sem Geolocalização
Como usuário final, eu quero digitar o nome de uma cidade para que eu possa consultar o clima de qualquer lugar do mundo quando a geolocalização não estiver disponível.

### Usuário Consultando Previsão
Como usuário final, eu quero ver a previsão horária e para os próximos 7 dias para que eu possa planejar minhas atividades.

### Usuário Buscando Outra Cidade
Como usuário final, eu quero poder buscar outra cidade a qualquer momento para que eu consulte o clima de diferentes localidades.

## Funcionalidades Principais

### 1. Detecção Automática de Localização

Ao acessar a página, o sistema solicita permissão de geolocalização do navegador. Se concedida, exibe automaticamente o clima da localização atual.

**Requisitos Funcionais:**
- RF01: O sistema deve solicitar permissão de geolocalização ao carregar a página
- RF02: Se autorizado, o sistema deve obter as coordenadas e buscar o clima automaticamente
- RF03: Se negado ou indisponível, o sistema deve exibir um campo de busca com mensagem orientativa

### 2. Busca de Cidade

Permite ao usuário digitar o nome de uma cidade para consultar o clima.

**Requisitos Funcionais:**
- RF04: O sistema deve exibir um campo de busca para digitação do nome da cidade
- RF05: O sistema deve converter o nome da cidade em coordenadas via API de Geocoding
- RF06: O sistema deve tratar casos de cidade não encontrada com mensagem amigável
- RF07: O sistema deve permitir nova busca a qualquer momento

### 3. Exibição de Clima Atual

Apresenta as condições climáticas atuais da cidade selecionada.

**Requisitos Funcionais:**
- RF08: O sistema deve exibir temperatura atual em graus Celsius
- RF09: O sistema deve exibir sensação térmica
- RF10: O sistema deve exibir umidade relativa do ar (%)
- RF11: O sistema deve exibir velocidade do vento (km/h)
- RF12: O sistema deve exibir condição climática (ensolarado, nublado, chuvoso, etc.)
- RF13: O sistema deve exibir ícone visual correspondente à condição climática
- RF14: O sistema deve exibir o nome da cidade e país

### 4. Previsão Horária (24 horas)

Apresenta a previsão hora a hora para as próximas 24 horas.

**Requisitos Funcionais:**
- RF15: O sistema deve exibir previsão para as próximas 24 horas
- RF16: Cada hora deve mostrar: horário, ícone da condição e temperatura
- RF17: O sistema deve permitir scroll horizontal para navegar entre as horas

### 5. Previsão de 7 Dias

Apresenta a previsão diária para os próximos 7 dias.

**Requisitos Funcionais:**
- RF18: O sistema deve exibir previsão para os próximos 7 dias
- RF19: Cada dia deve mostrar: dia da semana, ícone da condição, temperatura mínima e máxima
- RF20: O sistema deve destacar visualmente o dia atual

### 6. Backend - Endpoint de Clima

O backend deve intermediar as chamadas às APIs externas.

**Requisitos Funcionais:**
- RF21: O backend deve expor endpoint para buscar clima por coordenadas
- RF22: O backend deve expor endpoint para buscar coordenadas por nome de cidade
- RF23: O backend deve consumir a API Open-Meteo para dados climáticos
- RF24: O backend deve consumir a API de Geocoding Open-Meteo para conversão de cidade em coordenadas

## Experiência do Usuário

### Persona Principal

**Usuário Final**: Pessoa que deseja consultar rapidamente o clima para planejar seu dia ou viagens. Valoriza experiências visuais de alta qualidade e espera que a informação seja apresentada de forma clara e elegante.

### Fluxo Principal

1. Usuário acessa a página do Weather Dashboard
2. Sistema solicita permissão de geolocalização
3. **Se autorizado**: Sistema obtém coordenadas e exibe clima automaticamente
4. **Se negado/indisponível**: Sistema exibe mensagem e campo de busca
5. Usuário visualiza clima atual, previsão horária e previsão de 7 dias
6. Usuário pode buscar outra cidade a qualquer momento

### Diretrizes de UI/UX (Inspiração Apple)

- **Minimalismo**: Interface limpa, sem elementos desnecessários
- **Tipografia**: Fontes grandes e legíveis para temperatura principal, hierarquia visual clara
- **Cores**: Gradientes suaves que se adaptam à condição climática (azul para céu limpo, cinza para nublado, etc.)
- **Animações**: Transições suaves entre estados, micro-interações em hover/tap
- **Glassmorphism**: Uso de blur e transparência em cards para criar profundidade
- **Responsividade**: Design adaptável para desktop, tablet e mobile
- **Ícones**: Ícones climáticos elegantes e consistentes com o estilo visual

### Requisitos de Acessibilidade

- Contraste adequado entre texto e fundo
- Textos alternativos em ícones e imagens
- Navegação por teclado funcional
- Tamanhos de fonte legíveis

## Restrições Técnicas de Alto Nível

### Integrações Externas

- **Geocoding API**: `https://geocoding-api.open-meteo.com/v1/search` - Conversão de nome de cidade em coordenadas
- **Weather API**: `https://api.open-meteo.com/v1/forecast` - Obtenção de dados climáticos

### Características da API Open-Meteo

- API gratuita, sem necessidade de API key
- Limite de requisições: sem limite documentado para uso razoável
- Dados disponíveis: temperatura, sensação térmica, umidade, vento, código de condição WMO, previsão horária e diária

### Arquitetura

- Frontend não deve chamar APIs externas diretamente
- Backend deve intermediar todas as chamadas às APIs Open-Meteo
- Dados devem ser formatados pelo backend antes de enviar ao frontend

## Fora de Escopo

### Funcionalidades Excluídas

- Salvar cidades favoritas
- Histórico de buscas
- Alertas de clima severo
- Suporte a múltiplos idiomas (apenas português)
- Cache de dados climáticos
- Gráficos de previsão
- Modo offline
- Notificações push
- Compartilhamento em redes sociais
- Comparação entre cidades

### Considerações Futuras

- Sistema de favoritos poderá ser adicionado em versão futura
- Alertas de clima severo podem ser considerados após validação desta versão
