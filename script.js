// عرض الوقت الحقيقي
function updateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    document.getElementById('time').textContent = `${hours}:${minutes}`;
}

updateTime();
setInterval(updateTime, 1000);

// متغيرات للسحب
let touchStartY = 0;
let touchEndY = 0;
let currentApp = null;
let isSwipeGesture = false;
let swipeStartTime = 0;

// متغيرات السوايب بين الصفحات
let currentPage = 1;
let startX = 0;
let isDragging = false;

const page1 = document.getElementById('page1');
const page2 = document.getElementById('page2');

// فتح التطبيق
function openApp(appId) {
    const homeScreen = document.getElementById('homeScreen');
    const appPage = document.getElementById(appId);
    
    if (appPage) {
        homeScreen.classList.add('hide');
        
        setTimeout(() => {
            appPage.classList.add('active');
            currentApp = appId;
            
            // إضافة زر X للإغلاق
            if (!appPage.querySelector('.app-close-btn')) {
                const closeBtn = document.createElement('div');
                closeBtn.className = 'app-close-btn';
                closeBtn.innerHTML = '×';
                closeBtn.onclick = function(e) {
                    e.stopPropagation();
                    goHome();
                };
                appPage.appendChild(closeBtn);
            }
            
            // إضافة شريط الخروج
            if (!appPage.querySelector('.app-home-indicator')) {
                const homeIndicator = document.createElement('div');
                homeIndicator.className = 'app-home-indicator';
                homeIndicator.onclick = function(e) {
                    e.stopPropagation();
                    goHome();
                };
                appPage.appendChild(homeIndicator);
            }
        }, 100);
    }
}

// الرجوع للشاشة الرئيسية
function goHome() {
    if (currentApp) {
        const appPage = document.getElementById(currentApp);
        const homeScreen = document.getElementById('homeScreen');
        
        appPage.classList.remove('active');
        
        setTimeout(() => {
            homeScreen.classList.remove('hide');
            currentApp = null;
            touchStartY = 0;
            touchEndY = 0;
            isSwipeGesture = false;
        }, 100);
    }
}

const phoneScreen = document.querySelector('.phone-screen');

phoneScreen.addEventListener('touchstart', (e) => {
    if (currentApp) {
        const touch = e.changedTouches[0];
        touchStartY = touch.clientY;
        swipeStartTime = Date.now();
        isSwipeGesture = false;
        
        const phoneContainer = document.querySelector('.phone-container');
        const containerRect = phoneContainer.getBoundingClientRect();
        const relativeY = touch.clientY - containerRect.top;
        const containerHeight = containerRect.height;
        
        if (relativeY > containerHeight * 0.70) {
            isSwipeGesture = true;
        }
    } else {
        startX = e.touches[0].clientX;
        isDragging = true;
    }
});

phoneScreen.addEventListener('touchmove', (e) => {
    // التعامل مع السوايب داخل التطبيقات
    if (currentApp && isSwipeGesture) {
        const touch = e.changedTouches[0];
        const currentY = touch.clientY;
        const distance = currentY - touchStartY;
        
        if (distance < -30) {
            e.preventDefault();
        }
        return;
    }
    
    // التعامل مع السوايب بين الصفحات
    if (isDragging && !currentApp) {
        const currentX = e.touches[0].clientX;
        const diff = startX - currentX;
        
        // سوايب أسهل - مسافة أقصر
        if (Math.abs(diff) > 40) {
            if (diff > 0 && currentPage === 1) {
                // سوايب لليسار → الصفحة الثانية
                goToPage(2);
                isDragging = false;
            } else if (diff < 0 && currentPage === 2) {
                // سوايب لليمين → الصفحة الأولى
                goToPage(1);
                isDragging = false;
            }
        }
    }
});
phoneScreen.addEventListener('touchend', (e) => {
    if (currentApp && isSwipeGesture) {
        touchEndY = e.changedTouches[0].clientY;
        handleSwipe();
    }
    isDragging = false;
    isSwipeGesture = false;
});

// للكمبيوتر (Mouse)
phoneScreen.addEventListener('mousedown', (e) => {
    if (currentApp) {
        touchStartY = e.clientY;
        swipeStartTime = Date.now();
        isSwipeGesture = false;
        
        const phoneContainer = document.querySelector('.phone-container');
        const containerRect = phoneContainer.getBoundingClientRect();
        const relativeY = e.clientY - containerRect.top;
        const containerHeight = containerRect.height;
        
        if (relativeY > containerHeight * 0.70) {
            isSwipeGesture = true;
        }
    } else {
        startX = e.clientX;
        isDragging = true;
    }
});

