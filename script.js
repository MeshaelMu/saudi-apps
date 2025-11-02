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
            // إعادة تعيين المتغيرات
            touchStartY = 0;
            touchEndY = 0;
        }, 100);
    }
}

const phoneScreen = document.querySelector('.phone-screen');

phoneScreen.addEventListener('touchstart', (e) => {
    if (currentApp) {
        touchStartY = e.changedTouches[0].screenY;
    } else {
        startX = e.touches[0].clientX;
        isDragging = true;
    }
});

phoneScreen.addEventListener('touchmove', (e) => {
    if (!isDragging || currentApp) return;
    const currentX = e.touches[0].clientX;
    const diff = startX - currentX;
    
    if (Math.abs(diff) > 50) {
        if (diff > 0 && currentPage === 1) {
            goToPage(2);
            isDragging = false;
        } else if (diff < 0 && currentPage === 2) {
            goToPage(1);
            isDragging = false;
        }
    }
});

phoneScreen.addEventListener('touchend', (e) => {
    if (currentApp) {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }
    isDragging = false;
});

// للكمبيوتر (Mouse)
phoneScreen.addEventListener('mousedown', (e) => {
    if (currentApp) {
        touchStartY = e.screenY;
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
    if (currentApp) {
        touchEndY = e.screenY;
        handleSwipe();
    }
    isDragging = false;
});

// معالجة حركة السحب - محسّن
function handleSwipe() {
    if (currentApp) {
        const swipeDistance = touchStartY - touchEndY;
        const screenHeight = window.innerHeight;
        const isFromBottom = touchStartY > (screenHeight * 0.85);
        
        // السحب لازم يكون من تحت الشاشة ولفوق بمسافة طويلة
        // وليس للأسفل (scroll)
        if (isFromBottom && swipeDistance < -200) {
            goHome();
        }
    }
}

// منع السكرول من إغلاق التطبيق
const appPages = document.querySelectorAll('.app-page');

appPages.forEach(appPage => {
    let lastScrollTop = 0;
    
    appPage.addEventListener('scroll', (e) => {
        const scrollTop = appPage.scrollTop;
        if (scrollTop > lastScrollTop) {
            // يسكرول لتحت - امنع السوايب
            touchStartY = 0;
            touchEndY = 0;
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
        // تحويل للصيني
        contentAr.style.display = 'none';
        contentZh.style.display = 'block';
        langAr.style.display = 'none';
        langZh.style.display = 'inline';
    } else {
        // تحويل للعربي
        contentAr.style.display = 'block';
        contentZh.style.display = 'none';
        langAr.style.display = 'inline';
        langZh.style.display = 'none';
    }
}
