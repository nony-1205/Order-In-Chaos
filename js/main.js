
const paramsMap = {
    'lorenz':          'lorenzParams',
    'rossler':         'rosslerParams',
    'thomas':          'thomasparams',
    'aizawa':          'aizawaParams',
    'shimizu-morioka': 'shimizuParams',
    'halvorsen':       'halvorsenParams',
    'chen':            'chenParams',
    'dadras':          'dadrasParams'
}

const resetMap = {
    'lorenz':          'resetLorenz',
    'rossler':         'resetRossler',
    'thomas':          'resetThomas',
    'aizawa':          'resetAizawa',
    'shimizu-morioka': 'resetShimizu',
    'halvorsen':       'resetHalvorsen',
    'chen':            'resetChen',
    'dadras':          'resetDadras'
}


const routes = {
    'lorenz': {
        name: 'lorenz',

        eqns: 'dx/dt = σ(y - x)<br>dy/dt = x(ρ - z) - y<br>dz/dt = xy - βz',

        params: {sigma: { value: 10, min: 1, max: 20 },
                 rho:   { value: 28, min: 1, max: 60 },
                 beta:  { value: 2.667, min: 0.1, max: 5 }},

        init: {x: 0.1, y: 0, z: 0},

        type: '3D',

        color: 'cyan'
    },
    'aizawa': {
        name: 'aizawa',

        eqns: 'dx/dt = (z - β)x - dy<br>dy/dt = (z - β)y + dx<br>dz/dt = c + ax^2 - ez^2 + fz<br>dw/dt = -gw',

        params: {a: { value: 0.95, min: 0.5, max: 1.5 },
                b: { value: 0.7,  min: 0.1, max: 1.5 },
                c: { value: 0.6,  min: 0.1, max: 1.5 },
                d: { value: 3.5,  min: 1,   max: 6   },
                e: { value: 0.25, min: 0.1, max: 1   },
                f: { value: 0.1,  min: 0,   max: 0.5 }},

        init: {x: 0.1, y: 0, z: 0, w: 0},

        type:'3D',

        color: 'magenta'
    }, 
    'shimizu-morioka': {
        name: 'shimizu-morioka',

        eqns: 'dx/dt = y<br>dy/dt = x(1 - z) - ay<br>dz/dt = xy - bz',

        params: {a: { value: 0.75, min: 0.1, max: 1.5 },
                b: { value: 0.45, min: 0.1, max: 1.5 }},

        init: {x: 0.1, y: 0, z: 0},

        type: '3D',

        color: 'yellow'
    },
    'thomas': {
        name: 'thomas',

        eqns: 'dx/dt = sin(y) - bx<br>dy/dt = sin(z) - by<br>dz/dt = sin(x) - bz',

        params: { b: { value: 0.18, min: 0.1, max: 0.3 }},

        init: {x: 0.1, y: 0, z: 0},

        type: '3D',

        color: 'lime'
    },
    'rossler': {
    name: 'Rossler',

    type: '3D',

    eqns: 'dx/dt = -y - z<br>dy/dt = x + ay<br>dz/dt = b + z(x - c)',

    params: {a: { value: 0.2, min: 0.1, max: 0.5 },
            b: { value: 0.2, min: 0.1, max: 0.5 },
            c: { value: 5.7, min: 2,   max: 10  }},
    },

    'halvorsen': {
    name: 'Halvorsen',

    type: '3D',

    eqns: 'dx/dt = -ax - 4y - 4z - y²<br>dy/dt = -ay - 4z - 4x - z²<br>dz/dt = -az - 4x - 4y - x²',

    params: {a: { value: 1.4, min: 0.5, max: 3 }}
    },

    'chen': {
    name: 'Chen',

    type: '3D',

    eqns: 'dx/dt = a(y - x)<br>dy/dt = (c - a)x - xz + cy<br>dz/dt = xy - bz',

    params: {a: { value: 35, min: 20, max: 50 },
            b: { value: 3,  min: 1,  max: 8  },
            c: { value: 28, min: 15, max: 45 }},
    },
    'dadras': {
    name: 'Dadras',

    type: '3D',

    eqns: 'dx/dt = y - ax + byz<br>dy/dt = cy - xz + z<br>dz/dt = dxy - ez',

    params: {a: { value: 3,   min: 1, max: 6   },
            b: { value: 2.7, min: 1, max: 5   },
            c: { value: 1.7, min: 1, max: 4   },
            d: { value: 2,   min: 1, max: 4   },
            e: { value: 9,   min: 5, max: 15  }},
    },
}



