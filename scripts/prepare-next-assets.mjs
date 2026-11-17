import { copyFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';

const required = [
  ['assets/blohsh-logo.png', 'public/assets/blohsh-logo.png'],
  ['assets/projects/blohshblast-gameplay.png', 'public/assets/projects/blohshblast-gameplay.png'],
  ['assets/projects/blohshblast-home.png', 'public/assets/projects/blohshblast-home.png']
];

for (const [source, destination] of required) {
  const target = resolve(destination);
  await mkdir(dirname(target), { recursive: true });
  await copyFile(resolve(source), target);
  console.log('Prepared asset:', destination);
}
