function parsePromptOptions(options) {
  return Object.entries(options).map(([question, configs]) => {
    let base = {
      type: 'text',
      name: question,
      message: configs.message || question,
    };

    if (Array.isArray(configs.choices)) {
      const defaultChoice = Object.entries(configs.choices).find(([k, v]) => v.selected || v.default);

      base = {
        ...base,
        type: configs.value === Array ? 'multiselect' : 'select',
        choices: configs.choices,
        max: configs.max,
      };

      if (!!defaultChoice && configs.value !== Array) {
        base.initial = parseInt(defaultChoice[0]);
      };
    } else {
      base = {
        ...base,
      };
    }

    return base;
  });
}

function stringTemplate(template, obj) {
  return template.replace(/{{(.*?)}}/g, (_, key) => obj[key.trim()]);
}

module.exports = {
  parsePromptOptions,
  stringTemplate,
}
