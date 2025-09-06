// Số bài viết mỗi trang
const POSTS_PER_PAGE = 5;
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
      <div class="reactions">
        <button class="like-btn">👍 Like (<span>${post.likes || 0}</span>)</button>
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

window.onload = async function() {
  posts = await getPosts();
  renderPosts();

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
};
