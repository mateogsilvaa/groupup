import { execSync } from 'child_process'
import { existsSync, rmSync } from 'fs'
import { resolve } from 'path'

const dist = resolve('dist')

if (!existsSync(dist)) {
  console.error('dist/ not found — run `npm run build` first')
  process.exit(1)
}

const run = (cmd, cwd) => execSync(cmd, { cwd, stdio: 'inherit' })

const gitDir = resolve(dist, '.git')
if (existsSync(gitDir)) rmSync(gitDir, { recursive: true, force: true })

run('git init', dist)
run('git checkout -b gh-pages', dist)
run('git add -A', dist)
run('git commit -m "Deploy to GitHub Pages"', dist)
run('git remote add origin https://github.com/mateogsilvaa/groupup.git', dist)
run('git push -f origin gh-pages', dist)

console.log('\n✓ Deployed to gh-pages branch')
