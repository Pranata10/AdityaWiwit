(() => {
  const data = window.WEDDING || {};
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  function onReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  }

  function playAllBgVideos() {
    $$("video.bg-video").forEach((vid) => {
      vid.muted = true;
      vid.defaultMuted = true;
      vid.playsInline = true;
      vid.setAttribute("muted", "");
      vid.setAttribute("playsinline", "");
      vid.setAttribute("webkit-playsinline", "");
      const promise = vid.play();
      if (promise && typeof promise.catch === "function") {
        promise.catch(() => {});
      }
    });
  }

  const couple = `${data.names?.first || "Aditya"} & ${data.names?.second || "Wiwit"}`;

  onReady(function () {
    // ==========================================
    // 1. WEDDING NAMES & DATE (DARI CONFIG.JS)
    // ==========================================
    $$("[data-name='bride']").forEach((el) => {
      el.textContent = data.names?.first || "Aditya";
    });

    $$("[data-name='groom']").forEach((el) => {
      el.textContent = data.names?.second || "Wiwit";
    });

    $$("[data-name='couple']").forEach((el) => {
      el.textContent = couple;
    });

    $$("[data-date-label]").forEach((el) => {
      el.textContent = data.dateLabel || "";
    });

    // ==========================================
    // 2. NAMA TAMU DARI URL (?to=, ?guest=, ?u=)
    // ==========================================
    const params = new URLSearchParams(window.location.search);
    const rawGuest = params.get("to") || params.get("guest") || params.get("u");
    if (rawGuest) {
      const cleanName = rawGuest.replace(/\?+$/, "").trim();
      if (cleanName) {
        $$("#guestName, #guest-name, .guest-name, [data-guest]").forEach((el) => {
          el.textContent = cleanName;
        });
        const rsvpNameInput = $("#rsvpForm input[name='name']");
        if (rsvpNameInput && !rsvpNameInput.value.trim()) {
          rsvpNameInput.value = cleanName;
        }
      }
    }

    // ==========================================
    // 3. BACKGROUND & GALLERY IMAGES (CONFIG)
    // ==========================================
    $$("[data-image]").forEach((el) => {
      const key = el.dataset.image;
      const url = data.images?.[key];
      if (url) el.style.backgroundImage = `url("${url}")`;
    });

    $$("[data-gallery]").forEach((el) => {
      const url = data.gallery?.[Number(el.dataset.gallery)];
      if (url) el.src = url;
    });

    // ==========================================
    // 4. WEDDING EVENTS & GIFT (CONFIG)
    // ==========================================
    ["ceremony", "reception"].forEach((key) => {
      const event = data.events?.[key];
      if (!event) return;

      ["date", "time", "place"].forEach((field) => {
        const el = $(`[data-event="${key}-${field}"]`);
        if (el) el.innerHTML = String(event[field] || "").replace(/\n/g, "<br>");
      });

      const map = $(`[data-map="${key}"]`);
      if (map && event.map) map.href = event.map;
    });

    $$("[data-gift]").forEach((el) => {
      const field = el.dataset.gift;
      if (data.gift?.[field]) el.textContent = data.gift[field];
    });

    // ==========================================
    // 5. HAMBURGER NAVIGATION
    // ==========================================
    const toggle = $("#menuToggle");
    const menu = $("#menu");

    toggle?.addEventListener("click", () => {
      if (!menu) return;
      const open = menu.classList.toggle("open");
      toggle.classList.toggle("active", open);
      toggle.setAttribute("aria-expanded", String(open));
    });

    $$("#menu a").forEach((a) => {
      a.addEventListener("click", () => {
        menu?.classList.remove("open");
        toggle?.classList.remove("active");
        toggle?.setAttribute("aria-expanded", "false");
      });
    });

    // ==========================================
    // 6. COUNTDOWN TIMER
    // ==========================================
    const target = new Date(data.date || "2026-12-12T10:00:00+08:00").getTime();

    function tick() {
      let diff = Math.max(0, target - Date.now());
      const units = {
        days: 86400000,
        hours: 3600000,
        minutes: 60000,
        seconds: 1000
      };

      Object.entries(units).forEach(([id, size]) => {
        const el = document.getElementById(id);
        if (el) {
          el.textContent = String(Math.floor(diff / size)).padStart(2, "0");
          diff %= size;
        }
      });
    }

    tick();
    setInterval(tick, 1000);

    // ==========================================
    // 7. SCROLL REVEAL ANIMATION
    // ==========================================
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    $$(".reveal").forEach((el) => observer.observe(el));

    // ==========================================
    // 8. LOADER (1% -> 100%)
    // ==========================================
    const loader = document.getElementById("loader");
    const loaderNumber = document.getElementById("loaderNumber");

    if (loader && loaderNumber) {
      let count = 1;
      const interval = setInterval(() => {
        count++;
        loaderNumber.innerText = count;

        if (count >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            loader.style.opacity = "0";
            loader.style.visibility = "hidden";
            setTimeout(() => {
              loader.style.display = "none";
            }, 600);
          }, 200);
        }
      }, 20);
    }

    // ==========================================
    // 9. TOMBOL BUKA UNDANGAN
    // ==========================================
    const openBtn = document.getElementById("openInvitation");
    const guestCover = document.getElementById("guestCover");
    const bgMusic = document.getElementById("bgMusic");
    const introSection = document.getElementById("intro");

    if (openBtn) {
      openBtn.addEventListener("click", function (e) {
        e.preventDefault();

        if (guestCover) {
          guestCover.classList.add("is-opened");
          guestCover.style.setProperty("display", "none", "important");
          guestCover.style.setProperty("visibility", "hidden", "important");
          guestCover.style.setProperty("opacity", "0", "important");
          guestCover.style.setProperty("pointer-events", "none", "important");
        }

        document.documentElement.classList.remove("lock-scroll");
        document.body.classList.remove("lock-scroll");
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.width = "";
        document.body.style.height = "";

        playAllBgVideos();

        if (bgMusic) {
          bgMusic.loop = true;
          bgMusic.currentTime = 0;
          bgMusic.play().catch((error) => {
            console.log("Autoplay audio ditahan browser:", error);
          });
        }

        if (introSection) {
          const prevScrollBehavior = document.documentElement.style.scrollBehavior;
          document.documentElement.style.scrollBehavior = "auto";
          introSection.scrollIntoView({ behavior: "instant", block: "start" });
          window.scrollTo({ top: introSection.offsetTop, left: 0, behavior: "instant" });
          document.documentElement.style.scrollBehavior = prevScrollBehavior;
        }

        if (typeof AOS !== "undefined") {
          setTimeout(() => {
            if (typeof AOS.refreshHard === "function") {
              AOS.refreshHard();
            } else if (typeof AOS.refresh === "function") {
              AOS.refresh();
            }
          }, 120);
        }
      });
    }

    // ==========================================
    // 10. AUTOPLAY YOUTUBE PREWEDDING SAAT TERLIHAT
    // ==========================================
    const prewedSection = document.getElementById("prewed-video");
const prewedIframe = document.getElementById("prewedYoutubeIframe");

if (prewedSection && prewedIframe) {
  let isPrewedVisible = false;

  const sendYTCommand = (func, args = []) => {
    if (!prewedIframe.contentWindow) return;
    prewedIframe.contentWindow.postMessage(
      JSON.stringify({ event: "command", func, args }),
      "*"
    );
  };

  const kickYTPlay = () => {
    if (!prewedIframe.contentWindow) return;
    prewedIframe.contentWindow.postMessage(
      JSON.stringify({
        event: "listening",
        id: prewedIframe.id || "prewedYoutubeIframe"
      }),
      "*"
    );
    sendYTCommand("mute");
    sendYTCommand("playVideo");
  };

  prewedIframe.addEventListener("load", () => {
    if (isPrewedVisible) {
      setTimeout(kickYTPlay, 250);
      setTimeout(kickYTPlay, 800);
    }
  });

  const ytObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        isPrewedVisible = entry.isIntersecting;
        if (isPrewedVisible) {
          kickYTPlay();
          setTimeout(kickYTPlay, 350);
          setTimeout(kickYTPlay, 900);
        }
      });
    },
    { threshold: 0.25 }
  );

  ytObserver.observe(prewedSection);
}
    // ==========================================
    // 11. DOWNLOAD FOTO DI LIGHTBOX & KEYBOARD ESC
    // ==========================================
    const downloadBtn = document.getElementById("downloadBtn");
    if (downloadBtn) {
      downloadBtn.addEventListener("click", async function (e) {
        const src = this.dataset.src || this.getAttribute("href");
        const filename = this.dataset.filename || "foto-galeri.jpg";
        if (!src) return;

        e.preventDefault();

        try {
          const response = await fetch(src);
          if (!response.ok) throw new Error("Gagal mengambil gambar");
          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob);

          const tempLink = document.createElement("a");
          tempLink.href = blobUrl;
          tempLink.download = filename;
          document.body.appendChild(tempLink);
          tempLink.click();
          document.body.removeChild(tempLink);

          setTimeout(() => URL.revokeObjectURL(blobUrl), 1500);
        } catch (err) {
          const fallbackLink = document.createElement("a");
          fallbackLink.href = src;
          fallbackLink.download = filename;
          fallbackLink.target = "_blank";
          fallbackLink.rel = "noopener";
          document.body.appendChild(fallbackLink);
          fallbackLink.click();
          document.body.removeChild(fallbackLink);
        }
      });
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeLightbox();
      }
    });

    // ==========================================
    // 12. RSVP & GOOGLE SHEETS + PAGINATION
    // ==========================================
    const SCRIPT_URL =
      "https://script.google.com/macros/s/AKfycbx4W7sFprk_qx2WvDPrzRHj_dqMefFTVV9oYIImvP0Fo0lg9ccyOUxUTOStpr5h8QS6tg/exec";
    const ITEMS_PER_PAGE = 4;

    const rsvpForm = document.getElementById("rsvpForm");
    const submitBtn = document.getElementById("rsvpSubmitBtn");
    const wishesContainer = document.getElementById("wishesContainer");
    const paginationContainer = document.getElementById("wishesPagination");

    let allWishes = [];
    let currentPage = 1;

    function escapeHTML(str) {
      return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    function renderWishesPage(page) {
      if (!wishesContainer) return;
      currentPage = page;

      if (allWishes.length === 0) {
        wishesContainer.innerHTML = `<p style="text-align:center;font-size:10px;opacity:0.7;">Belum ada ucapan. Jadilah yang pertama mengirim doa restu!</p>`;
        if (paginationContainer) paginationContainer.innerHTML = "";
        return;
      }

      const totalPages = Math.ceil(allWishes.length / ITEMS_PER_PAGE);
      if (currentPage > totalPages) currentPage = totalPages;

      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const visibleWishes = allWishes.slice(startIndex, startIndex + ITEMS_PER_PAGE);

      wishesContainer.innerHTML = visibleWishes
        .map((item) => {
          const isAbsent = String(item.attendance).toLowerCase().includes("tidak");
          return `
            <div class="wish-card">
              <div class="wish-header">
                <span class="wish-name">${escapeHTML(item.name)}</span>
                <span class="wish-badge ${isAbsent ? "absent" : ""}">${escapeHTML(item.attendance)}</span>
              </div>
              <p class="wish-message">${escapeHTML(item.message)}</p>
              ${item.timestamp ? `<span class="wish-time">${escapeHTML(item.timestamp)}</span>` : ""}
            </div>
          `;
        })
        .join("");

      renderPagination(totalPages);
    }

    function renderPagination(totalPages) {
      if (!paginationContainer) return;
      if (totalPages <= 1) {
        paginationContainer.innerHTML = "";
        return;
      }

      let html = `<button type="button" class="page-btn" data-page="${currentPage - 1}" ${currentPage === 1 ? "disabled" : ""}>‹</button>`;

      for (let i = 1; i <= totalPages; i++) {
        html += `<button type="button" class="page-btn ${i === currentPage ? "active" : ""}" data-page="${i}">${i}</button>`;
      }

      html += `<button type="button" class="page-btn" data-page="${currentPage + 1}" ${currentPage === totalPages ? "disabled" : ""}>›</button>`;

      paginationContainer.innerHTML = html;

      paginationContainer.querySelectorAll(".page-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
          const targetPage = Number(this.getAttribute("data-page"));
          if (targetPage >= 1 && targetPage <= totalPages) {
            renderWishesPage(targetPage);
          }
        });
      });
    }

    async function loadWishes() {
      if (!wishesContainer) return;
      wishesContainer.innerHTML = `<p style="text-align:center;font-size:10px;opacity:0.7;">Memuat ucapan...</p>`;

      try {
        const res = await fetch(SCRIPT_URL);
        const json = await res.json();
        if (json.status === "success" && Array.isArray(json.data)) {
          allWishes = json.data;
          renderWishesPage(1);
        }
      } catch (err) {
        console.error("Gagal memuat ucapan:", err);
        wishesContainer.innerHTML = `<p style="text-align:center;font-size:10px;opacity:0.7;">Gagal memuat daftar ucapan.</p>`;
      }
    }

    if (rsvpForm) {
      rsvpForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const formData = new FormData(rsvpForm);
        const payload = {
          name: String(formData.get("name") || "").trim(),
          message: String(formData.get("message") || "").trim(),
          attendance: String(formData.get("attendance") || "").trim()
        };

        if (!payload.name || !payload.message || !payload.attendance) return;

        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = "Sending...";
        }

        try {
          await fetch(SCRIPT_URL, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify(payload)
          });

          allWishes.unshift({
            timestamp: "Baru saja",
            name: payload.name,
            message: payload.message,
            attendance: payload.attendance
          });
          renderWishesPage(1);
          rsvpForm.reset();
        } catch (err) {
          console.error("Gagal mengirim RSVP:", err);
          alert("Maaf, terjadi kendala saat mengirim ucapan. Silakan coba lagi.");
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = "Send";
          }
        }
      });
    }

    loadWishes();
  });

  // Fallback putar video latar belakang saat interaksi pertama
  const resumeAllBgVideos = () => {
    playAllBgVideos();
  };
  document.addEventListener("touchstart", resumeAllBgVideos, { once: true, passive: true });
  document.addEventListener("click", resumeAllBgVideos, { once: true });
})();

