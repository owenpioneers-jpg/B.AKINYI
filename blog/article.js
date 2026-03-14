/* ============================================================
   BERYL Portfolio — article.js
   Handles: reading progress bar, copy link buttons
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. READING PROGRESS BAR ── */
  const progressFill = document.getElementById('readingProgress');
  const articleContent = document.getElementById('articleContent');

  if (progressFill && articleContent) {
    const updateProgress = () => {
      const articleTop    = articleContent.offsetTop;
      const articleHeight = articleContent.offsetHeight;
      const scrolled      = window.scrollY - articleTop;
      const pct           = Math.min(Math.max((scrolled / articleHeight) * 100, 0), 100);
      progressFill.style.height = pct + '%';
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }


  /* ── 2. COPY LINK buttons ── */
  const copyBtns = document.querySelectorAll('#copyLinkBtn, #copyLinkBtn2');

  copyBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        const original = btn.textContent;
        btn.textContent = '✓';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = original;
          btn.classList.remove('copied');
        }, 2000);
      } catch {
        // Fallback for browsers without clipboard API
        const input = document.createElement('input');
        input.value = window.location.href;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        btn.textContent = '✓';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = '🔗';
          btn.classList.remove('copied');
        }, 2000);
      }
    });
  });

});