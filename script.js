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

// ------------------
// Chatbot logic
document.addEventListener("DOMContentLoaded", function () {
  const toggleBtn = document.getElementById("chatbot-toggle");
  const panel = document.getElementById("chatbot-panel");
  const closeBtn = document.getElementById("chatbot-close");
  const sendBtn = document.getElementById("chatbot-send");
  const input = document.getElementById("chatbot-input");
  const messagesDiv = document.getElementById("chatbot-messages");

  // Mở/đóng panel
  toggleBtn.addEventListener("click", function () {
    panel.classList.toggle("hidden");
  });
  closeBtn.addEventListener("click", function () {
    panel.classList.add("hidden");
  });

  // Dữ liệu FAQ (có thể mở rộng)
  const faq = [
    {
      keywords: ["kinh nghiệm", "làm việc", "kinh nghiệm làm việc"],
      answer:
        "Mình từng thực tập tại Công ty Lucas (Digital Marketing), tham gia đồ án Thương mại xã hội và đồ án Digital Marketing với vai trò trưởng nhóm. Chi tiết ở phần Kinh nghiệm.",
    },
    {
      keywords: ["kỹ năng", "skill", "biết gì"],
      answer:
        "Mình có kỹ năng về SEO, WordPress, Quay/Chụp, CapCut, Canva, HTML/CSS, Viết kịch bản, Lập kế hoạch, Google Sheet, Phân tích số liệu, Make.com, Figma và tự học các công cụ mới.",
    },
    {
      keywords: ["học vấn", "học", "trường"],
      answer:
        "Mình học tại Trường Đại học Công nghệ Thông tin, Đại học Quốc gia TP.HCM, ngành Thương mại điện tử. Tốt nghiệp sớm (3.5 năm) loại Giỏi.",
    },
    {
      keywords: ["liên hệ", "email", "facebook"],
      answer:
        "Bạn có thể liên hệ qua email: nhulacngoc@gmail.com hoặc Facebook: https://www.facebook.com/lacnhu04",
    },
    {
      keywords: ["dự án", "sản phẩm", "làm gì"],
      answer:
        "Mình đã thực hiện nhiều video quảng cáo, thiết kế ấn phẩm, meme và chiến dịch cho Lucas. Xem thêm ở các trang Video, Thiết kế, Meme.",
    },
    {
      keywords: ["xin chào", "hello", "hi", "chào"],
      answer: "Chào bạn! Mình là chatbot của Như. Rất vui được giúp đỡ!",
    },
    {
      keywords: ["cảm ơn", "thanks"],
      answer: "Không có gì ạ! Nếu cần thêm thông tin, cứ hỏi mình nhé.",
    },
  ];

  // Thêm tin nhắn vào khung chat
  function addMessage(text, isUser = false) {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add(isUser ? "user-message" : "bot-message");
    msgDiv.textContent = text;
    messagesDiv.appendChild(msgDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight; // Cuộn xuống cuối
  }

  // Xử lý câu hỏi và trả lời
  function processQuestion(question) {
    const lowerQ = question.toLowerCase().trim();
    let foundAnswer = null;

    // Tìm câu trả lời phù hợp dựa trên từ khóa
    for (let item of faq) {
      for (let keyword of item.keywords) {
        if (lowerQ.includes(keyword)) {
          foundAnswer = item.answer;
          break;
        }
      }
      if (foundAnswer) break;
    }

    if (foundAnswer) {
      addMessage(foundAnswer, false);
    } else {
      addMessage(
        "Mình chưa hiểu câu hỏi lắm. Bạn có thể hỏi về kinh nghiệm, kỹ năng, học vấn, liên hệ,...",
        false,
      );
    }
  }

  // Gửi tin nhắn
  function sendMessage() {
    const question = input.value.trim();
    if (question === "") return;

    addMessage(question, true);
    input.value = "";

    // Giả lập thời gian suy nghĩ (tạo cảm giác tự nhiên)
    setTimeout(() => {
      processQuestion(question);
    }, 500);
  }

  sendBtn.addEventListener("click", sendMessage);
  input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      sendMessage();
    }
  });

  // Đóng panel khi click ra ngoài (tuỳ chọn)
  document.addEventListener("click", function (e) {
    if (
      !panel.contains(e.target) &&
      !toggleBtn.contains(e.target) &&
      !panel.classList.contains("hidden")
    ) {
      panel.classList.add("hidden");
    }
  });
});

