
// free_flight_world/frontend/js/weather.js
document.addEventListener('DOMContentLoaded', () => {
    const weatherTypes = ['晴天', '雨天', '雪天', '多云'];
    let currentWeather = '晴天';
    let weatherParticles = null;
    const scene = window.scene; // 从main.js获取场景
    
    // 初始化天气系统
    function initWeatherSystem() {
        // 每5分钟随机切换一次天气
        setInterval(changeWeather, 10 * 1000);
        updateWeatherDisplay();
    }
    
    // 随机切换天气
    function changeWeather() {
        const newWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
        if (newWeather !== currentWeather) {
            currentWeather = newWeather;
            applyWeatherEffects();
            updateWeatherDisplay();
            showWeatherNotification(`天气已变为: ${currentWeather}`);
        }
    }
    
    // 应用天气特效
    function applyWeatherEffects() {
        // 清除现有天气粒子
        if (weatherParticles) {
            scene.remove(weatherParticles);
            weatherParticles = null;
        }
        
        // 根据天气类型创建粒子效果
        switch(currentWeather) {
            case '雨天':
                createRainEffect();
                break;
            case '雪天':
                createSnowEffect();
                break;
            case '多云':
                createCloudEffect();
                break;
            default:
                // 晴天不需要特效
                break;
        }
    }
    
    // 创建下雨效果
    function createRainEffect() {
        const rainGeometry = new THREE.BufferGeometry();
        const rainCount = 5000;
        const positions = new Float32Array(rainCount * 3);
        
        for (let i = 0; i < rainCount; i++) {
            positions[i * 3] = Math.random() * 2000 - 1000;
            positions[i * 3 + 1] = Math.random() * 200 + 50;
            positions[i * 3 + 2] = Math.random() * 2000 - 1000;
        }
        
        rainGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const rainMaterial = new THREE.PointsMaterial({
            color: 0xaaaaaa,
            size: 0.1,
            transparent: true
        });
        
        weatherParticles = new THREE.Points(rainGeometry, rainMaterial);
        scene.add(weatherParticles);
        
        // 动画循环
        function animateRain() {
            if (weatherParticles && currentWeather === '雨天') {
                const positions = weatherParticles.geometry.attributes.position.array;
                
                for (let i = 0; i < positions.length; i += 3) {
                    positions[i + 1] -= 1; // 雨滴下落
                    
                    if (positions[i + 1] < -10) {
                        positions[i + 1] = Math.random() * 50 + 100;
                        positions[i] = Math.random() * 200 - 100;
                        positions[i + 2] = Math.random() * 200 - 100;
                    }
                }
                
                weatherParticles.geometry.attributes.position.needsUpdate = true;
                requestAnimationFrame(animateRain);
            }
        }
        
        animateRain();
    }
    
    // 创建下雪效果
    function createSnowEffect() {
        const snowGeometry = new THREE.BufferGeometry();
        const snowCount = 3000;
        const positions = new Float32Array(snowCount * 3);
        
        for (let i = 0; i < snowCount; i++) {
            positions[i * 3] = Math.random() * 200 - 100;
            positions[i * 3 + 1] = Math.random() * 200 + 50;
            positions[i * 3 + 2] = Math.random() * 200 - 100;
        }
        
        snowGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const snowMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.2,
            transparent: true,
            opacity: 0.8
        });
        
        weatherParticles = new THREE.Points(snowGeometry, snowMaterial);
        scene.add(weatherParticles);
        
        // 动画循环
        function animateSnow() {
            if (weatherParticles && currentWeather === '雪天') {
                const positions = weatherParticles.geometry.attributes.position.array;
                
                for (let i = 0; i < positions.length; i += 3) {
                    positions[i + 1] -= 0.2; // 雪花缓慢下落
                    positions[i] += Math.sin(Date.now() * 0.001 + i) * 0.01; // 轻微摆动
                    
                    if (positions[i + 1] < -10) {
                        positions[i + 1] = Math.random() * 50 + 100;
                        positions[i] = Math.random() * 200 - 100;
                        positions[i + 2] = Math.random() * 200 - 100;
                    }
                }
                
                weatherParticles.geometry.attributes.position.needsUpdate = true;
                requestAnimationFrame(animateSnow);
            }
        }
        
        animateSnow();
    }
    
    // 创建多云效果
    function createCloudEffect() {
        // 创建几朵云
        for (let i = 0; i < 20; i++) {
            const cloudGeometry = new THREE.SphereGeometry(5 + Math.random() * 5, 8, 8);
            const cloudMaterial = new THREE.MeshBasicMaterial({
                color: 0xeeeeee,
                transparent: true,
                opacity: 0.7
            });
            
            const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
            cloud.position.set(
                Math.random() * 2000 - 1000,
                200 + Math.random() * 50,
                Math.random() * 2000 - 1000
            );
            
            scene.add(cloud);
            weatherParticles = cloud;
        }
    }
    
    // 更新天气显示
    function updateWeatherDisplay() {
        document.getElementById('weather').textContent = currentWeather;
    }
    
    // 显示天气通知
    function showWeatherNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.zIndex = "9999"; // 设置一个较高的z-index值，确保它位于最上层
        notification.style.position = "fixed"; // 使用fixed定位，使通知相对于视口定位
        notification.style.width="10%";
;        notification.style.left = "45%"; // 设置左侧距离为视口宽度的50%

        document.getElementById('ui-container').appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
    
    // 导出API
    window.weatherSystem = {
        init: initWeatherSystem,
        getCurrentWeather: () => currentWeather,
        changeWeather: changeWeather
    };
    
    // 初始化
    initWeatherSystem();
});
