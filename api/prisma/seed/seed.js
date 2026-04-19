import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Populando banco de dados...");

  await prisma.agendamentoServico.deleteMany();
  await prisma.agendamento.deleteMany();
  await prisma.user.deleteMany();

  const hash = await bcrypt.hash("123456", 10);
  await prisma.user.create({
    data: { nome: "Leila Salon", email: "admin@salao.com", password: hash },
  });

  const cliente = await prisma.cliente.create({
    data: { nome: "Maria Silva", telefone: "4399999999" },
  });
  const servico = await prisma.servico.create({
    data: { nome: "Corte e Escova", preco: 120, duracao: 60 },
  });

  const dataHoje = new Date();
  dataHoje.setHours(15, 0, 0, 0);

  await prisma.agendamento.create({
    data: {
      clienteId: cliente.id,
      data: dataHoje,
      status: "AGENDADO",
      servicos: {
        create: [{ servicoId: servico.id }],
      },
    },
  });

  console.log("Seed finalizado!");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
