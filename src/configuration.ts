import * as vscode from 'vscode';

/**
 * Extension configuration settings.
 */
export interface ExtensionConfiguration {
    requireModifierKey: boolean;
    modifierKey: 'ctrl' | 'cmd' | 'alt';
    maxSearchLines: number;
}

/**
 * Manages extension configuration settings.
 */
export class ConfigurationManager {
    private static readonly CONFIG_SECTION = 'markdownPreviewSelectionSync';

    /**
     * Gets the current extension configuration.
     */
    static get(): ExtensionConfiguration {
        const config = vscode.workspace.getConfiguration(this.CONFIG_SECTION);

        return {
            requireModifierKey: config.get('requireModifierKey', false),
            modifierKey: config.get('modifierKey', 'ctrl'),
            maxSearchLines: config.get('maxSearchLines', 50)
        };
    }

    /**
     * Registers a callback for configuration changes.
     */
    static onConfigChange(callback: () => void): vscode.Disposable {
        return vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration(this.CONFIG_SECTION)) {
                callback();
            }
        });
    }
}
