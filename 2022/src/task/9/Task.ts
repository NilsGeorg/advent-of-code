import { AbstractTask, Solution } from "../AbstractTask";

export class Task extends AbstractTask {
    private lastDirection = ''
    private visitedCoordinates: Array<Coordinate> = [new Coordinate(1, 1)]

    public solve(): Error | Solution {
        const data = this.getInputAsArray(__dirname)
        if (data instanceof Error) {
            return data
        }

        const one = this.solveOne(data, 1)
        const two = this.solveOne(data, 9)

        return [one, two]
    }

    private solveOne(data: string[], tailsLength: number): number {
        const mapped = data.map(item => item.split(' '))
        let head = new Coordinate(1, 1)
        let tail: Array<Coordinate> = []
        for (let i = 0; i < tailsLength; i++) {
            tail.push(new Coordinate(1, 1))
        }

        mapped.forEach(item => {
            [head, tail] = this.doStep2(item[0], Number(item[1]), head, tail)
        })

        return this.visitedCoordinates.reduce((acc, item) => {
            for (let i = 0; i < acc.length; i++) {
                if (acc[i].x === item.x && acc[i].y === item.y) {
                    return acc
                }
            }
            acc.push(item)
            return acc
        }, new Array<Coordinate>).length
    }

    private doStep2 = (direction: string, amount: number, head: Coordinate, tail: Array<Coordinate>,): [Coordinate, Array<Coordinate>] => {
        for (let i = 1; i <= amount; i++) {
            switch (direction) {
                case 'R':
                    head.x += 1
                    break
                case 'L':
                    head.x -= 1
                    break
                case 'U':
                    head.y += 1
                    break
                case 'D':
                    head.y -= 1
                    break
            }

            tail.forEach((item, index, array) => {
                if (index === 0) {
                    item = this.mt(head, item)
                } else {
                    item = this.mt(array[index - 1], item)
                }
            })
            // tail = this.mt(direction, head, tail)
        }

        return [head, tail]
    }


    private mt = (head: Coordinate, tail: Coordinate): Coordinate => {
        if (this.isInRange(head, tail)) {
            return tail
        }

        if (this.isOnTopOf(head, tail)) {
            return tail
        }

        if (this.isDiagonal(head, tail)) {
            this.moveDiagonal(head, tail)
        } else {
            this.moveStraight(head, tail)
        }

        this.visitedCoordinates.push({ ...tail })
        return tail
    }

    private moveDiagonal(head: Coordinate, tail: Coordinate) {
        // top left
        if (head.x < tail.x && head.y > tail.y) {
            tail.x -= 1
            tail.y += 1
        }

        // top right
        if (head.x > tail.x && head.y > tail.y) {
            tail.x += 1
            tail.y += 1
        }

        // bottom left
        if (head.x < tail.x && head.y < tail.y) {
            tail.x -= 1
            tail.y -= 1
        }

        // bottom right
        if (head.x > tail.x && head.y < tail.y) {
            tail.x += 1;
            tail.y -= 1;
        }
    }

    private moveStraight(head: Coordinate, tail: Coordinate) {
        if (head.x !== tail.x) {
            if (head.x > tail.x) {
                tail.x = head.x - 1
            } else {
                tail.x = head.x + 1
            }
        }

        if (head.y !== tail.y) {
            if (head.y > tail.y) {
                tail.y = head.y - 1
            } else {
                tail.y = head.y + 1
            }
        }
    }

    private isDiagonal(head: Coordinate, tail: Coordinate): boolean {
        if (head.x !== tail.x && head.y !== tail.y) {
            return true
        }

        return false
    }

    private isInRange(head: Coordinate, tail: Coordinate): boolean {
        for (let x = -1; x < 2; x++) {
            for (let y = -1; y < 2; y++) {
                const tmpX = tail.x + x
                const tmpY = tail.y + y

                if (head.x === tmpX && head.y === tmpY) {
                    return true
                }
            }
        }

        return false
    }

    private isOnTopOf(head: Coordinate, tail: Coordinate): boolean {
        if (head.x === tail.x && head.y === head.y) {
            return true
        }

        return false
    }
}

class Coordinate {
    x: number = 0
    y: number = 0

    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }
}