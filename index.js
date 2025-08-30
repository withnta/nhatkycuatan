// 🔗 Tự động biến link trong text thành <a>
function linkify(text) {
  let urlPattern = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlPattern, '<a href="$1" target="_blank">$1</a>');
}

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

    div.innerHTML = `
      <p>${linkify(post.text)}</p>
      ${post.image ? `<img src="${post.image}">` : ""}
    `;
    postsDiv.appendChild(div);
  });
};
