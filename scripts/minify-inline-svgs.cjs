const fs = require('fs')
const path = require('path')

function walkDir(dir, filelist = []) {
  const files = fs.readdirSync(dir)
  files.forEach(file => {
    const filepath = path.join(dir, file)
    const stat = fs.statSync(filepath)
    if (stat.isDirectory()) {
      walkDir(filepath, filelist)
    } else if (file.endsWith('.vue')) {
      filelist.push(filepath)
    }
  })
  return filelist
}

function compressSvgBlocks(content) {
  // Remove existing prettier-ignore comments before SVGs to avoid duplicates
  let result = content.replace(/<!--\s*prettier-ignore\s*-->\s*(<svg\b)/gi, '$1')

  // Compress each SVG block to one line and prepend prettier-ignore
  result = result.replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, match => {
    let s = match.replace(/\r?\n\s*/g, ' ')
    s = s.replace(/\s{2,}/g, ' ')
    return '<!-- prettier-ignore -->\n' + s.trim()
  })

  return result
}

function main() {
  const srcDir = path.join(process.cwd(), 'src')
  if (!fs.existsSync(srcDir)) {
    console.error('Diretório src/ não encontrado. Execute a partir da raiz do projeto.')
    process.exit(1)
  }

  const vueFiles = walkDir(srcDir)
  let changed = 0

  vueFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8')
    const newContent = compressSvgBlocks(content)
    if (newContent !== content) {
      fs.writeFileSync(file, newContent, 'utf8')
      console.log('Atualizado:', path.relative(process.cwd(), file))
      changed++
    }
  })

  console.log(`Concluído. Arquivos atualizados: ${changed}`)
}

main()
