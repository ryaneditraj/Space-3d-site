(function () {
  var note = document.getElementById("scene-note");

  function showLoadError(message) {
    if (note) {
      note.textContent = message;
    }
  }

  if (typeof THREE === "undefined") {
    showLoadError("Three.js did not load. Check your connection and reload the page.");
    return;
  }

  var sss = new THREE.Scene();
  var ccc = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  var rrr;

  try {
    rrr = new THREE.WebGLRenderer();
  } catch (err) {
    showLoadError("WebGL is unavailable in this browser, so the 3D scene cannot start.");
    return;
  }

  rrr.setSize(window.innerWidth, window.innerHeight);
  rrr.domElement.setAttribute("role", "img");
  rrr.domElement.setAttribute(
    "aria-label",
    "Animated 3D scene with a pizza-textured planet, a magenta wireframe donut, a cyan cube, and an orange cone."
  );
  document.body.appendChild(rrr.domElement);

  var texLoader = new THREE.TextureLoader();
  // A page opened from disk cannot sample a relative image in WebGL.
  // PIZZA_TEXTURE is the same JPEG as assets/textures/pizza.jpg.
  var textureUrl = "assets/textures/pizza.jpg";
  if (window.location.protocol === "file:" && window.PIZZA_TEXTURE) {
    textureUrl = window.PIZZA_TEXTURE;
  }
  var pizzaTex = texLoader.load(textureUrl);

  var geo1 = new THREE.SphereGeometry(3, 32, 32);
  var mat1 = new THREE.MeshBasicMaterial({ map: pizzaTex });
  var pizzaPlanet = new THREE.Mesh(geo1, mat1);
  sss.add(pizzaPlanet);

  var geo2 = new THREE.TorusGeometry(5, 1, 16, 100);
  var mat2 = new THREE.MeshBasicMaterial({ color: 0xff00ff, wireframe: true });
  var donut = new THREE.Mesh(geo2, mat2);
  sss.add(donut);

  var geo3 = new THREE.BoxGeometry(1.5, 1.5, 1.5);
  var mat3 = new THREE.MeshBasicMaterial({ color: 0x00ffff });
  var box = new THREE.Mesh(geo3, mat3);
  box.position.x = -6;
  box.position.y = 3;
  sss.add(box);

  var geo4 = new THREE.ConeGeometry(1, 2, 32);
  var mat4 = new THREE.MeshBasicMaterial({ color: 0xffa500 });
  var duckBeak = new THREE.Mesh(geo4, mat4);
  duckBeak.position.x = 6;
  duckBeak.position.y = -3;
  sss.add(duckBeak);

  var light = new THREE.AmbientLight(0xffffff);
  sss.add(light);

  ccc.position.z = 12;

  function frameCamera() {
    var aspect = window.innerWidth / Math.max(window.innerHeight, 1);
    ccc.aspect = aspect;
    // Desktop framing stays at z = 12. A narrow window would clip the
    // cube (x = -6) and the cone (x = 6), so step the camera back.
    var halfFov = (ccc.fov * Math.PI) / 360;
    var neededZ = 7.5 / Math.max(aspect, 0.25) / Math.tan(halfFov);
    ccc.position.z = Math.max(12, neededZ);
    ccc.updateProjectionMatrix();
    rrr.setSize(window.innerWidth, window.innerHeight);
  }

  window.addEventListener("resize", frameCamera);
  frameCamera();

  var motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  var reduceMotion = motionQuery.matches;

  if (typeof motionQuery.addEventListener === "function") {
    motionQuery.addEventListener("change", function (event) {
      reduceMotion = event.matches;
    });
  }

  function spinnySpin() {
    requestAnimationFrame(spinnySpin);

    if (!reduceMotion) {
      pizzaPlanet.rotation.x += 0.01;
      pizzaPlanet.rotation.y += 0.02;

      donut.rotation.z -= 0.03;
      donut.rotation.x += 0.01;

      box.rotation.y += 0.05;
      box.position.y += Math.sin(Date.now() * 0.003) * 0.05;

      duckBeak.rotation.x += 0.02;
      duckBeak.rotation.z += 0.02;
    }

    rrr.render(sss, ccc);
  }

  spinnySpin();
})();
