import Link from 'next/link'
import React, { FC, useEffect, useState, useMemo } from 'react'
import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  Object3D,
  Fog,
  DirectionalLight,
  AmbientLight,
  BoxGeometry,
  ShaderMaterial,
  Mesh,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass'
import fragment from '../shaders/webgl.frag'
import vertex from '../shaders/webgl.vert'

const MergeWebgl: FC = () => {
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

    // add object
    addObjects(object)

    const controls = new OrbitControls(camera, renderer.domElement)

    // add postprocessing
    const composer = new EffectComposer(renderer)
    const renderPass = new RenderPass(scene, camera)
    composer.addPass(renderPass)

    // resize
    window.addEventListener('resize', () => handleResize({ camera, renderer }))

    animate({ object, composer })
  }

  const addObjects = (object) => {
    const geometry = new BoxGeometry(0.5, 0.5, 0.5)

    const material = new ShaderMaterial({
      fragmentShader: fragment,
      vertexShader: vertex,
    })

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
  const animate = ({ object, composer }) => {
    window.requestAnimationFrame(() => animate({ object, composer }))
    object.rotation.x += 0.05
    object.rotation.y += 0.05
    composer.render()
  }

  return (
    <>
      <canvas ref={onCanvasLoaded} />
    </>
  )
}

export default MergeWebgl
