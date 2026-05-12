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

    // Handle messages from the webview
    webviewView.webview.onDidReceiveMessage(
      message => {
        switch (message.command) {
          case 'getActiveFile':
            const editor = vscode.window.activeTextEditor;
            if (editor) {
              const document = editor.document;
              const text = document.getText();
              const fileName = path.basename(document.fileName);
              const languageId = document.languageId;
              
              webviewView.webview.postMessage({
                command: 'activeFileContext',
                data: {
                  fileName,
                  languageId,
                  content: text
                }
              });
            } else {
              webviewView.webview.postMessage({
                command: 'activeFileContext',
                data: null
              });
            }
            return;
          case 'applyCode':
            const activeEditorForApply = vscode.window.activeTextEditor;
            if (activeEditorForApply) {
              activeEditorForApply.edit(editBuilder => {
                editBuilder.replace(activeEditorForApply.selection, message.code);
              });
            }
            return;
        }
      },
      undefined,
      this.context.subscriptions
    );
  }
}

export function deactivate() {}

