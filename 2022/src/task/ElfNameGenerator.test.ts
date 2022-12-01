import ElfNameGenerator, { ELF_NAMES } from "./ElfNameGenerator"

describe('Elf name generator', () => {
    test('random elf name to run', () => {
        expect(ElfNameGenerator.getRandomElfName()).toBeDefined()
    })

    it.each(getElfNames())('elf name %p to be the %p elf name', (index: number, name: string) => {
        expect(ElfNameGenerator.getElfNameByIndex(index)).toBe(name)
    })

    function getElfNames(): Array<[number, string]> {
        const testingValues: Array<[number, string]> = []

        testingValues.push([-1, ELF_NAMES[0]])
        ELF_NAMES.forEach((name, index) => testingValues.push([index, name]))
        ELF_NAMES.slice().forEach((name, index) => {
            testingValues.push([index + ELF_NAMES.length, name])
            testingValues.push([index + ELF_NAMES.length * 2, name])
        })

        return testingValues.sort((first, second) => first[0] - second[0])
    }
})