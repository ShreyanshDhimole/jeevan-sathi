
import React from "react";
import { Smartphone, Shield } from "lucide-react";

export const ScreenTimePermission: React.FC = () => {
  // Detect platform (placeholder: always "web" for now)
  const isWeb = true;

  // Later, you can detect native with Capacitor/Cordova here
  if (isWeb) {
    return (
      <div className="rounded-lg bg-yellow-50 border border-yellow-200 flex items-center gap-3 p-3 mb-4">
        <Shield className="h-5 w-5 text-yellow-500" />
        <div className="text-yellow-800">
          <strong>Enable permissions in mobile app</strong>:<br />
          To track your device/app usage, you need to install the mobile version and grant "Usage Stats" and "Accessibility" permissions.<br />
          <span className="block mt-1 text-yellow-700 text-xs">
            (These permissions cannot be granted from the browser.)
          </span>
        </div>
      </div>
    );
  }
  // Placeholder: On device, show "Grant" button here.
  // TODO: Connect to capacitors/app plugin in mobile context
  return null;
};
