
(function(){
const dadrasParams={a:3, b:2.7,c:1.7, d:2, e:9}
window.dadrasParams=dadrasParams
const dt= 0.008;
const stepsperframe=100;
const maxpoints=300000;
const scale=0.18;


let count=0;
let cx=1, cy=-2, cz=0.1;
let animationID=null;
let positions;
let colors;
let geometry;
let renderer;
let scene;
let camera;
let group;





function dadras(x,y,z){
    const dx= y - dadrasParams.a*x + dadrasParams.b*y*z;
    const dy=dadrasParams.c*y - x*z + z;
    const dz = dadrasParams.d*x*y - dadrasParams.e*z;
    return [dx,dy,dz];}



function rk4(x,y,z,dt)
    {const [k1x, k1y, k1z] = dadras(x,y,z);
     const [k2x, k2y, k2z] = dadras(x+k1x*dt/2, y+k1y*dt/2, z+k1z*dt/2);
     const [k3x, k3y, k3z] = dadras(x+k2x*dt/2, y+k2y*dt/2, z+k2z*dt/2);
     const [k4x, k4y, k4z] = dadras(x+k3x*dt, y+k3y*dt, z+k3z*dt);

     const newx= x+ (k1x +2*k2x +2*k3x +k4x )*dt/6;
     const newy = y+ (k1y +2*k2y +2*k3y +k4y)*dt/6;
     const newz = z+ (k1z +2*k2z +2*k3z +k4z)*dt/6;

     return [newx, newy, newz];}



function animate(){
    if (count<maxpoints){
        for (let i=0; i<stepsperframe; i++){
            [cx,cy,cz]= rk4(cx,cy,cz,dt);
            positions[count*3]=cx*scale;
            positions[count*3+1]=cy*scale;
            positions[count*3+2]=(cz-5)*scale;
            count++}
        }
    else{
        positions.copyWithin(0,stepsperframe*3);
        for (let i=0; i<stepsperframe; i++){
            [cx,cy,cz]=rk4(cx,cy,cz,dt);
            if (!isFinite(cx) || !isFinite(cy) || !isFinite(cz)) {
                cx=1; cy=-2; cz=0.1  // reset to starting point
                continue}

            positions[(maxpoints-stepsperframe+i)*3]=cx*scale;
            positions[((maxpoints-stepsperframe+i)*3)+1]=cy*scale;
            positions[((maxpoints-stepsperframe+i)*3)+2]=(cz-5)*scale;}
        }
    geometry.setDrawRange(0, count);
    geometry.attributes.position.needsUpdate=true;
    renderer.render(scene, camera);
    animationID=requestAnimationFrame(animate);
}


 
function initDadras(){

    cancelAnimationFrame(animationID);
    animationID=null;

    const canvas = document.getElementById('canvas-3d');

    renderer = new THREE.WebGLRenderer({canvas:canvas, antialias:true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    scene = new THREE.Scene(); 

    const fieldofview=50;
    const aspect= window.innerWidth/window.innerHeight;
    const near =0.1;
    const far=1000;
    camera= new THREE.PerspectiveCamera(fieldofview,aspect,near,far);
    camera.position.z=8;

    const drawingcanvas= document.createElement('canvas');
    const ctx=drawingcanvas.getContext('2d');
    const gradient =ctx.createRadialGradient(32,32,0,32,32,32);
    drawingcanvas.width=64;
    drawingcanvas.height=64;

    gradient.addColorStop(0,'rgba(255,255,255,1)');
    gradient.addColorStop(1,'rgba(0,0,255,0)');

    ctx.fillStyle=gradient;
    ctx.fillRect(0,0,64,64);

    const particletexture=new THREE.CanvasTexture(drawingcanvas);

    const PointsMaterial = new THREE.PointsMaterial
        ({vertexColors: true, 
        map: particletexture,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
        opacity: 1,
        size: 0.08,});

    const lineMaterial = new THREE.LineBasicMaterial({vertexColors: true, opacity: 0.2, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending});

    

    positions = new Float32Array(maxpoints*3); //multiply by 3 cuz eahc point has xyz coordiantes
    positions.fill(0);
    colors = new Float32Array(maxpoints*3); //multiply by 3 cuz eahc point has xyz coordiantes
    colors.fill(0);

    const coloremeraldgreen= new THREE.Color(0x50c878);
    const colorcyan = new THREE.Color(0x00ffff);
    const colorWhite = new THREE.Color(0xffffff);
    const tempcolor = new THREE.Color();

    for (let i=0; i<maxpoints; i++)
    {const t=i/ (maxpoints-1);
    if (t<0.05){
        const factor = t/0.05;
        tempcolor.copy(coloremeraldgreen).lerp(colorcyan, factor);
    }
    else{
        const factor = (t-0.05)/0.95;
        tempcolor.copy(colorcyan).lerp(colorWhite, factor);
    }
    colors[i*3] = tempcolor.r;
    colors[i*3 +1] = tempcolor.g;
    colors[i*3 +2] = tempcolor.b;}


    geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3)); 


    const points = new THREE.Points(geometry, PointsMaterial);
    const line = new THREE.Line(geometry, lineMaterial);

    group = new THREE.Group();
    window.currentGroup=group
    window.currentRenderer = renderer
    window.currentCamera = camera

    group.add(points);
    group.add(line);
    scene.add(group);
    count=0;
    cx=1;
    cy=-2;
    cz=0.1;
    geometry.setDrawRange(0,0);
    animate()}
    

function resetDadras(){
    count=0;
    cx=1;
    cy=-2;
    cz=0.1;
    positions.fill(0)
    geometry.setDrawRange(0,0)};



function destroyDadras(){
    cancelAnimationFrame(animationID);
    if (geometry) geometry.dispose();
    if (renderer) renderer.dispose();}

window.initDadras = initDadras;
window.destroyDadras = destroyDadras;
window.resetDadras=resetDadras
})();