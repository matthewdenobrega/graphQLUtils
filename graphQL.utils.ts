export interface EnumValue {
    enumValue: string
}

export class GraphQLUtils {
    static createMutation(data: Object, dataDefinition: Object, method: string, mutationName?: string): string {
        if (!method || !data) { return null }

        let mutation: string = (mutationName || method) + '{' + method

        mutation += '(' + GraphQLUtils.flattenObject(data) + ')'

        mutation += GraphQLUtils.processDataDefinition(dataDefinition || data) + '}'

        return mutation
    }

    static createQuery(dataDefinition: Object, method: string, parameters: Object, queryName?: string): string {
        if (!method || !dataDefinition) { return null }

        let query: string = 'query ' + (queryName || method) + '{' + method

        if (parameters && Object.keys(parameters).length) {
            query += '(' + GraphQLUtils.flattenObject(parameters) + ')'
        }

        query += GraphQLUtils.processDataDefinition(dataDefinition) + '}'

        return query
    }

    private static processDataDefinition(dataDefinition: Object): string {
        if (!dataDefinition) { return '' }

        let query: string = ''

        let keys: string[] = Object.keys(dataDefinition)
        keys.forEach((key: string, index: number) => {
            if (!index) { query += '{' }

            query += key

            if (dataDefinition[key] instanceof Array && dataDefinition[key].length) {
                query += GraphQLUtils.processDataDefinition(dataDefinition[key][0])
            } else if (dataDefinition[key] instanceof Object) {
                query += GraphQLUtils.processDataDefinition(dataDefinition[key])
            }

            if (index === (keys.length - 1)) {
                query += '}'
            } else {
                query += ','
            }
        })

        return query
    }

    private static flattenObject(object: Object): string {
        return Object.keys(object || {}).reduce((array: any[], key: string) => {
            if (!this.isBlank(object[key])) { array.push(key + ':' + GraphQLUtils.processValue(object[key])) }

            return array
        }, []).join(',')
    }

    private static isArray(input: any): boolean {
        return Array.isArray(input)
    }

    private static isBlank(input: any): boolean {
        return input === undefined || input === null
    }

    private static isString(input: any): boolean {
        return typeof input === 'string'
    }

    private static isStringMap(input: any): boolean {
        return typeof input === 'object' && input !== null
    }

    private static processValue(value: any): string {
        if (this.isBlank(value)) { return '' }

        if (this.isString(value)) { return '"' + value.replace(/"/g, '\\"') + '"' }

        if (this.isArray(value)) {
            let arrayString: string = '['

            value.forEach((valueInArray: any, index: number) => {
                arrayString += GraphQLUtils.processValue(valueInArray)
                if (index !== value.length - 1) { arrayString += ',' }
            })

            arrayString += ']'

            return arrayString
        }

        if (this.isStringMap(value)) {
            if (value['enumValue']) { // Special handling for enums - need to be prepared when mutation is created
                return (<EnumValue>value).enumValue
            }
            let objectString: string = '{'

            let keys: string[] = Object.keys(value)
            keys.forEach((key: string, index: number) => {
                objectString += key + ':' + GraphQLUtils.processValue(value[key])
                if (index !== keys.length - 1) { objectString += ',' }
            })

            objectString += '}'

            return objectString
        }

        return value.toString()
    }
}