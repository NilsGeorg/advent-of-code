import ElfNamesGenerator from "../ElfNameGenerator";
import { AbstractTask, Solution } from "../AbstractTask";

export class Task extends AbstractTask {
    public solve(): Solution | Error {
        const data = this.getInputAsArray(__dirname)
        if (data instanceof Error) {
            return data
        }

        const elves: Array<Elf> = this.mapDataToElves(data)

        if (elves.length < 1) {
            return Error("Something went wrong. Found no elves :(")
        }

        const one = this.partOne(elves)
        const two = this.partTwo(elves)

        return [one, two]
    }

    private partOne(elves: Array<Elf>): number {
        const topElf = elves.slice().sort((first, second) => second.totalCalories - first.totalCalories)[0]

        console.debug(`${topElf.name} is the elf carrying the most calories (${topElf.totalCalories})`)

        return topElf.totalCalories
    }

    private partTwo(elves: Array<Elf>): number {
        const topThreeElves = elves
            .slice()
            .sort((first, second) => second.totalCalories - first.totalCalories)
            .slice(0, 3)

        const topThreeTotal = topThreeElves.reduce((accumulator, elf) => accumulator + elf.totalCalories, 0)
        const topThree = topThreeElves.map(elf => `${elf.name} (${elf.totalCalories})`).join(', ')

        console.debug(`The top three calories carrying elves with a total of ${topThreeTotal} are ${topThree}`)

        return topThreeTotal
    }

    private mapDataToElves(data: Array<string>): Array<Elf> {
        const elves: Array<Elf> = []
        let stack: Array<number> = []

        data.forEach(item => {
            const itemAsNumber = parseInt(item)
            if (isNaN(itemAsNumber)) {
                const elfName = ElfNamesGenerator.getElfNameByIndex(elves.length)
                const elf = new Elf(elfName, stack)
                elves.push(elf)
                stack = []
            } else {
                stack.push(itemAsNumber)
            }
        })

        return elves
    }
}

class Elf {
    public name: String
    public calories: Array<number>
    public totalCalories: number

    constructor(name: String, calories: Array<number>) {
        this.name = name
        this.calories = calories
        this.totalCalories = calories.reduce((accumulator, calorieValue) => accumulator + calorieValue, 0)
    }
}
