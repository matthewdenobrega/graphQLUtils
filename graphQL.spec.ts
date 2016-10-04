import { GraphQLUtils } from './graphQL.utils'

describe('GraphQLUtils', () => {
    describe('createMutation', () => {
        it('should return null for null input', () => {
            expect(GraphQLUtils.createMutation(null, null, null)).toEqual(null)
            expect(GraphQLUtils.createMutation(null, '', null)).toEqual(null)
            expect(GraphQLUtils.createMutation({ id: null }, '', null)).toEqual(null)
        })

        it('should handle simple ojects', () => {
            let data: any = { name: 'Test course' }
            let expectedResult: string = 'createCourse{createCourse(name:"Test course"){name}}'

            expect(GraphQLUtils.createMutation(data, null, 'createCourse', null)).toEqual(expectedResult)
        })

        it('should handle simple ojects with a mutation name', () => {
            let data: any = { name: 'Test course' }
            let expectedResult: string = 'test{createCourse(name:"Test course"){name}}'

            expect(GraphQLUtils.createMutation(data, null, 'createCourse', 'test')).toEqual(expectedResult)
        })

        it('should handle encoded data', () => {
            let encryptedString: string = 'adyenjs_0_1_17$Ttsff8rFizRrKudpoy3POCELuy/aHCmyoA3mXoVl5I9QuZ83fyC3xXL8gU0tNvaJVTTSEILOuRa/eOTJMMMOuSWlV713PVgck8IrqtVW66vlU5vJyTgL4EXAIyLyUcUATxdYZ+8OnsIyfB5tM9V4oKsabfdPumhHn4thaUF4O8Aef6mddIuTAOYPbmDluWB7Z2/DNpoEgs4vNI8ddq7pK77G4RBgI2nKE0u/E79aQXZsMry5WZozwolp49gGfovleQtkoUQEEZBE1johB1B2WuIQ1uAW66APMhSNdN3AzFtudEd0MiBB46IHOD5l+qvilGxJTI4m1PzGeR7ABZIkjg==$3FMsoAmTpV9r0I8Xgdb0Zm3uI7+rI3+TNRrRp8BXzEXtEW0teiZvLxFfT/EQHwlB6VZBk2T7NTkNfQ0Z3136wHh3Lp4GRpA+4wESM9L1'
            let data: any = {
                adyenEncryptedData: encryptedString
            }
            let expectedResult: string = 'test{requestCardPayment(adyenEncryptedData:"' + encryptedString + '"){id}}'

            expect(GraphQLUtils.createMutation(data, { id: null }, 'requestCardPayment', 'test')).toEqual(expectedResult)
        })

        it('should handle simple objects with a data definition', () => {
            let data: any = { name: 'Test course' }
            let dataDefinition: any = { id: null, name: null }
            let expectedResult: string = 'test{createCourse(name:"Test course"){id,name}}'

            expect(GraphQLUtils.createMutation(data, dataDefinition, 'createCourse', 'test')).toEqual(expectedResult)
        })

        it('should automatically escape double quotes', () => {
            let data: any = { name: 'Test "course"' }
            let dataDefinition: any = { id: null, name: null }
            let expectedResult: string = 'test{createCourse(name:"Test \\"course\\""){id,name}}'

            expect(GraphQLUtils.createMutation(data, dataDefinition, 'createCourse', 'test')).toEqual(expectedResult)
        })

        it('should remove undefined values from mutations', () => {
            let data: any = { name: 'Test course', price: undefined }
            let dataDefinition: any = { id: null, name: null }
            let expectedResult: string = 'test{createCourse(name:"Test course"){id,name}}'

            expect(GraphQLUtils.createMutation(data, dataDefinition, 'createCourse', 'test')).toEqual(expectedResult)
        })

        it('should remove null values from mutations', () => {
            let data: any = { name: 'Test course', price: null }
            let dataDefinition: any = { id: null, name: null }
            let expectedResult: string = 'test{createCourse(name:"Test course"){id,name}}'

            expect(GraphQLUtils.createMutation(data, dataDefinition, 'createCourse', 'test')).toEqual(expectedResult)
        })

        it('should handle nested objects with a data definition', () => {
            let data: any = { name: 'Test course', question: { id: 1, name: 'test' } }
            let dataDefinition: any = { id: null, name: null }
            let expectedResult: string = 'test{createCourse(name:"Test course",question:{id:1,name:"test"}){id,name}}'

            expect(GraphQLUtils.createMutation(data, dataDefinition, 'createCourse', 'test')).toEqual(expectedResult)
        })

        it('should handle arrays nested within objects', () => {
            let data: any = { name: 'Test course', question: { content: [{ answer: 'answer1' }, { answer: 'answer2' }], id: 1 } }
            let dataDefinition: any = { id: null }
            let expectedResult: string = 'test{createCourse(name:"Test course",question:'
            expectedResult += '{content:[{answer:"answer1"},{answer:"answer2"}],id:1}){id}}'

            expect(GraphQLUtils.createMutation(data, dataDefinition, 'createCourse', 'test')).toEqual(expectedResult)
        })
    })

    describe('createQuery', () => {
        it('should return null for null input', () => {
            expect(GraphQLUtils.createQuery(null, null, null)).toEqual(null)
            expect(GraphQLUtils.createQuery(null, '', null)).toEqual(null)
            expect(GraphQLUtils.createQuery({ id: null }, '', null)).toEqual(null)
        })

        it('should handle simple objects', () => {
            let dataDefinition: any = { id: null, name: null }
            let expectedResult: string = 'query getCourse{getCourse{id,name}}'

            expect(GraphQLUtils.createQuery(dataDefinition, 'getCourse', null)).toEqual(expectedResult)
        })

        it('should handle simple objects with parameters', () => {
            let dataDefinition: any = { id: null, name: null }
            let expectedResult: string = 'query getCourse{getCourse(id:1){id,name}}'

            expect(GraphQLUtils.createQuery(dataDefinition, 'getCourse', { id: 1 })).toEqual(expectedResult)
        })

        it('should use the query name if there is one', () => {
            let dataDefinition: any = { id: null, name: null }
            let expectedResult: string = 'query test{getCourse(id:1){id,name}}'

            expect(GraphQLUtils.createQuery(dataDefinition, 'getCourse', { id: 1 }, 'test')).toEqual(expectedResult)
        })

        it('should handle nested objects', () => {
            let dataDefinition: any = { assessment: { id: null }, id: null, name: null }
            let expectedResult: string = 'query getCourse{getCourse{assessment{id},id,name}}'

            expect(GraphQLUtils.createQuery(dataDefinition, 'getCourse', null)).toEqual(expectedResult)
        })

        it('should handle nested arrays', () => {
            let dataDefinition: any = { assessments: [{ id: null }], id: null, name: null }
            let expectedResult: string = 'query getCourse{getCourse{assessments{id},id,name}}'

            expect(GraphQLUtils.createQuery(dataDefinition, 'getCourse', null)).toEqual(expectedResult)
        })

        it('should handle complex queries', () => {
            let dataDefinition: any = { assessments: [{ id: null }], id: null, name: null }
            let expectedResult: string = 'query searchCourses{searchCourses(take:100,text:""){assessments{id},id,name}}'

            expect(GraphQLUtils.createQuery(dataDefinition, 'searchCourses', { take: 100, text: '' })).toEqual(expectedResult)
        })
    })
})