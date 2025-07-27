// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyD2kzUUUIX4OROl9CwMot-nPlh3UfBJDTc",
    authDomain: "websitemy-a499f.firebaseapp.com",
    projectId: "websitemy-a499f",
    storageBucket: "websitemy-a499f.firebasestorage.app",
    messagingSenderId: "881476130860",
    appId: "1:881476130860:web:e269ede3c0b21a71e75989",
    measurementId: "G-RDQHR572D0"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

// DOM Elements
const loader = document.querySelector('.loader');
const header = document.getElementById('header');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const nav = document.querySelector('.nav');
const loginBtn = document.getElementById('login-btn');
const loginModal = document.getElementById('loginModal');
const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const phoneVerifyForm = document.getElementById('phoneVerifyForm');
const verifyCodeForm = document.getElementById('verifyCodeForm');
const forgotPassword = document.getElementById('forgotPassword');
const googleLogin = document.getElementById('googleLogin');
const googleRegister = document.getElementById('googleRegister');
const closeModalBtns = document.querySelectorAll('.close-modal');
const orderBtns = document.querySelectorAll('.order-btn');
const orderModal = document.getElementById('orderModal');
const orderForm = document.getElementById('orderForm');
const packageName = document.getElementById('packageName');
const contactForm = document.getElementById('contactForm');
const chatbotToggle = document.querySelector('.chatbot-toggle');
const chatbotContainer = document.querySelector('.chatbot-container');
const closeChatbot = document.querySelector('.close-chatbot');
const chatbotMessages = document.getElementById('chatbotMessages');
const chatbotInput = document.getElementById('chatbotInput');
const sendMessage = document.getElementById('sendMessage');
const tabBtns = document.querySelectorAll('.tab-btn');
const authForms = document.querySelectorAll('.auth-form');

// Global Variables
let currentUser = null;
let verificationId = null;

// Page Loader
window.addEventListener('load', () => {
    setTimeout(() => {
        loader.classList.add('fade-out');
    }, 1000);
});

// Header Scroll Effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
mobileMenuBtn.addEventListener('click', () => {
    nav.classList.toggle('active');
    mobileMenuBtn.innerHTML = nav.classList.contains('active') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
});

// Close Mobile Menu on Click
document.querySelectorAll('.nav ul li a').forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// Initialize AOS Animation
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    offset: 100
});

// Lazy Load Images
const lazyImages = document.querySelectorAll('img[loading="lazy"]');

const lazyLoad = (target) => {
    const io = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                observer.unobserve(img);
            }
        });
    });

    io.observe(target);
};

lazyImages.forEach(lazyLoad);

// Modal Functions
function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Login Modal
loginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal(loginModal);
});

// Order Modal
orderBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const package = btn.getAttribute('data-package');
        packageName.textContent = package;
        document.getElementById('package').value = package;
        openModal(orderModal);
    });
});

// Close Modals
closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const modal = btn.closest('.modal');
        closeModal(modal);
    });
});

// Close Modal When Clicking Outside
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        closeModal(e.target);
    }
});

// Auth Tabs
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        
        // Update active tab
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Show corresponding form
        authForms.forEach(form => form.classList.remove('active'));
        document.getElementById(`${tab}Form`).classList.add('active');
    });
});

// Forgot Password
forgotPassword.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('loginForm').classList.remove('active');
    phoneVerifyForm.classList.add('active');
});

// Google Login/Register Provider
const provider = new firebase.auth.GoogleAuthProvider();

function handleGoogleAuth() {
    auth.signInWithPopup(provider)
        .then((result) => {
            const user = result.user;
            currentUser = user;
            closeModal(loginModal);
            alert(`Welcome ${user.displayName || 'User'}!`);
        })
        .catch((error) => {
            console.error('Google Auth Error:', error);
            alert(error.message);
        });
}

googleLogin.addEventListener('click', handleGoogleAuth);
googleRegister.addEventListener('click', handleGoogleAuth);

// Email/Password Registration
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = registerForm.registerName.value;
    const email = registerForm.registerEmail.value;
    const phone = registerForm.registerPhone.value;
    const password = registerForm.registerPassword.value;
    const confirmPassword = registerForm.registerConfirmPassword.value;
    
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    auth.createUserWithEmailAndPassword(email, password)
        .then((cred) => {
            // Add user data to database
            return database.ref('users/' + cred.user.uid).set({
                name: name,
                email: email,
                phone: phone,
                createdAt: firebase.database.ServerValue.TIMESTAMP
            });
        })
        .then(() => {
            alert('Registration successful!');
            closeModal(loginModal);
        })
        .catch((error) => {
            console.error('Registration Error:', error);
            alert(error.message);
        });
});

// Email/Password Login
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = loginForm.loginEmail.value;
    const password = loginForm.loginPassword.value;
    
    auth.signInWithEmailAndPassword(email, password)
        .then((cred) => {
            currentUser = cred.user;
            closeModal(loginModal);
            alert('Login successful!');
        })
        .catch((error) => {
            console.error('Login Error:', error);
            alert(error.message);
        });
});

