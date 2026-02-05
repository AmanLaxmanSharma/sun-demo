import { useEffect, useRef, useState } from "react"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import * as THREE from "three"
import "./App.css"

export default function App() {
  const containerRef = useRef(null)
  useEffect(() => {
    //scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000010)
    //renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    containerRef.current.appendChild(renderer.domElement)
    //geometry
    //material 
    const geometry = new THREE.SphereGeometry(2, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      color: 0xFFFF0080,
      emissive: 0xff5500,
      emissiveIntensity: 6, 
    });
    //sun 
    const sun = new THREE.Mesh(geometry, material)
    scene.add(sun)
    //star
    function createStars() {
      const starCount = 1000

      // geometry + material for one star
      const starGeometry = new THREE.SphereGeometry(0.2, 8, 8)
      const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffec9c })

      for (let i = 0; i < starCount; i++) {
        const star = new THREE.Mesh(starGeometry, starMaterial)

        // random position in space
        star.position.x = (Math.random() - 0.5) * 200
        star.position.y = (Math.random() - 0.5) * 200
        star.position.z = (Math.random() - 0.5) * 200

        scene.add(star)
      }
    }

    createStars()

    //light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.005)
    scene.add(ambientLight)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(10, 20, 30)
    scene.add(directionalLight)
    //camara
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.z = 5
    //orbital control
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    //renderer

    function animate() {


      // sun.scale.setScalar(active ? 2 : 1)
      // sun.material.emissiveIntensity = active ? 0.6 : 0.3
      sun.rotation.y += 0.009
      sun.rotation.x += 0.009
      controls.update()
      renderer.render(scene, camera)

      requestAnimationFrame(animate)
    }
    animate()


  }, [])


  return <div ref={containerRef} />
}