function buildSliders(hash) {
    const container = document.getElementById('info-params')
    container.innerHTML = ''

    const route = routes[hash]
    if (!route || !route.params) return

    const paramsObj = window[paramsMap[hash]]
    if (!paramsObj) return

    const resetFn = window[resetMap[hash]]

    Object.entries(route.params).forEach(([key, config]) => {
        paramsObj[key]=config.value
        const wrapper = document.createElement('div')
        wrapper.style.marginBottom = '0.6rem'

        const label = document.createElement('div')
        label.style.display = 'flex'
        label.style.justifyContent = 'space-between'
        label.style.fontSize = '20px'
        label.style.color = 'rgba(100, 180, 220, 0.7)'
        label.style.marginBottom = '3px'

        const nameSpan = document.createElement('span')
        nameSpan.textContent = key

        const valueSpan = document.createElement('span')
        valueSpan.textContent = parseFloat(config.value.toFixed(1))
        valueSpan.id=`value-${hash}-${key}`

        label.appendChild(nameSpan)
        label.appendChild(valueSpan)

        const slider = document.createElement('input')
        slider.id=`slider-${hash}-${key}`
        slider.type = 'range'
        slider.min = config.min
        slider.max = config.max
        slider.step = (config.max - config.min) / 100
        slider.value = config.value
        slider.style.width = '100%'
        slider.style.cursor = 'pointer'

        slider.addEventListener('input', function() {
            const val = parseFloat(slider.value)
            paramsObj[key] = val
            valueSpan.textContent = parseFloat(val.toFixed(2))
            if (resetFn) resetFn()
        })

        wrapper.appendChild(label)
        wrapper.appendChild(slider)
        container.appendChild(wrapper)
    })

    const resetBtn=document.createElement('button')
    resetBtn.textContent='Reset'

    resetBtn.addEventListener('click',function(){
        

        Object.entries(route.params).forEach(([key,config]) => {
            paramsObj[key]=config.value
            document.getElementById(`slider-${hash}-${key}`).value= config.value
            document.getElementById(`value-${hash}-${key}`).textContent=parseFloat(config.value.toFixed(1))
        })

        if (resetFn) resetFn()

    })
    container.appendChild(resetBtn)
}



function initdragrotation(){
    let dragging=false;
    let lastX=0
    let lastY=0
    let velocityX=0
    let velocityY=0

    document.addEventListener('mousedown', function(e){
        dragging=true
        lastX=e.clientX
        lastY=e.clientY
    })

    document.addEventListener('mousemove', function(e){
        if (!dragging) return 
        velocityY= (e.clientX-lastX) *0.005
        velocityX= (e.clientY-lastY) *0.005
        lastX=e.clientX
        lastY=e.clientY
    })

    document.addEventListener('mouseup',function(){
        dragging=false
    })

    document.addEventListener('touchstart',function(e){
        dragging=true
        lastX=e.touches[0].clientX
        lastY=e.touches[0].clientY
    })

    document.addEventListener('touchmove',function(e){
        velocityY=(e.touches[0].clientX-lastX)*0.005
        velocityX=(e.touches[0].clientY-lastY)*0.005
        lastX=e.touches[0].clientX
        lastY=e.touches[0].clientY
    })

    document.addEventListener('touchend',function(){
        dragging=false
    })

    function rotationLoop(){
    if (window.currentGroup){
        window.currentGroup.rotation.x+=velocityX
        window.currentGroup.rotation.y+=velocityY
    }

    if (!dragging){
        velocityY+=0.0003
        velocityX*=0.95
        velocityY*=0.95
    }
    requestAnimationFrame(rotationLoop)
    }
    rotationLoop()
}

const dropdownbtn=document.getElementById('dropdown-btn')
const dropdownmenu = document.getElementById('dropdown-menu')
const dropdownarrow=document.getElementById('dropdown-arrow')

dropdownbtn.addEventListener('click', function(e){
    e.stopPropagation()
    dropdownmenu.classList.toggle('open')
    dropdownarrow.classList.toggle('open')
})

document.addEventListener('click', function(){
    dropdownmenu.classList.remove('open')
    dropdownarrow.classList.remove('open')
})



let currentattractor = null;

function route(){
    let hash = window.location.hash.slice(1);

    if (!hash || !(hash in routes)) hash='lorenz'

    if (hash in routes) {
        const route = routes[hash];
        document.getElementById('info-name').innerText = route.name;

        document.getElementById('info-eqns').innerHTML = route.eqns;

        buildSliders(hash)

        document.querySelector('.active').classList.remove('active');

        document.querySelector(`a[href="#${hash}"]`).classList.add('active');
        
        dropdownmenu.classList.remove('open')
        dropdownarrow.classList.remove('open')

        dropdownbtn.childNodes[0].textContent = route.name + ' '

        const overlay=document.getElementById('transition-overlay');
        overlay.style.opacity=1

        setTimeout(function(){
        if (currentattractor=== 'lorenz')destroyLorenz();
        if (currentattractor === 'aizawa') destroyAizawa();
        if (currentattractor === 'shimizu-morioka') destroyShimizu();
        if (currentattractor === 'thomas') destroyThomas();
        if (currentattractor==='rossler')destroyRossler();
        if (currentattractor==='rossler')destroyHalvorsen();
        if (currentattractor==='chen') destroyChen();
        if (currentattractor==='dadras') destroyDadras();

        currentattractor= hash;

        if(route.type === '3D'){
            document.getElementById('canvas-3d').style.display = 'block';
            
            if (hash=== 'lorenz') initLorenz();
            if (hash === 'aizawa') initAizawa();
            if (hash === 'thomas') initThomas();
            if (hash === 'shimizu-morioka') initShimizu();
            if (hash==='rossler') initRossler();
            if (hash==='halvorsen') initHalvorsen();
            if (hash==='chen') initChen();
            if (hash==='dadras') initDadras();
            overlay.style.opacity=0
        }
        },400)
    }
    
    if (!window.location.hash){
        window.location.hash= 'lorenz'
    }
}



window.addEventListener('hashchange',route);
window.addEventListener('load',route);

initdragrotation()

window.addEventListener('hashchange',route)
window.addEventListener('load',route)

window.addEventListener('resize',function(){
    if (window.currentRenderer && window.currentCamera){
        window.currentRenderer.setSize(window.innerWidth,window.innerHeight)
        window.currentCamera.aspect=window.innerWidth/window.innerHeight
        window.currentCamera.updateProjectionMatrix()
    }
})
