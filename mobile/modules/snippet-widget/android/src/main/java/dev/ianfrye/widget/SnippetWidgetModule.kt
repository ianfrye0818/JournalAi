package dev.ianfrye.widget

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class SnippetWidgetModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("SnippetWidget")
    AsyncFunction("refresh") { signedIn: Boolean ->
      val context = appContext.reactContext ?: return@AsyncFunction
      context.getSharedPreferences("snippet_widget", 0).edit()
        .putBoolean("signed_in", signedIn).commit()
      SnippetWidgetProvider.refresh(context)
    }
  }
}
