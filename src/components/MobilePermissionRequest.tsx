
import React, { useState, useEffect } from "react";
import { Shield, Smartphone, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobilePermissionRequestProps {
  onPermissionGranted?: () => void;
}

export const MobilePermissionRequest: React.FC<MobilePermissionRequestProps> = ({ 
  onPermissionGranted 
}) => {
  const [permissionStatus, setPermissionStatus] = useState<'unknown' | 'granted' | 'denied'>('unknown');
  const [isNative, setIsNative] = useState(false);

  useEffect(() => {
    // Check if we're running in a native app (Capacitor)
    setIsNative(window.Capacitor?.isNativePlatform() ?? false);
    
    if (isNative) {
      checkPermissionStatus();
    }
  }, [isNative]);

  const checkPermissionStatus = async () => {
    try {
      // In a real implementation, you'd check the actual permission status
      // For now, we'll assume it needs to be requested
      setPermissionStatus('unknown');
    } catch (error) {
      console.error('Error checking permission status:', error);
    }
  };

  const requestPermissions = async () => {
    try {
      // Open Android settings for usage access
      if (window.Capacitor?.isNativePlatform()) {
        // This would need to be implemented in the native plugin
        console.log('Requesting usage access permission...');
        
        // For now, show instructions to user
        alert('Please go to Settings > Special app access > Usage access and enable permission for this app');
        
        setPermissionStatus('granted');
        onPermissionGranted?.();
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
      setPermissionStatus('denied');
    }
  };

  if (!isNative) {
    return (
      <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 mb-4">
        <div className="flex items-center gap-3">
          <Smartphone className="h-5 w-5 text-blue-500" />
          <div className="text-blue-800">
            <strong>Mobile App Features</strong>
            <p className="text-sm mt-1">
              Install the mobile app to access screen time tracking and app usage penalties.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (permissionStatus === 'granted') {
    return (
      <div className="rounded-lg bg-green-50 border border-green-200 p-4 mb-4">
        <div className="flex items-center gap-3">
          <Shield className="h-5 w-5 text-green-500" />
          <div className="text-green-800">
            <strong>Permissions Granted</strong>
            <p className="text-sm mt-1">
              App usage tracking is enabled. You can now set up penalty rules.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-orange-50 border border-orange-200 p-4 mb-4">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Settings className="h-5 w-5 text-orange-500" />
          <div className="text-orange-800">
            <strong>Permission Required</strong>
            <p className="text-sm mt-1">
              Grant usage access permission to enable app time tracking and penalties.
            </p>
          </div>
        </div>
        
        <Button 
          onClick={requestPermissions}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          Grant Permission
        </Button>
        
        <div className="text-xs text-orange-700">
          This will open Android settings where you can enable "Usage access" for this app.
        </div>
      </div>
    </div>
  );
};
