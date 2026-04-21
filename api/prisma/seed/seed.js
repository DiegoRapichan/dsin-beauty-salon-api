import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const senhaHash = await bcrypt.hash("123456", 10);

  await prisma.usuario.upsert({
    where: { email: "admin@salao.com" },
    update: {},
    create: {
      nome: "Administrador",
      email: "admin@salao.com",
      senha: senhaHash,
    },
  });

  const servicos = [
    { nome: "Corte Feminino", preco: 60.0, duracao: 60 },
    { nome: "Escova", preco: 45.0, duracao: 45 },
    { nome: "Coloração", preco: 120.0, duracao: 120 },
    { nome: "Manicure", preco: 35.0, duracao: 30 },
    { nome: "Pedicure", preco: 40.0, duracao: 30 },
  ];

  for (const s of servicos) {
    await prisma.servico.upsert({
      where: { id: servicos.indexOf(s) + 1 },
      update: {},
      create: s,
    });
  }

  console.log("Seed concluído! Login: admin@salao.com / 123456");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
