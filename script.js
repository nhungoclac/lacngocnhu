// script.js - Kéo chuột cho carousel ảnh

document.addEventListener("DOMContentLoaded", function () {
  const carousels = document.querySelectorAll(".work-samples");

  carousels.forEach((carousel) => {
    let isDown = false;
    let startX;
    let scrollLeft;

    carousel.addEventListener("mousedown", (e) => {
      isDown = true;
      startX = e.pageX - carousel.offsetLeft;
      scrollLeft = carousel.scrollLeft;
      carousel.style.cursor = "grabbing";
      e.preventDefault(); // Ngăn chọn văn bản, kéo ảnh
    });

    carousel.addEventListener("mouseleave", () => {
      isDown = false;
      carousel.style.cursor = "grab";
    });

    carousel.addEventListener("mouseup", () => {
      isDown = false;
      carousel.style.cursor = "grab";
    });

    carousel.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - carousel.offsetLeft;
      const walk = (x - startX) * 1.5; // tốc độ kéo (có thể chỉnh)
      carousel.scrollLeft = scrollLeft - walk;
    });
  });
});

// Xử lý locket gallery (thêm vào script.js)
document.querySelectorAll(".locket-gallery").forEach((gallery) => {
  const items = gallery.querySelectorAll(".gallery-item");
  const counter = gallery.querySelector(".gallery-counter");
  if (items.length <= 1) return;

  let currentIndex = 0;
  let isAnimating = false;

  items.forEach((item, idx) => {
    item.style.zIndex = idx === 0 ? 3 : 1;
    if (idx === 0) item.classList.add("active");
  });

  gallery.addEventListener("click", function () {
    if (isAnimating) return;
    isAnimating = true;

    const currentItem = items[currentIndex];
    const nextIndex = (currentIndex + 1) % items.length;
    const nextItem = items[nextIndex];

    nextItem.style.zIndex = 3;
    nextItem.classList.add("next-ready");

    currentItem.classList.add("slide-down");

    if (counter) {
      counter.textContent = nextIndex + 1 + "/" + items.length;
    }

    setTimeout(() => {
      nextItem.classList.add("showing");
    }, 20);

    const onTransitionEnd = function () {
      currentItem.classList.remove("slide-down", "active");
      currentItem.style.zIndex = 1;

      nextItem.classList.remove("next-ready", "showing");
      nextItem.classList.add("active");

      currentIndex = nextIndex;
      isAnimating = false;

      currentItem.removeEventListener("transitionend", onTransitionEnd);
    };

    currentItem.addEventListener("transitionend", onTransitionEnd, {
      once: true,
    });
  });
});
