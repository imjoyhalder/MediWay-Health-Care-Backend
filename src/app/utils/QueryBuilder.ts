import { IQueryConfig, IQueryParams, PrismaCountArgs, PrismaDelegate, PrismaFindManyArgs } from "../interfaces/query.interface"

// T - type of model
export class QueryBuilder <
T, 
TWhereInput = Record<string, unknown>,
TInclude = Record<string, unknown>>{ 
    private query: PrismaFindManyArgs
    private countQuery: PrismaCountArgs
    private page: number = 1
    private limit: number = 10 
    private skip: number = 0
    private sortBy: string = 'createdAt'
    private sortOrder: 'asc' | 'desc' = 'desc'
    private selectFields: Record<string, boolean | undefined>

    constructor(
        private model: PrismaDelegate, 
        private queryParams: IQueryParams, 
        private config: IQueryConfig
    ){
        this.query = {
            where: {},
            include: {},
            orderBy: {},
            select: {},
            skip: 0,
            take: 10,
        }
        this.countQuery = {
            where: {},
        }
        // this.selectFields = {}
    }
}