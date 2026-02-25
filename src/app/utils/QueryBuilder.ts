import { Keys } from './../../generated/prisma/internal/prismaNamespace';
import { object } from "zod"
import { Prisma } from "../../generated/prisma/browser"
import { IQueryConfig, IQueryParams, PrismaCountArgs, PrismaDelegate, PrismaFindManyArgs, PrismaQueryFilter, PrismaStringFilter, PrismaWhereConditions } from "../interfaces/query.interface"

// T - type of model
export class QueryBuilder<
    T,
    TWhereInput = Record<string, unknown>,
    TInclude = Record<string, unknown>> {
    private query: PrismaFindManyArgs
    private countQuery: PrismaCountArgs
    private page: number = 1
    private limit: number = 10
    private skip: number = 0
    private sortBy: string = 'createdAt'
    private sortOrder: 'asc' | 'desc' = 'desc'
    private selectFields: Record<string, boolean | undefined | Record<string, unknown>> = {}

    constructor(
        private model: PrismaDelegate,
        private queryParams: IQueryParams,
        private config: IQueryConfig
    ) {
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
        search(): this{
            const { searchTerm } = this.queryParams
            const { searchableFields } = this.config

            if (searchTerm && searchableFields && searchableFields.length > 0) {
                const searchConditions: Record<string, unknown>[] =
                    searchableFields.map((field) => {
                        if (field.includes('.')) {
                            const parts = field.split('.')

                            if (parts.length === 2) {
                                const [relation, nestedField] = parts

                                const stringFilter: PrismaQueryFilter = {
                                    contains: searchTerm,
                                    mode: 'insensitive' as const,
                                }
                                return {
                                    [relation]: {
                                        [nestedField]: stringFilter
                                    }
                                }
                            }
                            else if (parts.length === 3) {
                                const [relation, nestedRelation, nestedField] = parts
                                const stringFilter: PrismaQueryFilter = {
                                    contains: searchTerm,
                                    mode: 'insensitive' as const,
                                }
                                return {
                                    [relation]: {
                                        [nestedRelation]: {
                                            [nestedField]: stringFilter
                                        }
                                    }
                                }
                            }

                        }
                        const stringFilter: PrismaStringFilter = {
                            contains: searchTerm,
                            mode: 'insensitive' as const,
                        }
                        return {
                            [field]: stringFilter
                        }
                    })
                const whereConditions = this.query.where as PrismaWhereConditions
                whereConditions.OR = searchConditions

                const countWhereConditions = this.countQuery.where as PrismaWhereConditions
                countWhereConditions.OR = searchConditions
            }

            return this;
        }
        filter(): this{
            const { filterableFields } = this.config
            const excludeFields = ['page', 'limit', 'sortBy', 'sortOrder', 'searchTerm', 'include', 'fields']

            const filterParams: Record<string, unknown> = {}
            object.Keys(this.queryParams).forEach((key) => {
                if (!excludeFields.includes(key)) {
                    filterParams[key] = this.queryParams[key]
                }
            })

            const queryWhere = this.query.where as Record<string, unknown>
            const countQueryWhere = this.countQuery.where as Record<string, unknown>

            object.Keys(filterParams).forEach((key) => {
                const value = filterParams[key]
                if(value===undefined || value === "" ){
                    return 
                }
                const isAllowedField = !filterableFields || filterableFields.length === 0 || filterableFields.includes(key)
                if(!isAllowedField){
                    return 
                }

                if(key.includes('.')){
                    const parts = key.split('.')

                    if(parts.length === 2){ 
                        const [relation, nestedField] = parts
                        queryWhere[relation] = {
                            [nestedField]: value
                        }

                        countQueryWhere[relation] = {
                            [nestedField]: value
                        }
                    }
                    else if(parts.length === 3){
                        const [relation, nestedRelation, nestedField] = parts
                        queryWhere[relation] = {
                            [nestedRelation]: {
                                [nestedField]: value
                            }
                        }

                        countWhere[relation] = {
                            [nestedRelation]: {
                                [nestedField]: value
                            }
                        }
                    }
                    else{
                        queryWhere[key] = value
                        countQueryWhere[key] = value
                    }
                }
                else{
                    queryWhere[key] = value; 
                    countQueryWhere[key] = value; 
                }
                
            })
            return this
        }
    }
}