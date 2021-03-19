const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: 'high-performance',
})
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.outputEncoding = THREE.sRGBEncoding
document.body.appendChild(renderer.domElement)

const controls = new THREE.OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.minPolarAngle = Math.PI / 2
controls.maxPolarAngle = Math.PI / 2
controls.target.y = 2

const ambientLight = new THREE.AmbientLight(0x202020)
scene.add(ambientLight)

const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1)
hemisphereLight.color.setHSL(0.6, 1, 0.1)
hemisphereLight.groundColor.setHSL(0.1, 0.2, 0.1)
scene.add(hemisphereLight)

const pointLight = new THREE.PointLight(0xffffff, 1, 100)
pointLight.position.set(0, 10, 5)
scene.add(pointLight)

const gridHelper = new THREE.GridHelper(100, 20)
scene.add(gridHelper)

const planeGeo = new THREE.PlaneGeometry(105, 105)
const groundMat = new THREE.MeshLambertMaterial({ side: THREE.DoubleSide })
groundMat.color.setHSL(0.095, 1, 0.75)
const ground = new THREE.Mesh(planeGeo, groundMat)
ground.rotation.x = Math.PI / 2
scene.add(ground)

const textureLoader = new THREE.TextureLoader()

const numOfImages = 30
for (let i = 0; i < numOfImages; i++) {
  generateImage()
}

camera.position.z = 5

animate()

function animate() {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}

function generateImage() {
  fetch(`https://source.unsplash.com/random/1366x768`)
    .then((res) => {
      addBox(res.url)
    })
    .catch((err) => console.log(err))
}

function addBox(imageUrl) {
  const texture = textureLoader.load(imageUrl)
  const geometry = new THREE.BoxGeometry(5, 5, 0.2)
  const material = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    map: texture,
  })
  const cube = new THREE.Mesh(geometry, material)
  // cube.position.y = 2.5
  cube.position.setFromCylindricalCoords(
    random(15, 25),
    random(-Math.PI * 2, Math.PI * 2),
    2.5
  )
  cube.lookAt(0, 2, 0)
  scene.add(cube)
}

function random(min, max) {
  return Math.random() * (max - min) + min
}
