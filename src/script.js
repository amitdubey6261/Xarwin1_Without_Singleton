import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { ARButton } from 'three/examples/jsm/webxr/ARButton'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import Stats from 'three/examples/jsm/libs/stats.module'
import * as dat from 'dat.gui'

const gui = new dat.GUI()

const canvas = document.querySelector('canvas.webgl')

const scene = new THREE.Scene()
scene.background = new THREE.Color(0xcacaca);

const geometry = new THREE.TorusGeometry( .7, .2, 16, 100 );

const material = new THREE.MeshBasicMaterial()
material.color = new THREE.Color(0xff0000)

// Mesh
// const sphere = new THREE.Mesh(geometry,material)
// scene.add(sphere)

const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const Loader = new GLTFLoader();
// var model , skeleton , mixer , idle ; 
var model, skeleton, mixer , idle ;

Loader.load('/Model.glb' , (object)=>{

    console.log(object)

    model = object.scene ; 
    scene.add(model);

    model.traverse( function ( obj ) {

        if ( obj.isMesh ) obj.castShadow = true;

    } );

    skeleton = new THREE.SkeletonHelper(model);
    skeleton.visible= 1 ; 
    scene.add(skeleton)

    const animations = object.animations ; 


    mixer = new THREE.AnimationMixer(model);

    const clip = THREE.AnimationClip.findByName(animations,'Walking')

    const action = mixer.clipAction(clip);

    action.play();

    console.log(animations)
})

window.addEventListener('resize', () =>{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

//stats panel 
const stats = Stats()
document.body.appendChild(stats.dom)

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

const axisHelper = new THREE.AxesHelper();
const gridHelper = new THREE.GridHelper(500,100);

scene.add(axisHelper);
scene.add(gridHelper);

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias:true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const button = ARButton.createButton(renderer);
document.body.appendChild(button);

const clock = new THREE.Clock()

const tick = () =>{

    const elapsedTime = clock.getElapsedTime()

    if(mixer != undefined ){
        mixer.update(0.009)
    }
    

    // Update objects
    // sphere.rotation.y = .5 * elapsedTime

    // Update Orbital Controls
    controls.update()
    stats.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()