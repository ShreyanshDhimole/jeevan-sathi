# Jeevan Sathi Android App Integration Guide

This folder contains **everything you need to make your web app into an Android app with advanced features!**

## 🚀 Step-by-Step: Turn Your Web Project into a Full-featured Android App

---

## 1. Setup: Transform Your Project with Capacitor

1. **Install Capacitor:**
   ```sh
   npm install --save @capacitor/core @capacitor/android
   npm install --save-dev @capacitor/cli
   ```

2. **Init Capacitor:**
   ```sh
   npx cap init
   ```
   - App name: `jeevan-sathi`
   - App ID: `app.lovable.a88339a26096461080a8e8650aa4077e`

3. **Add Android Platform:**
   ```sh
   npx cap add android
   ```

4. **Run your build:**
   ```sh
   npm run build
   npx cap sync
   ```

5. **Open Android Project:**
   ```sh
   npx cap open android
   ```

---

## 2. **Native Features and Code**

To enable **screen time & app usage tracking,** as well as local storage and punishment automation:
- Place the files in this folder inside your native `android/` project tree (see suggested structure below).

### Folder Structure:

```
android/
├── README.md         <- you are here!
├── src/
│   └── main/
│       └── java/
│           └── app/
│               └── lovable/
│                   └── ScreenTimePlugin.java
├── plugin-interface.d.ts
├── AndroidManifest.xml   <- manifest additions
```

---

## 3. **Android Java Plugin**

Place the [ScreenTimePlugin.java](src/main/java/app/lovable/ScreenTimePlugin.java) inside `android/app/src/main/java/app/lovable/`

## 4. **Permissions**

Add these lines to your `AndroidManifest.xml` (usually in `android/app/src/main/`):

```xml
<manifest>
  <uses-sdk
      android:minSdkVersion="22"
      android:targetSdkVersion="33" />
  <uses-feature android:name="android.hardware.camera" android:required="false" />
  <uses-permission android:name="android.permission.INTERNET" />
  <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
  <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
  <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
  <uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
  <uses-permission android:name="android.permission.CAMERA" />
  <uses-permission android:name="android.permission.RECORD_AUDIO" />
  <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
  <uses-permission android:name="android.permission.VIBRATE" />
  <uses-permission android:name="android.permission.READ_CALENDAR" />
  <uses-permission android:name="android.permission.WRITE_CALENDAR" />
  <uses-feature android:name="android.hardware.location" android:required="false" />
  <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
  <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
  <uses-feature android:name="android.hardware.location.gps" android:required="false" />
  <uses-permission android:name="android.permission.BLUETOOTH" android:required="false" />
  <uses-permission android:name="android.permission.BLUETOOTH_ADMIN" android:required="false" />
  <uses-permission android:name="android.permission.BLUETOOTH_CONNECT" android:required="false"/>
  <uses-permission android:name="android.permission.PACKAGE_USAGE_STATS" tools:ignore="ProtectedPermissions"/>
  <uses-permission android:name="android.permission.FOREGROUND_SERVICE"/>

  <application
      android:allowBackup="true"
      android:icon="@mipmap/ic_launcher"
      android:label="@string/app_name"
      android:roundIcon="@mipmap/ic_launcher_round"
      android:supportsRtl="true"
      android:theme="@style/AppTheme"
      android:usesCleartextTraffic="true">

    <activity
        android:configChanges="orientation|keyboardHidden|keyboard|screenSize|smallestScreenSize|locale|layoutDirection|uiMode"
        android:name="app.lovable.a88339a26096461080a8e8650aa4077e.MainActivity"
        android:label="@string/title_activity_main"
        android:theme="@style/AppTheme.NoActionBarLaunch"
        android:launchMode="singleTask"
        android:exported="true">

      <intent-filter>
        <action android:name="android.intent.action.MAIN" />
        <category android:name="android.intent.category.LAUNCHER" />
      </intent-filter>

      <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data android:scheme="@string/custom_url_scheme" />
      </intent-filter>

    </activity>

    <provider
        android:name="androidx.core.content.FileProvider"
        android:authorities="${applicationId}.fileprovider"
        android:exported="false"
        android:grantUriPermissions="true">
      <meta-data
          android:name="android.support.FILE_PROVIDER_PATHS"
          android:resource="@xml/file_paths"></meta-data>
    </provider>
    <receiver android:name="androidx.work.impl.background.systemalarm.RescheduleReceiver" android:enabled="true" android:exported="false"/>
    <!-- Register service if needed for background monitoring -->
  </application>
</manifest>
```
> Note: The user will need to grant Usage Access to your app in their settings (`Settings > Apps > Special app access > Usage access`).

