import React, { FC, useEffect, useState } from 'react'
import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  Object3D,
  PlaneBufferGeometry,
  ShaderMaterial,
  Mesh,
  DoubleSide,
  Clock,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import fragment from '../shaders/webgl.frag'
import vertex from '../shaders/webgl.vert'

const MergeWebgl: FC = () => {
  const [material, setMaterial] = useState(
    new ShaderMaterial({
      uniforms: {
        u_time: { value: 0.0 },
      },
      side: DoubleSide,
      fragmentShader: fragment,
      vertexShader: vertex,
      //   wireframe: true,
    }),
  )

  const onCanvasLoaded = (canvas: HTMLCanvasElement) => {
    if (!canvas) {
      return
    }

    const width = window.innerWidth
    const height = window.innerHeight

    // init scene
    const scene = new Scene()
    const camera = new PerspectiveCamera(70, width / height, 0.01, 10)
    camera.position.z = 1

    // init renderer
    const renderer = new WebGLRenderer({ canvas: canvas, antialias: true })
    renderer.setSize(width, height)

    // init object
    const object = new Object3D()
    scene.add(object)

    const clock = new Clock()

    // add object
    addObjects(object)

    const controls = new OrbitControls(camera, renderer.domElement)

    // add postprocessing
    const composer = new EffectComposer(renderer)
    const renderPass = new RenderPass(scene, camera)
    composer.addPass(renderPass)

    // resize
    window.addEventListener('resize', () => handleResize({ camera, renderer }))

    animate({ object, composer, clock })
  }

  const addObjects = (object) => {
    const geometry = new PlaneBufferGeometry(4, 4, 150, 150)

    const mesh = new Mesh(geometry, material)
    object.add(mesh)
  }

  // handle resize
  const handleResize = ({ camera, renderer }) => {
    const width = window.innerWidth
    const height = window.innerHeight
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, width)
  }

  useEffect(() => {
    return () => {
      window.removeEventListener('resize', () => handleResize)
    }
  })

  // animation
  const animate = ({ object, composer, clock }) => {
    window.requestAnimationFrame(() => animate({ object, composer, clock }))
    material.uniforms.u_time.value += clock.getDelta()
    setMaterial(material)
    composer.render()
  }

  return (
    <>
      <canvas ref={onCanvasLoaded} />
    </>
  )
}

export default MergeWebgl