// Phone Verification
phoneVerifyForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const phoneNumber = phoneVerifyForm.phoneNumber.value;
    const appVerifier = new firebase.auth.RecaptchaVerifier('phoneVerifyForm', {
        size: 'invisible'
    });
    
    auth.signInWithPhoneNumber(phoneNumber, appVerifier)
        .then((confirmationResult) => {
            verificationId = confirmationResult.verificationId;
            phoneVerifyForm.classList.remove('active');
            verifyCodeForm.classList.add('active');
        })
        .catch((error) => {
            console.error('Phone Verification Error:', error);
            alert(error.message);
        });
});

// Verify Code
verifyCodeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const code = verifyCodeForm.verificationCode.value;
    const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, code);
    
    auth.signInWithCredential(credential)
        .then(() => {
            alert('Password reset link will be sent to your phone!');
            closeModal(loginModal);
            verifyCodeForm.classList.remove('active');
            loginForm.classList.add('active');
        })
        .catch((error) => {
            console.error('Code Verification Error:', error);
            alert(error.message);
        });
});

// Order Form Submission
orderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = orderForm.orderName.value;
    const email = orderForm.orderEmail.value;
    const phone = orderForm.orderPhone.value;
    const package = orderForm.package.value;
    const message = orderForm.orderMessage.value;
    const timestamp = new Date().toISOString();
    
    // Submit to Google Sheets
    const scriptURL = 'https://script.google.com/macros/s/AKfycbzxIcJufRXXc1VsVJm5JqRF1ia0v-wuRTcWq60gVe0SzFHq7kucboarujGV2TTNcKHksA/exec';
    
    fetch(scriptURL, {
        method: 'POST',
        body: new URLSearchParams({
            'Timestamp': timestamp,
            'Name': name,
            'Email': email,
            'Phone': phone,
            'package': package,
            'message': message
        })
    })
    .then(response => {
        alert('Order submitted successfully! We will contact you soon.');
        orderForm.reset();
        closeModal(orderModal);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error submitting order. Please try again.');
    });
});

// Contact Form Submission
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = contactForm.name.value;
    const email = contactForm.email.value;
    const phone = contactForm.phone.value;
    const interest = contactForm.interest.value;
    const message = contactForm.message.value;
    
    // Here you would typically send this data to your backend
    alert(`Thank you ${name}! Your message has been received. We will contact you soon.`);
    contactForm.reset();
});

// Chatbot Functions
chatbotToggle.addEventListener('click', () => {
    chatbotContainer.classList.toggle('active');
});

closeChatbot.addEventListener('click', () => {
    chatbotContainer.classList.remove('active');
});

function addBotMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chatbot-message', 'bot');
    messageDiv.innerHTML = `<p>${message}</p>`;
    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function addUserMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chatbot-message', 'user');
    messageDiv.innerHTML = `<p>${message}</p>`;
    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// Simple Chatbot Responses
const botResponses = {
    'hello': 'Hello there! How can I help you with solar energy today?',
    'hi': 'Hi! What solar questions do you have for me?',
    'price': 'Our solar packages start at $4,999 after incentives. Would you like me to show you our packages?',
    'packages': 'We offer three main packages: Starter Home ($4,999), Family Home ($8,999), and Premium Home ($12,999). Which one are you interested in?',
    'contact': 'You can reach us at +1 (555) 123-4567 or info@alpha-electricals.com. Would you like me to open the contact form?',
    'default': "I'm sorry, I didn't understand that. Could you ask about our solar packages, prices, or contact information?"
};

sendMessage.addEventListener('click', () => {
    const message = chatbotInput.value.trim();
    if (message) {
        addUserMessage(message);
        chatbotInput.value = '';
        
        // Simple response logic
        setTimeout(() => {
            const lowerMessage = message.toLowerCase();
            let response = botResponses.default;
            
            if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
                response = botResponses.hello;
            } else if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
                response = botResponses.price;
            } else if (lowerMessage.includes('package') || lowerMessage.includes('system')) {
                response = botResponses.packages;
            } else if (lowerMessage.includes('contact') || lowerMessage.includes('call')) {
                response = botResponses.contact;
            }
            
            addBotMessage(response);
        }, 500);
    }
});

chatbotInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage.click();
    }
});