---

## 5. **Kotlin/Java Plugin Code**

See: [`src/main/java/app/lovable/ScreenTimePlugin.java`](src/main/java/app/lovable/ScreenTimePlugin.java)

This plugin exposes:
- `getAppUsageStats({ date })` — Returns a JS object with app usage for a given date.
- `getScreenTime({ date })` — Returns total device screen time for a given date.
- `setScreenTimeLimit({ app, minutes })` — Store per-app limits in native preferences.
- `getScreenTimeLimits()` — Returns all app/time limits.
- Native logic for **triggering punishments** if a user goes over their limit (calls a JS callback or shows a system notification).

---

## 6. **Expose Plugin to React (TypeScript)**

Interface in: [`plugin-interface.d.ts`](plugin-interface.d.ts)  
Use Capacitor’s `registerPlugin` in your TS code.

### Example Usage in React:

```typescript
import { ScreenTimePlugin } from '../android/plugin-interface'; // path to TS interface
import { registerPlugin } from '@capacitor/core';

const ScreenTime = registerPlugin<ScreenTimePlugin>('ScreenTimePlugin');

// Get today’s screen time for "YouTube"
ScreenTime.getAppUsageStats({ date: new Date().toISOString().slice(0,10) }).then(stats => {
  const yt = stats.apps.find(app => app.package === 'com.google.android.youtube');
  alert(`YouTube time today: ${yt.minutes} minutes`);
});

// Set a new daily limit (in minutes) for YouTube:
ScreenTime.setScreenTimeLimit({ app: 'com.google.android.youtube', minutes: 120 });

// Listen for “limit exceeded” (background punishments):
ScreenTime.addListener('limitExceeded', ({ app, minutesOver }) => {
  // call your punishment/points code here from JS!
  // e.g., applyPenalty(app, minutesOver)
});
```

---

## 7. **Automate Penalties from Settings**

- Expose a UI so the user can set per-app or per-category screen time limits (store via `setScreenTimeLimit`).
- In your React code, set up a listener as shown above.
- When notified, automatically deduct points, apply a punishment, or prompt the user.

_Note: You must add logic in your React code to apply custom punishments or show UI—it is not handled by the plugin alone._

---

## 8. **Local Storage**

- All collected usage stats will be stored to native SharedPreferences.  
- You can also use Capacitor’s Storage plugin for extra data.

---

## 9. **Everything Provided**

- [ScreenTimePlugin.java](src/main/java/app/lovable/ScreenTimePlugin.java): All Java logic for data and events.
- [plugin-interface.d.ts](plugin-interface.d.ts): TypeScript for plugin methods/events.
- [AndroidManifest.xml](AndroidManifest.xml): Permissions.
- This README: Follow steps and you’re good!

---

## 10. **Final Steps**

- Sync and rebuild:  
  `npx cap sync android && npx cap open android`
- Follow the prompts to enable permissions on-device (via system settings).
- Test the JS interface from your React app’s Settings & Insights pages.
- The Penalization logic can now be hooked directly from these plugin methods & events!

---

**Congratulations!** You now have a path to building a REAL “screen time controlling” Android app with punishment/penalty features, all from your existing React app.

For any build errors, always re-sync with `npx cap sync android` and rebuild as described.
