/* =========================================================
   YOUR PROJECTS
   Edit this list to change what appears on the site.
   - id: used in the link (#project-<id>), letters/numbers/hyphens only
   - cover: image shown on the card and at the top of the detail page
   - sections: the deeper write-up (heading + paragraphs and/or bullet list)
   - gallery: extra pictures with captions
   Put your own images in the images/ folder and update the paths.
   ========================================================= */
const PROJECTS = [
  {
    id: "um-autonomy",
    title: "UM::Autonomy",
    summary: "A buck converter power system and component monitoring boards for the University of Michigan's autonomous boat, which placed 4th worldwide at the International RoboBoat Competition.",
    tags: ["Power electronics", "KiCad", "Team lead"],
    role: "Electrical Team Lead, UM::Autonomy",
    year: "2023 – 2027",
    tools: "KiCad, buck converters, system monitoring software",
    cover: "images/um-autonomy-team.jpg",
    links: [],
    sections: [
      { heading: "The challenge",
        paragraphs: ["An autonomous boat has to run its motors, sensors and onboard computer from one battery pack, on the water, for a full competition run. Every component needs clean, stable power, and the team needs to know right away when a part is drawing too much current or running hot."] },
      { heading: "System diagram",
        paragraphs: ["The battery feeds the boat through an E-STOP and a power safety board. Power converters then make a 19 V rail for the computer and ball launcher and a 12 V rail for the water blaster, beacon and radio. Logic signals, Ethernet and USB tie every subsystem back to the main controller and the computer."],
        figures: [{ src: "images/um-autonomy-system.png", caption: "Power and signal diagram of the boat. Red lines carry power, green lines logic signals, yellow lines Ethernet and gray lines USB." }] },
      { heading: "The electrical box",
        paragraphs: ["Everything in the diagram lives in the boat's waterproof electrical box. The onboard computer sits in the lid, and the base holds the power distribution, converters and controllers, with sealed cable glands for every line that leaves the box."],
        figures: [{ src: "images/ebox.jpg", caption: "The current electrical box, with the onboard computer in the lid and power distribution in the base." }] },
      { heading: "Buck converter power system",
        paragraphs: [
          "I designed the boat's power system around a custom buck converter PCB in KiCad to replace the off the shelf converters we used before. It steps the battery voltage down to a regulated 19 V rail for the onboard computer and the ball launchers, the two heaviest loads on the boat.",
          "Because the rail has to supply about 15 A, I built it as a two phase converter around TI's LM25137F controller. The two phases switch at 400 kHz, half a cycle apart, and split the load current, which keeps each inductor and MOSFET pair inside its rating and spreads out the heat."
        ],
        parts: [
          { title: "Design",
            groups: [
              { title: "What the rail must handle", rows: [
                ["Onboard computer", "19 V, 6.3 A max", "Designed for about 7 A to leave margin"],
                ["Ball launchers", "19 V, 2 × 4 A = 8 A", "Both launchers can fire at the same time"],
                ["Total load", "About 15 A", "About 7.5 A per phase"]
              ] },
              { title: "Current and protection", rows: [
                ["Overcurrent limit (IOCP)", "1.25 × 15 A ≈ 18 A target", "9 A per phase target, so a fault trips before parts are damaged"],
                ["Current sense resistor", "60 mV ÷ 9 A = 6.6 mΩ → 7 mΩ", "Based on the LM25137F current limit threshold of 60 mV. The 7 mΩ shunt trips at about 8.6 A per phase, about 17 A total"]
              ] },
              { title: "MOSFETs", rows: [
                ["Max drain voltage (Vds)", "40 V", "About twice the output, to survive voltage spikes"],
                ["Max continuous current (Id)", "20 A", "About twice the 9 A phase limit"],
                ["On resistance (Rds)", "4.8 mΩ at 10 A, 5 V", "Extremely low power waste"],
                ["Max gate voltage (Vgs)", "40 V", "Survives spikes from parasitic inductance and capacitance on the PCB traces"]
              ] },
              { title: "Inductor", rows: [
                ["Value", "10 µH", "Compact, low resistance and quick to recover when the motors kick on, which reduces voltage droop"],
                ["Current rating", "9 A", "Above the 7.5 A per phase plus half of the 2 A ripple, about 8.5 A"]
              ] },
              { title: "Controller settings", rows: [
                ["Controller", "TI LM25137F, two phase", "Both phases interleaved at 400 kHz"],
                ["Output voltage", "19.04 V", "Feedback divider of 228 kΩ and 10 kΩ on the 0.8 V reference"],
                ["Light load mode", "Pulse frequency modulation", "Skips switching cycles at light loads so the board stays efficient when the boat is idle"],
                ["Compensation", "88.7 kΩ, 680 pF, 68 pF", "Sized with TI's design calculator for a fast, stable control loop"],
                ["Capacitors", "220 µF per phase output", "Input bank of a 100 µF bulk capacitor and four 10 µF ceramics"],
                ["Startup", "22.1 kΩ soft start, undervoltage lockout", "Ramps the output smoothly and shuts off cleanly when the battery sags"]
              ] }
            ] },
          { title: "Capabilities",
            intro: "The main goal was a rail that barely moves when the load changes. The computer must never brown out when a ball launcher motor suddenly pulls 4 A.",
            groups: [
              { title: "High resistance to voltage change", rows: [
                ["Load step response", "About 60 mV dip, 0.3%", "Estimated when a 4 A ball launcher turns on, from the 440 µF of output capacitance and a control loop near 23 kHz"],
                ["Recovery", "Tens of microseconds", "The fast loop and the 10 µH inductors bring the current back up before the computer notices"],
                ["Output ripple", "Low", "The two phases run half a cycle apart, so their ripple currents partly cancel at the output and input"]
              ] },
              { title: "Headroom and protection", rows: [
                ["Current headroom", "About 17 A limit for a 15 A load", "Room for both launchers and the computer at full draw"],
                ["Fault response", "Cycle by cycle current limit", "Each phase is limited on every switching cycle, so a short cannot run away"],
                ["Voltage margin", "40 V MOSFETs on a 19 V rail", "Spikes on the switch node stay well inside the part ratings"]
              ] },
              { title: "Efficiency and heat", rows: [
                ["MOSFET conduction loss", "About 0.27 W each at full load", "7.5 A² × 4.8 mΩ, so the board runs cool"],
                ["Heat spreading", "Two phases", "Losses are split across two inductors and two MOSFET pairs"],
                ["Light loads", "PFM mode", "High efficiency while the boat sits idle between tasks"]
              ] }
            ] }
        ],
        figures: [{ src: "images/buck-19v-schematic.png", caption: "Schematic of the two phase 19 V buck converter: the LM25137F controller on the right, the two power stages on the left and the input capacitor bank at the top." }] },
      { heading: "System monitoring", stack: true,
        paragraphs: ["I led two teams of four students that designed the boat's system monitoring boards. The boards measure the current, voltage and temperature of individual components, so the team can see the health of each part during testing and catch problems such as an overloaded rail or an overheating board before they cause a failure on the water."],
        bullets: ["Current, voltage and temperature readings for each component", "Early warning for overloads and overheating", "Makes it easier to integrate new hardware in future boats"],
        figures: [
          { src: "images/monitor-board-a.png", caption: "System monitoring board designed by the first team." },
          { src: "images/monitor-board-b.jpg", caption: "System monitoring board designed by the second team, with four thermistor connectors for temperature sensing." }
        ] },
      { heading: "Leading the team",
        paragraphs: ["As electrical team lead I coordinated the power and control integration across the whole vehicle, doubled the size of the electrical subteam and expanded our documentation so future members can build on the system."] },
      { heading: "Result",
        paragraphs: ["The boat finished 4th in the world at the International RoboBoat Competition."] }
    ],
    gallery: []
  },
  {
    id: "people-detector",
    title: "ESP32 Thermal & Vision People Detector",
    summary: "A doorway occupancy counter that pairs an ESP32-CAM with an 8×8 thermal sensor on a custom PCB, so it counts people by their body heat and ignores moving objects.",
    tags: ["ESP32", "PCB design", "C", "Python"],
    role: "Personal project",
    year: "Aug – Sep 2026",
    tools: "ESP32, ESP32-CAM, AMG8833, KiCad, C, Python",
    cover: "images/detector-cover.jpg",
    links: [],
    sections: [
      { heading: "The goal",
        paragraphs: ["The device mounts above a doorway and keeps a live count of how many people are in a room: every entry adds one and every exit subtracts one. A camera alone can be fooled by anything that moves, and can miss a person whose clothes match the floor. The thermal sensor solves both problems, because a person is always warmer than the room around them."] },
      { heading: "Hardware",
        paragraphs: ["An ESP32-CAM streams small grayscale frames to a main ESP32 over UART at 921,600 baud. A Panasonic AMG8833 thermal sensor sits on the main board's I²C bus. A USB power bank runs the whole system."],
        figures: [{ src: "images/detector-wiring.jpg", caption: "Wiring for data streaming (left) and for flashing the ESP32-CAM firmware through the DevKit (right)." }] },
      { heading: "Custom PCB",
        paragraphs: ["I designed a board with two copper layers in KiCad that replaces the breadboard wiring and holds everything in one place."],
        bullets: [
          "USB-C input at 5 V, with 5.1 kΩ resistors on the CC pins so a charger or power bank supplies power",
          "LD1117 3.3 V LDO regulator with 10 µF and 22 µF capacitors to power the ESP32 and thermal sensor",
          "Four pin JST connectors for the thermal sensor (3.3 V, I²C) and the camera (5 V, UART)",
          "Reset button with a 10 kΩ pull up resistor and 0.1 µF capacitor on the ESP32 enable pin",
          "76.5 × 53.5 mm board with M3 mounting holes for heat set inserts in the 3D printed housing"
        ],
        figures: [
          { src: "images/detector-schematic.jpg", caption: "KiCad schematic: ESP32, USB-C power input, 3.3 V regulator and the sensor connectors." },
          { src: "images/detector-pcb-3d.jpg", caption: "3D render of the finished board." },
          { src: "images/detector-pcb-layout.jpg", caption: "PCB layout with two copper layers and a ground pour." }
        ] },
      { heading: "Reading the thermal sensor",
        paragraphs: ["I wrote the AMG8833 driver in C for the main ESP32. The sensor reports an 8 × 8 grid of 64 temperatures across a 60° field of view, so each pixel covers about 7.5°."],
        bullets: [
          "All 64 pixels are read in one I²C burst every 100 ms (10 frames per second), so a frame never mixes two sensor updates. A read is 130 bytes at 100 kHz and takes about 12 ms",
          "Pixel temperatures are decoded at 0.25 °C per bit, and the decoder is tested against the example values in Panasonic's interface spec",
          "At startup the firmware looks for the sensor at both I²C addresses (0x69 and 0x68). If it isn't found, the board keeps counting with the camera and checks again every 2 seconds",
          "If the I²C bus locks up, the firmware recovers it and finds the sensor again"
        ] },
      { heading: "Confirming a person with heat",
        paragraphs: ["The camera finds moving shapes, and the thermal sensor decides whether each one is a person. A camera detection is only counted when it meets every one of these requirements:"],
        bullets: [
          "Warm: at least one thermal pixel is 2 °C or more above that pixel's learned background temperature",
          "In the right place: that warm pixel is within 1.5 pixels of where the camera detection falls on the 8 × 8 grid",
          "Fresh: the thermal frame is no more than 0.35 seconds old",
          "In view: the camera detection is inside the area the thermal sensor covers"
        ],
        figures: [
          { video: "videos/two-way-traffic.mp4", poster: "videos/two-way-traffic.jpg", caption: "Several people walking in both directions at once. Each person is tracked from line A to line B." },
          { video: "videos/same-direction.mp4", poster: "videos/same-direction.jpg", caption: "Several people walking through in the same direction." },
          { video: "videos/gray-hoodie.mp4", poster: "videos/gray-hoodie.jpg", caption: "A person in a gray hoodie over a gray floor, the low contrast case where the camera alone can miss someone." }
        ] },
      { heading: "How the background is learned",
        paragraphs: ["A fixed temperature threshold would break as the room warms up or cools down, so each pixel keeps its own background temperature instead."],
        bullets: [
          "The first frame, taken with nobody under the sensor, sets the starting background",
          "After that, each pixel's background follows a slow running average with a 30 second time constant, and it is not updated while the pixel is hot",
          "Each pixel is lightly smoothed over time (60% weight on the newest frame) to remove sensor flicker without adding noticeable lag",
          "Heat that stays in one place for 60 seconds, like a laptop or a warm seat, is absorbed into the background so it stops reading as a person"
        ] },
      { heading: "Counting people with heat on the board",
        paragraphs: [
          "The latest version also counts people from the thermal data alone, running on the main ESP32 in C that uses only integer math. A matching Python version exists for testing, and automated tests check that the two agree frame by frame.",
          "At 8 × 8 resolution, two people close together usually blur into one warm spot, so the code can't just count hot spots. Instead it groups touching warm pixels into regions and decides how many people each region holds:"
        ],
        bullets: [
          "Region size: each region's effective area is compared to one person's area, which is calibrated by walking through alone",
          "Shape: a region stretched across the doorway is two people side by side, and one stretched along it is two people in single file",
          "Evidence score: width, length, heat split across the dividing lines, distinct peaks, motion and the camera's view each add points, and a region needs 70 out of 100 to count as two people",
          "Tracking: each region is matched to the nearest predicted track. When two people merge and split again, each keeps its own identity and count",
          "Counting: two lines split the grid into outside, doorway and inside. A track that crosses from one side to the other is counted as an entry or exit, people who turn around count nothing, and occupancy never goes below 0"
        ] },
      { heading: "Simulation: camera and thermal side by side",
        paragraphs: ["This is a replay of the simulator included in the project, running its demo loop: single people, pairs side by side, a wheelchair being pushed, two people crossing paths and a cold cart. The camera frames go through the real camera detector, and the thermal frames go through the same thermal counting code that runs on the ESP32. The cart shows up on the camera but has no heat, so the thermal counter ignores it."],
        sim: { src: "data/sim-demo.json" } },
      { heading: "Making the camera fast enough",
        paragraphs: [
          "The first version streamed full color 320 × 240 frames, 153,600 bytes each. The serial link couldn't keep up: it ran at about 2 FPS, dropped to 0.25 FPS with vision processing, and often froze.",
          "I changed the ESP32-CAM firmware to send 80 × 60 grayscale frames instead, 4,800 bytes each and 32 times smaller. The camera now runs at 7 to 10 FPS and stays stable."
        ] },
      { heading: "How the vision code works",
        paragraphs: ["Each grayscale frame goes through a four stage pipeline on the ESP32 before the thermal check:"],
        bullets: [
          "Background subtraction: compare the frame to a reference image of the empty doorway and mark pixels whose brightness changed more than a threshold",
          "Blob detection: group touching marked pixels into blobs and throw away small blobs as noise",
          "Tracking: find each blob's center of mass and follow it from frame to frame",
          "Counting: a blob that crosses from the entrance line to the exit line counts as an entry, and the reverse counts as an exit"
        ],
        figures: [{ src: "images/detector-cv-pipeline.jpg", caption: "The four stage computer vision pipeline that finds the candidates the thermal sensor then checks." }] }
    ],
    gallery: []
  },
  {
    id: "micro-keyboard",
    title: "Micro Keyboard",
    summary: "A compact shortcut keyboard with nine keys and two rotary knobs, built around a Raspberry Pi Pico on a PCB I designed.",
    tags: ["RP2040", "KiCad", "CircuitPython"],
    role: "Personal project",
    year: "",
    tools: "Raspberry Pi Pico, KiCad, KMK, CircuitPython",
    cover: "images/keyboard-hero.jpg",
    card: "images/keyboard-card.jpg",
    links: [],
    sections: [
      { heading: "The idea",
        paragraphs: ["I wanted a small keyboard that sits next to my main one and handles the things I do all day: copy, paste, undo, media controls and volume. It has nine mechanical keys and two rotary knobs that also click like buttons."] },
      { heading: "Hardware", stack: true,
        bullets: [
          "Raspberry Pi Pico (RP2040) microcontroller, connected to the computer over USB",
          "Nine Cherry MX mechanical key switches (SW1 to SW9)",
          "Two ALPS rotary encoders with built in push buttons (SW15 and SW16)",
          "Eleven diodes, one for every switch and encoder button",
          "A PCB with two copper layers designed in KiCad, with four mounting holes"
        ],
        figures: [
          { src: "images/keyboard-schematic.png", caption: "KiCad schematic: the microcontroller and the key matrix with the two encoders." },
          { src: "images/keyboard-pcb-layout.jpg", caption: "PCB layout: encoders at the top corners, the microcontroller between them and the 3 × 3 keys below." },
          { src: "images/keyboard-pcb-3d.jpg", caption: "3D render of the board in KiCad." },
          { src: "images/keyboard-photo.jpg", caption: "The real PCB, assembled with Cherry MX switches, ALPS rotary encoders and the controller board." }
        ] },
      { heading: "The key matrix",
        paragraphs: [
          "Wiring every switch to its own pin would take 11 pins. Instead the switches sit in a grid of 3 columns and 4 rows, which needs only 7. Row 0 holds the two knob buttons, and rows 1 to 3 hold the nine keys.",
          "The firmware turns on one column at a time and reads which rows see it. Each switch has a diode pointing from the column to the row, so pressing several keys at once can never make a key that isn't pressed look pressed (this is called ghosting)."
        ],
        bullets: [
          "Columns 0, 1 and 2: pins D0, D1 and D2",
          "Rows 0 to 3: pins D4, D5, D6 and D7",
          "Left knob (SW16): A on D9, B on D8",
          "Right knob (SW15): A on A3, B on A2",
          "Both knobs: common pin to ground"
        ] },
      { heading: "How the knobs work",
        paragraphs: ["Each rotary encoder has two switches, A and B, that open and close a quarter step apart as the knob turns. Whichever one changes first tells the firmware the direction, and each click is one step. The common pin goes to ground and the microcontroller's internal pull up resistors hold A and B high, so no extra parts are needed."] },
      { heading: "What each key does",
        bullets: [
          "Row 1: Copy, Paste, Cut",
          "Row 2: Undo, Redo, Select all",
          "Row 3: Previous track, Next track, Lock screen",
          "Left knob: turn for volume, press to mute",
          "Right knob: turn for screen brightness, press to play or pause"
        ] },
      { heading: "Firmware",
        paragraphs: [
          "The keyboard runs KMK, a keyboard firmware written in CircuitPython, so changing a key only means editing one text file. To set it up: hold BOOTSEL while plugging in the board, drag the CircuitPython file onto the drive that appears, then copy the kmk folder and the keyboard's code.py file onto the CIRCUITPY drive.",
          "The computer sees it as a normal USB keyboard, so it works on Windows, macOS and Linux without any drivers."
        ] }
    ],
    gallery: []
  }
];

