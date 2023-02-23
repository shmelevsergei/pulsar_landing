import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
import { GLTFLoader } from 'GLTFLoader';
import { RectAreaLightHelper } from 'RectAreaLightHelper'
import { RectAreaLightUniformsLib } from 'RectAreaLightUniformsLib';
import preloader from './preloader.js';
import animate from './animate.js';



document.addEventListener('DOMContentLoaded', () => {

   preloader();

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

   function animateOnScroll(canvasID, videoInfo) {
      const canvas = document.getElementById(canvasID);
      const canvasContext = canvas.getContext('2d');

      const wrapperCanvas = document.querySelectorAll('.video-block');

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

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
            scrub: 2,
            pin: true,
            // markers: true,
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
   }

   gsap.registerPlugin(ScrollTrigger);

   const videoPresentInfo = {
      totalFrames: 73,
      totalTime: 5,
      images: [],
      currentFrame: 0,
      currentImage: (index) => `../images/frames/presents/${index}.webp`,
   };

   const videoDemoInfo = {
      totalFrames: 138,
      totalTime: 5,
      images: [],
      currentFrame: 0,
      currentImage: (index) => `../images/frames/particles/${index}.webp`,
   };

   const videoDemo1Info = {
      totalFrames: 99,
      totalTime: 3,
      images: [],
      currentFrame: 0,
      currentImage: (index) => `../images/frames/manifestation/${index}.webp`,
   };

   const accumDemoInfo = {
      totalFrames: 213,
      totalTime: 8,
      images: [],
      currentFrame: 0,
      currentImage: (index) => `../images/frames/accum/${index}.webp`,
   };

   const triggerDemoInfo = {
      totalFrames: 93,
      totalTime: 3,
      images: [],
      currentFrame: 0,
      currentImage: (index) => `../images/frames/trigger/${index}.webp`,
   };

   const returnDemoInfo = {
      totalFrames: 216,
      totalTime: 8,
      images: [],
      currentFrame: 0,
      currentImage: (index) => `../images/frames/return/${index}.webp`,
   };

   const lightsDemoInfo = {
      totalFrames: 422,
      totalTime: 10,
      images: [],
      currentFrame: 0,
      currentImage: (index) => `../images/frames/lights/${index}.webp`,
   };


   promo();
   animateOnScroll('video-present', videoPresentInfo);

   animateOnScroll('video-demo', videoDemoInfo);
   animateOnScroll('video-demo-1', videoDemo1Info);
   animateOnScroll('accum-demo', accumDemoInfo);
   animateOnScroll('trigger-demo', triggerDemoInfo);
   animateOnScroll('return-demo', returnDemoInfo);
   animateOnScroll('lights-demo', lightsDemoInfo);

   // ======= GSAP Animation ======= //

   animate();

   // ============ Tabs ============== //
   const tabsBtn = document.querySelector('.tabs-button');
   const tabsBtns = document.querySelectorAll('.tabs-button');
   const tabsItems = document.querySelectorAll('.tabs-item');

   function tabsButton(buttons, tabs, button) {
      buttons.forEach(item => {
         item.addEventListener('click', () => {
            let currentBtn = item;
            let tabId = currentBtn.getAttribute("data-tab");
            let currentTab = document.querySelector(tabId);

            if (!currentBtn.classList.contains('_active')) {

               removeClass(buttons);
               removeClass(tabs);

               currentBtn.classList.add('_active');
               currentTab.classList.add('_active');
            }

            function removeClass(elem) {
               elem.forEach(item => {
                  item.classList.remove('_active');
               });
            }

         });
         button.click();
      });
   }
   tabsButton(tabsBtns, tabsItems, tabsBtn);
})
