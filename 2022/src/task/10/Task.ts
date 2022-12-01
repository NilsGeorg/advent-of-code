import { AbstractTask, Solution } from "../AbstractTask";

export class Task extends AbstractTask {
    private signalStrength = 0
    private lastSignalCalculation = 0

    public solve(): Solution | Error {
        const data = this.getInputAsArray(__dirname)
        if (data instanceof Error) {
            return data
        }

        const one = this.solveOne(data)

        return [one, 0]
    }

    private solveOne = (data: string[]): number => {
        let cycle = 0
        let register = 1
        const pixelValue: number[] = []

        data.forEach((item) => {
            this.calculateSignalStrength(register, ++cycle)
            pixelValue.push(register)

            if (this.isAddx(item)) {
                this.calculateSignalStrength(register, ++cycle)
                pixelValue.push(register)

                register += Number(item.split(' ')[1])
            }
        })

        this.print(pixelValue)

        return this.signalStrength
    }

    private calculateSignalStrength = (value: number, cycle: number) => {
        if (cycle === 20 || this.lastSignalCalculation + 40 === cycle) {
            this.lastSignalCalculation = cycle
            this.signalStrength += cycle * value
        }
    }

    private print(pixelValue: number[]) {
        const pixels = pixelValue.map((item, index) => Math.abs(item - (index % 40)) < 2 ? '#' : '.')
        const crt: string[] = []

        while (pixels.length) {
            crt.push(pixels.splice(0, 40).join(''))
        }

        console.info(crt.join('\n'))
    }

    private isAddx = (input: string) => input.startsWith('addx')
}

