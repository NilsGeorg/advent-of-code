import { Task as One } from "./1/Task"
import { Task as Two } from "./2/Task"
import { Task as Three } from "./3/Task"
import { Task as Four } from "./4/Task"
import { Task as Five } from "./5/Task"
import { Task as Six } from "./6/Task"
import { Task as Seven } from "./7/Task"
import { Task as Eight } from "./8/Task"
import { Task as Nine } from "./9/Task"
import { Task as Ten } from "./10/Task"
import { Task as Eleven } from "./11/Task"
import { AbstractTask } from "./AbstractTask"
import { FileReader } from "./FileReaderService"

export class TaskFactory {
    private static taskStore: any = { One, Two, Three, Four, Five, Six, Seven, Eight, Nine, Ten, Eleven }

    static create = (name: string, fileReader: FileReader): AbstractTask => {
        const task = this.taskStore[name]
        if (!task) {
            throw new Error(`No task with ${name} found!`)
        }

        return new task(fileReader)
    }

    static createFromNumber = (name: number, fileReader: FileReader): AbstractTask =>
        this.create(NumberToTextConverter.convert(name), fileReader)
}

/**
 * This is the yagni version of a text to number converter. Not great, not terrible. Never needs to go higher than number 24 (still can up to 29!)
 */
class NumberToTextConverter {
    private static smallFries = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']

    public static convert(input: number): string {
        if (input >= 30) {
            throw new Error('Numbers bigger 30 are not supported')
        }

        const twenty = 'Twenty'
        if (input < 20) {
            return this.smallFries[input]
        } else if (input === 20) {
            return twenty
        } else {
            return twenty + this.smallFries[input - 20]
        }
    }
}