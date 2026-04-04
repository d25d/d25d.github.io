

  // ==============================================
  // 1. Banner 468x60 横幅
  // ==============================================
  const bannerAd = document.createElement("script");

    // 1.  src 链接
    bannerAd.src = "https://www.highperformanceformat.com/a7a85c99dc880e7f7d25ed43aa78155c/invoke.js";
    // 2. 异步加载
    bannerAd.async = true;
    // 3. 其他属性 👉 想加几个加几个
    // bannerAd.setAttribute("data-cfasync", "false");
    bannerAd.textContent = `
      atOptions = {
        'key' : 'a7a85c99dc880e7f7d25ed43aa7155c',
        'format' : 'iframe',
        'height' : 60,
        'width' : 468
      };
    `;
    // 最后加到 body 最后面
    document.body.appendChild(bannerAd);

  // ==============================================
  // 2. Smartlink 智能
  // ==============================================
  const smartlinkAd = document.createElement("div");
  smartlinkAd.style.textAlign = "center";
  smartlinkAd.style.margin = "12px 0";
  smartlinkAd.innerHTML = `
    <a href=" " 
       target="_blank" 
       style="display:inline-block; padding:10px 22px; background:#f8f9fa; border-radius:6px; color:#222; text-decoration:none; font-size:14px;">
      查看推荐内容
    </a >
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
  // 1. 创建容器 div
  let adContainer = document.createElement('div');
  adContainer.id = 'container-d1904fbcf2ecf99de619c2f37a701050';

  // 2. 设置宽高（必须给，否则显示不全）
  adContainer.style.width = '728px';
  adContainer.style.height = '90px';
  adContainer.style.margin = '10px auto';
  adContainer.style.textAlign = 'center';

  // 3. 创建广告脚本
  let adScript = document.createElement('script');
  adScript.async = true;
  adScript.setAttribute('data-cfasync', 'false');
  adScript.src = 'https://pl29050512.profitablecpmratenetwork.com/d1904fbcf2ecf99de619c2f37a701050/invoke.js';

  // 4. 先加容器，再加脚本（必须这个顺序！）
  document.body.appendChild(adContainer);
  document.body.appendChild(adScript);

});
