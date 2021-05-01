import React, { FC, useEffect, useState } from 'react'
import imagesLoaded from 'imagesloaded'
import gsap from 'gsap'
import FontFaceObserver from 'fontfaceobserver'
import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  Object3D,
  PlaneBufferGeometry,
  SphereBufferGeometry,
  ShaderMaterial,
  Mesh,
  DoubleSide,
  Clock,
  TextureLoader,
  Texture,
  MeshBasicMaterial,
  Vector2,
  Raycaster,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import Scroll from '../../helper/scroll'
import fragment from '../../shaders/webgl.frag'
import vertex from '../../shaders/webgl.vert'
import noise from '../../shaders/noise.glsl'

type ImageStore = {
  img: HTMLImageElement
  mesh: Mesh
  top: number
  left: number
  width: number
  height: number
}

const MergeWebglCanvas: FC = () => {
  let material: ShaderMaterial
  const materials: Array<ShaderMaterial> = []
  let images: Array<HTMLImageElement>
  let imageStores: Array<ImageStore>
  let width: number
  let height: number
  let scroll: Scroll
  let currentScroll = 0
  const previousScroll = 0
  let customPass: ShaderPass

  const onCanvasLoaded = (canvas: HTMLCanvasElement) => {
    if (!canvas) {
      return
    }

    width = window.innerWidth
    height = window.innerHeight

    console.log(width, height)

    // init scene
    const scene = new Scene()
    const camera = new PerspectiveCamera(70, width / height, 100, 2000)
    camera.position.z = 600

    camera.fov = 2 * Math.atan(height / 2 / 600) * (180 / Math.PI)

    // init renderer
    const renderer = new WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // init object
    const object = new Object3D()
    scene.add(object)

    const clock = new Clock()

    // const controls = new OrbitControls(camera, renderer.domElement)
    images = Array.from(document.querySelectorAll('img'))

    // const fontOpen = new Promise<void>((resolve) => {
    //   new FontFaceObserver('Open Sans').load().then(() => {
    //     resolve()
    //   })
    // })

    // const fontPlayfair = new Promise<void>((resolve) => {
    //   new FontFaceObserver('Playfair Display').load().then(() => {
    //     resolve()
    //   })
    // })

    const preloadImages = new Promise((resolve) => {
      imagesLoaded(
        document.querySelectorAll('img'),
        { background: true },
        resolve,
      )
    })

    const allDone = [preloadImages]
    const raycaster = new Raycaster()
    const mouse = new Vector2()

    Promise.all(allDone).then(() => {
      scroll = new Scroll()
      addObjects(object)
      addImages(scene)
      setPosition()
      mouseMovement(camera, raycaster, mouse, scene)

      // resize
      handleResize({ camera, renderer })
      window.addEventListener('resize', () =>
        handleResize({ camera, renderer }),
      )

      const composer = composerPass(renderer, scene, camera)

      animate({ object, composer, clock })
    })
  }

  const composerPass = (renderer, scene, camera): EffectComposer => {
    const composer = new EffectComposer(renderer)
    const renderPass = new RenderPass(scene, camera)
    composer.addPass(renderPass)

    //custom shader pass
    const counter = 0.0
    const myEffect = {
      uniforms: {
        tDiffuse: { value: null },
        scrollSpeed: { value: null },
        time: { value: null },
      },
      vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix 
          * modelViewMatrix 
          * vec4( position, 1.0 );
      }
      `,
      fragmentShader: `
      uniform sampler2D tDiffuse;
      varying vec2 vUv;
      uniform float scrollSpeed;
      uniform float time;
      ${noise}
      void main(){
        vec2 newUV = vUv;
        float area = smoothstep(1.,0.8,vUv.y)*2. - 1.;
        float area1 = smoothstep(0.4,0.0,vUv.y);
        area1 = pow(area1,4.);
        float noise = 0.5*(cnoise(vec3(vUv*10.,time/5.)) + 1.);
        float n = smoothstep(0.5,0.51, noise + area/2.);
        newUV.x -= (vUv.x - 0.5)*0.1*area1*scrollSpeed;
        gl_FragColor = texture2D( tDiffuse, newUV);
      //   gl_FragColor = vec4(n,0.,0.,1.);
      gl_FragColor = mix(vec4(1.),texture2D( tDiffuse, newUV),n);
      // gl_FragColor = vec4(area,0.,0.,1.);
      }
      `,
    }

    customPass = new ShaderPass(myEffect)
    customPass.renderToScreen = true

    composer.addPass(customPass)

    return composer
  }

  const mouseMovement = (
    camera: PerspectiveCamera,
    raycaster: Raycaster,
    mouse: Vector2,
    scene: Scene,
  ) => {
    window.addEventListener(
      'mousemove',
      (event) => {
        mouse.x = (event.clientX / width) * 2 - 1
        mouse.y = -(event.clientY / height) * 2 + 1

        // update the picking ray with the camera and mouse position
        raycaster.setFromCamera(mouse, camera)

        // calculate objects intersecting the picking ray
        const intersects = raycaster.intersectObjects(scene.children)

        if (intersects.length > 0) {
          // console.log(intersects[0]);
          const obj = intersects[0].object
          obj.material.uniforms.hover.value = intersects[0].uv
        }
      },
      false,
    )
  }

  const addImages = (scene: Scene) => {
    material = new ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        uImage: { value: 0 },
        hover: { value: new Vector2(0.5, 0.5) },
        hoverState: { value: 0 },
      },
      side: DoubleSide,
      fragmentShader: fragment,
      vertexShader: vertex,
      //   wireframe: true,
    })

    imageStores = images.map((img) => {
      const bounds = img.getBoundingClientRect()
      console.log(bounds)

      const geometry = new PlaneBufferGeometry(
        bounds.width,
        bounds.height,
        10,
        10,
      )

      const texture = new Texture(img)
      texture.needsUpdate = true

      const _material = material.clone()

      img.addEventListener('mouseenter', () => {
        gsap.to(_material.uniforms.hoverState, {
          duration: 1,
          value: 1,
          ease: 'power3.out',
        })
      })
      img.addEventListener('mouseout', () => {
        gsap.to(_material.uniforms.hoverState, {
          duration: 1,
          value: 0,
          ease: 'power3.out',
        })
      })

      materials.push(_material)

      _material.uniforms.uImage.value = texture

      const mesh = new Mesh(geometry, _material)

      scene.add(mesh)

      return {
        img: img,
        mesh: mesh,
        top: bounds.top,
        left: bounds.left,
        width: bounds.width,
        height: bounds.height,
      }
    })
  }

  const addObjects = (object: Object3D) => {
    const geometry = new PlaneBufferGeometry(200, 400, 10, 10)
    // const geometry = new SphereBufferGeometry(1, 80, 80)

    material = new ShaderMaterial({
      uniforms: {
        u_time: { value: 0.0 },
        tDiffuse: {
          value: new TextureLoader().load(`${process.env.IMAGE_URL}ocean.jpg`),
        },
      },
      side: DoubleSide,
      fragmentShader: fragment,
      vertexShader: vertex,
      wireframe: true,
    })

    const mesh = new Mesh(geometry, material)
    object.add(mesh)
  }

  const setPosition = () => {
    imageStores.forEach((o) => {
      o.mesh.position.y = currentScroll - o.top + height / 2 - o.height / 2
      o.mesh.position.x = o.left - width / 2 + o.width / 2
    })
  }

  // handle resize
  const handleResize = ({ camera, renderer }) => {
    const width = window.innerWidth
    const height = window.innerHeight
    renderer.setSize(width, height)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
  }

  useEffect(() => {
    return () => {
      window.removeEventListener('resize', () => handleResize)
    }
  })

  // animation
  const animate = ({ object, composer, clock }) => {
    scroll.render()
    currentScroll = scroll.scrollToRender
    setPosition()
    customPass.uniforms.scrollSpeed.value = scroll.speedTarget
    customPass.uniforms.time.value += clock.getDelta()
    window.requestAnimationFrame(() => animate({ object, composer, clock }))
    materials.forEach((m) => {
      console.log(m)
      m.uniforms.time.value += clock.getDelta()
    })
    composer.render()
  }

  return (
    <div id="container">
      <canvas ref={onCanvasLoaded} />
    </div>
  )
}

export default MergeWebglCanvas
