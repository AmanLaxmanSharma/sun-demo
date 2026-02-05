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
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      color: 0xff9900,
      emissive: 0xff5500,
      emissiveIntensity: 0.5
    });
    //sun 
    const sun = new THREE.Mesh(geometry, material)
    scene.add(sun)
    function createStars() {
      const starGeometry = new THREE.BufferGeometry(0.1, 5, 0, Math.PI * 2)
      const starCount = 1000

      const positions = new Float32Array(starCount * 3)

      for (let i = 0; i < starCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 200
      }

      starGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      )

      const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.7
      })

      const stars = new THREE.Points(starGeometry, starMaterial)
      scene.add(stars)
    }
    createStars();
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
