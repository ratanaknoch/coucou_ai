"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// ext-src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var vscode = __toESM(require("vscode"), 1);
var path = __toESM(require("path"), 1);
var fs = __toESM(require("fs"), 1);
function activate(context) {
  const provider = new CoucouSidebarProvider(context);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("coucou-ai.sidebarView", provider, {
      webviewOptions: { retainContextWhenHidden: true }
    })
  );
  let disposable = vscode.commands.registerCommand("coucou-ai.start", () => {
    vscode.commands.executeCommand("workbench.view.extension.coucou-ai-sidebar");
  });
  context.subscriptions.push(disposable);
}
var CoucouSidebarProvider = class {
  constructor(context) {
    this.context = context;
  }
  resolveWebviewView(webviewView) {
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this.context.extensionUri]
    };
    const htmlPath = path.join(this.context.extensionPath, "dist", "index.html");
    let htmlContent = "";
    try {
      htmlContent = fs.readFileSync(htmlPath, "utf8");
    } catch (err) {
      vscode.window.showErrorMessage("Could not find dist/index.html. Did you forget to build the webview?");
      htmlContent = "<html><body><h1>Error: Build not found</h1></body></html>";
    }
    webviewView.webview.html = htmlContent;
    webviewView.webview.onDidReceiveMessage(
      (message) => {
        switch (message.command) {
          case "getActiveFile":
            const editor = vscode.window.activeTextEditor;
            if (editor) {
              const document = editor.document;
              const text = document.getText();
              const fileName = path.basename(document.fileName);
              const languageId = document.languageId;
              webviewView.webview.postMessage({
                command: "activeFileContext",
                data: {
                  fileName,
                  languageId,
                  content: text
                }
              });
            } else {
              webviewView.webview.postMessage({
                command: "activeFileContext",
                data: null
              });
            }
            return;
          case "applyCode":
            const activeEditorForApply = vscode.window.activeTextEditor;
            if (activeEditorForApply) {
              activeEditorForApply.edit((editBuilder) => {
                if (!activeEditorForApply.selection.isEmpty) {
                  editBuilder.replace(activeEditorForApply.selection, message.code);
                } else {
                  editBuilder.insert(activeEditorForApply.selection.active, message.code);
                }
              });
            }
            return;
        }
      },
      void 0,
      this.context.subscriptions
    );
  }
};
function deactivate() {
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
