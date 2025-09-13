// Số bài viết mỗi trang
const POSTS_PER_PAGE = 6;
let currentPage = 1;
let posts = [];

// Hiển thị danh sách bài viết theo trang
function renderPosts() {
  let postsDiv = document.getElementById("posts");
  postsDiv.innerHTML = "";

  if (posts.length === 0) {
    postsDiv.innerHTML = "<p>Chưa có bài viết nào 🌱</p>";
    return;
  }

  let start = (currentPage - 1) * POSTS_PER_PAGE;
  let end = start + POSTS_PER_PAGE;
  let pagePosts = posts.slice(start, end);

  pagePosts.forEach((post, index) => {
    let div = document.createElement("div");
    div.className = "post";

    const raw = post.text ?? post.content ?? "";

    const textWithLinks = raw
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/\n/g, "<br>");
   

    // Giữ biến commentsHtml nhưng không dùng (tránh lỗi)
    let commentsHtml = "";
    /*
    if (post.comments && post.comments.length > 0) {
      commentsHtml = post.comments.map(c => `
        <div class="comment">
          <strong>${c.nickname}:</strong> ${c.text}
        </div>
      `).join("");
    }
    */

    div.innerHTML = `
      <div class="post-header">
        <img src="nhatky.jpg" class="avatar">
        <span class="author">datbointa</span>
      </div>
      <p>${textWithLinks}</p>
      ${post.image ? `<img src="${post.image}" class="post-img">` : ""}
      ${post.audio ? renderAudio(post.audio) : ""}  <!-- 🎵 thêm -->
      
      <div class="reactions">
        <button class="like-btn">👍 Like (<span>${post.likes || 0}</span>)</button>
        <!-- Thêm các reaction khác -->
        <button class="reaction-btn" data-type="love">❤️ (<span>${post.reactions?.love || 0}</span>)</button>
        <button class="reaction-btn" data-type="haha">😆 (<span>${post.reactions?.haha || 0}</span>)</button>
        <button class="reaction-btn" data-type="sad">😢 (<span>${post.reactions?.sad || 0}</span>)</button>
        <button class="reaction-btn" data-type="angry">😡 (<span>${post.reactions?.angry || 0}</span>)</button>

         
      </div>
      
      <!-- 
      <div class="comments">
        <h4>💬 Bình luận</h4>
        <div class="comments-list">${commentsHtml || "<p>Chưa có bình luận nào</p>"}</div>
        <input type="text" class="nickname-input" placeholder="Nickname (bắt buộc)">
        <textarea class="comment-input" placeholder="Nhập bình luận..."></textarea>
        <button class="comment-btn">Gửi</button>
      </div>
      -->
    `;

    // xử lý click Like
    let likeBtn = div.querySelector(".like-btn");
    likeBtn.addEventListener("click", async () => {
      let globalIndex = start + index;
      posts[globalIndex].likes = (posts[globalIndex].likes || 0) + 1;
      likeBtn.querySelector("span").textContent = posts[globalIndex].likes;
      await savePosts(posts);
    });

    // xử lý click cho các reaction khác
    let reactionBtns = div.querySelectorAll(".reaction-btn");
    reactionBtns.forEach(btn => {
      btn.addEventListener("click", async () => {
        let type = btn.getAttribute("data-type");
        let globalIndex = start + index;

        if (!posts[globalIndex].reactions) posts[globalIndex].reactions = {};
        posts[globalIndex].reactions[type] = (posts[globalIndex].reactions[type] || 0) + 1;

        btn.querySelector("span").textContent = posts[globalIndex].reactions[type];
        await savePosts(posts);
      });
    });

    // xử lý comment (đã comment lại toàn bộ)
    /*
    let commentBtn = div.querySelector(".comment-btn");
    commentBtn.addEventListener("click", async () => {
      let globalIndex = start + index;
      let nickname = div.querySelector(".nickname-input").value.trim();
      let text = div.querySelector(".comment-input").value.trim();

      if (!nickname || !text) {
        alert("Vui lòng nhập nickname và bình luận!");
        return;
      }

      if (!posts[globalIndex].comments) posts[globalIndex].comments = [];
      posts[globalIndex].comments.push({ nickname, text });

      await savePosts(posts);
      renderPosts(); // refresh lại để thấy comment mới
    });
    */

    postsDiv.appendChild(div);
  });

  let totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  document.getElementById("pageInfo").textContent = `Trang ${currentPage} / ${totalPages}`;
  document.getElementById("prevBtn").disabled = currentPage === 1;
  document.getElementById("nextBtn").disabled = currentPage === totalPages;
}

function renderAudio(url) {
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    let videoId = "";

    // xử lý link youtube đầy đủ
    if (url.includes("watch?v=")) {
      videoId = new URL(url).searchParams.get("v");
    }

    // xử lý link youtube rút gọn
    if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1].split("?")[0];
    }

    if (videoId) {
      return `<iframe width="100%" height="200" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
    } else {
      return `<a href="${url}" target="_blank">📺 Xem video trên YouTube</a>`;
    }
  } else if (url.includes("soundcloud.com")) {
    return `<iframe width="100%" height="166" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}"></iframe>`;
  } else if (url.endsWith(".mp3")) {
    return `<audio controls><source src="${url}" type="audio/mpeg"></audio>`;
  } else {
    return `<a href="${url}" target="_blank">🎵 Nghe nhạc tại đây</a>`;
  }
}


window.onload = async function() {
  let loadingEl = document.getElementById("loading");
  if (loadingEl) loadingEl.style.display = "block"; // hiện spinner nếu có

  posts = await getPosts();
  renderPosts();

  if (loadingEl) loadingEl.style.display = "none";  // ẩn spinner nếu có

  document.getElementById("prevBtn").addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderPosts();
    }
  });

  document.getElementById("nextBtn").addEventListener("click", () => {
    let totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
    if (currentPage < totalPages) {
      currentPage++;
      renderPosts();
    }
  });

 
}; // ✅ đóng đúng chỗ
