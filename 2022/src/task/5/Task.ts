import { AbstractTask, Solution } from "../AbstractTask";

export class Task extends AbstractTask {
    public solve(): Solution | Error {
        const data = this.getInputAsArray(__dirname)
        if (data instanceof Error) {
            return data
        }

        const one = this.solvePuzzle(data, false)
        const two = this.solvePuzzle(data, true)

        return [one, two]
    }

    private solvePuzzle(data: Array<string>, isCrane9001: boolean): string {
        const [crates, steps] = this.mapData(data)

        steps.forEach(([moves, start, end]) => {
            const movingCrates = crates[start].splice(0, moves)

            if (!isCrane9001) {
                movingCrates.reverse()
            }

            crates[end].splice(0, 0, ...movingCrates)
        })

        const result = crates.map(item => item[0]).join('')

        return result
    }


    private mapData(data: Array<string>): [Crates, Array<Step>] {
        const indexOfEmptyLine = data.findIndex((value) => !value)

        let crates = data
            .slice(0, indexOfEmptyLine - 1)
            .map((value) => this.createCrateRow(value))

        const steps: Array<Step> = data.slice(indexOfEmptyLine)
            .filter(item => item)
            .map(item => item
                .replace('move ', '')
                .replace('from ', '')
                .replace('to ', '')
                .split(' ')
                .map(value => Number(value)))
            .map(item => [item[0], item[1] - 1, item[2] - 1])

        crates = crates[0].map((_, c) => crates.map((_, r) => crates[r][c]))
        crates = crates.map(item => item.filter(value => value))

        return [crates, steps]
    }

    private createCrateRow(value: string) {
        const chunkSize = 3
        const emptySpace = 1
        let nextChunk = 0

        const crateRow: Array<string> = []
        while (nextChunk <= value.length) {
            const tmp = value.substring(nextChunk, nextChunk + chunkSize)

            crateRow.push(tmp.replaceAll('[', '').replaceAll(']', '').trim())

            nextChunk += (chunkSize + emptySpace)
        }

        return crateRow
    }

}

type Crates = Array<Array<string>>
type Step = [number, number, number]