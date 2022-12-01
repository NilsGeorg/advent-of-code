import { AbstractTask } from "./task/AbstractTask"
import { FileReader } from "./task/FileReaderService"
import { TaskFactory } from "./task/TaskStore"

class App {
    private readonly lastTask: number = 9
    private readonly firstTask: number = this.lastTask
    // private readonly firstTask: number = 1

    public start() {
        console.log('Start the Advent of Code!')

        this.createTasks().forEach((task, index) => {
            const result = task.solve()
            const taskNumber = index + 1

            if (result instanceof Error) {
                console.error(`Something went wrong on Task ${taskNumber}...`, result)
            } else {
                console.log(`Task ${taskNumber} Solution: ${result.toString()}`)
            }
        })
    }

    private createTasks() {
        const fileReader = new FileReader()
        const tasks: Array<AbstractTask> = []

        for (let i = this.firstTask; i <= this.lastTask; i++) {
            tasks.push(TaskFactory.createFromNumber(i, fileReader))
        }

        return tasks
    }
}

export default new App()