document.addEventListener("DOMContentLoaded", function () {
  const particlesContainer = document.createElement("div");
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

  particlesJS("particles-container", {
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
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: true,
          mode: "repulse",
        },
      },
    },
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
