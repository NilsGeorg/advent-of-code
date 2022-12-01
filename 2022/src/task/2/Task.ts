import { Solution, AbstractTask } from "../AbstractTask";

export class Task extends AbstractTask {
    public solve(): Solution | Error {
        const data = this.getInputAsArray(__dirname)
        if (data instanceof Error) {
            return data as Error
        }

        const one = this.solveOne(data)
        if (one instanceof Error) {
            return one as Error
        }

        const two = this.solveTwo(data)
        if (two instanceof Error) {
            return two as Error
        }

        return [one, two]
    }

    private solveOne(data: Array<string>): number | Error {
        const rounds = this.mapDataToRound(data, false)
        if (rounds instanceof Error) {
            return rounds as Error
        }

        const points = this.calculatePoints(rounds)
        console.debug(`You won with ${points}`)

        return points
    }

    private solveTwo(data: Array<string>): number | Error {
        const rounds = this.mapDataToRound(data, true)
        if (rounds instanceof Error) {
            return rounds as Error
        }


        const points = this.calculatePoints(rounds)
        console.debug(`You won with ${points}`)

        return points
    }

    private calculatePoints(rounds: Array<Round>) {
        return rounds.reduce((accumulator, round) => accumulator + round.getPoints(), 0)
    }

    private mapDataToRound(data: Array<string>, useResult: boolean = false): Array<Round> | Error {
        const rounds: Array<Round> = []
        for (const item of data) {
            if (!item) {
                continue
            }

            const splitItem = item.split(' ')
            if (splitItem.length !== 2) {
                return Error('Invalid amount of inputs!')
            }

            const round: Round = this.createRound(splitItem[0], splitItem[1], useResult)
            rounds.push(round)
        }

        return rounds
    }

    private createRound(inputA: string, inputB: string, useResult: boolean) {
        if (useResult) {
            return new Round(inputA, '', inputB)
        } else {
            return new Round(inputA, inputB)
        }
    }
}

enum Result {
    Win = 6,
    Draw = 3,
    Lose = 0
}

class OptionFactory {
    static getOptionInstance(input: string): Option {
        switch (input) {
            case 'A':
            case 'X':
                return new Rock()
            case 'B':
            case 'Y':
                return new Paper()
            case 'C':
            case 'Z':
                return new Scissors()
            default:
                throw new Error('Invalid input!')
        }
    }
}

interface Option {
    readonly value: number
    play(opponent: Option): Result
    calculate(result: Result): Option
}

class Rock implements Option {
    readonly value = 1
    play(opponent: Option): Result {
        switch (opponent.constructor) {
            case Rock:
                return Result.Draw
            case Paper:
                return Result.Lose
            case Scissors:
                return Result.Win
            default:
                throw new Error("Invalid Option!")
        }
    }
    calculate(opponentResult: Result): Option {
        switch (opponentResult) {
            case Result.Win:
                return new Paper()
            case Result.Draw:
                return new Rock()
            case Result.Lose:
                return new Scissors()
            default:
                throw new Error("Invalid Result!")
        }
    }
}

class Paper implements Option {
    readonly value: number = 2
    play(opponent: Option): Result {
        switch (opponent.constructor) {
            case Rock:
                return Result.Win
            case Paper:
                return Result.Draw
            case Scissors:
                return Result.Lose
            default:
                throw new Error("Invalid Option!")
        }
    }
    calculate(opponentResult: Result): Option {
        switch (opponentResult) {
            case Result.Win:
                return new Scissors()
            case Result.Draw:
                return new Paper()
            case Result.Lose:
                return new Rock()
            default:
                throw new Error("Invalid Result!")
        }
    }
}

class Scissors implements Option {
    readonly value: number = 3
    play(opponent: Option): Result {
        switch (opponent.constructor) {
            case Rock:
                return Result.Lose
            case Paper:
                return Result.Win
            case Scissors:
                return Result.Draw
            default:
                throw new Error("Invalid Option!")
        }
    }
    calculate(opponentResult: Result): Option {
        switch (opponentResult) {
            case Result.Lose:
                return new Paper()
            case Result.Draw:
                return new Scissors()
            case Result.Win:
                return new Rock()
            default:
                throw new Error("Invalid Result!")
        }
    }
}

class Round {
    private opponent: Option
    private you: Option
    private result: Result
    private points: number

    // TODO: This could take an interface instead of all this params
    constructor(opponent: string, you: string = '', result: string = '') {
        this.opponent = OptionFactory.getOptionInstance(opponent)

        if (!result && !you) {
            throw Error('You need either a correct result or input')
        } else if (!result) {
            this.you = OptionFactory.getOptionInstance(you)
        } else {
            this.you = this.opponent.calculate(this.getResultFromInput(result))
        }

        this.result = this.you.play(this.opponent)
        this.points = this.you.value + this.result.valueOf()
    }

    // TODO: Could be a factory
    private getResultFromInput(input: string): Result {
        switch (input) {
            case 'X':
                return Result.Lose
            case 'Y':
                return Result.Draw
            case 'Z':
                return Result.Win
            default:
                throw new Error("Invalid Result!")
        }
    }

    public getPoints = (): number => this.points
}