/* =========================================================
   Site behavior (you shouldn't need to edit below here)
   ========================================================= */
const homeView = document.getElementById("home-view");
const projectView = document.getElementById("project-view");
const grid = document.getElementById("project-grid");
const navLinks = document.getElementById("nav-links");
const navToggle = document.getElementById("nav-toggle");

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function renderGrid() {
  grid.innerHTML = PROJECTS.map(p => `
    <a class="card" href="#project-${esc(p.id)}">
      <img src="${esc(p.card || p.cover)}" alt="${esc(p.title)} preview" loading="lazy">
      <div class="card-body">
        <h3>${esc(p.title)}</h3>
        <p>${esc(p.summary)}</p>
        <span class="card-more">Read the full story →</span>
      </div>
    </a>`).join("");
}

function renderProject(p) {
  const sections = p.sections.map(s => `
    <h3>${esc(s.heading)}</h3>
    ${(s.paragraphs || []).map(t => `<p>${esc(t)}</p>`).join("")}
    ${s.bullets ? `<ul>${s.bullets.map(b => `<li>${esc(b)}</li>`).join("")}</ul>` : ""}
    ${s.parts ? s.parts.map(pt => `
      <div class="spec-part">
        <h4 class="spec-title">${esc(pt.title)}</h4>
        ${pt.intro ? `<p class="spec-intro">${esc(pt.intro)}</p>` : ""}
        ${pt.groups.map(g => `
          <div class="spec-group">
            <h5>${esc(g.title)}</h5>
            <dl class="spec-rows">${g.rows.map(r => `<div class="spec-row"><dt>${esc(r[0])}</dt><dd><strong>${esc(r[1])}</strong>${r[2] ? `<span>${esc(r[2])}</span>` : ""}</dd></div>`).join("")}</dl>
          </div>`).join("")}
      </div>`).join("") : ""}
    ${s.sim ? simMarkup(s.sim) : ""}
    ${s.code ? `<pre class="code"><code>${esc(s.code)}</code></pre>` : ""}
    ${s.figures ? `<div class="figures${s.stack ? " stack" : s.figures.length > 1 ? " multi" : ""}">${s.figures.map(f => `<figure>${f.video ? `<video src="${esc(f.video)}"${f.poster ? ` poster="${esc(f.poster)}"` : ""} controls muted playsinline preload="metadata" aria-label="${esc(f.caption)}"></video>` : `<img src="${esc(f.src)}" alt="${esc(f.caption)}" loading="lazy">`}<figcaption>${esc(f.caption)}</figcaption></figure>`).join("")}</div>` : ""}
  `).join("");

  projectView.innerHTML = `
    <a class="back-link" href="#projects">← All projects</a>
    <header class="project-head">
      <h1>${esc(p.title)}</h1>
      <p class="lede">${esc(p.summary)}</p>
    </header>
    <dl class="meta">
      <div><dt>Role</dt><dd>${esc(p.role)}</dd></div>
      ${p.year ? `<div><dt>Year</dt><dd>${esc(p.year)}</dd></div>` : ""}
    </dl>
    <img class="project-hero" src="${esc(p.cover)}" alt="${esc(p.title)} main screenshot">
    <div class="prose">${sections}</div>
    ${p.gallery && p.gallery.length ? `
      <section class="gallery" aria-label="Pictures">
        ${p.gallery.map(g => `<figure><img src="${esc(g.src)}" alt="${esc(g.caption)}" loading="lazy"><figcaption>${esc(g.caption)}</figcaption></figure>`).join("")}
      </section>` : ""}
    ${p.links && p.links.length ? `
      <div class="project-links">
        ${p.links.map((l, n) => `<a class="btn${n === 0 ? " btn-primary" : ""}" href="${esc(l.href)}" target="_blank" rel="noopener">${esc(l.label)}</a>`).join("")}
      </div>` : ""}
  `;
  document.title = `${p.title} · Colin Crespo`;
  projectView.querySelectorAll(".sim").forEach(initSim);
}


