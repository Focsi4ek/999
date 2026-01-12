
// Счетчики посещений
function initCounters() {
    let sessionCount = localStorage.getItem('sessionCount') || 0;
    let totalCount = localStorage.getItem('totalCount') || 0;
    
    // Увеличиваем счетчики
    sessionCount = parseInt(sessionCount) + 1;
    totalCount = parseInt(totalCount) + 1;
    
    // Сохраняем
    localStorage.setItem('sessionCount', sessionCount);
    localStorage.setItem('totalCount', totalCount);
    
    // Обновляем отображение
    const sessionElem = document.getElementById('sessionCounter');
    const totalElem = document.getElementById('totalCounter');
    
    if (sessionElem) sessionElem.textContent = sessionCount;
    if (totalElem) totalElem.textContent = totalCount;
}

// Сброс счетчиков
function resetCounters() {
    if (confirm('Вы уверены, что хотите сбросить счетчики?')) {
        localStorage.setItem('sessionCount', 0);
        localStorage.setItem('totalCount', 0);
        initCounters();
    }
}

// Информация о странице
function updatePageInfo() {
    const pageInfo = document.getElementById('pageInfo');
    if (pageInfo) {
        const now = new Date();
        const dateStr = now.toLocaleDateString('ru-RU');
        const timeStr = now.toLocaleTimeString('ru-RU');
        pageInfo.textContent = `Последнее обновление: ${dateStr} ${timeStr}`;
    }
}

// Обработка формы контактов
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Сохраняем в localStorage
            const contactData = {
                name: name,
                email: email,
                message: message,
                date: new Date().toISOString()
            };
            
            localStorage.setItem('lastContact', JSON.stringify(contactData));
            
            // Показываем сообщение
            const messageElem = document.getElementById('formMessage');
            if (messageElem) {
                messageElem.textContent = 'Сообщение отправлено! Мы сохранили его в LocalStorage.';
                messageElem.style.display = 'block';
                
                // Очищаем форму
                form.reset();
                
                // Скрываем сообщение через 5 секунд
                setTimeout(() => {
                    messageElem.style.display = 'none';
                }, 5000);
            }
        });
    }
}

// Очистка формы
function clearForm() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.reset();
        const messageElem = document.getElementById('formMessage');
        if (messageElem) {
            messageElem.style.display = 'none';
        }
    }
}

// Работа с блогом
function initBlog() {
    // Загружаем существующие посты
    loadBlogPosts();
    
    // Загружаем сохраненные посты из localStorage
    const savedPosts = localStorage.getItem('blogPosts');
    if (savedPosts) {
        const posts = JSON.parse(savedPosts);
        displayBlogPosts(posts);
    }
}

function addBlogPost() {
    const titleInput = document.getElementById('postTitle');
    const contentInput = document.getElementById('postContent');
    
    if (!titleInput || !contentInput) return;
    
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    
    if (!title || !content) {
        alert('Пожалуйста, заполните все поля');
        return;
    }
    
    // Получаем существующие посты
    let posts = [];
    const savedPosts = localStorage.getItem('blogPosts');
    if (savedPosts) {
        posts = JSON.parse(savedPosts);
    }
    
    // Добавляем новый пост
    const newPost = {
        id: Date.now(),
        title: title,
        content: content,
        date: new Date().toLocaleDateString('ru-RU')
    };
    
    posts.push(newPost);
    
    // Сохраняем
    localStorage.setItem('blogPosts', JSON.stringify(posts));
    
    // Обновляем отображение
    displayBlogPosts(posts);
    
    // Очищаем поля
    titleInput.value = '';
    contentInput.value = '';
}

function displayBlogPosts(posts) {
    const blogPostsContainer = document.querySelector('.blog-posts');
    if (!blogPostsContainer) return;
    
    // Очищаем существующие посты (кроме начальных)
    const initialPosts = blogPostsContainer.querySelectorAll('.post:not(.initial)');
    initialPosts.forEach(post => post.remove());
    
    // Добавляем новые посты
    posts.forEach(post => {
        const postElement = document.createElement('article');
        postElement.className = 'post';
        postElement.innerHTML = `
            <h3>${post.title}</h3>
            <p class="post-date">${post.date}</p>
            <p>${post.content}</p>
        `;
        blogPostsContainer.appendChild(postElement);
    });
}

function loadBlogPosts() {
    // Добавляем класс к начальным постам для идентификации
    const initialPosts = document.querySelectorAll('.blog-posts .post');
    initialPosts.forEach(post => post.classList.add('initial'));
}

function clearBlogPosts() {
    if (confirm('Вы уверены, что хотите удалить все добавленные записи?')) {
        localStorage.removeItem('blogPosts');
        // Перезагружаем страницу для обновления отображения
        location.reload();
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация темы
    initTheme();
    
    // Добавляем обработчик для кнопки темы
    const themeButton = document.getElementById('themeToggle');
    if (themeButton) {
        themeButton.addEventListener('click', toggleTheme);
    }
    
    // Инициализация счетчиков
    initCounters();
    
    // Обновление информации о странице
    updatePageInfo();
    
    // Инициализация формы контактов
    initContactForm();
    
    // Инициализация блога
    initBlog();
    
    // Обновляем время каждую минуту
    setInterval(updatePageInfo, 60000);
});