const util = require('util');
const path = require('path');
const fs = require('fs');
const ncp = util.promisify(require('ncp').ncp);
const { stringTemplate } = require('./utils');

module.exports = async function(project) {
  const { name, language, orms, plugins } = project;
  const lang = language || 'js';

  const options = {
    dotenv: {
      dependencies: {
        "dotenv": "^10.0.0",
      },
      importSection: "require('dotenv').config();",
    },
    helmet: {
      dependencies: {
        "helmet": "^5.0.1"
      },
      importSection: "const helmet = require('helmet');",
      useSection: "app.use(helmet());",
    },
    jsonParse: {
      useSection: "app.use(express.json());",
    },
    morgan: {
      dependencies: {
        "morgan": "^1.10.0",
      },
      importSection: "const morgan = require('morgan');",
      useSection: "app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));",
    },
    sequelize: {
      dependencies: {
        "sequelize": "^6.8.0",
      },
      devDependencies: {
        "sequelize-cli": "^6.2.0",
      },
      scripts: {
        "dev": "nodemon ./index.js",
        "db:reset": "npx sequelize-cli db:drop && npx sequelize-cli db:create && npx sequelize-cli db:migrate && npx sequelize-cli db:seed:all",
        "db:migrate": "npx sequelize-cli db:migrate",
      },
    }
  };

  await ncp(
    path.join(__dirname, `../templates/express/${lang}`),
    path.join(process.cwd(), name),
  );

  const filePath = path.join(process.cwd(), name, 'src', 'index.js');
  const fileContentTemplate = fs.readFileSync(filePath, 'utf8').toString();

  const packagePath = path.join(process.cwd(), name, 'package.json');

  if (Object.keys(options).includes(orms)) {
    plugins.push(orms);
  }

  const builded = plugins.reduce((acc, plugin) => {
    ['importSection', 'useSection'].forEach((key) => {
      if (options[plugin][key]) acc[key].push(options[plugin][key]);
    });

    [
      'dependencies',
      'devDependencies',
      'scripts',
    ].forEach((key) => {
      if (options[plugin][key]) {
        acc.packageJson[key] = {
          ...acc.packageJson[key],
          ...options[plugin][key]
        };
      }
    });

    return acc;
  }, {
    packageJson: JSON.parse(fs.readFileSync(packagePath, 'utf8')),
    useSection: [],
    importSection: [],
  });

  const fileContent = stringTemplate(fileContentTemplate, {
    importSection: builded.importSection.join("\r\n"),
    useSection: builded.useSection.join("\r\n")
  });

  fs.writeFileSync(filePath, fileContent);

  if (orms !== 'none') {
    await ncp(
      path.join(__dirname, `../templates/${orms}/${lang}`),
      name
    );
  }

  builded.packageJson.name = name;
  fs.writeFileSync(
    packagePath,
    JSON.stringify(builded.packageJson, null, 2)
  );
}
