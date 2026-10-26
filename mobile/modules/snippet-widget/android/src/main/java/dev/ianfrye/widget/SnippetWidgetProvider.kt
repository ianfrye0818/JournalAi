package dev.ianfrye.widget

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.database.sqlite.SQLiteDatabase
import android.net.Uri
import android.util.Log
import android.widget.RemoteViews
import java.io.File
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Locale

/** Reads only aggregates, never copies snippet text outside the app database. */
class SnippetWidgetProvider : AppWidgetProvider() {
  override fun onReceive(context: Context, intent: Intent) {
    super.onReceive(context, intent)
    // Includes periodic widget updates and clock changes while the app is closed.
    val pending = goAsync()
    Thread {
      try { refresh(context) } finally { pending.finish() }
    }.start()
  }

  companion object {
    fun refresh(context: Context) {
      val manager = AppWidgetManager.getInstance(context)
      val ids = manager.getAppWidgetIds(ComponentName(context, SnippetWidgetProvider::class.java))
      if (ids.isEmpty()) return
      val signedIn = context.getSharedPreferences("snippet_widget", 0)
        .getBoolean("signed_in", false)
      val count = if (signedIn) readCount(context) else null
      val views = RemoteViews(context.packageName, R.layout.snippet_widget)
      views.setTextViewText(R.id.snippet_widget_count, if (count != null)
        context.resources.getQuantityString(R.plurals.snippet_widget_count, count, count)
        else context.getString(R.string.snippet_widget_open))
      // Explicit package prevents another app from intercepting the journalai scheme.
      val capture = Intent(Intent.ACTION_VIEW, Uri.parse("journalai://capture"))
        .setPackage(context.packageName)
        .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP)
      val action = PendingIntent.getActivity(context, 0, capture,
        PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE)
      views.setOnClickPendingIntent(R.id.snippet_widget_add, action)
      views.setOnClickPendingIntent(R.id.snippet_widget_root, action)
      manager.updateAppWidget(ids, views)
    }

    private fun readCount(context: Context): Int? {
      // Matches expo-sqlite's defaultDatabaseDirectory and lib/db/client.ts.
      val file = File(context.filesDir, "SQLite/journalai.db")
      if (!file.exists()) return null
      return try {
        SQLiteDatabase.openDatabase(file.path, null, SQLiteDatabase.OPEN_READONLY).use { db ->
          val hour = db.rawQuery("SELECT value FROM kv WHERE key = ?",
            arrayOf("settings.rolloverHour")).use { cursor ->
            if (cursor.moveToFirst()) cursor.getString(0).toIntOrNull()
              ?.takeIf { it in 0..23 } ?: 4 else 4
          }
          val day = Calendar.getInstance()
          if (day.get(Calendar.HOUR_OF_DAY) < hour) day.add(Calendar.DAY_OF_MONTH, -1)
          val date = SimpleDateFormat("yyyy-MM-dd", Locale.US).format(day.time)
          db.rawQuery("SELECT COUNT(*) FROM snippets WHERE local_date = ? AND deleted_at IS NULL",
            arrayOf(date)).use { cursor -> cursor.moveToFirst(); cursor.getInt(0) }
        }
      } catch (error: Exception) {
        // First launch/migrations or a temporarily busy database: avoid displaying a false zero.
        Log.w("SnippetWidget", "Could not read daily count", error)
        null
      }
    }
  }
}
