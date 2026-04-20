import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando o seed do banco de dados...");

  await prisma.agendamentoServico.deleteMany();
  await prisma.agendamento.deleteMany();
  await prisma.servico.deleteMany();
  await prisma.cliente.deleteMany();
  await prisma.usuario.deleteMany();

  console.log("🧹 Banco de dados limpo.");

  const leila = await prisma.usuario.create({
    data: {
      nome: "Leila Oliveira",
      email: "admin@salao.com",
      senha: "123456",
      role: "ADMIN",
    },
  });

  const corte = await prisma.servico.create({
    data: { nome: "Corte de Cabelo", preco: 50.0, duracao: 30 },
  });
  const barba = await prisma.servico.create({
    data: { nome: "Barba Tradicional", preco: 35.0, duracao: 20 },
  });
  const sobrancelha = await prisma.servico.create({
    data: { nome: "Sobrancelha", preco: 15.0, duracao: 15 },
  });
  const combo = await prisma.servico.create({
    data: { nome: "Combo Completo", preco: 90.0, duracao: 60 },
  });

  const diego = await prisma.cliente.create({
    data: { nome: "Diego Rapichan", telefone: "43996876005" },
  });
  const ana = await prisma.cliente.create({
    data: { nome: "Ana Souza", telefone: "43888888888" },
  });

  const agora = new Date();

  const dataHoje = new Date();
  dataHoje.setHours(14, 30, 0);

  const ag1 = await prisma.agendamento.create({
    data: {
      data: dataHoje,
      status: "AGENDADO",
      clienteId: diego.id,
    },
  });
  await prisma.agendamentoServico.create({
    data: { agendamentoId: ag1.id, servicoId: corte.id },
  });

  const amanha = new Date();
  amanha.setDate(agora.getDate() + 1);
  amanha.setHours(10, 0, 0);

  const ag2 = await prisma.agendamento.create({
    data: {
      data: amanha,
      status: "AGENDADO",
      clienteId: diego.id,
    },
  });
  await prisma.agendamentoServico.create({
    data: { agendamentoId: ag2.id, servicoId: barba.id },
  });

  const dataPassada = new Date();
  dataPassada.setHours(agora.getHours() - 2);

  const ag3 = await prisma.agendamento.create({
    data: {
      data: dataPassada,
      status: "CANCELADO",
      clienteId: ana.id,
      log: "Horário alterado de 16:00 para 10:00 (Modificado por: Cliente)",
    },
  });
  await prisma.agendamentoServico.create({
    data: { agendamentoId: ag3.id, servicoId: combo.id },
  });

  console.log(`
Seed finalizado com sucesso!
-----------------------------------------------
🔑 ADMIN: admin@salao.com | 123456
📱 CLIENTE TESTE: 43996876005
-----------------------------------------------
  `);
}

main()
  .catch((e) => {
    console.error("Erro ao rodar o seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
