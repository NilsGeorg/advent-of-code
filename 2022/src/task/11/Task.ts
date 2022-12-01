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

    private solveOne = (data: string[]): number => this.do(this.returnToMonkey(data), 20)

    private solveTwo = (data: string[]): number => {
        const monkeys = this.returnToMonkey(data)
        
        const mod = monkeys.reduce((a, b) => a * b.getTest(), 1);
        monkeys.forEach(monkey => monkey.setMod(mod))

        return this.do(monkeys, 10_000)
    }

    private do = (monkeys: Monkey[], amountRounds: number): number => {
        for (let i = 0; i < amountRounds; i++) {
            this.doRound(monkeys,)
        }

        return monkeys
            .slice()
            .map(item => item.getInspectedItems())
            .sort((a, b) => b - a)
            .slice(0, 2)
            .reduce((acc, val) => acc * val)
    }

    private doRound = (monkeys: Monkey[]) => {
        monkeys.forEach((monkey, _, monkeyList) => {
            while (monkey.hasItems()) {
                const item = monkey.getFirstItem()
                const roundResult = monkey.doRound(item)
                monkeyList[roundResult[0]].addItem(roundResult[1])
            }
        })
    }

    private returnToMonkey = (data: string[]): Monkey[] => {
        const monkeys = data
            .slice()
            .filter(item => item)
            .filter(item => !item.toLowerCase().startsWith('monkey'))
            .map(item => item.split(':')[1].trim())
            .reduce((acc, item, index) => {
                const chunkIndex = Math.floor(index / 5)
                if (!acc[chunkIndex]) {
                    acc[chunkIndex] = []
                }

                acc[chunkIndex].push(item)

                return acc
            }, new Array<Array<string>>())
            .map((item) => new Monkey(item))

        return monkeys
    }
}

class Monkey {
    private operation: string
    private items: number[] = []
    private inspectedItems: number = 0
    private test: number
    private result: [number, number]
    private mod = -1

    constructor(input: string[]) {
        this.items = input[0].trim().split(',').map(item => Number(item.trim()))
        this.operation = input[1].replace('new', 'opResult')
        this.test = Number(input[2].trim().split(' ')[2])
        this.result = [this.getResult(input[3]), this.getResult(input[4])]
    }

    public doRound = (old: number): [number, number] => {
        this.inspectedItems++

        let opResult = 0
        eval(this.operation)

        if (this.mod === -1) {
            opResult = Math.floor(opResult / 3)
        } else {
            opResult = opResult % this.mod
        }

        return [this.nextMonkey(opResult), opResult]
    }

    public hasItems = (): boolean => this.items.length > 0
    public getFirstItem = (): number => this.items.splice(0, 1)[0]
    public addItem = (item: number) => this.items.push(item)
    public getInspectedItems = (): number => this.inspectedItems
    public setMod = (mod: number) => this.mod = mod
    public getTest = () => this.test

    private nextMonkey = (value: number): number => value % this.test === 0 ? this.result[0] : this.result[1]
    private getResult = (input: string): number => Number(input.trim().split(' ')[3])
}