/* ---------- Simulation player (camera + thermal replay) ---------- */
function simMarkup(sim) {
  return `<div class="sim" data-src="${esc(sim.src)}">
    <div class="sim-views">
      <figure><canvas class="sim-cam" width="480" height="360" aria-label="Simulated camera view"></canvas><figcaption>Camera: 80 × 60 grayscale, detected blobs and tracks</figcaption></figure>
      <figure><canvas class="sim-th" width="360" height="360" aria-label="Simulated thermal view"></canvas><figcaption>Thermal: 8 × 8 temperatures, warm regions and people counted</figcaption></figure>
    </div>
    <div class="sim-bar">
      <button class="btn btn-small sim-play" type="button">Play</button>
      <input class="sim-seek" type="range" min="0" max="1000" value="0" aria-label="Simulation time">
      <span class="sim-time">0.0 s</span>
    </div>
    <div class="sim-stats">
      <div><span class="sim-k">Inside</span><span class="sim-v sim-inside">0</span></div>
      <div><span class="sim-k">Entries</span><span class="sim-v sim-in">0</span></div>
      <div><span class="sim-k">Exits</span><span class="sim-v sim-out">0</span></div>
      <ol class="sim-log"><li class="sim-empty">Loading the simulation…</li></ol>
    </div>
  </div>`;
}

