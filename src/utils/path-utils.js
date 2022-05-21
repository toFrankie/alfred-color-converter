import { fileURLToPath } from 'url'
import { dirname as pathDirname } from 'path'

export const filename = meta => {
  return meta.url ? fileURLToPath(meta.url) : ''
}

export const dirname = meta => pathDirname(filename(meta))
