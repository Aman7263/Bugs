// ------------------- Tabs -------------------
const tabs = document.querySelectorAll(".tab");
const tabContents = document.querySelectorAll(".tab-content");
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    const target = tab.dataset.tab;
    tabContents.forEach(tc => tc.classList.remove("active"));
    document.getElementById(target).classList.add("active");
  });
});

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
    if (match) version = match[1].replace(/_/g, '.');
  } else if (/Windows/i.test(ua)) {
    const match = ua.match(/Windows NT ([0-9.]+)/);
    if (match) version = match[1];
  } else if (/Linux/i.test(ua)) {
    version = "N/A";
  } else if (/iPhone|iPad|iPod/i.test(ua)) {
    const match = ua.match(/OS ([0-9_]+)/);
    if (match) version = match[1].replace(/_/g, '.');
  } else if (/Android/i.test(ua)) {
    const match = ua.match(/Android\s([0-9\.]+)/);
    if (match) version = match[1];
  }
  return version;
};

const getBatteryDetails = async () => {
  try {
    if (navigator.getBattery) {
      const battery = await navigator.getBattery();
      const chargingTimeInMinutes = battery.chargingTime / 60;
      return {
        level: battery.level * 100,
        charging: battery.charging,
        chargingTime: battery.charging ? Math.round(chargingTimeInMinutes) : "Not charging"
      };
    }
  } catch (e) {}
  return { level: "N/A", charging: "N/A", chargingTime: "N/A" };
};

const getDeviceMemory = () => navigator.deviceMemory ? `${navigator.deviceMemory} GB` : "N/A";

const getDeviceStorage = () => new Promise(resolve => {
  if(navigator.storage && navigator.storage.estimate){
    navigator.storage.estimate().then(est => resolve({ romAvailable: ((est.quota-est.usage)/1024/1024/1024).toFixed(2) }));
  } else resolve({ romAvailable: "N/A" });
});

const getNetworkType = () => navigator.connection ? navigator.connection.effectiveType || "Unknown" : "Unknown";
const getNetworkDownlink = () => navigator.connection ? navigator.connection.downlink || "N/A" : "N/A";
const getScreenResolution = () => `${window.screen.width} x ${window.screen.height}`;
const getStandbyTime = () => "N/A";

const displayDetails = (lat,long,batteryInfo,storageInfo)=>{
  document.getElementById('lat').innerText=lat;
  document.getElementById('long').innerText=long;
  document.getElementById('deviceModel').innerText=getDeviceModel();
  document.getElementById('os').innerText=getOperatingSystem();
  document.getElementById('osVersion').innerText=getOSVersion();
  document.getElementById('batteryLevel').innerText=batteryInfo.level!=="N/A"?`${batteryInfo.level}%`:"N/A";
  document.getElementById('batteryCharging').innerText=batteryInfo.charging!=="N/A"? (batteryInfo.charging?"Charging":"Not Charging"):"N/A";
  document.getElementById('batteryChargingTime').innerText=batteryInfo.chargingTime;
  document.getElementById('networkType').innerText=getNetworkType();
  document.getElementById('networkDownlink').innerText=getNetworkDownlink();
  document.getElementById('deviceMemory').innerText=getDeviceMemory();
  document.getElementById('deviceStorage').innerText=`${storageInfo.romAvailable} GB`;
  document.getElementById('screenResolution').innerText=getScreenResolution();
  document.getElementById('standbyTime').innerText=getStandbyTime();
  document.getElementById('openMapBtn').onclick=()=>window.open(`https://www.google.com/maps?q=${lat},${long}`,'_blank');
  document.getElementById('details').style.display='block';
};

document.getElementById('getDetailsBtn').addEventListener('click', async()=>{
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(async pos=>{
      const batteryInfo=await getBatteryDetails();
      const storageInfo=await getDeviceStorage();
      displayDetails(pos.coords.latitude,pos.coords.longitude,batteryInfo,storageInfo);
    }, err=>alert('Error: '+err.message));
  } else alert('Geolocation not supported');
});

// ------------------- Word Generator -------------------
const toggleVisibility = (checkboxId, inputs) => {
  const cb = document.getElementById(checkboxId);
  cb.addEventListener('change',()=>inputs.forEach(id=>{
    const el = document.getElementById(id);
    if(cb.checked) el.classList.remove("hidden");
    else { el.classList.add("hidden"); if(el.tagName==='INPUT') el.value=''; }
  }));
};
toggleVisibility('useSpecial',['specialCharsLabel','specialChars','numSpecialCharsLabel','numSpecialChars']);
toggleVisibility('useNumbers',['numDigitsLabel','numDigits']);

document.getElementById('generateBtn').addEventListener('click',generateCombinations);

async function generateCombinations(){
  const length=parseInt(document.getElementById("length").value);
  const useLowercase=document.getElementById("useLowercase").checked;
  const useUppercase=document.getElementById("useUppercase").checked;
  const useNumbers=document.getElementById("useNumbers").checked;
  const useSpecial=document.getElementById("useSpecial").checked;
  const firstPart=document.getElementById("firstPart").value;
  const lastPart=document.getElementById("lastPart").value;
  const customSpecialChars=document.getElementById("specialChars").value;
  const numSpecialChars=parseInt(document.getElementById("numSpecialChars").value)||0;
  const numDigits=parseInt(document.getElementById("numDigits").value)||0;
  const output=document.getElementById("output");
  output.innerHTML=""; document.getElementById("totalCombinations").innerHTML="";
  
  if(!length){ output.innerHTML="Please enter the length."; return;}
  let charSet="";
  if(useLowercase) charSet+="abcdefghijklmnopqrstuvwxyz";
  if(useUppercase) charSet+="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if(useNumbers) charSet+="0123456789";
  let specialCharSet=useSpecial?(customSpecialChars || "!@#$%^&*()"):"";
  charSet+=specialCharSet;
  if(!charSet){ output.innerHTML="Select at least one character type."; return;}
  
  const remainingLength=length-firstPart.length-lastPart.length;
  if(remainingLength<0){ output.innerHTML="First+Last exceeds total length."; return;}
  
  let totalCombinations=0;
  const batchSize=1000;
  
  async function generateRecursively(current="", sc=0, dc=0){
    if(current.length===remainingLength){
      if(sc===numSpecialChars && dc===numDigits){
        const div=document.createElement("div");
        div.textContent=firstPart+current+lastPart;
        output.appendChild(div);
        totalCombinations++;
      }
      return;
    }
    for(let char of charSet){
      const newSc=sc+(specialCharSet.includes(char)?1:0);
      const newDc=dc+(char>='0' && char<='9'?1:0);
      if(newSc<=numSpecialChars && newDc<=numDigits){
        await generateRecursively(current+char,newSc,newDc);
      }
      if(totalCombinations%batchSize===0) await new Promise(r=>setTimeout(r,0));
    }
  }
  await generateRecursively();
  document.getElementById("totalCombinations").innerText=`Total Combinations: ${totalCombinations}`;
}
