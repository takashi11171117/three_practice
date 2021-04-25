import React, { FC, useEffect, useState } from 'react'
import imagesLoaded from 'imagesloaded'
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
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import Scroll from '../../helper/scroll'
import fragment from '../../shaders/webgl.frag'
import vertex from '../../shaders/webgl.vert'

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
  let images: Array<HTMLImageElement>
  let imageStores: Array<ImageStore>
  let width: number
  let height: number
  let scroll: Scroll
  let currentScroll = 0
  const previousScroll = 0

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

    Promise.all(allDone).then(() => {
      scroll = new Scroll()
      addObjects(object)
      addImages(scene)
      setPosition()

      const composer = new EffectComposer(renderer)
      const renderPass = new RenderPass(scene, camera)
      composer.addPass(renderPass)

      // resize
      handleResize({ camera, renderer })
      window.addEventListener('resize', () =>
        handleResize({ camera, renderer }),
      )

      animate({ object, composer, clock })
    })
  }

  const addImages = (scene: Scene) => {
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

      const material = new MeshBasicMaterial({ map: texture })

      const mesh = new Mesh(geometry, material)

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
    window.requestAnimationFrame(() => animate({ object, composer, clock }))
    // material.uniforms.u_time.value += clock.getDelta()
    composer.render()
  }

  return (
    <div id="container">
      <canvas ref={onCanvasLoaded} />
    </div>
  )
}

export default MergeWebglCanvas
