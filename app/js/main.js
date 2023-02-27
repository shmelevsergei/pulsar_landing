import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
import { GLTFLoader } from 'GLTFLoader';
import { RectAreaLightHelper } from 'RectAreaLightHelper'
import { RectAreaLightUniformsLib } from 'RectAreaLightUniformsLib';
import preloader from './preloader.js';
import animateBlocks from './animate.js';
import tabsButton from './tabs.js';


document.addEventListener('DOMContentLoaded', () => {

   Splitting();
   luxy.init();
   preloader();
   promo();
   animateBlocks();
   parallax();

   // ============ Tabs ============== //
   const tabsBtn = document.querySelector('.tabs-button');
   const tabsBtns = document.querySelectorAll('.tabs-button');
   const tabsItems = document.querySelectorAll('.tabs-item');
   tabsButton(tabsBtns, tabsItems, tabsBtn);
   // ============ End Tabs ============== //

   gsap.registerPlugin(ScrollTrigger);

   function promo() {
      let model = document.querySelector('.js_3d-model');

      const width = model.clientWidth;
      const height = model.clientHeight;

      function init() {
         //Scene
         const scene = new THREE.Scene()
         // scene.background = new THREE.Color("#060709");

         //Camera
         const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
         camera.position.set(0, 0, 150);

         //render
         const renderer = new THREE.WebGLRenderer({ antialias: true, alfa: true })
         renderer.setSize(width, height);
         renderer.setClearColor(0x000000, 0);
         model.appendChild(renderer.domElement)

         const light = new THREE.AmbientLight(0xffffff); // soft white light (мягкий белый свет)
         scene.add(light);

         // Model
         {
            const loader = new GLTFLoader();
            loader.load('./images/model/pulsar.gltf', gltf => {
               gltf.scene.scale.multiplyScalar(35 / 100); // adjust scalar factor to match your scene scale
               gltf.scene.position.x = 10; // once rescaled, position the model where needed
               gltf.scene.position.z = 0;
               gltf.scene.position.y = -10;

               scene.add(gltf.scene);
            },
               (error) => {
                  console.log('Error: ' + error)
               }
            )
         }

         {
            const light = new THREE.DirectionalLight(0xffffff, 1)
            light.position.set(0, 1, 0)
            light.lookAt(0, -1, 0)
            scene.add(light)

            // Helper
            // const helper = new THREE.DirectionalLightHelper(light, 1)
            // scene.add(helper)
         }

         {
            const light = new THREE.DirectionalLight(0xffffff, 1)
            light.position.set(0, -1, 0)
            light.lookAt(0, 1, 0)
            scene.add(light)

            // Helper
            // const helper = new THREE.DirectionalLightHelper(light, 5)
            // scene.add(helper)
         }
         {
            const light = new THREE.DirectionalLight(0xffffff, 1)
            light.position.set(0, 1, 1)
            light.lookAt(0, 1, 0)
            scene.add(light)

            // Helper
            // const helper = new THREE.DirectionalLightHelper(light, 5)
            // scene.add(helper)
         }

         RectAreaLightUniformsLib.init();
         {
            const rectLight = new THREE.RectAreaLight(0xffffff, 1, 100, 100);
            rectLight.position.set(-1, 0, 0)
            rectLight.rotation.y = Math.PI + Math.PI / 4;
            scene.add(rectLight)
         }

         {
            const rectLight = new THREE.RectAreaLight(0xffffff, 1, 100, 100);
            rectLight.position.set(0, -1, 0)
            rectLight.rotation.y = Math.PI - Math.PI / 4;
            scene.add(rectLight)
         }

         //OrbitControls
         const controls = new OrbitControls(camera, renderer.domElement);
         controls.enableZoom = false;
         controls.autoRotate = true;
         controls.autoRotateSpeed = 2;
         controls.enableDamping = false;
         controls.minPolarAngle = 1;
         controls.maxPolarAngle = 1;
         // controls.minAzimuthAngle = 1;
         // controls.maxAzimuthAngle = 1;


         //Resize
         window.addEventListener('resize', onWindowResize, false)

         function onWindowResize() {
            camera.aspect = width / height;
            camera.updateProjectionMatrix();

            renderer.setSize(width, height)
         }

         // Animate
         function animate() {
            requestAnimationFrame(animate)
            controls.update();
            renderer.render(scene, camera)
         }
         animate()

      }

      init();
   }

   function parallax() {
      gsap.from('.parallax__col._left', {
         scrollTrigger: {
            trigger: '.parallax__wrapper',
            start: 'top bottom',
            scrub: 1.9,
         },
         yPercent: 10,
      })
      gsap.to('.parallax__col._right', {
         scrollTrigger: {
            trigger: '.parallax__wrapper',
            start: 'top top',
            scrub: 1.9,
         },
         yPercent: -20,
      })
   }

   function animateOnScroll(canvasID, videoInfo) {
      const canvas = document.getElementById(canvasID);
      const canvasContext = canvas.getContext('2d');

      canvas.width = 1920;
      canvas.height = 1080;

      for (let i = 0; i <= videoInfo.totalFrames; i++) {
         const img = new Image();
         img.src = videoInfo.currentImage(i);
         videoInfo.images.push(img);
      }

      gsap.to(videoInfo, {
         currentFrame: videoInfo.totalFrames,
         snap: 'currentFrame',
         ease: 'none',
         scrollTrigger: {
            trigger: canvas,
            start: 'top',
            end: `bottom+=${videoInfo.totalFrames * videoInfo.totalTime}`,
            scrub: true,
            pin: true,
            markers: true,
         },
         onUpdate: render,
      })

      videoInfo.images[0].onload = () => {
         canvasContext.drawImage(videoInfo.images[0], 0, 0);
      }

      function render() {
         canvasContext.clearRect(0, 0, canvas.width, canvas.height);
         canvasContext.drawImage(videoInfo.images[videoInfo.currentFrame], 0, 0);
      }
   };

   const videoPresentInfo = {
      totalFrames: 73,
      totalTime: 5,
      images: [],
      currentFrame: 0,
      currentImage: (index) => `../images/frames/presents/${index}.webp`,
   };

   animateOnScroll('video-present', videoPresentInfo);

})
