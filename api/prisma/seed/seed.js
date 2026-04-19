import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log(" Iniciando o seed do banco de dados...");

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash("123456", saltRounds);

  const user = await prisma.user.upsert({
    where: { email: "admin@salao.com" },
    update: {},
    create: {
      nome: "Administrador Leila",
      email: "admin@salao.com",
      password: passwordHash,
    },
  });

  console.log(" Usuário admin criado: admin@salao.com / 123456");

  await prisma.cliente.deleteMany({});
  const clientes = [
    { nome: "Maria Silva", telefone: "11999999999" },
    { nome: "João Souza", telefone: "11988888888" },
    { nome: "Ana Paula", telefone: "43977777777" },
  ];

  for (const cliente of clientes) {
    await prisma.cliente.create({ data: cliente });
  }
  console.log(" Clientes de teste inseridos.");

  await prisma.servico.deleteMany({});
  const servicos = [
    { nome: "Corte de Cabelo", preco: 50.0, duracao: 30 },
    { nome: "Manicure", preco: 40.0, duracao: 60 },
    { nome: "Escova", preco: 60.0, duracao: 30 },
    { nome: "Barba", preco: 30.0, duracao: 30 },
    { nome: "Hidratação", preco: 80.0, duracao: 60 },
  ];

  for (const servico of servicos) {
    await prisma.servico.create({ data: servico });
  }
  console.log(" Serviços de teste inseridos.");

  console.log("\n Seed finalizado com sucesso!");
}

main()
  .catch((e) => {
    console.error(" Erro ao executar o seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
