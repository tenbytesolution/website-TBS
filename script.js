// Preloader
window.addEventListener('load', function() {
    const preloader = document.querySelector('.preloader');
    const loadingText = document.querySelector('.loading-text');
    
    if (preloader) {
        // Change loading text after 1 second
        setTimeout(() => {
            if (loadingText) {
                loadingText.textContent = "Hampir selesai...";
            }
        }, 1000);
        
        // Hide preloader after 1.5 seconds
        setTimeout(() => {
            preloader.classList.add('hidden');
            
            // Remove preloader from DOM after animation completes
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 1500);
    }
    
    // Initialize EmailJS
    initializeEmailJS();
});

// ============================================
// EMAILJS CONFIGURATION - INI YANG PERLU DIUBAH
// ============================================
function initializeEmailJS() {
    // EmailJS Configuration
    // Dapatkan User ID dari: https://dashboard.emailjs.com/admin/integration
    emailjs.init("cT8uLQY_hRP4wUtPl"); // Ganti dengan User ID Anda
    
    console.log("EmailJS initialized successfully");
}

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('nav ul');
    const menuIcon = document.querySelector('.mobile-menu-btn i');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('show');
            
            // Toggle menu icon
            if (menuIcon.classList.contains('fa-bars')) {
                menuIcon.classList.remove('fa-bars');
                menuIcon.classList.add('fa-times');
            } else {
                menuIcon.classList.remove('fa-times');
                menuIcon.classList.add('fa-bars');
            }
        });
    }
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('nav ul li a').forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('show');
            if (menuIcon) {
                menuIcon.classList.remove('fa-times');
                menuIcon.classList.add('fa-bars');
            }
        });
    });
    
    // Portfolio filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            const filterValue = this.getAttribute('data-filter');
            
            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    // Show item with fade in animation
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    // Hide item with fade out animation
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                if (navMenu && navMenu.classList.contains('show')) {
                    navMenu.classList.remove('show');
                    if (menuIcon) {
                        menuIcon.classList.remove('fa-times');
                        menuIcon.classList.add('fa-bars');
                    }
                }
                
                // Calculate offset for fixed header
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                // Smooth scroll
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Header background change on scroll
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.backgroundColor = 'rgba(26, 86, 219, 0.97)';
            header.style.backdropFilter = 'blur(10px)';
            header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.backgroundColor = 'var(--primary-blue)';
            header.style.backdropFilter = 'none';
            header.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        }
    });
    
    // ============================================
    // FORM VALIDATION AND EMAIL SENDING
    // ============================================
    const consultationForm = document.getElementById('consultationForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    const successMessage = document.getElementById('successMessage');
    
    if (consultationForm) {
        consultationForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Validate form first
            if (!validateForm()) {
                showNotification('Harap perbaiki data yang belum sesuai.', 'error');
                return;
            }
            
            // Disable submit button and show loading
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline-block';
            
            try {
                // Collect form data
                const formData = {
                    nama: document.getElementById('nama').value,
                    email: document.getElementById('email').value,
                    telepon: document.getElementById('telepon').value,
                    perusahaan: document.getElementById('perusahaan').value || 'Tidak disebutkan',
                    layanan: document.getElementById('layanan').options[document.getElementById('layanan').selectedIndex].text,
                    budget: document.getElementById('budget').options[document.getElementById('budget').selectedIndex].text,
                    pesan: document.getElementById('pesan').value,
                    tanggal: new Date().toLocaleString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })
                };
                
                // Send email using EmailJS
                // SERVICE ID: dapatkan dari https://dashboard.emailjs.com/admin
                // TEMPLATE ID: dapatkan dari https://dashboard.emailjs.com/admin/templates
                const response = await emailjs.send(
                    "service_4ot9bjn", // Ganti dengan Service ID Anda
                    "template_68yh8di", // Ganti dengan Template ID Anda
                    {
                        to_email: "tenbytesolution@gmail.com",
                        from_name: formData.nama,
                        from_email: formData.email,
                        from_phone: formData.telepon,
                        company: formData.perusahaan,
                        service: formData.layanan,
                        budget: formData.budget,
                        message: formData.pesan,
                        date: formData.tanggal,
                        reply_to: formData.email
                    }
                );
                
                console.log("Email sent successfully:", response);
                
                // Show success message
                consultationForm.style.display = 'none';
                successMessage.style.display = 'block';
                
                // Show notification
                showNotification('Permintaan konsultasi berhasil dikirim! Tim kami akan segera menghubungi Anda.', 'success');
                
                // Reset form
                consultationForm.reset();
                clearErrors();
                
                // Re-enable form after 5 seconds (for new submission)
                setTimeout(() => {
                    consultationForm.style.display = 'block';
                    successMessage.style.display = 'none';
                }, 10000);
                
            } catch (error) {
                console.error("Email sending failed:", error);
                showNotification('Gagal mengirim permintaan. Silakan coba lagi atau hubungi kami langsung.', 'error');
            } finally {
                // Re-enable submit button
                submitBtn.disabled = false;
                btnText.style.display = 'inline-block';
                btnLoading.style.display = 'none';
            }
        });
    }
    
    // Form validation function
    function validateForm() {
        let isValid = true;
        clearErrors();
        
        // Validate nama
        const nama = document.getElementById('nama');
        if (!nama.value.trim()) {
            showError(nama, 'Nama lengkap wajib diisi');
            isValid = false;
        } else if (nama.value.trim().length < 3) {
            showError(nama, 'Nama minimal 3 karakter');
            isValid = false;
        }
        
        // Validate email
        const email = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim()) {
            showError(email, 'Email wajib diisi');
            isValid = false;
        } else if (!emailRegex.test(email.value)) {
            showError(email, 'Format email tidak valid');
            isValid = false;
        }
        
        // Validate telepon
        const telepon = document.getElementById('telepon');
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!telepon.value.trim()) {
            showError(telepon, 'Nomor telepon wajib diisi');
            isValid = false;
        } else if (!phoneRegex.test(telepon.value)) {
            showError(telepon, 'Format nomor telepon tidak valid');
            isValid = false;
        } else if (telepon.value.replace(/\D/g, '').length < 10) {
            showError(telepon, 'Nomor telepon minimal 10 digit');
            isValid = false;
        }
        
        // Validate layanan
        const layanan = document.getElementById('layanan');
        if (!layanan.value) {
            showError(layanan, 'Pilih jenis layanan');
            isValid = false;
        }
        
        // Validate budget
        const budget = document.getElementById('budget');
        if (!budget.value) {
            showError(budget, 'Pilih budget proyek');
            isValid = false;
        }
        
        // Validate pesan
        const pesan = document.getElementById('pesan');
        if (!pesan.value.trim()) {
            showError(pesan, 'Deskripsi proyek wajib diisi');
            isValid = false;
        } else if (pesan.value.trim().length < 10) {
            showError(pesan, 'Deskripsi minimal 10 karakter');
            isValid = false;
        }
        
        // Validate privacy checkbox
        const privacy = document.getElementById('privacy');
        if (!privacy.checked) {
            showError(privacy, 'Anda harus menyetujui kebijakan privasi');
            isValid = false;
        }
        
        return isValid;
    }
    
    // Show error function
    function showError(element, message) {
        const errorElement = document.getElementById(element.id + '-error');
        if (errorElement) {
            errorElement.textContent = message;
        }
        element.classList.add('error');
        
        // Scroll to first error
        if (element.scrollIntoView) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
    
    // Clear all errors
    function clearErrors() {
        document.querySelectorAll('.error-message').forEach(el => {
            el.textContent = '';
        });
        document.querySelectorAll('.error').forEach(el => {
            el.classList.remove('error');
        });
    }
    
    // Real-time validation
    const formInputs = consultationForm.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                const errorElement = document.getElementById(this.id + '-error');
                if (errorElement) {
                    errorElement.textContent = '';
                }
                this.classList.remove('error');
            }
        });
    });
    
    function validateField(field) {
        const value = field.value.trim();
        const errorElement = document.getElementById(field.id + '-error');
        
        if (!errorElement) return;
        
        switch (field.id) {
            case 'nama':
                if (!value) {
                    showError(field, 'Nama lengkap wajib diisi');
                } else if (value.length < 3) {
                    showError(field, 'Nama minimal 3 karakter');
                } else {
                    errorElement.textContent = '';
                    field.classList.remove('error');
                }
                break;
                
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value) {
                    showError(field, 'Email wajib diisi');
                } else if (!emailRegex.test(value)) {
                    showError(field, 'Format email tidak valid');
                } else {
                    errorElement.textContent = '';
                    field.classList.remove('error');
                }
                break;
                
            case 'telepon':
                const phoneRegex = /^[\d\s\-\+\(\)]+$/;
                if (!value) {
                    showError(field, 'Nomor telepon wajib diisi');
                } else if (!phoneRegex.test(value)) {
                    showError(field, 'Format nomor telepon tidak valid');
                } else if (value.replace(/\D/g, '').length < 10) {
                    showError(field, 'Nomor telepon minimal 10 digit');
                } else {
                    errorElement.textContent = '';
                    field.classList.remove('error');
                }
                break;
                
            case 'pesan':
                if (!value) {
                    showError(field, 'Deskripsi proyek wajib diisi');
                } else if (value.length < 10) {
                    showError(field, 'Deskripsi minimal 10 karakter');
                } else {
                    errorElement.textContent = '';
                    field.classList.remove('error');
                }
                break;
                
            case 'layanan':
            case 'budget':
                if (!field.value) {
                    showError(field, field.id === 'layanan' ? 'Pilih jenis layanan' : 'Pilih budget proyek');
                } else {
                    errorElement.textContent = '';
                    field.classList.remove('error');
                }
                break;
                
            case 'privacy':
                if (!field.checked) {
                    showError(field, 'Anda harus menyetujui kebijakan privasi');
                } else {
                    errorElement.textContent = '';
                    field.classList.remove('error');
                }
                break;
        }
    }
    
    // Newsletter form submission
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value;
            const submitBtn = this.querySelector('button[type="submit"]');
            
            if (email) {
                // Validate email
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    showNotification('Format email tidak valid.', 'error');
                    return;
                }
                
                // Add animation to button
                submitBtn.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    submitBtn.style.transform = 'scale(1)';
                }, 150);
                
                // In a real implementation, you would send this to your server
                console.log("Newsletter subscription:", email);
                
                showNotification(`Terima kasih! Email ${email} telah berhasil didaftarkan untuk newsletter.`, 'success');
                emailInput.value = '';
            } else {
                showNotification('Harap masukkan alamat email Anda.', 'error');
            }
        });
    }
    
    // Animation on scroll
    function animateOnScroll() {
        const elements = document.querySelectorAll('.process-step, .tech-item, .service-card, .portfolio-item, .why-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add animation class based on element type
                    if (entry.target.classList.contains('process-step')) {
                        entry.target.classList.add('animated');
                    } else if (entry.target.classList.contains('tech-item')) {
                        // Stagger animation for tech items
                        const index = Array.from(entry.target.parentElement.children).indexOf(entry.target);
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                        }, index * 100);
                    } else {
                        entry.target.style.opacity = '1';
                    }
                    
                    // Unobserve after animation
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        elements.forEach(element => {
            observer.observe(element);
        });
    }
    
    // Counter animation for stats
    function animateCounters() {
        const counters = document.querySelectorAll('.counter');
        const statsSection = document.getElementById('stats');
        
        if (!statsSection) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    counters.forEach(counter => {
                        const target = +counter.getAttribute('data-target');
                        const increment = target / 100;
                        let current = 0;
                        
                        const updateCounter = () => {
                            if (current < target) {
                                current += increment;
                                counter.textContent = Math.ceil(current);
                                setTimeout(updateCounter, 20);
                            } else {
                                counter.textContent = target;
                            }
                        };
                        
                        updateCounter();
                    });
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(statsSection);
    }
    
    // Scroll to top button
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Show/hide scroll to top button
        if (scrollTop > 500) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
        
        // Update scroll progress
        const scrollProgress = document.querySelector('.scroll-progress');
        if (scrollProgress) {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            scrollProgress.style.width = scrolled + '%';
        }
    });
    
    // Scroll to top functionality
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Add click animation
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    }
    
    // Add scroll progress bar
    const scrollProgress = document.createElement('div');
    scrollProgress.className = 'scroll-progress';
    document.body.appendChild(scrollProgress);
    
    // Notification function
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => {
            notification.remove();
        });
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        // Set icon based on type
        let icon = '';
        switch (type) {
            case 'success':
                icon = '<i class="fas fa-check-circle"></i>';
                break;
            case 'error':
                icon = '<i class="fas fa-exclamation-circle"></i>';
                break;
            case 'warning':
                icon = '<i class="fas fa-exclamation-triangle"></i>';
                break;
            default:
                icon = '<i class="fas fa-info-circle"></i>';
        }
        
        notification.innerHTML = `${icon} ${message}`;
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }
    
    // Add hover effect to technology icons
    const techItems = document.querySelectorAll('.tech-item');
    techItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.querySelector('i').style.transform = 'scale(1.2)';
            this.querySelector('i').style.color = 'var(--primary-red)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.querySelector('i').style.transform = 'scale(1)';
            this.querySelector('i').style.color = 'var(--primary-blue)';
        });
    });
    
    // Add hover effect to service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.querySelector('.service-icon').style.transform = 'scale(1.1)';
            this.querySelector('.service-icon').style.color = 'var(--primary-red)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.querySelector('.service-icon').style.transform = 'scale(1)';
            this.querySelector('.service-icon').style.color = 'var(--primary-blue)';
        });
    });
    
    // Set current year in footer
    const currentYear = new Date().getFullYear();
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = currentYear;
    }
    
    // Initialize animations
    setTimeout(() => {
        animateOnScroll();
        animateCounters();
    }, 1000);
    
    // Add typing animation for hero text (optional)
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && window.innerWidth > 768) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        }
        
        // Start typing animation after preloader
        setTimeout(typeWriter, 2000);
    }
    
    // Add parallax effect to hero section
    window.addEventListener('scroll', function() {
        const heroSection = document.querySelector('.hero');
        const scrollPosition = window.pageYOffset;
        
        if (heroSection && scrollPosition < heroSection.offsetHeight) {
            heroSection.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
        }
    });
    
    // Add click animation to all buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
});

