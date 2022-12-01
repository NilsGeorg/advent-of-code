import { AbstractTask, Solution } from "../AbstractTask";

export class Task extends AbstractTask {
    public solve(): Solution | Error {
        const data = this.fileReader.readInput(__dirname)
        if (data instanceof Error) {
            return data
        }

        const one = this.solvePuzzle(data, 4)
        const two = this.solvePuzzle(data, 14)

        return [one, two]
    }

    private solvePuzzle(input: string, len: number): number {
        const uniqueChars = []
        for (let i = 0; i < input.length; i++) {
            const tmp = input[i]

            uniqueChars.push(tmp)
            uniqueChars.splice(0, uniqueChars.length - len)

            if (new Set(uniqueChars).size === len) {
                return i + 1
            }
        }

        return -1
    }
}