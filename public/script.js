document.addEventListener('DOMContentLoaded', () => {
    const instanceGrid = document.getElementById('instanceGrid');
    const nodeCountEl = document.getElementById('nodeCount');
    const avgLoadEl = document.getElementById('avgLoad');
    const scalingBtn = document.getElementById('scalingBtn');
    const netCanvas = document.getElementById('netChart');
    const netCtx = netCanvas.getContext('2d');

    // 1. Console State
    let instances = [];
    let netData = Array(40).fill(20);
    let isScaling = false;

    const createInstance = (id) => {
        const load = 20 + Math.random() * 30;
        const uptime = (Math.random() * 500).toFixed(1);
        
        const card = document.createElement('div');
        card.className = 'server-card glass-card';
        card.id = `inst_${id}`;
        card.innerHTML = `
            <div class="card-top">
                <div class="name-wrap">
                    <span class="server-name">INSTANCE_${id.toUpperCase()}</span>
                    <span class="server-region">us-east-1a</span>
                </div>
                <span class="badge online">ONLINE</span>
            </div>
            <div class="card-metrics">
                <div class="row"><span>CPU Usage</span><b class="cpu-val">${Math.floor(load)}%</b></div>
                <div class="health-bar"><div class="health-fill" style="width: ${load}%"></div></div>
                <div style="margin-top: 1rem;" class="row"><span>Uptime</span><b>${uptime}h</b></div>
                <div class="row"><span>Mem</span><b>4.2GB / 8GB</b></div>
            </div>
        `;
        
        instanceGrid.appendChild(card);
        return { id, load, el: card };
    };

    // 2. Monitoring Engine
    const updateMonitoring = () => {
        let totalLoad = 0;
        instances.forEach(inst => {
            const drift = (Math.random() - 0.5) * 4;
            inst.load = Math.max(10, Math.min(95, inst.load + drift));
            
            const fill = inst.el.querySelector('.health-fill');
            const val = inst.el.querySelector('.cpu-val');
            
            fill.style.width = `${inst.load}%`;
            val.innerText = `${Math.floor(inst.load)}%`;
            
            if (inst.load > 85) fill.style.background = 'var(--health-amber)';
            else fill.style.background = 'var(--accent)';
            
            totalLoad += inst.load;
        });

        const avg = instances.length ? Math.floor(totalLoad / instances.length) : 0;
        avgLoadEl.innerText = `${avg}%`;
        nodeCountEl.innerText = instances.length < 10 ? `0${instances.length}` : instances.length;
    };

    // 3. Network Chart (Canvas)
    const renderNetChart = () => {
        netCanvas.width = netCanvas.parentElement.clientWidth;
        netCanvas.height = netCanvas.parentElement.clientHeight;
        
        netCtx.clearRect(0, 0, netCanvas.width, netCanvas.height);
        
        // Grid lines
        netCtx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
        netCtx.lineWidth = 1;
        for(let i=0; i<4; i++) {
            const h = (netCanvas.height / 4) * i;
            netCtx.beginPath();
            netCtx.moveTo(0, h); netCtx.lineTo(netCanvas.width, h);
            netCtx.stroke();
        }

        // Data path
        netCtx.beginPath();
        netCtx.strokeStyle = 'var(--accent)';
        netCtx.lineWidth = 2;
        netCtx.lineJoin = 'round';
        
        const step = netCanvas.width / (netData.length - 1);
        netCtx.moveTo(0, netCanvas.height - (netData[0] / 100 * netCanvas.height));

        for(let i=1; i<netData.length; i++) {
            netCtx.lineTo(i * step, netCanvas.height - (netData[i] / 100 * netCanvas.height));
        }
        
        // Area fill
        netCtx.lineTo(netCanvas.width, netCanvas.height);
        netCtx.lineTo(0, netCanvas.height);
        netCtx.fillStyle = 'rgba(6, 182, 212, 0.05)';
        netCtx.fill();
        netCtx.stroke();

        netData.shift();
        const nextVal = 20 + Math.random() * 30 + (isScaling ? 40 : 0);
        netData.push(nextVal);

        setTimeout(() => requestAnimationFrame(renderNetChart), 100);
    };

    // 4. CI/CD Pipeline Logic
    const steps = ['Build', 'Test', 'Deploy'];
    let currentStepIndex = 0;
    const pipelineStatus = document.getElementById('pipelineStatus');

    const runPipeline = () => {
        if (currentStepIndex >= steps.length) {
            currentStepIndex = 0;
            steps.forEach(s => document.getElementById(`step${s}`).className = 'step');
            pipelineStatus.innerText = 'DEPLOYMENT_COMPLETE: Resources provisioned.';
            // Auto-scale up
            if (instances.length < 12) {
                const node = createInstance(Math.random().toString(36).substr(2, 4));
                instances.push(node);
            }
            return;
        }

        const currentStep = steps[currentStepIndex];
        const el = document.getElementById(`step${currentStep}`);
        el.classList.add('active');
        pipelineStatus.innerText = `EXECUTING_${currentStep.toUpperCase()}...`;

        setTimeout(() => {
            el.classList.remove('active');
            el.classList.add('done');
            currentStepIndex++;
            runPipeline();
        }, 2000);
    };

    // 5. Scaling Interaction
    scalingBtn.addEventListener('click', () => {
        if (isScaling) return;
        isScaling = true;
        scalingBtn.innerText = "Scaling Active...";
        scalingBtn.style.borderColor = "var(--health-amber)";
        
        runPipeline();
        
        setTimeout(() => {
            isScaling = false;
            scalingBtn.innerText = "Simulate Peak Load";
            scalingBtn.style.borderColor = "var(--border)";
        }, 10000);
    });

    // Initial Start
    for(let i=0; i<6; i++) {
        instances.push(createInstance(Math.random().toString(36).substr(2, 4)));
    }

    setInterval(updateMonitoring, 1000);
    requestAnimationFrame(renderNetChart);

    // Responsive Chart
    window.addEventListener('resize', () => {
        netCanvas.width = netCanvas.parentElement.clientWidth;
        netCanvas.height = netCanvas.parentElement.clientHeight;
    });
});
