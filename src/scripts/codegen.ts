import { generate } from './generator.js';

async function main() {
  await generate('commands');
  await generate('buttons');
  await generate('modals');
}

main()
  .then(() => console.log('Codegen finished!'))
  .catch((reason) => {
    console.log(reason);
  });