function heatColor(v) { // 0..1 -> deep blue, purple, orange, yellow
  const stops = [[30, 40, 140], [110, 60, 200], [215, 70, 120], [245, 150, 50], [255, 230, 110]];
  v = Math.max(0, Math.min(1, v)) * (stops.length - 1);
  const i = Math.min(Math.floor(v), stops.length - 2), f = v - i, a = stops[i], b = stops[i + 1];
  return `rgb(${a.map((c, k) => Math.round(c + (b[k] - c) * f)).join(",")})`;
}

async function initSim(root) {
  let data;
  try { data = await (await fetch(root.dataset.src)).json(); }
  catch { root.querySelector(".sim-log").innerHTML = `<li class="sim-empty">The simulation data didn't load. Reload the page to try again.</li>`; return; }
  const cam = root.querySelector(".sim-cam").getContext("2d");
  const th = root.querySelector(".sim-th").getContext("2d");
  const playBtn = root.querySelector(".sim-play"), seek = root.querySelector(".sim-seek");
  const W = data.camera.w, H = data.camera.h, S = 480 / W;
  const frames = data.cams.map(b64 => Uint8Array.from(atob(b64), c => c.charCodeAt(0)));
  const off = document.createElement("canvas"); off.width = W; off.height = H;
  const offCtx = off.getContext("2d"), img = offCtx.createImageData(W, H);
  const steps = data.steps, dur = data.duration;
  let t = 0, idx = 0, playing = false, last = 0, lastTemps = null;

  function stepAt(time) { let i = 0; while (i + 1 < steps.length && steps[i + 1].t <= time) i++; return i; }

  function drawCam(st) {
    const px = frames[Math.max(0, st.cam)];
    if (px) { for (let i = 0; i < px.length; i++) { const v = px[i], o = i * 4; img.data[o] = img.data[o + 1] = img.data[o + 2] = v; img.data[o + 3] = 255; } offCtx.putImageData(img, 0, 0); }
    cam.imageSmoothingEnabled = false; cam.drawImage(off, 0, 0, 480, 360);
    const [rx0, , rx1] = data.camera.roi;
    cam.fillStyle = "rgba(0,0,0,0.45)"; cam.fillRect(0, 0, rx0 * S, 360); cam.fillRect(rx1 * S, 0, 480 - rx1 * S, 360);
    const [top, bottom] = data.camera.lines;
    [[bottom, "#2bb3a3", "A (outside)"], [top, "#e08a2c", "B (inside)"]].forEach(([y, c, label]) => {
      cam.strokeStyle = c; cam.lineWidth = 2; cam.beginPath(); cam.moveTo(0, y * S); cam.lineTo(480, y * S); cam.stroke();
      cam.font = "600 12px Inter, sans-serif"; cam.fillStyle = c; cam.fillText(label, 6, y * S - 6);
    });
    cam.strokeStyle = "#fff"; cam.lineWidth = 2;
    st.blobs.forEach(([x0, y0, x1, y1]) => cam.strokeRect(x0 * S, y0 * S, (x1 - x0 + 1) * S, (y1 - y0 + 1) * S));
    st.ctracks.forEach(k => {
      cam.fillStyle = "#2f4fbf"; cam.beginPath(); cam.arc(k.x * S, k.y * S, 7, 0, 7); cam.fill();
      cam.strokeStyle = "#fff"; cam.stroke(); cam.fillStyle = "#fff"; cam.font = "600 12px Inter, sans-serif"; cam.fillText("#" + k.id, k.x * S + 10, k.y * S + 4);
    });
  }

  function drawTh(st) {
    const temps = st.temps || lastTemps; if (st.temps) lastTemps = st.temps;
    const C = 45;
    th.fillStyle = "#1b1a2e"; th.fillRect(0, 0, 360, 360);
    if (!temps) return;
    const lo = 21, hi = 28;
    for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
      const v = temps[r * 8 + c];
      th.fillStyle = heatColor((v - lo) / (hi - lo)); th.fillRect(c * C, r * C, C, C);
      th.fillStyle = "rgba(255,255,255,0.8)"; th.font = "500 11px 'JetBrains Mono', monospace"; th.textAlign = "center";
      th.fillText(v.toFixed(1), c * C + C / 2, r * C + C / 2 + 4);
    }
    th.textAlign = "left";
    data.lines.at.forEach((y, i) => {
      th.setLineDash([6, 5]); th.strokeStyle = i ? "#2bb3a3" : "#e08a2c"; th.lineWidth = 2;
      th.beginPath(); th.moveTo(0, y * C); th.lineTo(360, y * C); th.stroke(); th.setLineDash([]);
    });
    st.regions.forEach(rg => {
      th.strokeStyle = "#fff"; th.lineWidth = 2;
      rg.cells.forEach(([c, r]) => th.strokeRect(c * C + 1, r * C + 1, C - 2, C - 2));
    });
    st.ttracks.forEach(k => {
      const x = k.x * C, y = k.y * C;
      th.fillStyle = "#fff"; th.beginPath(); th.arc(x, y, 13, 0, 7); th.fill();
      th.fillStyle = "#1b1a2e"; th.font = "700 13px Inter, sans-serif"; th.textAlign = "center"; th.fillText(k.n, x, y + 5); th.textAlign = "left";
    });
    const lab = st.regions.map(r => r.label).filter((v, i, a) => a.indexOf(v) === i).join(" · ");
    if (lab) { th.fillStyle = "rgba(0,0,0,0.6)"; th.fillRect(0, 332, 360, 28); th.fillStyle = "#fff"; th.font = "500 12px Inter, sans-serif"; th.fillText(lab, 8, 350); }
  }

  function render() {
    idx = stepAt(t);
    const st = steps[idx];
    drawCam(st); drawTh(st);
    root.querySelector(".sim-inside").textContent = st.occ[0];
    root.querySelector(".sim-in").textContent = st.occ[1];
    root.querySelector(".sim-out").textContent = st.occ[2];
    const logs = [];
    for (let i = 0; i <= idx; i++) steps[i].log.forEach(([k, text]) => logs.push({ k, text, t: steps[i].t }));
    root.querySelector(".sim-log").innerHTML = logs.length
      ? logs.slice(-4).reverse().map(e => `<li class="sim-${e.k}"><span>${e.t.toFixed(1)} s</span>${esc(e.text)}</li>`).join("")
      : `<li class="sim-empty">No one has crossed yet.</li>`;
    root.querySelector(".sim-time").textContent = `${t.toFixed(1)} / ${dur.toFixed(0)} s`;
    seek.value = Math.round(t / dur * 1000);
  }

  function loop(now) {
    if (!playing || !root.isConnected) return;
    t += (now - last) / 1000; last = now;
    if (t >= dur) t = 0;
    render(); requestAnimationFrame(loop);
  }
  function setPlaying(p) {
    playing = p; playBtn.textContent = p ? "Pause" : "Play";
    if (p) { last = performance.now(); requestAnimationFrame(loop); }
  }
  playBtn.addEventListener("click", () => setPlaying(!playing));
  seek.addEventListener("input", () => { t = seek.value / 1000 * dur; render(); });
  t = 3.0; render();
  const reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting && !playing) { setPlaying(true); io.disconnect(); } }), { threshold: 0.15 });
    io.observe(root);
  }
}

