/**
 * Hardware Numb3rs — Landing Page Script
 */

(function () {
  "use strict";

  /* ---- Year in footer ---- */
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear().toString();
  }

  /* ---- Mobile nav toggle ---- */
  const toggle = document.querySelector(".nav__toggle");
  const navLinks = document.querySelector(".nav__links");

  if (toggle && navLinks) {
    toggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---- Fetch latest videos via YouTube RSS (via public proxy) ---- */
  const CHANNEL_ID_REGEX = /channel\/([\w-]+)/;
  const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/c/HardwareNumb3rs";
  const VIDEOS_GRID = document.getElementById("videos-grid");
  const VIDEOS_FALLBACK = document.getElementById("videos-fallback");
  const MAX_VIDEOS = 6;

  /**
   * Renders skeleton placeholders while loading.
   */
  function renderSkeletons(count) {
    if (!VIDEOS_GRID) return;
    let html = "";
    for (let i = 0; i < count; i++) {
      html += `
        <div class="video-card video-card--skeleton">
          <div class="video-card__thumb"></div>
          <div class="video-card__body">
            <div class="video-card__title">Loading…</div>
            <div class="video-card__date">—</div>
          </div>
        </div>`;
    }
    VIDEOS_GRID.innerHTML = html;
  }

  /**
   * Build a video card element.
   */
  function videoCardHTML(video) {
    const dateStr = new Date(video.published).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    return `
      <a href="${video.url}" target="_blank" rel="noopener" class="video-card">
        <div class="video-card__thumb">
          <img
            src="${video.thumbnail}"
            alt="${video.title}"
            loading="lazy"
            width="480"
            height="270"
          />
          <div class="video-card__play">
            <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </div>
        </div>
        <div class="video-card__body">
          <h3 class="video-card__title">${video.title}</h3>
          <time class="video-card__date" datetime="${video.published}">${dateStr}</time>
        </div>
      </a>`;
  }

  /**
   * Try to load videos from the YouTube RSS feed.
   * Uses a CORS-friendly public proxy to avoid CORS issues in-browser.
   */
  async function loadVideos() {
    if (!VIDEOS_GRID) return;
    renderSkeletons(MAX_VIDEOS);

    try {
      // YouTube channel ID for Hardware Numb3rs
      const CHANNEL_ID = "UCVTvrgSgjmEruGyyTclpq2w";
      const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

      const res = await fetch(feedUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const text = await res.text();
      const parser = new DOMParser();
      const xml = parser.parseFromString(text, "application/xml");
      const entries = xml.querySelectorAll("entry");

      if (!entries.length) throw new Error("No entries");

      const videos = Array.from(entries)
        .slice(0, MAX_VIDEOS)
        .map((entry) => {
          const videoId =
            entry.querySelector("videoId")?.textContent ??
            entry
              .querySelector("id")
              ?.textContent?.replace("yt:video:", "") ??
            "";
          return {
            title:
              entry.querySelector("title")?.textContent ?? "Untitled",
            url: `https://www.youtube.com/watch?v=${videoId}`,
            thumbnail: `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
            published:
              entry.querySelector("published")?.textContent ??
              new Date().toISOString(),
          };
        });

      VIDEOS_GRID.innerHTML = videos.map(videoCardHTML).join("");
    } catch {
      // Fallback: show link to YouTube channel
      VIDEOS_GRID.innerHTML = "";
      if (VIDEOS_FALLBACK) VIDEOS_FALLBACK.hidden = false;
    }
  }

  loadVideos();
})();
