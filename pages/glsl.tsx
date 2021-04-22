import Link from 'next/link'
import React, { FC, useEffect, useState } from 'react'
import {
  WebGLRenderer,
  Scene,
  OrthographicCamera,
  Clock,
  PlaneGeometry,
  Color,
  ShaderMaterial,
  Mesh,
} from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import fragment from '../shaders/glsl.frag'
import vertex from '../shaders/glsl.vert'

const GLSL: FC = () => {
  const [material, setMaterial] = useState(
    new ShaderMaterial({
      uniforms: {
        u_color_a: { value: new Color(0xff0000) },
        u_color_b: { value: new Color(0x00ffff) },
        u_time: { value: 0.0 },
        u_mouse: { value: { x: 0.0, y: 0.0 } },
        u_resolution: { value: { x: 0, y: 0 } },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
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
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
    camera.position.z = 1

    // init renderer
    const renderer = new WebGLRenderer({ canvas: canvas, antialias: true })
    renderer.setClearColor('#1d1d1d')
    renderer.setSize(width, height)

    const clock = new Clock()

    const geometry = new PlaneGeometry(2, 2)

    const plane = new Mesh(geometry, material)
    scene.add(plane)

    // add postprocessing
    const composer = new EffectComposer(renderer)
    const renderPass = new RenderPass(scene, camera)
    composer.addPass(renderPass)
    handleResize({ camera, renderer })
    window.addEventListener('resize', () => handleResize({ camera, renderer }))

    animate({ composer, clock, plane })
  }

  const move = (evt) => {
    material.uniforms.u_mouse.value.x = evt.touches
      ? evt.touches[0].clientX
      : evt.clientX
    material.uniforms.u_mouse.value.y = evt.touches
      ? evt.touches[0].clientY
      : evt.clientY
    setMaterial(material)
  }

  // handle resize
  const handleResize = ({ camera, renderer }) => {
    const aspectRatio = window.innerWidth / window.innerHeight
    let width, height
    if (aspectRatio >= 1) {
      width = 1
      height = (window.innerHeight / window.innerWidth) * width
    } else {
      width = aspectRatio
      height = 1
    }
    camera.left = -width
    camera.right = width
    camera.top = height
    camera.bottom = -height
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    material.uniforms.u_resolution.value.x = window.innerWidth
    material.uniforms.u_resolution.value.y = window.innerHeight
    setMaterial(material)
  }

  useEffect(() => {
    if ('ontouchstart' in window) {
      document.addEventListener('touchmove', move)
    } else {
      document.addEventListener('mousemove', move)
    }

    return () => {
      window.removeEventListener('resize', () => handleResize)
    }
  })

  // animation
  const animate = (params: {
    composer: EffectComposer
    clock: Clock
    plane: Mesh<PlaneGeometry, ShaderMaterial>
  }) => {
    window.requestAnimationFrame(() => animate(params))
    material.uniforms.u_time.value += params.clock.getDelta()
    setMaterial(material)
    params.composer.render()
  }

  return (
    <>
      <canvas ref={onCanvasLoaded} />
    </>
  )
}

export default GLSL
