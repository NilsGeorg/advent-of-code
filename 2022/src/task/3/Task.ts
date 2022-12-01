import { AbstractTask, Solution } from "../AbstractTask";

export class Task extends AbstractTask {
    public solve(): Solution | Error {
        const data = this.getInputAsArray(__dirname)
        if (data instanceof Error) {
            return data
        }

        const one = this.solveOne(data)
        const two = this.solveTwo(data)

        return [one, two]
    }

    private solveOne(data: Array<string>): number {
        return data
            .map((item) => this.createBackpack(item))
            .map(([first, second]) => [...first, ...second]
                .filter((value, index, array) => array.indexOf(value) !== index))
            .flatMap(value => value)
            .reduce((accumulator, char) => accumulator + this.getValue(char), 0)
    }

    private solveTwo(data: Array<string>): number {
        return this.createGroups(data)
            .map(([first, second, third]) => {
                const duplicates = [...first, ...second]
                    .filter((value, index, array) => array.indexOf(value) !== index)

                return [...duplicates, ...third].filter((value, index, array) => array.indexOf(value) !== index)
            })
            .flatMap(value => value)
            .reduce((accumulator, char) => accumulator + this.getValue(char), 0)
    }

    private createBackpack(input: string): Backpack {
        const charArray = [...input]
        const chunkSize: number = charArray.length / 2

        const firstChunk = new Set(input.slice(0, chunkSize))
        const secondChunk = new Set(input.slice(chunkSize))

        return [firstChunk, secondChunk]
    }

    private createGroups(data: Array<string>): Array<Group> {
        const chunkSize = 3
        let nextChunk = 0
        const chunkHolder = data.slice()

        const groups: Array<Group> = []
        while (chunkHolder.length > 0) {
            const chunk = chunkHolder
                .splice(0, chunkSize)
                .map(item => [...new Set([...item])].reduce((acc, value) => acc.concat(value), ''))

            groups.push([chunk[0], chunk[1], chunk[2]])

            nextChunk += chunkSize
        }

        return groups
    }

    private getValue(char: string): number {
        // A = 65, Z = 90
        // a = 97, z = 122
        const charIndex = char.charCodeAt(0)

        if (charIndex > 91) {
            return charIndex - 96
        } else {
            return charIndex - 64 + 26
        }
    }
}

type Backpack = [Set<string>, Set<string>]
type Group = [string, string, string]

