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














// Chatbot Application
document.addEventListener('DOMContentLoaded', function() {
    // Debug mode configuration
    const CHATBOT_DEBUG = true;
    const debugLog = CHATBOT_DEBUG ? console.log.bind(console, '[Chatbot]') : function() {};

    // DOM Elements
    const elements = {
        chatbotToggle: document.querySelector('.chatbot-toggle'),
        chatbotContainer: document.querySelector('.chatbot-container'),
        closeChatbot: document.querySelector('.close-chatbot'),
        chatbotMessages: document.getElementById('chatbotMessages'),
        chatbotInput: document.getElementById('chatbotInput'),
        sendMessage: document.getElementById('sendMessage'),
        attachFile: document.getElementById('attachFile'),
        notificationBadge: document.querySelector('.notification-badge')
    };

    // Verify all required elements exist
    if (!validateElements()) {
        console.error('Chatbot initialization failed: Required elements missing');
        return;
    }

    // State management
    const state = {
        isTyping: false,
        conversationHistory: [],
        firstVisit: !localStorage.getItem('chatbotVisited')
    };

    // Initialize the chatbot
    initChatbot();

    // Core Functions
    function validateElements() {
        let allValid = true;
        Object.entries(elements).forEach(([name, element]) => {
            if (!element && name !== 'notificationBadge') {
                console.error(`Element ${name} not found`);
                allValid = false;
            }
        });
        return allValid;
    }

    function initChatbot() {
        debugLog('Initializing chatbot...');
        
        // Set up event listeners
        setupEventListeners();
        
        // Show welcome notification if first visit
        if (state.firstVisit) {
            setTimeout(showWelcomeNotification, 3000);
            localStorage.setItem('chatbotVisited', 'true');
        }
        
        // Initial welcome message
        addBotMessage(botResponses.hello.message, botResponses.hello.quickReplies);
    }

    function setupEventListeners() {
        // Toggle chatbot visibility
        elements.chatbotToggle.addEventListener('click', toggleChatbot);
        
        // Close chatbot
        elements.closeChatbot.addEventListener('click', () => {
            elements.chatbotContainer.classList.remove('active');
        });
        
        // Send message on button click
        elements.sendMessage.addEventListener('click', handleSendMessage);
        
        // Send message on Enter key
        elements.chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSendMessage();
            }
        });
        
        // File attachment (placeholder functionality)
        if (elements.attachFile) {
            elements.attachFile.addEventListener('click', () => {
                addBotMessage("File upload functionality would be implemented here in a production environment.");
            });
        }
        
        // Quick replies (event delegation)
        document.addEventListener('click', handleQuickReply);
    }

    function toggleChatbot() {
        elements.chatbotContainer.classList.toggle('active');
        if (elements.notificationBadge) {
            elements.notificationBadge.style.display = 'none';
        }
        
        if (elements.chatbotContainer.classList.contains('active')) {
            elements.chatbotInput.focus();
        }
    }

    function showWelcomeNotification() {
        if (elements.notificationBadge) {
            elements.notificationBadge.style.display = 'flex';
            debugLog('Showing welcome notification');
        }
    }

    // Message Handling
    function handleSendMessage() {
        const message = elements.chatbotInput.value.trim();
        if (!message) return;
        
        debugLog('User sending message:', message);
        addUserMessage(message);
        elements.chatbotInput.value = '';
        
        // Process the message after a short delay
        setTimeout(() => {
            processMessage(message);
        }, 300);
    }

    function handleQuickReply(e) {
        if (e.target.classList.contains('quick-reply')) {
            const button = e.target;
            const replyText = button.textContent;
            const replyValue = button.dataset.reply;
            
            debugLog('Quick reply selected:', replyText);
            addUserMessage(replyText);
            
            setTimeout(() => {
                processMessage(replyValue);
            }, 500);
        }
    }

    // Message Display Functions
    function addUserMessage(message) {
        try {
            const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const messageDiv = createMessageElement('user', message, timestamp);
            elements.chatbotMessages.appendChild(messageDiv);
            scrollToBottom();
            
            // Add to conversation history
            state.conversationHistory.push({
                type: 'user',
                message: message,
                timestamp: new Date()
            });
        } catch (error) {
            console.error('Error adding user message:', error);
        }
    }

    function addBotMessage(message, quickReplies = []) {
        try {
            const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const messageDiv = createMessageElement('bot', message, timestamp, quickReplies);
            elements.chatbotMessages.appendChild(messageDiv);
            scrollToBottom();
            
            // Add to conversation history
            state.conversationHistory.push({
                type: 'bot',
                message: message,
                timestamp: new Date(),
                quickReplies: quickReplies
            });
        } catch (error) {
            console.error('Error adding bot message:', error);
        }
    }

    function createMessageElement(type, content, timestamp, quickReplies = []) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message ${type}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.innerHTML = `<p>${content}</p>`;
        
        // Add quick replies if provided
        if (quickReplies.length > 0) {
            const quickRepliesDiv = document.createElement('div');
            quickRepliesDiv.className = 'quick-replies';
            
            quickReplies.forEach(reply => {
                const button = document.createElement('button');
                button.className = 'quick-reply';
                button.textContent = reply.text;
                button.dataset.reply = reply.value;
                quickRepliesDiv.appendChild(button);
            });
            
            messageContent.appendChild(quickRepliesDiv);
        }
        
        messageDiv.appendChild(messageContent);
        
        const timeDiv = document.createElement('div');
        timeDiv.className = 'message-time';
        timeDiv.textContent = timestamp;
        messageDiv.appendChild(timeDiv);
        
        return messageDiv;
    }

    function showTypingIndicator() {
        if (state.isTyping) return;
        
        state.isTyping = true;
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        elements.chatbotMessages.appendChild(typingDiv);
        scrollToBottom();
        
        return typingDiv;
    }

    function hideTypingIndicator(typingElement) {
        if (typingElement && typingElement.parentNode) {
            typingElement.remove();
        }
        state.isTyping = false;
    }

    function scrollToBottom() {
        elements.chatbotMessages.scrollTop = elements.chatbotMessages.scrollHeight;
    }

    // Message Processing
    function processMessage(message) {
        debugLog('Processing message:', message);
        
        const typingElement = showTypingIndicator();
        const lowerMessage = message.toLowerCase();
        
        setTimeout(() => {
            try {
                hideTypingIndicator(typingElement);
                
                // Find appropriate response
                let response = findResponse(lowerMessage);
                
                // Add bot response
                addBotMessage(response.message, response.quickReplies);
                
                // Handle special actions
                handleSpecialActions(lowerMessage, message);
                
            } catch (error) {
                console.error('Error processing message:', error);
                addBotMessage("I encountered an error processing your request. Please try again.");
            }
        }, 1000 + Math.random() * 1000); // Random delay for natural feel
    }

    function findResponse(message) {
        // Check for specific keywords
        if (message.includes('hello') || message.includes('hi')) {
            return botResponses.hello;
        }
        if (message.includes('solar') || message.includes('panel') || message.includes('package')) {
            return botResponses['solar packages'];
        }
        if (message.includes('wire') || message.includes('electr')) {
            return botResponses['house wiring'];
        }
        if (message.includes('cctv') || message.includes('security') || message.includes('camera')) {
            return botResponses['cctv systems'];
        }
        if (message.includes('contact') || message.includes('call') || message.includes('email')) {
            return botResponses.contact;
        }
        if (message.includes('price') || message.includes('cost')) {
            return {
                message: "Our prices vary based on your needs:<br><br>" +
                         "• Solar: Depends on your electricity usage<br>" +
                         "• Wiring: Based on property size<br>" +
                         "• CCTV: Number of cameras needed<br><br>" +
                         "Would you like a free consultation?",
                quickReplies: [
                    { text: 'Solar Consultation', value: 'solar consultation' },
                    { text: 'Wiring Estimate', value: 'wiring estimate' },
                    { text: 'CCTV Quote', value: 'cctv quote' }
                ]
            };
        }
        
        // Default response
        return botResponses.default;
    }

    function handleSpecialActions(lowerMessage, originalMessage) {
        if (lowerMessage.includes('open contact') || originalMessage === 'open contact') {
            setTimeout(() => {
                const contactLink = document.querySelector('a[href="#contact"]');
                if (contactLink) {
                    contactLink.click();
                    elements.chatbotContainer.classList.remove('active');
                } else {
                    debugLog('Contact link not found');
                }
            }, 500);
        }
        else if (lowerMessage.includes('whatsapp') || originalMessage === 'whatsapp') {
            window.open('https://wa.me/+94751168206', '_blank', 'noopener,noreferrer');
        }
        else if (lowerMessage.includes('call now') || originalMessage === 'call now') {
            window.location.href = 'tel:+94723283588';
        }
    }

    // Bot Responses
    const botResponses = {
        'hello': {
            message: 'Hello there! ?? How can I assist you with solar energy, electrical wiring, or CCTV systems today?',
            quickReplies: [
                { text: 'Solar Packages', value: 'solar packages' },
                { text: 'House Wiring', value: 'house wiring' },
                { text: 'CCTV Systems', value: 'cctv systems' }
            ]
        },
        'solar packages': {
            message: 'We offer several solar packages:<br><br>' +
                    '• <strong>5KV System</strong> - Rs.850,000<br>' +
                    '• <strong>10KV System</strong> - Rs.1,500,000<br>' +
                    '• <strong>20KV System</strong> - Rs.2,250,000<br><br>' +
                    'Would you like more details about any specific package?',
            quickReplies: [
                { text: '5KV Details', value: '5kv details' },
                { text: '10KV Details', value: '10kv details' },
                { text: 'Contact Sales', value: 'contact sales' }
            ]
        },
        'house wiring': {
            message: 'Our professional house wiring services include:<br><br>' +
                    '• Complete new home wiring<br>' +
                    '• Electrical repairs and upgrades<br>' +
                    '• Safety inspections<br>' +
                    '• Lighting solutions<br><br>' +
                    'We use high-quality materials meeting all safety standards.',
            quickReplies: [
                { text: 'Get a Quote', value: 'wiring quote' },
                { text: 'View Gallery', value: 'wiring gallery' },
                { text: 'Safety Tips', value: 'safety tips' }
            ]
        },
        'cctv systems': {
            message: 'We provide complete CCTV security solutions:<br><br>' +
                    '?? <strong>Basic Package</strong> (4 cameras) - Rs.75,000<br>' +
                    '?? <strong>Advanced Package</strong> (8 cameras) - Rs.150,000<br>' +
                    '?? <strong>Premium Package</strong> (12 cameras) - Rs.250,000<br><br>' +
                    'All packages include professional installation and support.',
            quickReplies: [
                { text: 'Basic Details', value: 'basic cctv' },
                { text: 'Advanced Details', value: 'advanced cctv' },
                { text: 'Book Installation', value: 'book cctv' }
            ]
        },
        'contact': {
            message: 'You can reach us through:<br><br>' +
                    '?? Phone: +94723283588<br>' +
                    '?? Email: sujithelectro@gmail.com<br>' +
                    '?? Location: Kurunegala, Sri Lanka<br><br>' +
                    'Would you like me to open the contact form for you?',
            quickReplies: [
                { text: 'Open Contact Form', value: 'open contact' },
                { text: 'Call Now', value: 'call now' },
                { text: 'WhatsApp', value: 'whatsapp' }
            ]
        },
        'default': {
            message: "I'm sorry, I didn't quite understand that. Could you ask about:<br><br>" +
                    "• Our solar packages<br>" +
                    "• House wiring services<br>" +
                    "• CCTV security systems<br>" +
                    "• Contact information",
            quickReplies: [
                { text: 'Solar Packages', value: 'solar packages' },
                { text: 'House Wiring', value: 'house wiring' },
                { text: 'Contact Info', value: 'contact' }
            ]
        }
    };

    // Feature Testing (only in debug mode)
    if (CHATBOT_DEBUG) {
        setTimeout(() => {
            debugLog('Running automated tests...');
            testFeature('Message Sending', () => {
                addUserMessage('Test message');
                processMessage('hello');
            });
            
            testFeature('Quick Replies', () => {
                const testEvent = {
                    target: document.querySelector('.quick-reply') || 
                            { classList: { contains: () => true }, textContent: 'Test', dataset: { reply: 'test' } }
                };
                handleQuickReply(testEvent);
            });
            
            testFeature('Special Actions', () => {
                processMessage('open contact');
                processMessage('whatsapp');
                processMessage('call now');
            });
        }, 2000);
    }

    function testFeature(featureName, testFunction) {
        try {
            debugLog(`Testing feature: ${featureName}`);
            testFunction();
        } catch (error) {
            debugLog(`Test failed for ${featureName}:`, error);
        }
    }
});

