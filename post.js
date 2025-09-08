// Upload ảnh lên ImgBB
async function uploadToImgBB(file) {
  let form = new FormData();
  form.append("image", file);

  let res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, {
    method: "POST",
    body: form
  });

  let data = await res.json();
  if (data.success) {
    return data.data.url; // link ảnh public
  } else {
    throw new Error("Upload ảnh thất bại!");
  }
}

// Đăng nhật ký mới
async function postDiary() {
  let content = document.getElementById("content").value;
  let imageInput = document.getElementById("imageInput").files[0];
  let audioLink = document.getElementById("audioInput").value.trim(); // 🎵 thêm

  if (!content && !imageInput && !audioLink) {
    alert("Vui lòng viết gì đó hoặc chọn ảnh/nhạc!");
    return;
  }

  let imageUrl = null;
  if (imageInput) {
    imageUrl = await uploadToImgBB(imageInput); // upload lên imgbb
  }

  let posts = await getPosts();
  posts.unshift({
    text: content,
    image: imageUrl,
    audio: audioLink, // 🎵 thêm
    comments: []
  });

  await savePosts(posts);
  alert("Đăng thành công!");
  renderPosts();

  // Reset form
  document.getElementById("content").value = "";
  document.getElementById("imageInput").value = "";
  document.getElementById("audioInput").value = ""; // 🎵 reset
}

// Hiển thị & quản lý bài viết + comment
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

    // danh sách comment (nếu có)
    let commentHTML = "";
    if (post.comments && post.comments.length > 0) {
      commentHTML = `
        <div class="comments">
          <h4>Bình luận:</h4>
          <ul>
            ${post.comments
              .map(
                (cmt, cIndex) => `
              <li>
                <b>${cmt.nickname}:</b> ${cmt.text}
                <button onclick="deleteComment(${index}, ${cIndex})">❌</button>
              </li>`
              )
              .join("")}
          </ul>
        </div>
      `;
    }

    div.innerHTML = `
      <p>${post.text}</p>
      ${post.image ? `<img src="${post.image}" alt="Ảnh nhật ký">` : ""}
      ${post.audio ? renderAudio(post.audio) : ""} <!-- 🎵 hiển thị nhạc -->
      <br>
      <button onclick="deletePost(${index})">❌ Xóa bài</button>
      ${commentHTML}
    `;

    container.appendChild(div);
  });
}

// 🎵 Hàm render nhạc
function renderAudio(url) {
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    return `<iframe width="100%" height="200" src="${url.replace("watch?v=", "embed/")}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
  } else if (url.includes("soundcloud.com")) {
    return `<iframe width="100%" height="166" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}"></iframe>`;
  } else if (url.endsWith(".mp3")) {
    return `<audio controls><source src="${url}" type="audio/mpeg"></audio>`;
  } else {
    return `<a href="${url}" target="_blank">🎵 Nghe nhạc tại đây</a>`;
  }
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

// Xóa 1 comment trong bài viết
async function deleteComment(postIndex, commentIndex) {
  let posts = await getPosts();
  posts[postIndex].comments.splice(commentIndex, 1);
  await savePosts(posts);
  renderPosts();
}

// Load khi mở trang post.html
window.onload = renderPosts;
