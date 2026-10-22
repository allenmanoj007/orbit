import prisma from '../../config/database';

export class AdminService {
  async getStats() {
    const [totalUsers, activeUsers, totalMessages, pendingReports] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true, isBanned: false } }),
      prisma.message.count(),
      prisma.report.count({ where: { status: 'PENDING' } }),
    ]);

    return {
      totalUsers,
      activeUsers,
      totalMessages,
      pendingReports,
    };
  }

  async getUsers(page = 1, limit = 20, search?: string) {
    const skip = (page - 1) * limit;
    const where = search
      ? {
          OR: [
            { email: { contains: search, mode: 'insensitive' as const } },
            { profile: { displayName: { contains: search, mode: 'insensitive' as const } } },
            { profile: { username: { contains: search, mode: 'insensitive' as const } } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { profile: true },
      }),
      prisma.user.count({ where }),
    ]);

    return { users, total, page, limit };
  }

  async banUser(userId: string, reason: string, adminId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        isBanned: true,
        banReason: reason,
        bannedAt: new Date(),
        bannedBy: adminId,
      },
    });
  }

  async unbanUser(userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        isBanned: false,
        banReason: null,
        bannedAt: null,
        bannedBy: null,
      },
    });
  }

  async getReports(page = 1, limit = 20, status?: any) {
    const skip = (page - 1) * limit;
    const where = status ? { status } : {};

    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          reporter: { include: { profile: true } },
          reportedUser: { include: { profile: true } },
        },
      }),
      prisma.report.count({ where }),
    ]);

    return { reports, total, page, limit };
  }

  async updateReport(reportId: string, status: any, adminId: string, reviewNotes?: string) {
    return prisma.report.update({
      where: { id: reportId },
      data: {
        status,
        reviewedBy: adminId,
        reviewedAt: new Date(),
        reviewNotes,
      },
    });
  }

  async getInterests() {
    return prisma.interest.findMany({ orderBy: { name: 'asc' } });
  }

  async createInterest(name: string, emoji: string, category: string) {
    return prisma.interest.create({
      data: { name, emoji, category },
    });
  }

  async getHobbies() {
    return prisma.hobby.findMany({ orderBy: { name: 'asc' } });
  }

  async createHobby(name: string, emoji: string, category: string) {
    return prisma.hobby.create({
      data: { name, emoji, category },
    });
  }
}

export const adminService = new AdminService();
