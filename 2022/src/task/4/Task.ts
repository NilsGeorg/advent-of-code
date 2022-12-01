import { toNamespacedPath } from "path";
import { AbstractTask, Solution } from "../AbstractTask";

export class Task extends AbstractTask {
    public solve(): Solution | Error {
        const data = this.getInputAsArray(__dirname)
        if (data instanceof Error) {
            return data
        }

        const assignments = this.mapToAssignments(data)

        const one = this.solveOne(assignments)
        const two = this.solveTwo(assignments)

        return [one, two]
    }

    private solveOne(assignments: Array<Assignment>): number {
        return assignments
            .map(([first, second]) => this.isIn(first, second) || this.isIn(second, first))
            .filter(item => item)
            .length
    }

    private solveTwo(assignments: Assignment[]) {
        return assignments
        .map(([first, second]) => this.isOverlapping(first, second) || this.isOverlapping(second, first))
        .filter(item => item)
        .length
    }

    private mapToAssignments(data: Array<string>): Array<Assignment> {
        const sectionList: Array<Array<Section>> = data
            .map((item) => item
                .split(',')
                .map((value) => {
                    const tmp = value.split('-')
                    return [Number(tmp[0]), Number(tmp[1])]
                }))

        return sectionList.map((item) => [item[0], item[1]])
    }

    private isIn(first: Section, second: Section): boolean {
        return first[0] >= second[0] && first[1] <= second[1]
    }

    private isOverlapping(first: Section, second: Section): boolean {
        return (first[0] >= second[0] && first[0] <= second[1]) || (first[1] >= second[0] && first[1] <= second[1])
    }

}

type Assignment = [Section, Section]
type Section = [number, number]