// ============================================
// CARA SETUP EMAILJS (Panduan Lengkap)
// ============================================
/*
LANGKAH 1: Daftar di EmailJS
1. Buka https://www.emailjs.com/
2. Klik "Sign Up Free" dan buat akun
3. Verifikasi email Anda

LANGKAH 2: Buat Email Service
1. Setelah login, klik "Email Services" di sidebar
2. Klik "Add New Service"
3. Pilih "Gmail" (atau email provider lainnya)
4. Ikuti petunjuk untuk menghubungkan email tenbytesolution@gmail.com
5. Catat "Service ID" yang diberikan

LANGKAH 3: Buat Email Template
1. Klik "Email Templates" di sidebar
2. Klik "Create New Template"
3. Beri nama template, misal: "Konsultasi Form"
4. Isi template dengan konten berikut:

Subject: Permintaan Konsultasi Baru dari {{from_name}}

Body:
<h2>Permintaan Konsultasi Baru</h2>
<p><strong>Tanggal:</strong> {{date}}</p>
<p><strong>Nama:</strong> {{from_name}}</p>
<p><strong>Email:</strong> {{from_email}}</p>
<p><strong>Telepon/WhatsApp:</strong> {{from_phone}}</p>
<p><strong>Perusahaan:</strong> {{company}}</p>
<p><strong>Jenis Layanan:</strong> {{service}}</p>
<p><strong>Budget Proyek:</strong> {{budget}}</p>
<p><strong>Deskripsi Proyek:</strong></p>
<p>{{message}}</p>
<hr>
<p>Segera hubungi calon klien ini!</p>

5. Catat "Template ID" yang diberikan

LANGKAH 4: Dapatkan User ID
1. Klik "Integration" di sidebar
2. Copy "User ID" yang terlihat

LANGKAH 5: Update Kode JavaScript
Ganti nilai berikut di script.js:

1. Line 23: emailjs.init("USER_ID_ANDA");
2. Line 117: "SERVICE_ID_ANDA"
3. Line 118: "TEMPLATE_ID_ANDA"

LANGKAH 6: Tes Form
1. Upload website ke hosting
2. Isi form konsultasi
3. Cek email tenbytesolution@gmail.com
4. Anda akan menerima email otomatis!
*/

console.log("Tenbytes Solution Website Loaded Successfully");
console.log("Don't forget to configure EmailJS with your credentials!");