import fs from 'fs/promises'
import os from 'os'
import path from 'path'

const homedir = os.homedir()
const foundDirs = []

async function fileExists(filePath: string) {
  try {
    await fs.access(filePath)
    return true
  } catch (e) {
    return false
  }
}

async function removeFileOrDir(dirs: string[]) {
  for (let i = 0; i < dirs.length; i++) {
    if (await fileExists(dirs[i])) {
      await fs.rm(dirs[i], { recursive: true })
      console.log(dirs[i], 'removed')
    }
  }
}

async function getDirSize(dirPath: string) {
  let totalSize = 0
  let children: string[]
  try {
    children = await fs.readdir(dirPath)
  } catch (error) {
    return
  }

  for (let i = 0; i < children.length; i++) {
    const child = children[i]

    const childPath = path.join(dirPath, child)
    const res = await fs.lstat(childPath)

    // 如果是软连接
    if (res.isSymbolicLink()) {
      break
    }

    if (res.isDirectory()) {
      totalSize += await getDirSize(childPath)
    } else {
      totalSize += res.size
    }

    return totalSize
  }
}

async function searchDir(dirPath: string, searchName: string) {
  let children: string[]
  try {
    children = await fs.readdir(dirPath)
  } catch (error) {
    return
  }
  for (let i = 0; i < children.length; i++) {
    const child = children[i]
    // console.log('child',child)

    const childPath = path.join(dirPath, child)
    const res = await fs.lstat(childPath)

    // 如果是软连接
    if (res.isSymbolicLink()) {
      break
    }

    if (res.isDirectory() && !child.startsWith('.')) {
      if (child === 'node_modules') {
        console.log('childPath', childPath)
        foundDirs.push(childPath)
      } else {
        await searchDir(childPath, searchName)
      }
    }
  }
}

async function main() {
  // await searchDir(homedir, 'node_modules')

  // await fs.writeFile('./found', foundDirs.join(os.EOL))

  // const size = await getDirSize('./node_modules')
  // console.log('size', size)

  const str = await fs.readFile('./found', { encoding: 'utf-8' })
  const dirs = str.split(os.EOL)

  await removeFileOrDir(dirs)

  console.log('done')
}

main()
