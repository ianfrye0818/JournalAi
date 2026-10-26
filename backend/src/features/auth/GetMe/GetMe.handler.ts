import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaService } from '@src/services/prisma.service';
import { UserResponse } from '../shared/user.response';
import { GetMeQuery } from './GetMe.query';
import { GetMeResponse } from './GetMe.response';

@QueryHandler(GetMeQuery)
export class GetMeHandler implements IQueryHandler<GetMeQuery, GetMeResponse> {
  constructor(private readonly prisma: PrismaService) {}

  async execute({ userId }: GetMeQuery): Promise<GetMeResponse> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    return UserResponse.from(user);
  }
}