// ==========================================
// GLOBAL FUNCTIONS (DIPANGGIL DARI ONCLICK HTML)
// ==========================================
function copyToClipboard(containerId, buttonElement) {
  const targetEl = document.getElementById(containerId);
  if (!targetEl) return;
  const textToCopy = targetEl.innerText.trim();

  const onSuccess = () => {
    const originalText = buttonElement.innerText;
    buttonElement.innerText = "BERHASIL DISALIN!";
    buttonElement.style.background = "#e9e6df";
    buttonElement.style.color = "#171615";

    setTimeout(() => {
      buttonElement.innerText = originalText;
      buttonElement.style.background = "rgba(233, 230, 223, 0.1)";
      buttonElement.style.color = "var(--paper)";
    }, 2000);
  };

  if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
    navigator.clipboard.writeText(textToCopy).then(onSuccess).catch(() => {
      fallbackCopy(textToCopy, onSuccess);
    });
  } else {
    fallbackCopy(textToCopy, onSuccess);
  }
}

function fallbackCopy(text, onSuccess) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand("copy");
    onSuccess();
  } catch (err) {
    console.error("Gagal menyalin teks: ", err);
  } finally {
    document.body.removeChild(textarea);
  }
}

function openLightbox(imgSrc) {
  const modal = document.getElementById("imageLightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const downloadBtn = document.getElementById("downloadBtn");

  if (!modal || !lightboxImg) return;

  lightboxImg.src = imgSrc;

  if (downloadBtn) {
    const fileName = imgSrc.split("/").pop() || "foto-galeri.jpg";
    downloadBtn.href = imgSrc;
    downloadBtn.setAttribute("download", fileName);
    downloadBtn.dataset.src = imgSrc;
    downloadBtn.dataset.filename = fileName;
  }

  modal.style.display = "flex";
}

function closeLightbox() {
  const modal = document.getElementById("imageLightbox");
  if (modal) modal.style.display = "none";
}
