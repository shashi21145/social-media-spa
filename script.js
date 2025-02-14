document.addEventListener("DOMContentLoaded", () => {
  const authSection = document.getElementById("auth-section");
  const contentSection = document.getElementById("content-section");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const loginBtn = document.getElementById("login-btn");
  const registerBtn = document.getElementById("register-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const postBtn = document.getElementById("post-btn");
  const postText = document.getElementById("post-text");
  const postImage = document.getElementById("post-image");
  const postsFeed = document.getElementById("posts-feed");

  let currentUser = null;

  // Check if user is logged in
  if (localStorage.getItem("currentUser")) {
    currentUser = JSON.parse(localStorage.getItem("currentUser"));
    authSection.classList.add("hidden");
    contentSection.classList.remove("hidden");
    loadPosts();
  }

  // Register
  registerBtn.addEventListener("click", () => {
    const username = usernameInput.value;
    const password = passwordInput.value;
    if (username && password) {
      localStorage.setItem(username, JSON.stringify({ username, password, posts: [] }));
      alert("Registration successful!");
    } else {
      alert("Please enter a username and password.");
    }
  });

  // Login
  loginBtn.addEventListener("click", () => {
    const username = usernameInput.value;
    const password = passwordInput.value;
    const user = JSON.parse(localStorage.getItem(username));
    if (user && user.password === password) {
      currentUser = user;
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      authSection.classList.add("hidden");
      contentSection.classList.remove("hidden");
      loadPosts();
    } else {
      alert("Invalid username or password.");
    }
  });

  // Logout
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    currentUser = null;
    authSection.classList.remove("hidden");
    contentSection.classList.add("hidden");
  });

  // Create Post
  postBtn.addEventListener("click", () => {
    const text = postText.value;
    const image = postImage.files[0];
    if (text || image) {
      const reader = new FileReader();
      reader.onload = () => {
        const post = {
          id: Date.now(),
          text,
          image: reader.result,
          likes: 0,
          comments: [],
        };
        currentUser.posts.push(post);
        localStorage.setItem(currentUser.username, JSON.stringify(currentUser));
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
        loadPosts();
        postText.value = "";
        postImage.value = "";
      };
      if (image) reader.readAsDataURL(image);
      else reader.onload();
    }
  });

  // Load Posts
  function loadPosts() {
    postsFeed.innerHTML = "";
    currentUser.posts.forEach((post) => {
      const postElement = document.createElement("div");
      postElement.className = "post";
      postElement.innerHTML = `
        <p>${post.text}</p>
        ${post.image ? `<img src="${post.image}" alt="Post Image">` : ""}
        <div class="post-actions">
          <button onclick="likePost(${post.id})">❤️ ${post.likes}</button>
          <button onclick="addComment(${post.id})">💬 Comment</button>
        </div>
        <div class="comments">
          ${post.comments.map((comment) => `<div class="comment">${comment}</div>`).join("")}
        </div>
      `;
      postsFeed.appendChild(postElement);
    });
  }

  // Like Post
  window.likePost = (postId) => {
    const post = currentUser.posts.find((p) => p.id === postId);
    post.likes++;
    localStorage.setItem(currentUser.username, JSON.stringify(currentUser));
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    loadPosts();
  };

  // Add Comment
  window.addComment = (postId) => {
    const comment = prompt("Enter your comment:");
    if (comment) {
      const post = currentUser.posts.find((p) => p.id === postId);
      post.comments.push(comment);
      localStorage.setItem(currentUser.username, JSON.stringify(currentUser));
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      loadPosts();
    }
  };
});