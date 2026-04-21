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

### 🖥️ Visão do Administrador (Gestão)

| Funcionalidade           | Descrição Técnica                            | Screenshot (Clique para ampliar)                                                                      |
| :----------------------- | :------------------------------------------- | :---------------------------------------------------------------------------------------------------- |
| **Login Administrativo** | Acesso seguro para gestores e funcionários   | <a href="Screenshots/admin_login.png"><img src="Screenshots/admin_login.png" width="250"></a>         |
| **Dashboard Principal**  | Métricas de faturamento real e agenda do dia | <a href="Screenshots/admin_dashboard.png"><img src="Screenshots/admin_dashboard.png" width="250"></a> |
| **Gestão de Serviços**   | Controle de CRUD, duração e preços           | <a href="Screenshots/admin_servicos.png"><img src="Screenshots/admin_servicos.png" width="250"></a>   |
| **Base de Clientes**     | Listagem e busca de clientes cadastrados     | <a href="Screenshots/admin_clientes.png"><img src="Screenshots/admin_clientes.png" width="250"></a>   |
| **Gestão de Usuários**   | Controle de acesso dos funcionários          | <a href="Screenshots/admin_usuarios.png"><img src="Screenshots/admin_usuarios.png" width="250"></a>   |

### 📱 Experiência do Cliente

| Funcionalidade           | Descrição Técnica                          | Screenshot (Clique para ampliar)                                                                                                                                                                                          |
| :----------------------- | :----------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Primeiro Acesso**      | Landing page de boas-vindas ao salão       | <a href="Screenshots/cliente_primeiro_acesso.png"><img src="Screenshots/cliente_primeiro_acesso.png" width="250"></a>                                                                                                     |
| **Login / Cadastro**     | Fluxo simplificado via Telefone            | <a href="Screenshots/cliente_login.png"><img src="Screenshots/cliente_login.png" width="120"></a> <a href="Screenshots/cliente_cadastro_cliente.png"><img src="Screenshots/cliente_cadastro_cliente.png" width="120"></a> |
| **Novo Agendamento**     | Seleção de múltiplos serviços e horários   | <a href="Screenshots/cliente_agendamento.png"><img src="Screenshots/cliente_agendamento.png" width="250"></a>                                                                                                             |
| **Sugestão Inteligente** | Recomendação de agrupamento semanal        | <a href="Screenshots/cliente_recomendacao_agendamento.png"><img src="Screenshots/cliente_recomendacao_agendamento.png" width="250"></a>                                                                                   |
| **Meus Horários**        | Central de agendamentos e trava de 48h     | <a href="Screenshots/cliente_meus_horarios.png"><img src="Screenshots/cliente_meus_horarios.png" width="250"></a>                                                                                                         |
| **Reagendamento**        | Validação de disponibilidade em tempo real | <a href="Screenshots/cliente_reagendar.png"><img src="Screenshots/cliente_reagendar.png" width="250"></a>                                                                                                                 |

### ⚙️ Camada Técnica (Backend & Dados)

| Componente               | Descrição Técnica                            | Screenshot (Clique para ampliar)                                                                                                          |
| :----------------------- | :------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------- |
| **Documentação Swagger** | Endpoints REST mapeados e testáveis          | <a href="Screenshots/tecnico_swagger.png"><img src="Screenshots/tecnico_swagger.png" width="250"></a>                                     |
| **Suíte de Testes**      | Validações unitárias e de integração         | <a href="Screenshots/tecnico_testes.png"><img src="Screenshots/tecnico_testes.png" width="250"></a>                                       |
| **Modelagem Prisma**     | Tabela de Agendamentos (Prisma Studio)       | <a href="Screenshots/tecnico_prisma_Agendamento.png"><img src="Screenshots/tecnico_prisma_Agendamento.png" width="250"></a>               |
| **Preço Imutável**       | Tabela intermediária de histórico de valores | <a href="Screenshots/tecnico_prisma_AgendamentoServico.png"><img src="Screenshots/tecnico_prisma_AgendamentoServico.png" width="250"></a> |

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
