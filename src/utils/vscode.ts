/**
 * A utility wrapper for the VS Code webview API.
 */
class VSCodeAPIWrapper {
  private readonly vsCodeApi: any;

  constructor() {
    // Check if the acquireVsCodeApi function exists (only in VS Code environment)
    if (typeof acquireVsCodeApi === 'function') {
      this.vsCodeApi = acquireVsCodeApi();
    }
  }

  /**
   * Post a message to the extension
   */
  public postMessage(message: any) {
    if (this.vsCodeApi) {
      this.vsCodeApi.postMessage(message);
    } else {
      console.log('Would post message to extension:', message);
    }
  }

  /**
   * Request active file context and wait for the response
   */
  public async getActiveFileContext(): Promise<{ fileName: string; languageId: string; content: string } | null> {
    return new Promise((resolve) => {
      if (!this.vsCodeApi) {
        resolve(null);
        return;
      }

      // Handler for the message from extension
      const messageHandler = (event: MessageEvent) => {
        const message = event.data;
        if (message.command === 'activeFileContext') {
          window.removeEventListener('message', messageHandler);
          resolve(message.data);
        }
      };

      window.addEventListener('message', messageHandler);
      
      // Request the file context
      this.postMessage({ command: 'getActiveFile' });
      
      // Timeout after 2 seconds just in case
      setTimeout(() => {
        window.removeEventListener('message', messageHandler);
        resolve(null);
      }, 2000);
    });
  }

  /**
   * Apply code to the active document
   */
  public applyCode(code: string) {
    this.postMessage({ command: 'applyCode', code });
  }
}

// Export a singleton instance
export const vscode = new VSCodeAPIWrapper();
