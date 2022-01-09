#!/usr/bin/env node

const createApp = require('../src/index');
const { parsePromptOptions } = require('../src/utils');
const fs = require('fs');

const argv = require('minimist')(process.argv.slice(2));
const prompts = require('prompts');

const tools = {
  // language: {
  //   value: String,
  //   choices: [
  //     { title: 'JavaScript', value: 'js', selected: true },
  //     { title: 'TypeScript', value: 'ts' },
  //   ]
  // },
  plugins: {
    value: Array,
    choices: [
      { title: 'dotenv', value: 'dotenv', selected: true },
      { title: 'JsonParse', value: 'jsonParse', selected: true },
      { title: 'Helmet', value: 'helmet', selected: true },
    ]
  },
  orms: {
    value: String,
    choices: [
      { title: 'Sequelize', value: 'sequelize' },
      { title: 'None', value: 'none' },
    ]
  }
};

async function init() {
  let projectName = argv._[0];

  const defaultProjectName = !projectName ? 'create-express-app' : projectName;

  let result = {};

  try {
    await prompts(
      [
        {
          type: projectName ? null : 'text',
          name: 'projectName',
          message: 'Project name:',
          initial: defaultProjectName,
          onState: (state) => {
            return (projectName = state.value.trim() || defaultProjectName);
          }
        },
      ]);

    if (fs.existsSync(projectName)) {
      console.log(`Folder already exist with ${projectName}`);
      return;
    }

    result = await prompts(
      [
        {
          type: projectName ? null : 'text',
          name: 'projectName',
          message: 'Project name:',
          initial: defaultProjectName,
          onState: (state) => {
            return (projectName = state.value.trim() || defaultProjectName);
          }
        },

        ...parsePromptOptions(tools),
      ],
      {
        onCancel: () => {
          throw new Error('✖ Operation cancelled')
        }
      }
    );
  } catch (cancelled) {
    console.log(cancelled);
    return;
  }

  createApp({
    name: projectName,
    ...result,
  });
}

init().catch((e) => {
  console.error(e);
});