function route() {
  const hash = decodeURIComponent(location.hash.slice(1));
  const project = hash.startsWith("project-") && PROJECTS.find(p => "project-" + p.id === hash);

  if (project) {
    renderProject(project);
    homeView.hidden = true;
    projectView.hidden = false;
    window.scrollTo(0, 0);
    setActive("projects");
  } else {
    projectView.hidden = true;
    homeView.hidden = false;
    document.title = "Colin Crespo Portfolio";
    const target = hash && document.getElementById(hash);
    if (target) target.scrollIntoView();
    else if (!hash || hash === "top") window.scrollTo(0, 0);
  }
  navLinks.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
}

function setActive(id) {
  navLinks.querySelectorAll("a").forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + id));
}

// Highlight the nav link for the section on screen
const observer = new IntersectionObserver(entries => {
  if (!homeView.hidden) entries.forEach(e => e.isIntersecting && setActive(e.target.id));
}, { rootMargin: "-40% 0px -55% 0px" });
["about", "projects", "contact"].forEach(id => observer.observe(document.getElementById(id)));

navToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(open));
});

document.getElementById("copy-email").addEventListener("click", async e => {
  const btn = e.currentTarget;
  const text = document.getElementById("email-text").textContent;
  try {
    await navigator.clipboard.writeText(text);
    btn.textContent = "Copied";
  } catch {
    const range = document.createRange();
    range.selectNodeContents(document.getElementById("email-text"));
    getSelection().removeAllRanges();
    getSelection().addRange(range);
    btn.textContent = "Selected";
  }
  setTimeout(() => (btn.textContent = "Copy"), 1800);
});

document.getElementById("year").textContent = new Date().getFullYear();
renderGrid();
window.addEventListener("hashchange", route);
route();
