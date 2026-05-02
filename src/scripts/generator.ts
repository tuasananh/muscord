import * as fs from 'fs';
import * as prettier from 'prettier';

const snakeToCamel = (str: string) =>
  str.replace(/(_\w)/g, (m) => m[1].toUpperCase());

export async function generate(folder: string) {
  const folderPath = `src/interactions/${folder}`;
  const files = fs
    .readdirSync(folderPath)
    .filter((f) => !f.startsWith('index.ts') && !f.startsWith('_'));

  const lines = [];
  lines.push('// Auto-generated — do not edit');
  for (const f of files) {
    const filenameNoExtension = f.replace(/\.\w+$/, '');
    const camelCased = snakeToCamel(filenameNoExtension);
    lines.push(`import { ${camelCased} } from './${filenameNoExtension}';`);
  }
  lines.push('');
  lines.push(`export const ${folder} = [`);
  for (const f of files) {
    const filenameNoExtension = f.replace(/\.\w+$/, '');
    const camelCased = snakeToCamel(filenameNoExtension);
    lines.push(`  ${camelCased},`);
  }
  lines.push('];');

  const outputPath = folderPath + `/_generated_${folder}.ts`;

  const raw = lines.join('\n');
  const config = await prettier.resolveConfig(outputPath);
  const formatted = await prettier.format(raw, {
    ...config,
    filepath: outputPath,
  });

  if (
    fs.existsSync(outputPath) &&
    fs.readFileSync(outputPath, 'utf-8') === formatted
  ) {
    console.log(`File ${outputPath} content is already up to date`);
  } else {
    fs.writeFileSync(outputPath, formatted);
  }
}
