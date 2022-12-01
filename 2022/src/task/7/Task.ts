import { AbstractTask, Solution } from "../AbstractTask";
import { FileReader } from "../FileReaderService";

export class Task extends AbstractTask {

    public solve = (): Solution | Error => {
        const data = this.getInputAsArray(__dirname)
        if (data instanceof Error) {
            return data
        }

        const fs = new FileSystem(data)
        fs.cdRoot()
        const startDir = fs.cd('/')

        const folderSizes: Array<FolderSize> = this.getFolderSizes(startDir)

        const one = this.solveOne(folderSizes)
        const two = this.solveTwo(folderSizes)

        return [one, two]
    }

    private solveOne = (folderSizes: Array<FolderSize>): number => folderSizes
        .filter(([_, size]) => size <= 100_000)
        .reduce((acc, [_, size]) => acc + size, 0)


    private solveTwo = (folderSizes: Array<FolderSize>) => {
        const neededSpace = 30_000_000
        const maxSpace: number = 70_000_000
        const currentlyUsed = folderSizes[0][1]

        const possibleFolders = folderSizes
            .filter(([_, size]) => maxSpace - currentlyUsed + size > neededSpace)
            .map(([_, size]) => size)

        return Math.min(...possibleFolders)
    }

    private getFolderSizes = (dir: Dir, folders: Array<FolderSize> = []): Array<FolderSize> => {
        folders.push([dir.name, this.calculateFolderSize(dir)])
        dir.getFolders().forEach(folder => this.getFolderSizes(folder, folders))

        return folders
    }

    private calculateFolderSize = (dir: Dir): number => {
        let size = dir.getFiles().reduce((acc, nextVal) => acc + nextVal.size, 0)
        size += dir.getFolders().reduce((acc, nextVal) => acc + this.calculateFolderSize(nextVal), 0)

        return size
    }
}

class FileSystem {
    private stuff: Dir
    private currentPath: Array<string> = []

    constructor(data: Array<string>) {
        this.stuff = new Dir('root')
        this.stuff.addFolder(new Dir('/'))

        for (let i of data) {
            const exploded = i.split(' ')

            if (this.isCommand(exploded)) {
                if (i.includes('cd')) {
                    this.cd(exploded[exploded.length - 1])
                } else {
                    continue
                }
            } else if (this.isDir(exploded)) {
                this.mkdir(exploded[exploded.length - 1])
            } else {
                this.touch(exploded[1], exploded[0])
            }
        }

        this.cdRoot()
    }

    private getCurrentDir = () => {
        let dir = this.stuff
        this.currentPath.forEach((pathName) => {
            const tmpDir = dir.getFolder(pathName)
            if (!tmpDir) {
                throw new Error('dir not found')
            }

            dir = tmpDir
        })

        return dir
    }

    public cdRoot() {
        this.currentPath = []
    }

    public touch = (name: string, size: string): File => {
        const dir = this.getCurrentDir()

        const file = new File(name, Number(size))
        dir.addFile(file)

        return file
    }

    public mkdir = (newDir: string) => {
        const dir = this.getCurrentDir()
        const newFolder = new Dir(newDir)
        dir.addFolder(newFolder)
    }

    public cd = (nextPath: string): Dir => {
        if (nextPath === '..') {
            this.currentPath.pop()
            return this.getCurrentDir()
        }

        const dir = this.getCurrentDir()
        const nextDir = dir.getFolder(nextPath)

        if (!nextDir) {
            throw new Error(`Dir ${nextDir} not found!`)
        }

        this.currentPath.push(nextPath)
        return nextDir
    }

    public printFS = () => console.log(this.stuff.treeView())

    private isCommand = (input: Array<string>) => input[0] === '$'
    private isDir = (input: Array<string>) => input[0] === 'dir'
}

class File {
    readonly name: string
    readonly size: number

    constructor(name: string, size: number) {
        this.name = name
        this.size = size
    }
}

class Dir {
    private files: Array<File> = []
    private folders: Array<Dir> = []
    readonly name: string

    constructor(name: string) {
        this.name = name
    }

    public addFile = (file: File) => this.files.push(file)
    public getFile = (name: string): (File | undefined) => this.files.find(file => file.name === name)
    public getFiles = () => this.files.slice()
    public addFolder = (dir: Dir) => this.folders.push(dir)
    public getFolder = (name: string): (Dir | undefined) => this.folders.find(folder => folder.name === name)
    public getFolders = (): Array<Dir> => this.folders.slice()

    public treeView = (tab: string = ''): string => {
        let tree = this.getTreeItem(tab, `${this.name} (dir)`)
        const tabValue = tab + '\t'

        this.files.forEach((file) => {
            tree += this.getTreeItem(tabValue, `${file.name} (file, ${file.size})`)
        })

        this.folders.forEach((dir) => tree += dir.treeView(tabValue))

        return tree
    }

    private getTreeItem = (tab: string, name: string): string => `${tab}-${name} \n`
}

type FolderSize = [string, number]