phoneScreen.addEventListener('mousemove', (e) => {
    if (!isDragging || currentApp) return;
    const currentX = e.clientX;
    const diff = startX - currentX;
    
    if (Math.abs(diff) > 100) {
        if (diff > 0 && currentPage === 1) {
            goToPage(2);
            isDragging = false;
        } else if (diff < 0 && currentPage === 2) {
            goToPage(1);
            isDragging = false;
        }
    }
});

phoneScreen.addEventListener('mouseup', (e) => {
    if (currentApp && isSwipeGesture) {
        touchEndY = e.clientY;
        handleSwipe();
    }
    isDragging = false;
    isSwipeGesture = false;
});

// معالجة حركة السحب
function handleSwipe() {
    if (!currentApp || !isSwipeGesture) return;
    
    const swipeDistance = touchStartY - touchEndY;
    const swipeTime = Date.now() - swipeStartTime;
    const swipeVelocity = Math.abs(swipeDistance) / swipeTime;
    
    if (swipeDistance < -60 && (swipeVelocity > 0.2 || swipeDistance < -100)) {
        goHome();
    }
    
    isSwipeGesture = false;
}

// منع السكرول من إغلاق التطبيق
const appPages = document.querySelectorAll('.app-page');

appPages.forEach(appPage => {
    let lastScrollTop = 0;
    
    appPage.addEventListener('scroll', (e) => {
        const scrollTop = appPage.scrollTop;
        if (scrollTop > lastScrollTop) {
            touchStartY = 0;
            touchEndY = 0;
            isSwipeGesture = false;
        }
        lastScrollTop = scrollTop;
    });
});

// دعم مفتاح ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && currentApp) {
        goHome();
    }
});

// تبديل اللغة في التطبيقات
function toggleLanguage(appId) {
    const appPage = document.getElementById(appId);
    
    const titleAr = appPage.querySelector('.app-title-ar');
    const titleZh = appPage.querySelector('.app-title-zh');
    const contentAr = appPage.querySelector('.content-ar');
    const contentZh = appPage.querySelector('.content-zh');
    const langAr = appPage.querySelector('.lang-ar');
    const langZh = appPage.querySelector('.lang-zh');
    
    if (contentAr && contentAr.style.display !== 'none') {
        if (titleAr) titleAr.style.display = 'none';
        if (titleZh) titleZh.style.display = 'block';
        if (contentAr) contentAr.style.display = 'none';
        if (contentZh) contentZh.style.display = 'block';
        if (langAr) langAr.style.display = 'none';
        if (langZh) langZh.style.display = 'inline';
    } else {
        if (titleAr) titleAr.style.display = 'block';
        if (titleZh) titleZh.style.display = 'none';
        if (contentAr) contentAr.style.display = 'block';
        if (contentZh) contentZh.style.display = 'none';
        if (langAr) langAr.style.display = 'inline';
        if (langZh) langZh.style.display = 'none';
    }
}

// الانتقال بين الصفحات
function goToPage(pageNumber) {
    currentPage = pageNumber;
    
    if (pageNumber === 1) {
        page1.style.display = 'block';
        page2.style.display = 'none';
        updateDots(1);
    } else {
        page1.style.display = 'none';
        page2.style.display = 'block';
        updateDots(2);
    }
}

// تحديث النقاط
function updateDots(activePage) {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        if (index + 1 === activePage) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// تبديل اللغة في الويدجت
function toggleWidgetLanguage() {
    const widget = document.querySelector('.widget-1');
    
    const contentAr = widget.querySelector('.widget-content-ar');
    const contentZh = widget.querySelector('.widget-content-zh');
    const langAr = widget.querySelector('.widget-lang-ar');
    const langZh = widget.querySelector('.widget-lang-zh');
    
    if (contentAr.style.display !== 'none') {
        contentAr.style.display = 'none';
        contentZh.style.display = 'block';
        langAr.style.display = 'none';
        langZh.style.display = 'inline';
    } else {
        contentAr.style.display = 'block';
        contentZh.style.display = 'none';
        langAr.style.display = 'inline';
        langZh.style.display = 'none';
    }
}

