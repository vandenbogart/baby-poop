import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Updating users with correct password hash...')

  // Hash the password
  const hashedPassword = await bcrypt.hash('password', 10)
  console.log('Password hash:', hashedPassword)

  // Update or create Aja
  const aja = await prisma.user.upsert({
    where: { username: 'Aja' },
    update: {
      password: hashedPassword,
    },
    create: {
      id: 'default_user_aja',
      username: 'Aja',
      password: hashedPassword,
    },
  })

  // Update or create Eric
  const eric = await prisma.user.upsert({
    where: { username: 'Eric' },
    update: {
      password: hashedPassword,
    },
    create: {
      id: 'default_user_eric',
      username: 'Eric',
      password: hashedPassword,
    },
  })

  console.log('Users updated successfully')
  console.log('Aja ID:', aja.id)
  console.log('Eric ID:', eric.id)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