// Initialize Google Map
function initMap() {
    const location = { lat: 40.712776, lng: -74.005974 }; // Replace with your coordinates
    const map = new google.maps.Map(document.getElementById('googleMap'), {
        zoom: 15,
        center: location,
        styles: [
            {
                featureType: 'all',
                elementType: 'labels.text.fill',
                stylers: [{ saturation: 36 }, { color: '#333333' }, { lightness: 40 }]
            },
            {
                featureType: 'all',
                elementType: 'labels.text.stroke',
                stylers: [{ visibility: 'on' }, { color: '#ffffff' }, { lightness: 16 }]
            },
            {
                featureType: 'all',
                elementType: 'labels.icon',
                stylers: [{ visibility: 'off' }]
            },
            {
                featureType: 'administrative',
                elementType: 'geometry.fill',
                stylers: [{ color: '#fefefe' }, { lightness: 20 }]
            },
            {
                featureType: 'administrative',
                elementType: 'geometry.stroke',
                stylers: [{ color: '#fefefe' }, { lightness: 17 }, { weight: 1.2 }]
            },
            {
                featureType: 'landscape',
                elementType: 'geometry',
                stylers: [{ color: '#f5f5f5' }, { lightness: 20 }]
            },
            {
                featureType: 'poi',
                elementType: 'geometry',
                stylers: [{ color: '#f5f5f5' }, { lightness: 21 }]
            },
            {
                featureType: 'road.highway',
                elementType: 'geometry.fill',
                stylers: [{ color: '#ffffff' }, { lightness: 17 }]
            },
            {
                featureType: 'road.highway',
                elementType: 'geometry.stroke',
                stylers: [{ color: '#ffffff' }, { lightness: 29 }, { weight: 0.2 }]
            },
            {
                featureType: 'road.arterial',
                elementType: 'geometry',
                stylers: [{ color: '#ffffff' }, { lightness: 18 }]
            },
            {
                featureType: 'road.local',
                elementType: 'geometry',
                stylers: [{ color: '#ffffff' }, { lightness: 16 }]
            },
            {
                featureType: 'transit',
                elementType: 'geometry',
                stylers: [{ color: '#f2f2f2' }, { lightness: 19 }]
            },
            {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{ color: '#e9e9e9' }, { lightness: 17 }]
            }
        ]
    });
    
    new google.maps.Marker({
        position: location,
        map: map,
        title: 'Alpha Electricals Solar System',
        icon: 'images/solar-marker.png'
    });
}

// Inverter Modals
const inverterModals = document.querySelectorAll('.inverter-modal');
const closeInverterModals = document.querySelectorAll('.close-inverter-modal');

function openInverterModal(modalId) {
    document.getElementById(modalId).classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeAllInverterModals() {
    inverterModals.forEach(modal => {
        modal.classList.remove('active');
    });
    document.body.style.overflow = 'auto';
}

// Add click events to inverter brand links
document.querySelectorAll('.inverter-brand').forEach(brand => {
    brand.addEventListener('click', function(e) {
        e.preventDefault();
        const modalId = this.getAttribute('data-modal');
        openInverterModal(modalId);
    });
});

closeInverterModals.forEach(btn => {
    btn.addEventListener('click', closeAllInverterModals);
});

// Close when clicking outside modal
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('inverter-modal')) {
        closeAllInverterModals();
    }
});











// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    });
});

// Page Transition Effect
document.querySelectorAll('a:not([href^="#"])').forEach(link => {
    link.addEventListener('click', (e) => {
        if (link.href && !link.href.includes('javascript') && !link.href.includes('#')) {
            e.preventDefault();
            loader.classList.remove('fade-out');
            setTimeout(() => {
                window.location.href = link.href;
            }, 500);
        }
    });
});

// Sunlight Energy Flowing Animation
function createEnergyParticle() {
    const particle = document.createElement('div');
    particle.classList.add('energy-particle');
    
    // Random position along the top of the viewport
    const startX = Math.random() * window.innerWidth;
    const endX = startX + (Math.random() * 200 - 100); // Slight horizontal movement
    
    // Random size and opacity
    const size = Math.random() * 4 + 2;
    const opacity = Math.random() * 0.4 + 0.1;
    const duration = Math.random() * 3 + 2;
    
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.opacity = opacity;
    particle.style.left = `${startX}px`;
    particle.style.top = '0';
    particle.style.background = `radial-gradient(circle, var(--secondary-color), transparent)`;
    particle.style.animation = `flow-down ${duration}s linear forwards`;
    
    // Keyframes for the animation
    const keyframes = `
        @keyframes flow-down {
            0% {
                transform: translateY(0) translateX(0);
                opacity: ${opacity};
            }
            100% {
                transform: translateY(${window.innerHeight}px) translateX(${endX - startX}px);
                opacity: 0;
            }
        }
    `;
    
    // Add the keyframes to the head
    const style = document.createElement('style');
    style.innerHTML = keyframes;
    document.head.appendChild(style);
    
    document.body.appendChild(particle);
    
    // Remove particle after animation completes
    setTimeout(() => {
        particle.remove();
        style.remove();
    }, duration * 1000);
}

// Create energy particles periodically
setInterval(createEnergyParticle, 200);

// Auth State Listener
auth.onAuthStateChanged(user => {
    currentUser = user;
    if (user) {
        loginBtn.textContent = 'Dashboard';
    } else {
        loginBtn.textContent = 'Login';
    }
});