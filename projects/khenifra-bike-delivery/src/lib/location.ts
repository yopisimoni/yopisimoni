import { Capacitor } from "@capacitor/core";
import { Geolocation } from "@capacitor/geolocation";

export type AppPosition = {
  latitude: number;
  longitude: number;
  accuracy: number;
};

export async function getCurrentAppPosition(): Promise<AppPosition> {
  if (Capacitor.isNativePlatform()) {
    const permission = await Geolocation.requestPermissions({
      permissions: ["location"],
    });

    if (
      permission.location !== "granted" &&
      permission.coarseLocation !== "granted"
    ) {
      throw new Error("LOCATION_PERMISSION_DENIED");
    }

    const position = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 12000,
      maximumAge: 10000,
    });

    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
    };
  }

  if (typeof navigator === "undefined" || !navigator.geolocation) {
    throw new Error("LOCATION_UNAVAILABLE");
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        }),
      reject,
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 10000 }
    );
  });
}

export async function watchAppPosition(
  onPosition: (position: AppPosition) => void,
  onError?: (error: unknown) => void
) {
  if (Capacitor.isNativePlatform()) {
    const id = await Geolocation.watchPosition(
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
      (position, error) => {
        if (error) {
          onError?.(error);
          return;
        }
        if (!position) return;
        onPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      }
    );

    return () => {
      void Geolocation.clearWatch({ id });
    };
  }

  if (typeof navigator === "undefined" || !navigator.geolocation) {
    throw new Error("LOCATION_UNAVAILABLE");
  }

  const id = navigator.geolocation.watchPosition(
    (position) =>
      onPosition({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      }),
    (error) => onError?.(error),
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
  );

  return () => navigator.geolocation.clearWatch(id);
}