// ------------------
// Tự động nhận diện & điều chỉnh tỉ lệ khung hình (Aspect Ratio) cho video nhúng Facebook
function adjustVideoAspectRatios() {
  document.querySelectorAll(".reel-embed, .landscape-embed").forEach((embed) => {
    const iframe = embed.querySelector("iframe");
    if (!iframe) return;

    let width = parseFloat(iframe.getAttribute("width"));
    let height = parseFloat(iframe.getAttribute("height"));

    // Nếu không tìm thấy width/height trên thẻ, đọc từ URL parameters (width=...&height=...)
    if (!width || !height) {
      const src = iframe.getAttribute("src") || "";
      const widthMatch = src.match(/[?&]width=(\d+)/);
      const heightMatch = src.match(/[?&]height=(\d+)/);
      if (widthMatch && heightMatch) {
        width = parseFloat(widthMatch[1]);
        height = parseFloat(heightMatch[1]);
      }
    }

    if (width && height && height > 0) {
      const ratio = width / height;
      embed.style.aspectRatio = `${width} / ${height}`;

      const card = embed.closest(".reel-card");
      if (card) {
        if (ratio > 1.2) {
          // Video ngang (landscape 16:9, v.v.)
          card.classList.add("landscape-card");
          card.classList.remove("portrait-card", "square-card");
        } else if (ratio < 0.8) {
          // Video dọc (reels 9:16)
          card.classList.add("portrait-card");
          card.classList.remove("landscape-card", "square-card");
        } else {
          // Video vuông (1:1)
          card.classList.add("square-card");
          card.classList.remove("landscape-card", "portrait-card");
        }
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", adjustVideoAspectRatios);

// ------------------
// Xử lý nút Trở về đầu trang (Back to Top)
document.addEventListener("DOMContentLoaded", function () {
  let btn = document.getElementById("back-to-top");

  // Tự động tạo nút nếu chưa có sẵn trong HTML
  if (!btn) {
    btn = document.createElement("button");
    btn.id = "back-to-top";
    btn.className = "back-to-top-btn hidden";
    btn.setAttribute("aria-label", "Trở về đầu trang");
    btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(btn);
  }

  // Ẩn/hiện nút khi người dùng cuộn trang xuống > 300px
  window.addEventListener("scroll", function () {
    if (window.scrollY > 300) {
      btn.classList.remove("hidden");
    } else {
      btn.classList.add("hidden");
    }
  });

  // Khi click nút -> cuộn mượt lên đầu trang
  btn.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
});

// ------------------
// Xử lý slider ảnh cho trang Brief & Sản phẩm (.brief-slider)
function initBriefSliders() {
  document.querySelectorAll(".brief-slider").forEach((slider) => {
    const slides = slider.querySelectorAll(".slide-item");
    const prevBtn = slider.querySelector(".prev-btn");
    const nextBtn = slider.querySelector(".next-btn");
    const counter = slider.querySelector(".slider-counter");

    if (slides.length <= 1) {
      if (prevBtn) prevBtn.style.display = "none";
      if (nextBtn) nextBtn.style.display = "none";
      if (counter) counter.style.display = "none";
      return;
    }

    let currentIndex = 0;

    function showSlide(index) {
      slides.forEach((slide, i) => {
        if (i === index) {
          slide.classList.add("active");
        } else {
          slide.classList.remove("active");
        }
      });
      if (counter) {
        counter.style.display = "block";
        counter.textContent = `${index + 1}/${slides.length}`;
      }
    }

    // Tự động khởi tạo hiển thị slide đầu tiên và tính toán số đếm 1/N ngay từ khi mở trang
    showSlide(0);

    if (prevBtn) {
      prevBtn.style.display = "flex";
      prevBtn.addEventListener("click", function (e) {
        e.preventDefault();
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        showSlide(currentIndex);
      });
    }

    if (nextBtn) {
      nextBtn.style.display = "flex";
      nextBtn.addEventListener("click", function (e) {
        e.preventDefault();
        currentIndex = (currentIndex + 1) % slides.length;
        showSlide(currentIndex);
      });
    }
  });
}

document.addEventListener("DOMContentLoaded", initBriefSliders);

// ------------------
// Xử lý Lightbox phóng to ảnh toàn màn hình với nút Next/Prev chuyển ảnh
function initImageLightbox() {
  let lightbox = document.getElementById("image-lightbox");
  if (!lightbox) {
    lightbox = document.createElement("div");
    lightbox.id = "image-lightbox";
    lightbox.innerHTML = `
      <button class="lightbox-close" aria-label="Đóng"><i class="fas fa-times"></i></button>
      <button class="lightbox-nav lightbox-prev" aria-label="Ảnh trước"><i class="fas fa-chevron-left"></i></button>
      <img class="lightbox-content" src="" alt="Ảnh phóng to" />
      <button class="lightbox-nav lightbox-next" aria-label="Ảnh tiếp"><i class="fas fa-chevron-right"></i></button>
      <div class="lightbox-counter">1 / 1</div>
    `;
    document.body.appendChild(lightbox);
  }

  const lightboxImg = lightbox.querySelector(".lightbox-content");
  const closeBtn = lightbox.querySelector(".lightbox-close");
  const prevBtn = lightbox.querySelector(".lightbox-prev");
  const nextBtn = lightbox.querySelector(".lightbox-next");
  const counter = lightbox.querySelector(".lightbox-counter");

  let currentGallery = [];
  let currentIndex = 0;
  let activeSliderSyncFn = null;

  function updateLightboxImage() {
    if (currentGallery.length === 0) return;
    lightboxImg.src = currentGallery[currentIndex];

    if (currentGallery.length > 1) {
      prevBtn.style.display = "flex";
      nextBtn.style.display = "flex";
      counter.style.display = "block";
      counter.textContent = `${currentIndex + 1} / ${currentGallery.length}`;
    } else {
      prevBtn.style.display = "none";
      nextBtn.style.display = "none";
      counter.style.display = "none";
    }

    // Đồng bộ slide với card bên dưới nếu thuộc slider
    if (activeSliderSyncFn) {
      activeSliderSyncFn(currentIndex);
    }
  }

  function openLightbox(gallery, index, syncFn) {
    currentGallery = gallery;
    currentIndex = index;
    activeSliderSyncFn = syncFn || null;
    updateLightboxImage();
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden"; // Khóa cuộn trang khi đang mở lightbox
  }

  function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = ""; // Khôi phục cuộn trang
  }

  function showPrev() {
    if (currentGallery.length <= 1) return;
    currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
    updateLightboxImage();
  }

  function showNext() {
    if (currentGallery.length <= 1) return;
    currentIndex = (currentIndex + 1) % currentGallery.length;
    updateLightboxImage();
  }

  // Bắt sự kiện click vào ảnh
  document.addEventListener("click", function (e) {
    const img = e.target.closest(".brief-img-wrapper img, .slide-item img, .zoomable-img");
    if (!img || !img.src) return;

    // Kiểm tra xem ảnh có thuộc về slider nhiều ảnh không
    const slider = img.closest(".brief-slider");
    if (slider) {
      const slideImgs = Array.from(slider.querySelectorAll(".slide-item img"));
      const gallerySrcs = slideImgs.map((i) => i.src);
      const clickedIdx = slideImgs.indexOf(img);

      // Hàm đồng bộ trạng thái slider trên trang
      const syncFn = (idx) => {
        const slides = slider.querySelectorAll(".slide-item");
        const cardCounter = slider.querySelector(".slider-counter");
        slides.forEach((s, i) => {
          if (i === idx) s.classList.add("active");
          else s.classList.remove("active");
        });
        if (cardCounter) cardCounter.textContent = `${idx + 1}/${slides.length}`;
      };

      openLightbox(gallerySrcs, clickedIdx >= 0 ? clickedIdx : 0, syncFn);
    } else {
      // Ảnh đơn lẻ (vd: ảnh brief bên trái)
      openLightbox([img.src], 0, null);
    }
  });

  // Nút chuyển ảnh Next / Prev
  prevBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    showPrev();
  });

  nextBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    showNext();
  });

  // Đóng khi click nút X hoặc click ra ngoài vùng ảnh
  closeBtn.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Phím tắt điều khiển bàn phím (Phím mũi tên trái/phải và phím Esc)
  document.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("active")) return;
    if (e.key === "Escape") closeLightbox();
    else if (e.key === "ArrowLeft") showPrev();
    else if (e.key === "ArrowRight") showNext();
  });
}

document.addEventListener("DOMContentLoaded", initImageLightbox);

// <!--Start of Tawk.to Script-->
var Tawk_API = Tawk_API || {},
  Tawk_LoadStart = new Date();
(function () {
  var s1 = document.createElement("script"),
    s0 = document.getElementsByTagName("script")[0];
  s1.async = true;
  s1.src = "https://embed.tawk.to/69a5dfcc2f01051c35610930/1jinv4eps";
  s1.charset = "UTF-8";
  s1.setAttribute("crossorigin", "*");
  s0.parentNode.insertBefore(s1, s0);
})();
// <!--End of Tawk.to Script-->