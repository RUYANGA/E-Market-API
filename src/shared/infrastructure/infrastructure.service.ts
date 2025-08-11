import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";


import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class InfrastructureService {
  constructor(
    private prisma: PrismaService,

  ) {}

  async checkRecordExists(model: string, id: string) {
    const record = await this.prisma[model].findUnique({ where: { id } });
    if (!record) {
      throw new NotFoundException(`${model} with id ${id} not found`);
    }
    return record;
  }

  async checkDuplicate(model: string, fields: { property: string; value: any }[]) {
    for (const field of fields) {
      const record = await this.prisma[model].findFirst({
        where: { [field.property]: field.value },
      });
      if (record) {
        throw new ConflictException(
          `${model} with ${field.property} '${field.value}' already exists`
        );
      }
    }
  }

  generatePaginationMeta(total: number, page: number, limit: number, baseUrl: string) {
    const totalPages = Math.ceil(total / limit);
    return {
      pagination: {
        total,
        count: Math.min(limit, total - (page - 1) * limit),
        perPage: limit,
        currentPage: page,
        totalPages,
        links: {
          first: `${baseUrl}?page=1&limit=${limit}`,
          last: `${baseUrl}?page=${totalPages}&limit=${limit}`,
          prev: page > 1 ? `${baseUrl}?page=${page - 1}&limit=${limit}` : null,
          next: page < totalPages ? `${baseUrl}?page=${page + 1}&limit=${limit}` : null,
        },
      },
    };
  }
}
