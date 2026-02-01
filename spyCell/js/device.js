// ------------------- Device Info (All OS Compatible) -------------------

const getDeviceModel = () => {
  const ua = navigator.userAgent;
  if (/Macintosh/i.test(ua)) return "Mac Computer";
  if (/Windows/i.test(ua)) return "Windows Computer";
  if (/Linux/i.test(ua)) return "Linux Computer";
  if (/iPhone|iPad|iPod/i.test(ua)) return "iPhone/iPad/iPod Device";
  if (/Android/i.test(ua)) return "Android Device";
  return "Unknown Device";
};

const getOperatingSystem = () => {
  const ua = navigator.userAgent;
  if (/Macintosh/i.test(ua)) return "MacOS";
  if (/Windows/i.test(ua)) return "Windows OS";
  if (/Linux/i.test(ua)) return "Linux";
  if (/iPhone|iPad|iPod/i.test(ua)) return "iOS";
  if (/Android/i.test(ua)) return "Android OS";
  return "Unknown OS";
};

const getOSVersion = () => {
  const ua = navigator.userAgent;
  let version = "Unknown Version";

  if (/Macintosh/i.test(ua)) {
    const match = ua.match(/Mac OS X ([0-9_]+)/);
    if (match) version = match[1].replace(/_/g, ".");
  } else if (/Windows/i.test(ua)) {
    const match = ua.match(/Windows NT ([0-9.]+)/);
    if (match) version = match[1];
  } else if (/iPhone|iPad|iPod/i.test(ua)) {
    const match = ua.match(/OS ([0-9_]+)/);
    if (match) version = match[1].replace(/_/g, ".");
  } else if (/Android/i.test(ua)) {
    const match = ua.match(/Android ([0-9.]+)/);
    if (match) version = match[1];
  }

  return version;
};

const getBatteryDetails = async () => {
  if (!navigator.getBattery) {
    return { level: "N/A", charging: "N/A", chargingTime: "N/A" };
  }

  const battery = await navigator.getBattery();
  return {
    level: Math.round(battery.level * 100),
    charging: battery.charging,
    chargingTime: battery.charging
      ? Math.round(battery.chargingTime / 60)
      : "Not charging",
  };
};

const getDeviceMemory = () =>
  navigator.deviceMemory ? `${navigator.deviceMemory} GB` : "N/A";

const getDeviceStorage = async () => {
  if (!navigator.storage || !navigator.storage.estimate) {
    return { romAvailable: "N/A" };
  }
  const est = await navigator.storage.estimate();
  return {
    romAvailable: ((est.quota - est.usage) / 1024 / 1024 / 1024).toFixed(2),
  };
};

const getNetworkType = () =>
  navigator.connection?.effectiveType || "Unknown";

const getNetworkDownlink = () =>
  navigator.connection?.downlink || "N/A";

const getScreenResolution = () =>
  `${window.screen.width} x ${window.screen.height}`;

const getStandbyTime = () => "N/A";

const displayDetails = (lat, long, battery, storage) => {
  document.getElementById("lat").innerText = lat;
  document.getElementById("long").innerText = long;
  document.getElementById("deviceModel").innerText = getDeviceModel();
  document.getElementById("os").innerText = getOperatingSystem();
  document.getElementById("osVersion").innerText = getOSVersion();
  document.getElementById("batteryLevel").innerText =
    battery.level !== "N/A" ? `${battery.level}%` : "N/A";
  document.getElementById("batteryCharging").innerText =
    battery.charging === "N/A"
      ? "N/A"
      : battery.charging
      ? "Charging"
      : "Not Charging";
  document.getElementById("batteryChargingTime").innerText =
    battery.chargingTime;
  document.getElementById("networkType").innerText = getNetworkType();
  document.getElementById("networkDownlink").innerText =
    getNetworkDownlink();
  document.getElementById("deviceMemory").innerText = getDeviceMemory();
  document.getElementById("deviceStorage").innerText =
    `${storage.romAvailable} GB`;
  document.getElementById("screenResolution").innerText =
    getScreenResolution();
  document.getElementById("standbyTime").innerText = getStandbyTime();

  document.getElementById("openMapBtn").onclick = () =>
    window.open(`https://www.google.com/maps?q=${lat},${long}`, "_blank");

  document.getElementById("details").style.display = "block";
};

document.getElementById("getDetailsBtn").addEventListener("click", async () => {
  if (!navigator.geolocation) {
    alert("Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(async (pos) => {
    const battery = await getBatteryDetails();
    const storage = await getDeviceStorage();

    displayDetails(
      pos.coords.latitude,
      pos.coords.longitude,
      battery,
      storage
    );
  });
});
