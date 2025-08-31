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

  // Tính index bắt đầu và kết thúc
  let start = (currentPage - 1) * POSTS_PER_PAGE;
  let end = start + POSTS_PER_PAGE;
  let pagePosts = posts.slice(start, end);

  pagePosts.forEach((post, index) => {
    let div = document.createElement("div");
    div.className = "post";

    // lấy text gốc (ưu tiên text, fallback sang content)
    const raw = post.text ?? post.content ?? "";

    // biến text thành clickable link
    const textWithLinks = raw
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/\n/g, "<br>");

    div.innerHTML = `
      <p>${textWithLinks}</p>
      ${post.image ? `<img src="${post.image}">` : ""}
      <div class="reactions">
        <button class="like-btn">👍 Like (<span>${post.likes || 0}</span>)</button>
      </div>
    `;

    // xử lý click Like
    let likeBtn = div.querySelector(".like-btn");
    likeBtn.addEventListener("click", async () => {
      let globalIndex = start + index; // vì đang phân trang nên phải cộng offset
      posts[globalIndex].likes = (posts[globalIndex].likes || 0) + 1;
      likeBtn.querySelector("span").textContent = posts[globalIndex].likes;
      await savePosts(posts);
    });

    postsDiv.appendChild(div);
  });

  // Cập nhật thông tin phân trang
  let totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  document.getElementById("pageInfo").textContent = `Trang ${currentPage} / ${totalPages}`;
  document.getElementById("prevBtn").disabled = currentPage === 1;
  document.getElementById("nextBtn").disabled = currentPage === totalPages;
}

// Load dữ liệu khi mở trang
window.onload = async function() {
  posts = await getPosts();
  renderPosts();

  // Nút phân trang
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
