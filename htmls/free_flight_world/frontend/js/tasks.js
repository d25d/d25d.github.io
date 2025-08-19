
// free_flight_world/frontend/js/tasks.js
document.addEventListener('DOMContentLoaded', () => {
    const tasks = {
        currentTask: null,
        completedTasks: [],
        collectibles: [],
        waypoints: [],
        taskTypes: [
            { name: "收集星星", target: 5, reward: "解锁冲刺能力", icon: "⭐" },
            { name: "探索城市", target: 3, reward: "解锁双倍跳跃", icon: "🏙️" },
            { name: "飞越山脉", target: 1, reward: "解锁滑翔模式", icon: "⛰️" },
            { name: "穿越河流", target: 1, reward: "解锁水上行走", icon: "🌊" }
        ]
    };

    // 初始化任务系统
    function initTaskSystem(scene) {
        // 生成收集物
        generateCollectibles(scene);
        // 生成路径点
        generateWaypoints(scene);
        // 随机选择一个任务
        assignRandomTask();
        // 更新UI
        updateTaskUI();
    }

    // 生成可收集物品
    function generateCollectibles(scene) {
        const geometry = new THREE.SphereGeometry(0.5, 16, 16);
        const material = new THREE.MeshBasicMaterial({ color: 0xFFFF00 });
        
        for (let i = 0; i < 20; i++) {
            const collectible = new THREE.Mesh(geometry, material);
            collectible.position.set(
                Math.random() * 200 - 100,
                Math.random() * 50 + 5,
                Math.random() * 200 - 100
            );
            collectible.userData = { type: 'collectible', id: i };
            scene.add(collectible);
            tasks.collectibles.push(collectible);
        }
    }

    // 生成路径点
    function generateWaypoints(scene) {
        const geometry = new THREE.ConeGeometry(2, 5, 4);
        const material = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
        
        // 城市区域
        for (let i = 0; i < 3; i++) {
            const waypoint = new THREE.Mesh(geometry, material);
            waypoint.position.set(
                Math.random() * 100 - 50,
                5,
                Math.random() * 100 - 50
            );
            waypoint.userData = { type: 'waypoint', id: i, area: 'city' };
            scene.add(waypoint);
            tasks.waypoints.push(waypoint);
        }
        
        // 山脉区域
        const mountainWaypoint = new THREE.Mesh(geometry, material);
        mountainWaypoint.position.set(200, 150, 200);
        mountainWaypoint.userData = { type: 'waypoint', id: 3, area: 'mountain' };
        scene.add(mountainWaypoint);
        tasks.waypoints.push(mountainWaypoint);
        
        // 河流区域
        const riverWaypoint = new THREE.Mesh(geometry, material);
        riverWaypoint.position.set(0, 1, 0);
        riverWaypoint.userData = { type: 'waypoint', id: 4, area: 'river' };
        scene.add(riverWaypoint);
        tasks.waypoints.push(riverWaypoint);
    }

    // 分配随机任务
    function assignRandomTask() {
        const availableTasks = tasks.taskTypes.filter(task => 
            !tasks.completedTasks.includes(task.name)
        );
        
        if (availableTasks.length > 0) {
            tasks.currentTask = {
                ...availableTasks[Math.floor(Math.random() * availableTasks.length)],
                progress: 0
            };
        } else {
            tasks.currentTask = { name: "自由探索", target: 0, progress: 0, icon: "🌍" };
        }
    }

    // 检查任务完成情况
    function checkTaskCompletion(playerPosition) {
        if (!tasks.currentTask) return;
        
        // 检查收集物碰撞
        tasks.collectibles.forEach((item, index) => {
            if (item && playerPosition.distanceTo(item.position) < 3) {
                scene.remove(item);
                tasks.collectibles[index] = null;
                
                if (tasks.currentTask.name.includes("收集")) {
                    tasks.currentTask.progress++;
                    showNotification(`收集进度: ${tasks.currentTask.progress}/${tasks.currentTask.target}`);
                }
            }
        });
        
        // 检查路径点碰撞
        tasks.waypoints.forEach(waypoint => {
            if (waypoint && playerPosition.distanceTo(waypoint.position) < 5) {
                const area = waypoint.userData.area;
                
                if ((tasks.currentTask.name.includes("城市") && area === 'city') ||
                    (tasks.currentTask.name.includes("山脉") && area === 'mountain') ||
                    (tasks.currentTask.name.includes("河流") && area === 'river')) {
                    
                    tasks.currentTask.progress++;
                    showNotification(`探索进度: ${tasks.currentTask.progress}/${tasks.currentTask.target}`);
                }
            }
        });
        
        // 检查任务完成
        if (tasks.currentTask.progress >= tasks.currentTask.target && tasks.currentTask.target > 0) {
            showNotification(`任务完成! 奖励: ${tasks.currentTask.reward}`);
            tasks.completedTasks.push(tasks.currentTask.name);
            assignRandomTask();
        }
        
        updateTaskUI();
    }

    // 更新任务UI
    function updateTaskUI() {
        const taskElement = document.getElementById('current-task');
        const progressElement = document.getElementById('task-progress');
        
        if (tasks.currentTask) {
            taskElement.textContent = `${tasks.currentTask.icon} ${tasks.currentTask.name}`;
            
            if (tasks.currentTask.target > 0) {
                progressElement.textContent = `进度: ${tasks.currentTask.progress}/${tasks.currentTask.target}`;
            } else {
                progressElement.textContent = "自由探索模式";
            }
        }
    }

    // 显示通知
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.getElementById('ui-container').appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 2000);
    }

    // 导出API
    window.taskSystem = {
        init: initTaskSystem,
        checkCompletion: checkTaskCompletion,
        getCurrentTask: () => tasks.currentTask,
        getCompletedTasks: () => tasks.completedTasks
    };
});
