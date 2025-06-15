
package app.lovable;

import android.app.usage.UsageStats;
import android.app.usage.UsageStatsManager;
import android.content.Context;
import android.content.SharedPreferences;
import android.os.Build;
import android.provider.Settings;
import androidx.annotation.RequiresApi;
import com.getcapacitor.*;
import com.getcapacitor.annotation.*;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import java.util.*;

@NativePlugin
public class ScreenTimePlugin extends Plugin {
  private SharedPreferences prefs;
  private static final String PREFS_NAME = "screen_time_limits";
  private static final String LIMITS_KEY = "limits";

  @Override
  public void load() {
    prefs = getContext().getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
  }

  @PluginMethod
  public void getAppUsageStats(PluginCall call) {
    String dateStr = call.getString("date", "");
    long start = getStartOfDayMillis(dateStr);
    long end = getEndOfDayMillis(dateStr);

    UsageStatsManager usm = (UsageStatsManager) getContext().getSystemService(Context.USAGE_STATS_SERVICE);
    if (usm == null) {
      call.reject("UsageStatsManager unavailable");
      return;
    }
    List<UsageStats> stats = usm.queryUsageStats(UsageStatsManager.INTERVAL_DAILY, start, end);
    JSONArray apps = new JSONArray();
    for (UsageStats usage : stats) {
      try {
        JSONObject app = new JSONObject();
        app.put("package", usage.getPackageName());
        app.put("minutes", usage.getTotalTimeInForeground() / 60000);
        apps.put(app);
      } catch (JSONException ignored) {}
    }
    JSObject ret = new JSObject();
    ret.put("apps", apps);
    call.resolve(ret);
  }

  @PluginMethod
  public void getScreenTime(PluginCall call) {
    String dateStr = call.getString("date", "");
    long start = getStartOfDayMillis(dateStr);
    long end = getEndOfDayMillis(dateStr);
    long total = 0;

    UsageStatsManager usm = (UsageStatsManager) getContext().getSystemService(Context.USAGE_STATS_SERVICE);
    if (usm != null) {
      List<UsageStats> stats = usm.queryUsageStats(UsageStatsManager.INTERVAL_DAILY, start, end);
      for (UsageStats u : stats) {
        total += u.getTotalTimeInForeground();
      }
    }
    JSObject ret = new JSObject();
    ret.put("minutes", total / 60000);
    call.resolve(ret);
  }

  @PluginMethod
  public void setScreenTimeLimit(PluginCall call) {
    String app = call.getString("app");
    int minutes = call.getInt("minutes", 0);
    if (app == null || minutes <= 0) {
      call.reject("App and minutes required");
      return;
    }
    try {
      JSONObject limits = getLimits();
      limits.put(app, minutes);
      prefs.edit().putString(LIMITS_KEY, limits.toString()).apply();
      call.resolve();
    } catch (JSONException e) {
      call.reject("Failed to save limit");
    }
  }

  @PluginMethod
  public void getScreenTimeLimits(PluginCall call) {
    JSONObject limits = getLimits();
    JSObject ret = new JSObject();
    for (Iterator<String> it = limits.keys(); it.hasNext(); ) {
      String key = it.next();
      try {
        ret.put(key, limits.getInt(key));
      } catch (JSONException ignored) {}
    }
    call.resolve(ret);
  }

  private JSONObject getLimits() {
    String json = prefs.getString(LIMITS_KEY, "{}");
    try {
      return new JSONObject(json);
    } catch (JSONException e) {
      return new JSONObject();
    }
  }

  // Background checker: should call JS directly via notifyListeners for limitExceeded event.
  @Override
  public void handleOnResume() {
    // Run in background or on user return to app - production should use a Service
    checkLimitsAndNotify();
  }

  private void checkLimitsAndNotify() {
    try {
      JSONObject limits = getLimits();
      Iterator<String> apps = limits.keys();
      while (apps.hasNext()) {
        String pkg = apps.next();
        int allowed = limits.getInt(pkg);
        long used = getAppMinutesToday(pkg);
        if (used > allowed) {
          JSObject data = new JSObject();
          data.put("app", pkg);
          data.put("minutesOver", used - allowed);
          notifyListeners("limitExceeded", data, true);
        }
      }
    } catch (JSONException ignored) {}
  }

  private long getAppMinutesToday(String pkg) {
    long start = getStartOfDayMillis("");
    long end = getEndOfDayMillis("");
    UsageStatsManager usm = (UsageStatsManager) getContext().getSystemService(Context.USAGE_STATS_SERVICE);
    if (usm != null) {
      List<UsageStats> stats = usm.queryUsageStats(UsageStatsManager.INTERVAL_DAILY, start, end);
      for (UsageStats usage : stats) {
        if (pkg.equals(usage.getPackageName())) {
          return usage.getTotalTimeInForeground() / 60000;
        }
      }
    }
    return 0;
  }

  private long getStartOfDayMillis(String dateStr) {
    Calendar c = Calendar.getInstance();
    if (!dateStr.isEmpty()) {
      String[] s = dateStr.split("-");
      c.set(Calendar.YEAR, Integer.parseInt(s[0]));
      c.set(Calendar.MONTH, Integer.parseInt(s[1]) - 1);
      c.set(Calendar.DAY_OF_MONTH, Integer.parseInt(s[2]));
    }
    c.set(Calendar.HOUR_OF_DAY, 0);
    c.set(Calendar.MINUTE, 0);
    c.set(Calendar.SECOND, 0);
    c.set(Calendar.MILLISECOND, 0);
    return c.getTimeInMillis();
  }
  private long getEndOfDayMillis(String dateStr) {
    Calendar c = Calendar.getInstance();
    if (!dateStr.isEmpty()) {
      String[] s = dateStr.split("-");
      c.set(Calendar.YEAR, Integer.parseInt(s[0]));
      c.set(Calendar.MONTH, Integer.parseInt(s[1]) - 1);
      c.set(Calendar.DAY_OF_MONTH, Integer.parseInt(s[2]));
    }
    c.set(Calendar.HOUR_OF_DAY, 23);
    c.set(Calendar.MINUTE, 59);
    c.set(Calendar.SECOND, 59);
    c.set(Calendar.MILLISECOND, 999);
    return c.getTimeInMillis();
  }
}
