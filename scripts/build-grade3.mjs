import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from 'vite'
import { createGrade3IsolationPlugin } from './grade3-vite-isolation.mjs'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const temporaryRoot = await fs.realpath(os.tmpdir())
const outputRoot = await fs.mkdtemp(path.join(temporaryRoot, 'matematika-grade3-build-'))

try {
  await build({
    root: repoRoot,
    logLevel: 'warn',
    plugins: [createGrade3IsolationPlugin()],
    build: {
      outDir: outputRoot,
      emptyOutDir: false,
    },
  })
  console.log('Grade-3 isolated production build passed; temporary output will be removed.')
} finally {
  if (
    path.dirname(outputRoot) !== temporaryRoot ||
    !path.basename(outputRoot).startsWith('matematika-grade3-build-')
  ) {
    throw new Error(`Refusing to remove unexpected build path: ${outputRoot}`)
  }
  await fs.rm(outputRoot, { recursive: true, force: true })
}
