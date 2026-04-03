

document.addEventListener("DOMContentLoaded", function () {

  // ==============================================
  // 1. Banner 468x60 横幅
  // ==============================================
  const bannerAd = document.createElement("div");
  bannerAd.style.textAlign = "center";
  bannerAd.style.margin = "10px 0";
  bannerAd.innerHTML = `
    <script>
      atOptions = {
        'key' : 'a7a85c99dc880e7f7d25ed43aa78155c',
        'format' : 'iframe',
        'height' : 60,
        'width' : 468,
        'params' : {}
      };
    </script>
    <script src="https://www.highperformanceformat.com/a7a85c99dc880e7f7d25ed43aa78155c/invoke.js"></script>
  `;
  document.body.prepend(bannerAd);

  // ==============================================
  // 2. Smartlink 智能
  // ==============================================
  const smartlinkAd = document.createElement("div");
  smartlinkAd.style.textAlign = "center";
  smartlinkAd.style.margin = "12px 0";
  smartlinkAd.innerHTML = `
    <a href="https://www.profitablecpmratenetwork.com/dxpupbas?key=b84795fa2e9d66edfc77fb67673f231e" 
       target="_blank" 
       style="display:inline-block; padding:10px 22px; background:#f8f9fa; border-radius:6px; color:#222; text-decoration:none; font-size:14px;">
      查看推荐内容
    </a>
  `;
  document.body.appendChild(smartlinkAd);

  // ==============================================
  // 3. Social Bar 底部
  // ==============================================
  const socialBarScript = document.createElement("script");
  socialBarScript.src = "https://pl29050515.profitablecpmratenetwork.com/8e/dc/56/8edc561f49e4a977a1cdc080d43c909b.js";
  socialBarScript.async = true;
  document.body.appendChild(socialBarScript);

  // ==============================================
  // 4. Native Banner 原生
  // ==============================================
  const nativeAd = document.createElement("div");
  nativeAd.style.textAlign = "center";
  nativeAd.style.margin = "15px 0";
  const nativeScript = document.createElement("script");
  nativeScript.src = "https://pl29050515.profitablecpmratenetwork.com/8e/dc/56/8edc561f49e4a977a1cdc080d43c909b.js";
  nativeScript.async = true;
  nativeAd.appendChild(nativeScript);
  document.body.appendChild(nativeAd);

});
