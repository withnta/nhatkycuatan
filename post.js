// Đăng nhật ký mới
async function postDiary() {
  let content = document.getElementById("content").value;
  let imageInput = document.getElementById("imageInput").files[0];

  if (!content && !imageInput) {
    alert("Vui lòng viết gì đó hoặc chọn ảnh!");
    return;
  }

  // Convert ảnh sang base64
  let imageBase64 = null;
  if (imageInput) {
    imageBase64 = await toBase64(imageInput);
  }

  let posts = await getPosts();
  posts.unshift({
    text: content,
    image: imageBase64
  });

  await savePosts(posts);
  alert("Đăng thành công!");
  renderPosts();

  // Reset form
  document.getElementById("content").value = "";
  document.getElementById("imageInput").value = "";
}

// Chuyển file sang Base64
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Hiển thị & quản lý bài viết
async function renderPosts() {
  let posts = await getPosts();
  let container = document.getElementById("managePosts");

  if (posts.length === 0) {
    container.innerHTML = "<p>Chưa có bài viết nào 🌱</p>";
    return;
  }

  container.innerHTML = "";
  posts.forEach((post, index) => {
    let div = document.createElement("div");
    div.className = "post";

    div.innerHTML = `
      <p>${post.text}</p>
      ${post.image ? `<img src="${post.image}">` : ""}
      <br>
      <button onclick="deletePost(${index})">❌ Xóa</button>
    `;

    container.appendChild(div);
  });
}

// Xóa bài viết
async function deletePost(index) {
  let posts = await getPosts();
  if (confirm("Bạn có chắc muốn xóa bài này không?")) {
    posts.splice(index, 1);
    await savePosts(posts);
    renderPosts();
  }
}

// Load khi mở trang post.html
window.onload = renderPosts;
