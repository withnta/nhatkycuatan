// Hiển thị bài viết ở trang chính
window.onload = async function() {
  let postsDiv = document.getElementById("posts");
  let posts = await getPosts();

  if (posts.length === 0) {
    postsDiv.innerHTML = "<p>Chưa có bài viết nào 🌱</p>";
    return;
  }

  posts.forEach(post => {
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
    `;
    postsDiv.appendChild(div);
  });
};
