import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
import { GLTFLoader } from 'GLTFLoader';
import { RectAreaLightHelper } from 'RectAreaLightHelper'
import { RectAreaLightUniformsLib } from 'RectAreaLightUniformsLib';
import preloader from './preloader.js';
import animateBlocks from './animate.js';
import animateHeader from './fixed-header.js';
import tabsButton from './tabs.js';


document.addEventListener('DOMContentLoaded', () => {

   Splitting();
   preloader();
   animateHeader();
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

   function sectionPresent() {
      const sectionPresent = document.querySelector('.present');
      const canvas = document.getElementById('video-present');
      const ctx = canvas.getContext('2d');
      const textTop = document.querySelector('.present__top-descr');
      const textMiddle = document.querySelector('.present__middle-descr');
      const textBottom = document.querySelector('.present__bottom-descr');

      canvas.width = 1920;
      canvas.height = 1080;

      let frameCount = 78;
      const currentFrame = index => (`../images/frames/presents/${index}.webp`);

      let images = [];
      let presents = {
         frame: 0
      };

      for (let i = 0; i < frameCount; i++) {
         let img = new Image();
         img.src = currentFrame(i);
         images.push(img);
      }

      gsap.timeline({
         onUpdate: render,
         scrollTrigger: {
            trigger: sectionPresent,
            pin: true,
            scrub: true,
            end: '+=400%',
            // markers: true,
         }
      })

         .to(textTop, {
            opacity: 1,
            duration: 6,
         })
         .to(textTop, {
            opacity: 0,
         })
         .to(textMiddle, {
            opacity: 1,
            duration: 6,
         })
         .to(textMiddle, {
            opacity: 0,
         })
         .to(textBottom, {
            opacity: 1,
            duration: 6,
         })
         .to(textBottom, {
            opacity: 0,
         })
         .to(presents, {
            frame: frameCount - 1,
            snap: "frame",
            ease: "none",
            duration: 20,
         }, 0);


      images[0].onload = render;

      function render() {
         ctx.clearRect(0, 0, canvas.width, canvas.height);
         ctx.drawImage(images[presents.frame], 0, 0);
      }
   }
   sectionPresent();


   function sectionParticles() {
      const sectionParticles = document.querySelector('.particles');
      const canvas = document.getElementById('video-particles');
      const ctx = canvas.getContext('2d');

      canvas.width = 1920;
      canvas.height = 1080;

      let frameCount = 138;
      const currentFrame = index => (`../images/frames/particles/${index}.webp`);

      let images = [];
      let particles = {
         frame: 0
      };

      for (let i = 0; i < frameCount; i++) {
         let img = new Image();
         img.src = currentFrame(i);
         images.push(img);
      }

      gsap.timeline({
         onUpdate: render,
         scrollTrigger: {
            trigger: sectionParticles,
            pin: true,
            scrub: true,
            end: '+=200%',
            // markers: true,
         }
      })
         .to(particles, {
            frame: frameCount - 1,
            snap: "frame",
            ease: "none",
            duration: 1,
         }, 0);


      images[0].onload = render;

      function render() {
         ctx.clearRect(0, 0, canvas.width, canvas.height);
         ctx.drawImage(images[particles.frame], 0, 0);
      }
   }
   sectionParticles();

   function sectionManifestation() {
      const sectionManifestation = document.querySelector('.manifestation');
      const canvas = document.getElementById('video-manifestation');
      const ctx = canvas.getContext('2d');

      canvas.width = 1920;
      canvas.height = 1080;

      let frameCount = 99;
      const currentFrame = index => (`../images/frames/manifestation/${index}.webp`);

      let images = [];
      let manifestation = {
         frame: 0
      };

      for (let i = 0; i < frameCount; i++) {
         let img = new Image();
         img.src = currentFrame(i);
         images.push(img);
      }

      gsap.timeline({
         onUpdate: render,
         scrollTrigger: {
            trigger: sectionManifestation,
            pin: true,
            scrub: true,
            end: '+=200%',
            // markers: true,
         }
      })
         .to(manifestation, {
            frame: frameCount - 1,
            snap: "frame",
            ease: "none",
            duration: 1,
         }, 0);


      images[0].onload = render;

      function render() {
         ctx.clearRect(0, 0, canvas.width, canvas.height);
         ctx.drawImage(images[manifestation.frame], 0, 0);
      }
   }
   sectionManifestation();

   function sectionAccum() {
      const sectionAccum = document.querySelector('.accum');
      const canvas = document.getElementById('accum-video');
      const ctx = canvas.getContext('2d');
      const textRight = document.querySelector('.accum__descr-top');
      const textLeft = document.querySelector('.accum__descr-bottom');

      canvas.width = 1920;
      canvas.height = 1080;

      let frameCount = 213;
      const currentFrame = index => (`../images/frames/accum/${index}.webp`);

      let images = [];
      let accum = {
         frame: 0
      };

      for (let i = 0; i < frameCount; i++) {
         let img = new Image();
         img.src = currentFrame(i);
         images.push(img);
      }

      gsap.timeline({
         onUpdate: render,
         scrollTrigger: {
            trigger: sectionAccum,
            pin: true,
            scrub: true,
            end: '+=400%',
            // markers: true,
         }
      })

         .to(textRight, {
            opacity: 1,
            duration: 6,
         })
         .to(textRight, {
            opacity: 0,
         })
         .to(textLeft, {
            opacity: 1,
            duration: 6,
         })
         .to(textLeft, {
            opacity: 0,
         })

         .to(accum, {
            frame: frameCount - 1,
            snap: "frame",
            ease: "none",
            duration: 14,
         }, 0);


      images[0].onload = render;

      function render() {
         ctx.clearRect(0, 0, canvas.width, canvas.height);
         ctx.drawImage(images[accum.frame], 0, 0);
      }
   }
   sectionAccum();

   function sectionTrigger() {
      const sectionTrigger = document.querySelector('.trigger');
      const canvas = document.getElementById('trigger-demo');
      const ctx = canvas.getContext('2d');
      const text = document.querySelector('.trigger__descr');

      canvas.width = 1920;
      canvas.height = 1080;

      let frameCount = 93;
      const currentFrame = index => (`../images/frames/trigger/${index}.webp`);

      let images = [];
      let trigger = {
         frame: 0
      };

      for (let i = 0; i < frameCount; i++) {
         let img = new Image();
         img.src = currentFrame(i);
         images.push(img);
      }

      gsap.timeline({
         onUpdate: render,
         scrollTrigger: {
            trigger: sectionTrigger,
            pin: true,
            scrub: true,
            end: '+=200%',
            // markers: true,
         }
      })

         .to(text, {
            opacity: 1,
            duration: 10,
         })
         .to(text, {
            opacity: 0,
         })
         .to(trigger, {
            frame: frameCount - 1,
            snap: "frame",
            ease: "none",
            duration: 12,
         }, 0);


      images[0].onload = render;

      function render() {
         ctx.clearRect(0, 0, canvas.width, canvas.height);
         ctx.drawImage(images[trigger.frame], 0, 0);
      }
   }
   sectionTrigger();

   function sectionReturn() {
      const sectionReturn = document.querySelector('.return');
      const canvas = document.getElementById('return-demo');
      const ctx = canvas.getContext('2d');
      const text = document.querySelector('.return__descr');

      canvas.width = 1920;
      canvas.height = 1080;

      let frameCount = 216;
      const currentFrame = index => (`../images/frames/return/${index}.webp`);

      let images = [];
      let returnC = {
         frame: 0
      };

      for (let i = 0; i < frameCount; i++) {
         let img = new Image();
         img.src = currentFrame(i);
         images.push(img);
      }

      gsap.timeline({
         onUpdate: render,
         scrollTrigger: {
            trigger: sectionReturn,
            pin: true,
            scrub: true,
            end: '+=200%',
            // markers: true,
         }
      })

         .to(text, {
            opacity: 1,
            duration: 10,
         })
         .to(text, {
            opacity: 0,
         })
         .to(returnC, {
            frame: frameCount - 1,
            snap: "frame",
            ease: "none",
            duration: 12,
         }, 0);


      images[0].onload = render;

      function render() {
         ctx.clearRect(0, 0, canvas.width, canvas.height);
         ctx.drawImage(images[returnC.frame], 0, 0);
      }
   }
   sectionReturn();

   function sectionLights() {
      const sectionLights = document.querySelector('.lights');
      const canvas = document.getElementById('lights-demo');
      const ctx = canvas.getContext('2d');
      const text = document.querySelector('.lights__descr');

      canvas.width = 1920;
      canvas.height = 1080;

      let frameCount = 422;
      const currentFrame = index => (`../images/frames/lights/${index}.webp`);

      let images = [];
      let lights = {
         frame: 0
      };

      for (let i = 0; i < frameCount; i++) {
         let img = new Image();
         img.src = currentFrame(i);
         images.push(img);
      }

      gsap.timeline({
         onUpdate: render,
         scrollTrigger: {
            trigger: sectionLights,
            pin: true,
            scrub: true,
            end: '+=400%',
            // markers: true,
         }
      })

         .to(text, {
            opacity: 1,
            duration: 10,
         })
         .to(text, {
            opacity: 0,
         })
         .to(lights, {
            frame: frameCount - 1,
            snap: "frame",
            ease: "none",
            duration: 12,
         }, 0);


      images[0].onload = render;

      function render() {
         ctx.clearRect(0, 0, canvas.width, canvas.height);
         ctx.drawImage(images[lights.frame], 0, 0);
      }
   }
   sectionLights();









})
