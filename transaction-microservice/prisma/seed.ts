import {PrismaClient} from "@prisma/client";
import * as process from "process";

const prisma = new PrismaClient();

async function main() {
  // Seed TransactionType
  const transactionTypes = [
    { name: 'Deposit' },
    { name: 'Withdrawal' },
    { name: 'Transfer' },
    { name: 'Payment' },
    { name: 'Yape'}
  ];

  for (const type of transactionTypes) {
    await prisma.transactionType.create({
      data: type,
    });
  }

  // Seed TransactionStatus
  const transactionStatuses = [
    { name: 'Pending' },
    { name: 'Approved' },
    { name: 'Rejected' },
  ];

  for (const status of transactionStatuses) {
    await prisma.transactionStatus.create({
      data: status,
    });
  }

  console.log('Seeding completed.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });