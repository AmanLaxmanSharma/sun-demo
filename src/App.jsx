import { useEffect, useRef, useState } from "react"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import * as THREE from "three"
import "./App.css"

export default function App() {
  const containerRef = useRef(null)

  const sceneRef = useRef()
  const cameraRef = useRef()
  const rendererRef = useRef()
  const sunRef = useRef()
  const frameRef = useRef()

  const [hovered, setHovered] = useState(false)
  const [active, setActive] = useState(false)

  useEffect(() => {
    // 1. SCENE
    const scene = new THREE.Scene()
    sceneRef.current = scene
    scene.background = new THREE.Color(0x000010)

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

createStars()


    // 2. CAMERA
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.z = 5
    cameraRef.current = camera

    // 3. RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer
    // orbitcontrols
    const controls = new OrbitControls(camera, renderer.domElement)
 controls.enableDamping = true


    // 4. LIGHTS
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.005)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(10, 20, 30)
    scene.add(directionalLight)

    // 5. SUN
const geometry = new THREE.SphereGeometry(2, 40, 40)
const material = new THREE.MeshStandardMaterial({
  color: "#ff9900",
  emissive: "#ffff00",
  emissiveIntensity: 0.1,
})

const sun = new THREE.Mesh(geometry, material)
scene.add(sun)
sunRef.current = sun

// Rotation marker
const marker = new THREE.Mesh(
  new THREE.SphereGeometry(0.1),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
sun.add(marker)
marker.position.set(1, 0, 0)


    // 6. MOUSE INTERACTION
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    function onMouseMove(event) {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObject(sun)

      if (intersects.length > 0) {
        setHovered(true)
        sun.material.color.set("#ffff00")
      } else {
        setHovered(false)
        sun.material.color.set("#ff9900")
      }
    }

    function onClick() {
      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObject(sun)

      if (intersects.length > 0) {
        setActive(prev => !prev)
      }
    }

    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("click", onClick)

    // 7. RESIZE
    function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener("resize", onResize)
    controls.update();
    // 8. ANIMATION LOOP
    function animate() {
  sun.rotation.y += 0.005
  sun.rotation.x += 0.005

  sun.scale.setScalar(active ? 2 : 1)
  sun.material.emissiveIntensity = active ? 0.6 : 0.3

  controls.update()
  renderer.render(scene, camera)

  frameRef.current = requestAnimationFrame(animate)
    }


    animate()

    // 9. CLEANUP
    return () => {
      cancelAnimationFrame(frameRef.current)

      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("click", onClick)
      window.removeEventListener("resize", onResize)
      controls.dispose()

      geometry.dispose()
      material.dispose()
      renderer.dispose()
    }
  }, [])

  return <div ref={containerRef} />
}
