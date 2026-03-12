import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common';
import { FollowService } from './follow.service';

@Controller('follows')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post()
  follow(@Body() body: { followerId: string; followingId: string }) {
    return this.followService.follow(+body.followerId, +body.followingId);
  }

  @Delete()
  unfollow(@Body() body: { followerId: string; followingId: string }) {
    return this.followService.unfollow(+body.followerId, +body.followingId);
  }

  @Get('followings/:userId')
  findFollowings(@Param('userId') userId: string) {
    return this.followService.findFollowings(+userId);
  }

  @Get('followers/:userId')
  findFollowers(@Param('userId') userId: string) {
    return this.followService.findFollowers(+userId);
  }

  @Get('check')
  checkFollow(@Query('followerId') followerId: string, @Query('followingId') followingId: string) {
    return this.followService.checkFollow(+followerId, +followingId);
  }
}
