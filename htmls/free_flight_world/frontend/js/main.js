import { GLTFLoader } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/GLTFLoader";
import { Sky } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/objects/Sky.js";
// import { Cannon } from "https://cdnjs.cloudflare.com/ajax/libs/cannon.js/0.6.2/cannon.js";

// import * as THREE from "https://cdn.skypack.dev/three@0.132.2";
// free_flight_world/frontend/js/main.js
document.addEventListener('DOMContentLoaded', () => {
    // 初始化Three.js场景
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding= THREE.sRGBEncoding;
    document.getElementById('canvas-container').appendChild(renderer.domElement);
    // const world = new Cannon.World();

    // 创建几何体和材质
    // const geometry = new THREE.BoxGeometry(1, 2, 1); // 立方体尺寸
    // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // 绿色材质
    // const playerMesh = new THREE.Mesh(geometry, material); // 创建网格
    // // 将网格添加到场景中
    // scene.add(playerMesh);

    // 玩家控制器
    const player = {
        position: new THREE.Vector3(0, 10, 0),
        velocity: new THREE.Vector3(),
        rotation: new THREE.Euler(0, 0, 0, 'YXZ'),
        speed: 0.5,
        flightMode: 'hover',
        isFlying: false,
        sprintMultiplier: 3,
        jumpForce: 2,
        gravity: 0.07,
        mouseSensitivity: 0.006,//视角左右转动灵敏度
        moveDirection: new THREE.Vector3(),
        to: new THREE.Vector3(),
        mesh:null
    };

    // 控制状态
    const controls = {
        forward: false,
        backward: false,
        left: false,
        right: false,
        up: false,
        down: false,
        sprint: false,
        isPointerLocked: false
    };

    let camera_foeward = new THREE.Vector3(0, 0, -1);//相机朝向
    camera_foeward.y = 0;
    camera_foeward.normalize(); // 标准化向量以保持长度为1

    const raycaster = new THREE.Raycaster();//射线检测穿模



    //player.gravity= player.jumpForce*player.jumpForce/6;

    // 加载人物模型
    const model = new THREE.Object3D();//人物
    let ac =new THREE.Object3D();
    const map = new THREE.Object3D();//地图2e5751362b964b71bf2435773ba82a2d.gltf
    const loader = new GLTFLoader();
    
    var mixer,action;  
    var clock = new THREE.Clock(); //声明一个时钟对象

    // var loader1 = new GLTFLoader();
    const sky = new Sky();
    loader.load(
       "girl1/bf721ed64a0b4eadabe45480e56d82ae.gltf", // 替换为您的 GLB 文件路径
    //    "girl/woman.gltf", 
       function(gltf){
            
            model.add(gltf.scene);

            // 检查模型是否为 THREE.Object3D 的实例
            if (!(model instanceof THREE.Object3D)) {
                console.error('加载的 GLB 模型不是 THREE.Object3D 的实例');
                return;
            }

            // 调整模型的大小和位置
            model.scale.set(5, 5, 5); // 根据需要调整缩放比例
            model.position.set(0, 0, 0); // 根据需要调整位置
            player.mesh=model;
            // 将模型添加到场景中
            scene.add(model);

        });

        loader.load(
            "map/map1/2e5751362b964b71bf2435773ba82a2d.gltf", // 替换为您的 GLB 文件路径
         //    "girl/woman.gltf", 
            function(gltf){
                 
                 map.add(gltf.scene);
     
                 // 检查模型是否为 THREE.Object3D 的实例
                 if (!(model instanceof THREE.Object3D)) {
                     console.error('加载的 GLB 模型不是 THREE.Object3D 的实例');
                     return;
                 }
     
                 // 调整模型的大小和位置
                 map.scale.set(100, 100, 100); // 根据需要调整缩放比例
                 map.position.set(-430, -1231, 0); // 根据需要调整位置
                 // 将模型添加到场景中
                 scene.add(map);
     
             });


        // 加载骨骼动作动画模型
        // loader.load('run/walk.glb', function(result) {
        //      // 调整动画模型的缩放比例，以匹配原始模型
        //     const originalScale = new THREE.Vector3(); // 假设这是原始模型的缩放比例
        //     model.getWorldScale(originalScale); // 获取原始模型的缩放比例
        //     const animationScale = new THREE.Vector3(); // 假设这是动画模型的缩放比例
        //     result.scene.getWorldScale(animationScale); // 获取动画模型的缩放比例

        //     // 计算缩放因子
        //     const scaleFactor = originalScale.divide(animationScale);
        //     ac.add(result.scene);
        //     // 应用缩放因子到动画模型
        //     // ac.scale.set(50, 50, 50);
        //     ac.position.set(0, 5, 0);

        //     // scene.add(ac);
        //     //w创建骨骼动画
        //     // mixer = new THREE.AnimationMixer(model);
        //     // action = mixer.clipAction(result.animations[0]);
        //     // action.play();
        // });



    // 添加光源
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // 创建地形
    createTerrain();
    // 相机初始位置
    updateCamera();
    // 事件监听
    setupEventListeners();

    // 游戏循环
    function animate() {
        requestAnimationFrame(animate);
        updatePlayerPosition();
        // if (mixer) {
        //     mixer.update();
        // }
        //updateCamera();
        renderer.render(scene, camera);
        updateHUD();
        // playerMesh.position.copy(player.position); // 复制玩家位置到网格
    }
    animate();

    // 创建地形函数
    function createTerrain() {
        // 地面
        const groundGeometry = new THREE.PlaneGeometry(1000, 1000, 100, 100);
        const groundMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x3a5f0b,
            side: THREE.DoubleSide
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        // scene.add(ground);

        // 随机生成建筑物
        for (let i = 0; i < 50; i++) {
            const red = Math.floor(Math.random() * 256); // 生成0到255之间的随机整数
            const green = Math.floor(Math.random() * 256);
            const blue = Math.floor(Math.random() * 256);
            const randomColor = `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`;
            
            const height = Math.random() * 30 + 50;
            const buildingGeometry = new THREE.BoxGeometry(10, height, 10);
            const buildingMaterial = new THREE.MeshStandardMaterial({ 
                color: randomColor,
                metalness: 0.3,
                roughness: 0.7
            });
            const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
            building.position.set(
                Math.random() * 800 - 400,
                height / 2,
                Math.random() * 800 - 400
            );
            scene.add(building);
        }

        // 添加山脉
        const mountainGeometry = new THREE.ConeGeometry(100, 150, 32);
        const mountainMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
        const mountain = new THREE.Mesh(mountainGeometry, mountainMaterial);
        mountain.position.set(200, 75, 200);
        scene.add(mountain);

        // 添加河流
        const riverGeometry = new THREE.PlaneGeometry(1000, 30, 1, 1);
        const riverMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x1E90FF,
            transparent: true,
            opacity: 0.8
        });
        const river = new THREE.Mesh(riverGeometry, riverMaterial);
        river.rotation.x = -Math.PI / 2;
        river.position.set(0, 0.1, 0);
        // scene.add(river);

        
        sky.scale.setScalar(450000); // 根据需要调整天空的大小
        scene.add(sky);
        // 更新天空材质的属性来调整天空的颜色和效果
        const uniforms = sky.material.uniforms;
        uniforms['turbidity'].value = 10;
        uniforms['rayleigh'].value = 3;
        uniforms['mieCoefficient'].value = 0.1;
        uniforms['mieDirectionalG'].value = 0.95;
        uniforms['sunPosition'].value.set(0.3, -0.038, -0.95);
        // 根据需要调整太阳的位置
        const sun = new THREE.Vector3();
        const phi = THREE.MathUtils.degToRad(88);
        const theta = THREE.MathUtils.degToRad(180);
        sun.setFromSphericalCoords(1, phi, theta);
        uniforms.sunPosition.value.copy(sun);


        // // 创建纹理加载器
        // const loader = new THREE.TextureLoader();
        // // 加载全景图片文件
        // const texture = loader.load(
        //     "images/sky.jpg",
        //     () => {
        //         // 将纹理转换为适合环境映射的格式
        //         texture.mapping = THREE.EquirectangularReflectionMapping;
        //         //设置sRGB 颜色空间
        //         texture.colorSpace = THREE.SRGBColorSpace;
        //         // 将纹理设置为场景的背景
        //         scene.background = texture;

                
        //     }
        // );



    }

    // 设置事件监听
    function setupEventListeners() {
        // 键盘控制
        window.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'w': case 'ArrowUp': controls.forward = true; updatePlayerPosition(); break;
                case 's': case 'ArrowDown': controls.backward = true; updatePlayerPosition(); break;
                case 'a': case 'ArrowLeft': controls.left = true; updatePlayerPosition(); break;
                case 'd': case 'ArrowRight': controls.right = true; updatePlayerPosition(); break;
                case ' ': {
                    jump();
                    break;}
                case 'Shift': controls.down = true; break;
                case 'Control': controls.sprint = true; break;
                case 'Escape': exitPointerLock(); break;
            }
        });

        window.addEventListener('keyup', (e) => {
            switch(e.key) {
                case 'w': case 'ArrowUp': controls.forward = false; break;
                case 's': case 'ArrowDown': controls.backward = false; break;
                case 'a': case 'ArrowLeft': controls.left = false; break;
                case 'd': case 'ArrowRight': controls.right = false; break;
                case ' ': {
                    // if(controls.upup==true){controls.upup=false;}
                    controls.up = false; break;}
                case 'Shift': controls.down = false; break;
                case 'Control': controls.sprint = false; break;
            }
        });

        // 鼠标控制
        // document.addEventListener('mousedown', () => {
        //     if (!controls.isPointerLocked) {
        //         requestPointerLock();
        //     }
        // });

        document.addEventListener('mousemove', onMouseMove);
        // document.addEventListener('pointerlockchange', () => {
        //     controls.isPointerLocked = document.pointerLockElement === renderer.domElement;
        //     if (controls.isPointerLocked) {
        //         document.addEventListener('mousemove', onMouseMove);
        //     } else {
        //         document.removeEventListener('mousemove', onMouseMove);
        //     }
        // });

        // 按钮控制
        // document.getElementById('fly-up-btn').addEventListener('touchstart', () => controls.up = true);
        // document.getElementById('fly-up-btn').addEventListener('touchend', () => controls.up = false);
        // document.getElementById('fly-down-btn').addEventListener('touchstart', () => controls.down = true);
        // document.getElementById('fly-down-btn').addEventListener('touchend', () => controls.down = false);
        // document.getElementById('left-btn').addEventListener('touchstart', () => controls.left = true);
        // document.getElementById('left-btn').addEventListener('touchend', () => controls.left = false);
        // document.getElementById('right-btn').addEventListener('touchstart', () => controls.right = true);
        // document.getElementById('right-btn').addEventListener('touchend', () => controls.right = false);
        document.getElementById('jump-btn').addEventListener('click', jump);
        document.getElementById('sprint-btn').addEventListener('touchstart', () => controls.sprint = true);
        document.getElementById('sprint-btn').addEventListener('touchend', () => controls.sprint = false);
        document.getElementById('mode-btn').addEventListener('click', toggleFlightMode);
        // document.getElementById('stop-btn').addEventListener('click', stopMovement);
    }

    // 鼠标移动处理
    function onMouseMove(e) {
        // if (!controls.isPointerLocked) return;
        
        // 更新玩家旋转
        player.rotation.y -= e.movementX * player.mouseSensitivity;
        player.rotation.x -= e.movementY * player.mouseSensitivity;
        
        // 限制垂直视角范围
        player.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, player.rotation.x));
    }

    // 请求指针锁定
    // function requestPointerLock() {
    //     renderer.domElement.requestPointerLock = renderer.domElement.requestPointerLock || 
    //         renderer.domElement.mozRequestPointerLock || 
    //         renderer.domElement.webkitRequestPointerLock;
    //     renderer.domElement.requestPointerLock();
    // }

    // 退出指针锁定
    function exitPointerLock() {
        document.exitPointerLock = document.exitPointerLock || 
            document.mozExitPointerLock || 
            document.webkitExitPointerLock;
        document.exitPointerLock();
    }

    // 更新玩家位置
    function updatePlayerPosition() {
        const speed = controls.sprint ? player.speed * player.sprintMultiplier : player.speed;
        
        // 重置移动方向
        player.moveDirection.set(0, 0, 0);
        let ca=camera_foeward.clone();
        ca.y=0;
        
        // 根据当前视角计算移动方向
        if (controls.forward) {player.moveDirection.z -= 1;  player.to=player.moveDirection;  player.mesh.lookAt(player.mesh.position.clone().add(ca));}
        if (controls.backward) {player.moveDirection.z += 1; player.to=player.moveDirection;  player.mesh.lookAt(player.mesh.position.clone().add(ca.negate())); }
        if (controls.left) {player.moveDirection.x -= 1; player.to=player.moveDirection;      player.mesh.lookAt(player.mesh.position.clone().add(ca.applyEuler(new THREE.Euler(0, Math.PI / 2, 0))));}
        if (controls.right) {player.moveDirection.x += 1; player.to=player.moveDirection;     player.mesh.lookAt(player.mesh.position.clone().add(ca.applyEuler(new THREE.Euler(0, -Math.PI / 2, 0))));}
        
        // 标准化移动方向并应用速度
        if (player.moveDirection.lengthSq() > 0) {
            player.moveDirection.normalize();
            
            // 根据玩家旋转计算实际移动方向
            const direction = new THREE.Vector3();
            direction.copy(player.moveDirection);
            direction.applyEuler(new THREE.Euler(0, player.rotation.y, 0));
            
            // 应用移动
            player.velocity.x = direction.x * speed;
            player.velocity.z = direction.z * speed;

            // player.mesh.velocity.x = direction.x * speed;
            // player.mesh.velocity.z = direction.z * speed;
        } else {
            // 没有移动输入时减速
            player.velocity.x *= 0;
            player.velocity.z *= 0;

            // player.mesh.velocity.x *= 0.9;
            // player.mesh.velocity.z *= 0.9;
        }
        
        // 垂直移动（飞行模式）
        if (player.isFlying) {
            if (controls.up) player.velocity.y = speed;
            if (controls.down) player.velocity.y = -speed;
            if (!controls.up && !controls.down) player.velocity.y *= 0;
        } else {
            // 重力影响
            player.velocity.y -= player.gravity;
        }
        
        // raycaster.set(player.position, player.velocity);//检测穿模
        // // 计算射线与场景中物体的交集
        // const intersects = raycaster.intersectObjects(scene.children);
        // if (intersects.length > 0) {
        //     // 如果有交集，防止穿模
        //     const intersect = intersects[0];
        //     player.position.copy(intersect.point);
        // }
        // else{
        //     // 应用速度
        //     player.position.add(player.velocity);
        // }

        player.position.add(player.velocity);

       
        
        // 地面碰撞检测
        if (player.position.y < 0) {
            player.position.y = 0;
            player.velocity.y = 0;

            // player.mesh.position.y = 2;
            // player.mesh.velocity.y = 0;
        }
        updateCamera();
    }

    // 跳跃功能
    function jump() {
        if (!player.isFlying) {
            player.velocity.y = player.jumpForce;
            // player.mesh.velocity.y = player.jumpForce;

        }
    }

    // 切换飞行模式
    function toggleFlightMode() {
        player.isFlying = !player.isFlying;
        document.getElementById('flight-mode').textContent = player.isFlying ? '飞行' : '行走';
    }

    // 停止移动
    function stopMovement() {
        player.velocity.set(0, 0, 0);
        // player.mesh.velocity.set(0, 0, 0);
    }

    // 更新相机位置和旋转
    function updateCamera() {
        camera.position.copy(player.position);
        camera.rotation.copy(player.rotation);
        
        camera_foeward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);//相机朝向
        // 将前方向量应用到相机的旋转上，得到相机实际的前方向量
        //camera_foeward.applyQuaternion(camera.quaternion);

        // 将前方向量投影到水平面上（忽略y轴）
        // camera_foeward.y = 0;
        camera_foeward.normalize(); // 标准化向量以保持长度为1

        camera.position.add(camera_foeward.clone().
            negate().multiplyScalar(10));//相机后退10
        

        model.position.copy(player.position);
        // player.mesh.rotation.y=player.rotation.y;
        
        // 调整相机高度
         camera.position.y += 7; // 模拟人眼高度
    }

    // 更新HUD显示左上角显示
    function updateHUD() {
        document.getElementById('altitude').textContent = Math.floor(player.position.y);
        document.getElementById('speed').textContent = Math.floor(Math.sqrt(
            player.velocity.x * player.velocity.x + 
            player.velocity.z * player.velocity.z
        ) * 100);
    }

    // 窗口大小调整
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // 导出场景供其他模块使用
    window.scene = scene;
});
