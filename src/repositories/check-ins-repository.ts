import { CheckIn, Prisma } from '@prisma/client'

export interface CheckInsRepository {
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>

  findByUserIdOnDate(user_id: string, date: Date): Promise<CheckIn | null>

  findManyByUserId(user_id: string, page: number): Promise<CheckIn[]>

  countByUserId(user_id: string): Promise<number>

  findById(id: string): Promise<CheckIn | null>

  save(data: CheckIn): Promise<CheckIn>
}
