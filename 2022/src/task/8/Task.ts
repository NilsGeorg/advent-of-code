import { AbstractTask, Solution } from "../AbstractTask";

export class Task extends AbstractTask {
    public solve = (): Solution | Error => {
        const data = this.getInputAsArray(__dirname)
        if (data instanceof Error) {
            return data
        }

        const convertedData = data
            .map(item => [...item]
                .map(value => Number(value)))

        const one = this.solveOne(convertedData)
        const two = this.solveTwo(convertedData)

        return [one, two]
    }

    private solveOne = (data: Array<Array<number>>): number => {
        let visibleTrees = 0
        for (let i = 1; i < data.length - 1; i++) {
            for (let j = 1; j < data.length - 1; j++) {
                const tree = Number(data[i][j])

                const isHiddenLeft = data[i]
                    .slice(0, j)
                    .some(val => this.isHidden(tree, val))
                const isHiddenRight = data[i]
                    .slice(j + 1)
                    .some(val => this.isHidden(tree, val))
                const isHiddenTop = data
                    .slice(0, i)
                    .some(val => this.isHidden(tree, val[j]))
                const isHiddenBottom = data
                    .slice(i + 1)
                    .some(val => this.isHidden(tree, val[j]))

                if (!isHiddenLeft || !isHiddenRight || !isHiddenTop || !isHiddenBottom) {
                    visibleTrees++
                }
            }
        }

        return visibleTrees + (data.length + data[0].length) * 2 - 4
    }

    private solveTwo = (data: Array<Array<number>>): number => {
        let highestScenicScore = 0
        for (let i = 1; i < data.length - 1; i++) {
            for (let j = 1; j < data.length - 1; j++) {
                const tree = Number(data[i][j])

                const left = this.getDistanceLeft(data[i], j, tree)
                const right = this.getDistanceRight(data[i], j, tree)
                const top = this.getDistanceTop(data, i, j, tree)
                const bottom = this.getDistanceBottom(data, i, j, tree)

                const scenicScore = left * right * top * bottom
                if (scenicScore > highestScenicScore) {
                    highestScenicScore = scenicScore
                }
            }
        }

        return highestScenicScore
    }

    private getDistanceLeft = (data: Array<number>, index: number, tree: number): number =>
        this.getHorizontalDistance(data.slice(0, index).reverse(), tree)

    private getDistanceRight = (data: Array<number>, index: number, tree: number) =>
        this.getHorizontalDistance(data.slice(index + 1), tree)

    private getHorizontalDistance = (data: Array<number>, tree: number) =>
        this.getDistance(data.findIndex(val => this.isBlocking(val, tree)), data.length)

    private getDistanceTop = (data: Array<Array<number>>, index: number, position: number, tree: number) =>
        this.getVerticalDistance(data.slice(0, index).reverse(), position, tree)

    private getDistanceBottom = (data: Array<Array<number>>, index: number, position: number, tree: number) =>
        this.getVerticalDistance(data.slice(index + 1), position, tree)

    private getVerticalDistance = (data: Array<Array<number>>, position: number, tree: number) =>
        this.getDistance(data.findIndex(val => this.isBlocking(val[position], tree)), data.length)

    private getDistance = (distance: number, length: number) => distance > -1 ? distance + 1 : length
    private isHidden = (first: number, second: number) => first <= second
    private isBlocking = (first: number, second: number) => first >= second
} 