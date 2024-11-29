document.addEventListener("DOMContentLoaded", function () {
  const particlesContainer = document.createElement("div");
  particlesContainer.id = "particles-js";
  particlesContainer.style.position = "fixed";
  particlesContainer.style.top = "0";
  particlesContainer.style.left = "0";
  particlesContainer.style.width = "100%";
  particlesContainer.style.height = "100%";
  particlesContainer.style.pointerEvents = "none";
  document.body.appendChild(particlesContainer);
  const images = document.querySelectorAll("img");
  images.forEach((img) => img.remove());
  document.body.style.backgroundColor = "#141414";
  particlesJS("particles-js", {
    particles: {
      number: {
        value: 80,
        density: {
          enable: true,
          value_area: 800,
        },
      },
      color: {
        value: "#ffffff",
      },
      shape: {
        type: "circle",
      },
      move: {
        enable: true,
        speed: 3,
        direction: "none",
        random: false,
        straight: false,
        out_mode: "out",
        attract: {
          enable: false,
          rotateX: 600,
          rotateY: 1200
        }
      }
    },
    interactivity: {
      detect_on: "window",
      events: {
        onhover: {
          enable: true,
          mode: "repulse",
        },
        resize: true
      },
      modes: {
        repulse: {
          distance: 100,
          duration: 0.4
        }
      }
    },
    retina_detect: true
  });
  document.addEventListener('mousemove', function(e) {
    particlesJS.pJS.interactivity.mouse.pos_x = e.clientX;
    particlesJS.pJS.interactivity.mouse.pos_y = e.clientY;
  });
  const neuralNetwork = document.createElement("div");
  neuralNetwork.style.background = "linear-gradient(to right, #4E2A84, #AB83A1)";
  neuralNetwork.style.width = "100%";
  neuralNetwork.style.height = "100%";
  neuralNetwork.style.position = "absolute";
  neuralNetwork.style.opacity = "0.5";
  particlesContainer.appendChild(neuralNetwork);
  document.body.style.fontFamily = "Arial, sans-serif";
  document.body.style.color = "#ffffff";
});
