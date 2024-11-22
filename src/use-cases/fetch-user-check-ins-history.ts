import { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '@/repositories/check-ins-repository'

interface FetchUserCheckInsHistoryUseCaseRequest {
  user_id: string
  page: number
}

interface FetchUserCheckInsHistoryResponse {
  checkIns: CheckIn[]
}

export class FetchUserCheckInsHistoryUseCase {
  constructor(private checkinsRepository: CheckInsRepository) {}

  async execute({
    user_id,
    page,
  }: FetchUserCheckInsHistoryUseCaseRequest): Promise<FetchUserCheckInsHistoryResponse> {
    const checkIns = await this.checkinsRepository.findManyByUserId(
      user_id,
      page,
    )

    return {
      checkIns,
    }
  }
}
