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
