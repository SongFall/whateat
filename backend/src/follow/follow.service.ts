import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FollowService {
  constructor(private readonly prisma: PrismaService) {}

  follow(followerId: number, followingId: number) {
    return this.prisma.follow.create({
      data: {
        followerId,
        followingId,
      },
    });
  }

  unfollow(followerId: number, followingId: number) {
    return this.prisma.follow.deleteMany({
      where: {
        followerId,
        followingId,
      },
    });
  }

  findFollowings(userId: number) {
    return this.prisma.follow.findMany({
      where: { followerId: userId },
      include: {
        following: {
          select: {
            id: true,
            username: true,
            avatar: true,
            nickname: true,
            bio: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  findFollowers(userId: number) {
    return this.prisma.follow.findMany({
      where: { followingId: userId },
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            avatar: true,
            nickname: true,
            bio: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async checkFollow(followerId: number, followingId: number) {
    const follow = await this.prisma.follow.findFirst({
      where: {
        followerId,
        followingId,
      },
    });
    return { isFollowing: !!follow };
  }
}