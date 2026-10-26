import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaService } from '@src/services/prisma.service';
import { StyleProfileResponse } from '../shared/style-profile.response';
import { GetStyleProfileQuery } from './GetStyleProfile.query';
import { GetStyleProfileResponse } from './GetStyleProfile.response';

/** A user without a saved profile gets an empty one rather than a 404. */
@QueryHandler(GetStyleProfileQuery)
export class GetStyleProfileHandler implements IQueryHandler<
  GetStyleProfileQuery,
  GetStyleProfileResponse
> {
  constructor(private readonly prisma: PrismaService) {}

  async execute({
    userId,
  }: GetStyleProfileQuery): Promise<GetStyleProfileResponse> {
    const profile = await this.prisma.styleProfile.findUnique({
      where: { userId },
    });
    return StyleProfileResponse.from(profile);
  }
}
