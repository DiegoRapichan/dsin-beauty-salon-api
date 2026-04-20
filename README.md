# Cabeleleila Leila — Solução de Agendamento Inteligente

> Aplicação Full Stack desenvolvida para o desafio técnico da **DSIN**.
> Soluciona a gestão completa de agendamentos de um salão de beleza com inteligência de dados, regras de negócio rigorosas e interface premium.

---

## Engenharia de Software e Stack Tecnológica

### Backend (API RESTful)

| Tecnologia            | Responsabilidade                                                  |
| --------------------- | ----------------------------------------------------------------- |
| **Node.js & Express** | Estrutura robusta com middleware de tratamento de erros global    |
| **Prisma ORM**        | Modelagem de dados e persistência com integridade referencial     |
| **SQLite**            | Portabilidade total — execução imediata sem dependências externas |
| **Zod**               | Blindagem de todos os endpoints via Schema Validation             |
| **JWT & Bcrypt**      | Autenticação segura para o painel administrativo                  |
| **Vitest**            | Testes unitários para validação automática das regras de negócio  |
| **Swagger UI**        | Documentação técnica interativa (`/api-docs`)                     |
| **DayJS**             | Manipulação precisa de fusos horários e cálculos de datas         |

### Frontend (Interface)

| Tecnologia          | Responsabilidade                                            |
| ------------------- | ----------------------------------------------------------- |
| **React.js (Vite)** | Performance otimizada com Fast Refresh e bundling eficiente |
| **Tailwind CSS**    | Design system "Premium Dark" — responsivo e moderno         |
| **Lucide React**    | Biblioteca de ícones vetoriais                              |

---

## Regras de Negócio Implementadas

Todos os requisitos do enunciado DSIN foram endereçados:

### Nível Fundamental (Obrigatório)

**1. Agendamento de Múltiplos Serviços**
Cliente pode selecionar um ou mais serviços em um único agendamento.

**2. Trava de Reagendamento (48h)**
Algoritmo que calcula a diferença entre o momento atual e a data do serviço. Caso seja inferior a 48h, a alteração via sistema é bloqueada e o cliente é instruído a contatar o salão por telefone.

**3. Sugestão Inteligente de Mesma Semana**
Ao detectar um agendamento existente para o mesmo cliente na mesma semana (segunda a domingo), o sistema sugere a unificação dos serviços na data do primeiro agendamento.

**4. Histórico de Agendamentos**
Visão completa para o cliente de seus agendamentos passados e futuros, com detalhamento de cada serviço.

**5. Identificação por Telefone**
O portal do cliente utiliza o número de telefone como identificador, reduzindo fricção no acesso e agendamento.

### Nível Plus (Diferenciais Opcionais)

**6. Painel Operacional — Gestão pela Leila**

- Alteração de agendamentos de clientes diretamente pelo painel administrativo.
- Listagem completa de agendamentos recebidos.
- Confirmação de agendamento ao cliente.
- Gerenciamento de status por serviço: `Pendente → Confirmado → Concluído / Cancelado`.

**7. Rastreabilidade (Logs de Auditoria)**
Histórico detalhado de alterações com registro de horário anterior, novo horário e responsável pela modificação (Cliente ou Admin).

**8. Dashboard Gerencial**
Indicadores de desempenho semanal, faturamento previsto e visão consolidada da agenda.

---

## Evidências do Projeto

| Funcionalidade           | Descrição Técnica             | Screenshot                        |
| ------------------------ | ----------------------------- | --------------------------------- |
| Login Administrativo     | Autenticação segura com JWT   | `screenshots/login_admin.png`     |
| Dashboard Gerencial      | Faturamento e status semanais | `screenshots/dashboard.png`       |
| Sugestão de Mesma Semana | Inteligência de agendamento   | `screenshots/sugestao_semana.png` |
| Trava 48h                | Validação de prazo de edição  | `screenshots/trava_48h.png`       |
| Documentação API         | Swagger interativo            | `screenshots/swagger.png`         |
| Testes Automatizados     | Suite Vitest passando         | `screenshots/testes_passando.png` |

---

## Instruções de Execução

### 1. Backend (API)

```bash
cd api
npm install
npm run seed    # Popula o banco com Admin, Clientes e Serviços base
npm run dev     # Servidor em http://localhost:3000
```

- Documentação interativa: `http://localhost:3000/api-docs`
- Executar testes: `npm test`

### 2. Frontend (Web)

```bash
cd web
npm install
npm run dev     # Aplicação em http://localhost:5173
```

---

## Vídeo de Demonstração

O vídeo demonstra o ciclo de vida completo da aplicação: do auto-cadastro do cliente via telefone até a gestão administrativa pela Leila, com destaque para a execução dos testes automatizados e visualização das tabelas via Prisma Studio.
