const vscode = require('vscode');

const SECTION = 'markdown-preview-github-styles';
const APPLY_COMMAND = 'markdownPreviewThemeToggle.apply';
const THEMES = [
  { mode: 'light', value: 'light', label: 'Light' },
  { mode: 'light', value: 'light_high_contrast', label: 'Light high contrast' },
  { mode: 'dark', value: 'dark', label: 'Dark' },
  { mode: 'dark', value: 'dark_high_contrast', label: 'Dark high contrast' },
  { mode: 'dark', value: 'dark_dimmed', label: 'Dark dimmed' },
];

function isMarkdownPreviewTab() {
  const tab = vscode.window.tabGroups.activeTabGroup?.activeTab;
  if (!tab) return false;

  const input = tab.input;
  return (
    (input instanceof vscode.TabInputWebview &&
      (input.viewType === 'markdown.preview' || input.viewType === 'mainThreadWebview-markdown.preview')) ||
    (input instanceof vscode.TabInputCustom && input.viewType === 'vscode.markdown.preview.editor')
  );
}

function updateSetting(config, key, value) {
  const inspected = config.inspect(key);
  const target = inspected?.workspaceValue !== undefined
    ? vscode.ConfigurationTarget.Workspace
    : vscode.ConfigurationTarget.Global;
  return config.update(key, value, target);
}

function isCurrent(config, mode, theme) {
  if (config.get('colorTheme', 'auto') !== mode) return false;
  return !theme || config.get(`${mode}Theme`, mode) === theme;
}

function buildChoices() {
  return [
    { label: 'Auto (match editor)', mode: 'auto' },
    { label: 'System', mode: 'system' },
    ...THEMES.map(theme => ({
      label: theme.label,
      mode: theme.mode,
      theme: theme.value,
    })),
  ];
}

function buildHover(config) {
  const choices = buildChoices();
  const lines = [
    '**MD Preview themes**',
    '',
  ];
  for (const choice of choices) {
    const args = encodeURIComponent(JSON.stringify([choice.mode, choice.theme]));
    const marker = isCurrent(config, choice.mode, choice.theme) ? '$(check)&nbsp;&nbsp;' : '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
    lines.push(`${marker}[${choice.label}](command:${APPLY_COMMAND}?${args})  `);
  }
  const hover = new vscode.MarkdownString(lines.join('\n'), true);
  hover.isTrusted = { enabledCommands: [APPLY_COMMAND] };
  return hover;
}

function activate(context) {
  const button = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  button.name = 'Markdown Preview Theme';
  button.text = '$(color-mode) MD Preview';

  function refresh() {
    if (!isMarkdownPreviewTab()) {
      button.hide();
      return;
    }

    const config = vscode.workspace.getConfiguration(SECTION);
    button.tooltip = buildHover(config);
    button.show();
  }

  async function applySelection(mode, theme) {
    const config = vscode.workspace.getConfiguration(SECTION);
    try {
      if (theme) await updateSetting(config, `${mode}Theme`, theme);
      await updateSetting(config, 'colorTheme', mode);
      refresh();
    } catch (error) {
      vscode.window.showErrorMessage(`Could not change Markdown preview theme: ${error.message}`);
    }
  }

  context.subscriptions.push(
    button,
    vscode.commands.registerCommand(APPLY_COMMAND, applySelection),
    vscode.window.tabGroups.onDidChangeTabs(refresh),
    vscode.window.tabGroups.onDidChangeTabGroups(refresh),
    vscode.window.onDidChangeActiveTextEditor(refresh),
    vscode.workspace.onDidChangeConfiguration(event => {
      if (event.affectsConfiguration(SECTION)) refresh();
    })
  );

  refresh();
}

module.exports = { activate };
