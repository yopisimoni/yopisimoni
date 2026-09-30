import fs from "node:fs";

function patchAndroid() {
  const file = "android/app/src/main/AndroidManifest.xml";
  if (!fs.existsSync(file)) return false;

  let content = fs.readFileSync(file, "utf8");
  const permissions = [
    '<uses-permission android:name="android.permission.INTERNET" />',
    '<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />',
    '<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />',
  ];

  for (const permission of permissions) {
    if (!content.includes(permission)) {
      content = content.replace(
        /<manifest([^>]*)>/,
        (match) => match + "\n    " + permission
      );
    }
  }

  fs.writeFileSync(file, content);
  return true;
}

function patchIos() {
  const file = "ios/App/App/Info.plist";
  if (!fs.existsSync(file)) return false;

  let content = fs.readFileSync(file, "utf8");
  const key = "NSLocationWhenInUseUsageDescription";

  if (!content.includes(`<key>${key}</key>`)) {
    const entry =
      "\n\t<key>NSLocationWhenInUseUsageDescription</key>" +
      "\n\t<string>Khenifra Delivery uses your location while you are using the app to select pickup points, find nearby available riders, and track active deliveries.</string>\n";
    content = content.replace("</dict>", entry + "</dict>");
  }

  fs.writeFileSync(file, content);
  return true;
}

const android = patchAndroid();
const ios = patchIos();

if (!android && !ios) {
  console.error("No native Capacitor projects found. Run npm run mobile:add:android and/or npm run mobile:add:ios first.");
  process.exit(1);
}

console.log("Native permissions configured:", {
  android,
  ios,
});
