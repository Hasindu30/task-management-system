import { PrismaClient, Priority, Status } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Hash password for default admin user
  const hashedPassword = await bcrypt.hash("123456", 10);

  // Upsert admin user
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@test.com" },
    update: {
      name: "Admin User",
      password: hashedPassword,
    },
    create: {
      name: "Admin User",
      email: "admin@test.com",
      password: hashedPassword,
    },
  });

  console.log(`Admin user seeded: ${adminUser.email} (ID: ${adminUser.id})`);

  // Check if sample tasks exist
  const existingTasksCount = await prisma.task.count({
    where: { userId: adminUser.id },
  });

  if (existingTasksCount === 0) {
    const today = new Date();
    
    const task1DueDate = new Date(today);
    task1DueDate.setDate(today.getDate() + 3);

    const task2DueDate = new Date(today);
    task2DueDate.setDate(today.getDate() + 7);

    const task3DueDate = new Date(today);
    task3DueDate.setDate(today.getDate() - 2); // Overdue task

    const task4DueDate = new Date(today);
    task4DueDate.setDate(today.getDate() + 1);

    const task5DueDate = new Date(today);
    task5DueDate.setDate(today.getDate() + 5);

    await prisma.task.createMany({
      data: [
        {
          title: "Complete Internship Technical Assessment",
          description: "Build full-stack task management application with React and Express.",
          priority: Priority.HIGH,
          status: Status.IN_PROGRESS,
          dueDate: task1DueDate,
          userId: adminUser.id,
        },
        {
          title: "Setup CI/CD Pipeline",
          description: "Configure Vercel and Render automatic deployments.",
          priority: Priority.MEDIUM,
          status: Status.PENDING,
          dueDate: task2DueDate,
          userId: adminUser.id,
        },
        {
          title: "Submit Initial Project Proposal",
          description: "Review requirement specifications and finalize system architecture.",
          priority: Priority.HIGH,
          status: Status.PENDING,
          dueDate: task3DueDate, // Overdue
          userId: adminUser.id,
        },
        {
          title: "Write API Documentation",
          description: "Document REST endpoints, validation rules, and error codes.",
          priority: Priority.LOW,
          status: Status.COMPLETED,
          dueDate: task4DueDate,
          userId: adminUser.id,
        },
        {
          title: "Perform Responsiveness Audit",
          description: "Ensure UI scales smoothly on desktop, tablet, and mobile displays.",
          priority: Priority.MEDIUM,
          status: Status.PENDING,
          dueDate: task5DueDate,
          userId: adminUser.id,
        },
      ],
    });

    console.log("Sample tasks seeded successfully.");
  } else {
    console.log("Tasks already exist, skipping sample task seeding.");
  }
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
