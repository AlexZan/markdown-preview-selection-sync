import { ConfigurationManager } from './configuration';

/**
 * Markdown-it plugin that injects configuration into the preview HTML.
 * This allows the preview script to access VS Code settings without manual editing.
 * https://code.visualstudio.com/api/extension-guides/markdown-extension#adding-support-for-new-syntax-with-markdownit-plugins
 */
export function extendMarkdownIt(md: any) {
    // Store original renderer
    const defaultRender = md.renderer.render;

    // Override renderer to inject config script
    md.renderer.render = function (tokens: any[], options: any, env: any) {
        const html = defaultRender.call(md.renderer, tokens, options, env);

        // Get current configuration (read fresh on each render for live updates)
        const config = ConfigurationManager.get();

        // Try to inject as data attribute instead of inline script (CSP-safe)
        const configData = `data-markdown-preview-config='${JSON.stringify(config)}'`;

        // Inject config as data attribute on body or first element
        const bodyTagRegex = /<body([^>]*)>/i;
        if (bodyTagRegex.test(html)) {
            return html.replace(bodyTagRegex, `<body$1 ${configData}>`);
        }

        // Fallback: wrap in div with data attribute
        return `<div ${configData}>${html}</div>`;
    };

    return md;
}
