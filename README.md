# Leila Salon — Solução de Agendamento Inteligente

> Aplicação Full Stack desenvolvida para o desafio técnico da **DSIN**. Soluciona a gestão completa de agendamentos de um salão de beleza com inteligência de dados, regras de negócio rigorosas e interface premium Dark Mode.

🎬 **[Assistir Apresentação Técnica](#)** ← substitua pelo link do vídeo

---

## O Problema e a Solução

A **Cabeleleila Leila** enfrentava três desafios principais que este software resolve:

| #   | Problema                                                                                  | Solução Implementada                                                                    |
| --- | ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| 1   | **Agenda ineficiente:** clientes esqueciam de agrupar serviços, gerando buracos na agenda | **Sugestão Inteligente** detecta agendamentos na mesma semana e incentiva o agrupamento |
| 2   | **Previsibilidade financeira:** alterações de preços afetavam relatórios históricos       | **Snapshot de Preços** (`precoPago`) grava o valor acordado no ato do agendamento       |
| 3   | **Cancelamentos de última hora:** prejuízo por falta de tempo para reocupar horários      | **Trava das 48h** garante prazo hábil para a Leila reorganizar a agenda                 |

---

## Stack Tecnológica

### Backend (API RESTful)

| Tecnologia        | Responsabilidade                                                            |
| ----------------- | --------------------------------------------------------------------------- |
| Node.js + Express | Estrutura robusta com padrão MVC, Services e tratamento global de erros     |
| Prisma ORM        | Persistência com Atomic Transactions e integridade referencial              |
| SQLite            | Portabilidade total — execução imediata sem dependências externas           |
| Zod               | Blindagem de todos os endpoints via Schema Validation e inferência de tipos |
| JWT + Bcrypt      | Autenticação administrativa segura e hash de senhas (fator de custo 10)     |
| Vitest            | Suíte de testes unitários para validação automática das regras de negócio   |
| Swagger UI        | Documentação técnica interativa e explorável em `/api-docs`                 |

### Frontend (Interface)

| Tecnologia      | Responsabilidade                                                            |
| --------------- | --------------------------------------------------------------------------- |
| React 19 + Vite | Performance otimizada com Fast Refresh e bundling eficiente                 |
| Tailwind CSS    | Design System "Premium Dark" — responsivo, moderno e baseado em utilitários |
| DayJS           | Manipulação precisa de fusos horários e cálculos complexos de datas         |

---

## Regras de Negócio Implementadas

### Nível Fundamental

- [x] **Agendamento Multi-serviço:** o cliente seleciona um ou mais serviços em um único atendimento
- [x] **Trava de Reagendamento (48h):** bloqueia alterações próximas à data, instruindo contato via telefone
- [x] **Sugestão Inteligente:** detecta agendamentos na mesma semana e sugere unificação para otimizar a agenda
- [x] **Identificação por Telefone:** acesso simplificado via número de 11 dígitos validados, reduzindo fricção no agendamento

### Nível Plus (Diferenciais Técnicos)

- [x] **Imutabilidade Financeira (`precoPago`):** valor "congelado" no ato do agendamento — alterações futuras no catálogo não distorcem o faturamento histórico
- [x] **Dashboard Gerencial Reativo:** indicadores de desempenho com faturamento real e visão consolidada da agenda
- [x] **Rastreabilidade (Logs de Auditoria):** registro de quem alterou o horário, qual era o valor e o horário anterior
- [x] **Segurança de Rotas:** Private Routes distintos para Cliente (identificação por telefone) e Admin (JWT)

---

## Evidências do Projeto (Screenshots)

### Visão do Administrador (Gestão)

| Funcionalidade       | Descrição Técnica                              | Screenshot                        |
| -------------------- | ---------------------------------------------- | --------------------------------- |
| Login Administrativo | Acesso seguro para gestores e funcionários     | `screenshots/admin_login.png`     |
| Dashboard Principal  | Métricas de faturamento real e agenda do dia   | `screenshots/admin_dashboard.png` |
| Gestão de Serviços   | Controle de CRUD, duração e preços             | `screenshots/admin_servicos.png`  |
| Base de Clientes     | Listagem e busca de clientes cadastrados       | `screenshots/admin_clientes.png`  |
| Gestão de Usuários   | Controle de acesso dos funcionários ao sistema | `screenshots/admin_usuarios.png`  |

### Experiência do Cliente

| Funcionalidade       | Descrição Técnica                                       | Screenshot                                                           |
| -------------------- | ------------------------------------------------------- | -------------------------------------------------------------------- |
| Primeiro Acesso      | Landing page de boas-vindas ao salão                    | `screenshots/cliente_primeiro_acesso.png`                            |
| Login / Cadastro     | Fluxo simplificado via telefone (11 dígitos)            | `screenshots/cliente_login.png` / `screenshots/cadastro_cliente.png` |
| Novo Agendamento     | Interface de seleção de múltiplos serviços e horários   | `screenshots/cliente_agendamento.png`                                |
| Sugestão Inteligente | Recomendação para agrupar horários na mesma semana      | `screenshots/cliente_recomendacao_agendamento.png`                   |
| Meus Horários        | Central de agendamentos com status e trava de 48h       | `screenshots/cliente_meus_horarios.png`                              |
| Reagendamento        | Interface de alteração com validação de disponibilidade | `screenshots/cliente_reagendar.png`                                  |

### Camada Técnica (Backend & Dados)

| Componente           | Descrição Técnica                               | Screenshot                                          |
| -------------------- | ----------------------------------------------- | --------------------------------------------------- |
| Documentação Swagger | Todos os endpoints REST mapeados e testáveis    | `screenshots/tecnico_swagger.png`                   |
| Suíte de Testes      | Validações unitárias e de integração (Vitest)   | `screenshots/tecnico_testes.png`                    |
| Modelagem Prisma     | Tabela de Agendamentos (relação Cliente/Status) | `screenshots/tecnico_prisma_Agendamento.png`        |
| Preço Imutável       | Tabela intermediária salvando o valor histórico | `screenshots/tecnico_prisma_AgendamentoServico.png` |

---

## Instruções de Execução

**1. Instalar dependências (raiz)**

```bash
npm install
```

**2. Configurar o backend**

```bash
cd api
npx prisma migrate deploy
npm run seed    # Popula Admin (admin@salao.com / 123456) e serviços base
npm run dev     # Servidor em http://localhost:3000
```

**3. Configurar o frontend**

```bash
cd web
npm run dev     # Aplicação em http://localhost:5173
```

**4. Executar os testes unitários**

```bash
cd api && npm test
```

- Documentação interativa: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

## Vídeo de Demonstração

O vídeo demonstra o ciclo de vida completo da aplicação: do auto-cadastro do cliente via telefone até a gestão administrativa pela Leila, com destaque para a segurança de tipos, execução dos testes automatizados e a prova da integridade financeira via `precoPago`.

**[Assistir Apresentação Técnica](#)** ← substitua pelo link do vídeo

---

Desenvolvido por **Diego Colombari Rapichan** — 2026
