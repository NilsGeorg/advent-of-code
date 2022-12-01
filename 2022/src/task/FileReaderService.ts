import { readFileSync } from "fs"
import path from "path"

export class FileReader {
    readInput(dirname: string): string | Error {
        let data: string

        try {
            data = readFileSync(path.join(dirname, './input'), 'utf8')
        } catch (error: any) {
            return Error(error.toString())
        }

        return data
    }
}
