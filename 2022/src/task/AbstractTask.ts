import { FileReader } from "./FileReaderService"

export abstract class AbstractTask {
    public abstract solve(): Solution | Error

    protected fileReader: FileReader

    constructor(fileReader: FileReader) {
        this.fileReader = fileReader
    }

    protected getInputAsArray(dirname: string, separator: string = '\n'): Array<string> | Error {
        const data = this.fileReader.readInput(dirname)
        if (data instanceof Error) {
            return data
        }

        return data.toString().split(separator)
    }
}

export type Solution = [any, any]