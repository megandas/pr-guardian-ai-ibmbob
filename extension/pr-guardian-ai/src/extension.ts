import * as vscode from "vscode";
import { SidebarProvider } from "./sidebarProvider";
import { openArchitectureView } from "./architectureView";

export function activate(context: vscode.ExtensionContext) {
  console.log("🚀 PR Guardian AI Activated!");

  // Register Sidebar
  const provider = new SidebarProvider(context.extensionUri);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "prguardianView",
      provider
    )
  );

  // Register Repository Intelligence Dashboard
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "pr-guardian-ai.showArchitecture",
      () => {
        openArchitectureView(context);
      }
    )
  );
}

export function deactivate() {}