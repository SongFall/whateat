const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function resetPassword() {
  try {
    // 查找用户
    const user = await prisma.user.findUnique({
      where: { email: 'sf@whateat.com' }
    });

    if (!user) {
      console.log('用户不存在');
      return;
    }

    // 哈希密码
    const hashedPassword = await bcrypt.hash('123456', 10);

    // 更新密码
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });

    console.log('密码重置成功');
  } catch (error) {
    console.error('密码重置失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetPassword();