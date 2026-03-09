import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
  const provider = new CoucouSidebarProvider(context);
  
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('coucou-ai.sidebarView', provider, {
      webviewOptions: { retainContextWhenHidden: true }
    })
  );

  let disposable = vscode.commands.registerCommand('coucou-ai.start', () => {
    vscode.commands.executeCommand('workbench.view.extension.coucou-ai-sidebar');
  });

  context.subscriptions.push(disposable);
}

class CoucouSidebarProvider implements vscode.WebviewViewProvider {
  constructor(private readonly context: vscode.ExtensionContext) {}

  resolveWebviewView(webviewView: vscode.WebviewView) {
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this.context.extensionUri]
    };

    const htmlPath = path.join(this.context.extensionPath, 'dist', 'index.html');
    let htmlContent = '';
    
    try {
      htmlContent = fs.readFileSync(htmlPath, 'utf8');
    } catch (err) {
      vscode.window.showErrorMessage('Could not find dist/index.html. Did you forget to build the webview?');
      htmlContent = '<html><body><h1>Error: Build not found</h1></body></html>';
    }

    webviewView.webview.html = htmlContent;
  }
}

export function deactivate() {}
