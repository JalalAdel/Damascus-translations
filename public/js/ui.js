// ui.js - For all shared user interface scripts

// Import Firebase authentication for user identification (if auth is used on this page)
import { auth } from './main.js'; // Ensure this path is correct relative to ui.js

document.addEventListener("DOMContentLoaded", () => {

  // Determine current language from HTML lang attribute
  const currentLang = document.documentElement.lang || 'en'; // Default to 'en'
console.log("Detected currentLang:", currentLang, "from document.documentElement.lang:", document.documentElement.lang);

  // Localization strings
  const localizedStrings = {
    en: {
      // General messages
      fileSelected: (count) => `${count} file(s) selected.`,
      fileSizeLimitError: (size) => `Error: exceeds ${size}MB limit.`,
      noFilesSelected: 'No files selected.',
      uploading: (fileName, progress) => `Uploading: "${fileName}" (${Math.round(progress)}%)...`,
      uploaded: (fileName) => `Uploaded: "${fileName}"`,
      uploadFailed: (fileName, message) => `Failed to upload "${fileName}": ${message}`,
      generalUploadError: 'File upload failed. Please try again.',
      sending: 'Sending...',
      messageSentSuccess: 'Your request has been sent successfully!',
      messageSendFailed: 'Failed to send request. Please try again later.',
      proceed: 'Proceed', // For general contact form on index.html
      noFilesSelectedYet: 'No files selected yet.',
      selectedFilesTitle: 'Selected Files:',
      uploadedFilesTitle: 'Uploaded Files:',

      // Quotation form validation messages
      noFilesForValidation: 'Please select files for upload.',
      langMismatch: 'Source and target languages must differ.',
      invalidPageCount: 'Please enter a valid page count.',
      invalidWordCount: 'Please enter a valid word count.',

      // Modal specific messages
      modalSendRequest: 'Send Request',
      modalSendingFiles: 'Uploading Files...',
      modalSendingEmail: 'Sending Email...',

      // Quotation Summary strings for email template
      certifiedTranslation: 'Certified Translation',
      standardCertifiedTranslation: 'Standard Certified Translation',
      pages: 'pages',
      page: 'page',
      professionalTranslation: 'Professional Translation',
      words: 'words',
      word: 'word',
      urgent: 'Urgent',
      normal: 'Normal',
      pricePerPage: 'Price per page',
      pricePerWord: 'Price per word',
      urgencyFee: 'Urgency Fee',
      from: 'From',
      to: 'To',
      count: 'Count',
      totalPrice: 'Total Price',
      serviceIconUrl: 'https://res.cloudinary.com/drxvjsnm2/image/upload/v1700000000/icons/generic_service_icon.png' // Generic service icon placeholder
    },
    ar: {
      // General messages
      fileSelected: (count) => `${count} ملف(ملفات) مختارة.`,
      fileSizeLimitError: (size) => `خطأ: يتجاوز الحد الأقصى للحجم ${size} ميجابايت.`,
      noFilesSelected: 'لم يتم اختيار ملفات.',
      uploading: (fileName, progress) => `جاري الرفع: "${fileName}" (${Math.round(progress)}%)...`,
      uploaded: (fileName) => `تم الرفع: "${fileName}"`,
      uploadFailed: (fileName, message) => `فشل رفع "${fileName}": ${message}`,
      generalUploadError: 'فشل تحميل الملف. الرجاء المحاولة مرة أخرى.',
      sending: 'جاري الإرسال...',
      messageSentSuccess: 'تم إرسال طلبك بنجاح!',
      messageSendFailed: 'فشل إرسال الطلب. الرجاء المحاولة مرة أخرى لاحقًا.',
      proceed: 'إرسال', // For general contact form
      noFilesSelectedYet: 'لم يتم اختيار ملفات بعد.',
      selectedFilesTitle: 'الملفات المختارة:',
      uploadedFilesTitle: 'الملفات المرفوعة:',

      // Quotation form validation messages
      noFilesForValidation: 'الرجاء تحديد ملفات للرفع.',
      langMismatch: 'يجب أن تختلف اللغة الأساسية عن المستهدفة.',
      invalidPageCount: 'الرجاء إدخال عدد صفحات صحيح.',
      invalidWordCount: 'الرجاء إدخال عدد كلمات صحيح.',

      // Modal specific messages
      modalSendRequest: 'إرسال الطلب',
      modalSendingFiles: 'جاري رفع الملفات...',
      modalSendingEmail: 'جاري إرسال البريد...',

      // Quotation Summary strings for email template
      certifiedTranslation: 'ترجمة معتمدة',
      standardCertifiedTranslation: 'ترجمة معتمدة قياسية',
      pages: 'صفحات',
      page: 'صفحة',
      professionalTranslation: 'ترجمة احترافية',
      words: 'كلمات',
      word: 'كلمة',
      urgent: 'مستعجل',
      normal: 'عادي',
      pricePerPage: 'السعر لكل صفحة',
      pricePerWord: 'السعر لكل كلمة',
      urgencyFee: 'رسوم الاستعجال',
      from: 'من',
      to: 'إلى',
      count: 'العدد',
      totalPrice: 'السعر الإجمالي',
      serviceIconUrl: 'https://res.cloudinary.com/drxvjsnm2/image/upload/v1700000000/icons/generic_service_icon.png' // Generic service icon placeholder
    }
  };

  const t = (key, ...args) => {
    const string = localizedStrings[currentLang][key];
    return typeof string === 'function' ? string(...args) : string;
  };

  // --- Helper: Sanitize values for EmailJS payload ---
  function sanitizeForEmailJS(v) {
    if (v === undefined || v === null) return '';
    if (typeof v === 'object' && !Array.isArray(v)) {
      try { return JSON.stringify(v); } catch (e) { return String(v); }
    }
    return String(v);
  }

  // Helper: Build a human-readable quote summary text for the template
  // This version is self-contained and avoids direct t() calls for robustness
  function buildQuoteSummaryText(quoteSummary, currentLang) {
    if (!quoteSummary || typeof quoteSummary !== 'object') return '';

    const isCertified = !!quoteSummary.isCertified;
    const count = Number(quoteSummary.count) || 0;
    // Default rates (same as used elsewhere)
    const basePriceRate = isCertified ? 31.75 : 0.10;
    const urgencyFeeRate = isCertified ? 7.94 : 4.75;
    const calculatedBasePrice = (count * basePriceRate).toFixed(2);
    const urgencyFeeCalculated = (quoteSummary.urgency === 'priority' && count > 0) ? urgencyFeeRate : 0;
    const finalTotal = (parseFloat(calculatedBasePrice) + urgencyFeeCalculated).toFixed(2);

    // Provide minimal localized labels inline (avoid missing t() keys causing failures)
    const L = (en, ar) => (currentLang === 'ar' ? ar : en); // Localized label helper
    const lines = [
      `${L('Service', 'الخدمة')}: ${isCertified ? L('Certified Translation', 'ترجمة معتمدة') : L('Professional Translation', 'ترجمة احترافية')}`,
      `${L('From', 'من')}: ${sanitizeForEmailJS(quoteSummary.fromLang || '')}`,
      `${L('To', 'إلى')}: ${sanitizeForEmailJS(quoteSummary.toLang || '')}`,
      `${L('Count', 'العدد')}: ${count} ${isCertified ? L('page(s)', 'صفحة/صفحات') : L('word(s)', 'كلمة/كلمات')}`,
      `${L('Base price rate', 'السعر الأساسي')}: $${basePriceRate.toFixed(2)}`,
      `${L('Base price', 'السعر')}: $${calculatedBasePrice}`,
      `${L('Urgency', 'الاستعجال')}: ${quoteSummary.urgency === 'priority' ? L('Urgent', 'مستعجل') : L('Normal', 'عادي')}`,
      `${L('Urgency fee', 'رسوم الاستعجال')}: $${urgencyFeeCalculated.toFixed(2)}`,
      `${L('Total', 'الإجمالي')}: $${finalTotal}`
    ];

    return lines.join('\n');
  }


  // --- Quote button slide-in ---
  const quoteBtn = document.getElementById("quoteSlideBtn");
  const hero = document.querySelector(".hero-section");
  const contactSection = document.getElementById("contact");

  function getCssVar(name) {
    const value = getComputedStyle(document.documentElement).getPropertyValue(name);
    return parseFloat(value) || 80;
  }

  if (quoteBtn && hero && contactSection) {
    window.addEventListener("scroll", () => {
      const navbarHeight = getCssVar("--navbar-height");
      const heroBottom = hero.offsetHeight;
      const contactTop = contactSection.offsetTop;

      const shouldShowQuoteBtn =
        window.scrollY > heroBottom &&
        window.scrollY < contactTop - navbarHeight;

      quoteBtn.classList.toggle("show", shouldShowQuoteBtn);
    });
  }

  // --- Navbar collapse/shrink logic ---
  const nav = document.querySelector('.navbar');
  const collapseEl = document.getElementById('navbarNav');

  if (nav && collapseEl && typeof bootstrap !== "undefined") {
    const bsCollapse = new bootstrap.Collapse(collapseEl, { toggle: false });
    let lastScrollY = window.scrollY;

    const toggler = document.querySelector('.navbar-toggler');
    if (toggler) {
      toggler.addEventListener('click', () => {
        // This toggles the menu open/closed
      });
    }

    window.addEventListener('scroll', () => {
      if (window.innerWidth <= 991) {
        if (window.scrollY > lastScrollY && collapseEl.classList.contains('show')) {
          bsCollapse.hide();
        }
        lastScrollY = window.scrollY;
      }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (collapseEl.classList.contains('show')) {
          bsCollapse.hide();
        }
      });
    });
  }

  // --- START: RESOURCES CAROUSEL INITIALIZATION ---
  const resourcesCarouselElement = document.getElementById('resourcesCarousel');
  if (resourcesCarouselElement) {
      const resourcesCarousel = new bootstrap.Carousel(resourcesCarouselElement, {
          interval: false,
          wrap: true
      });
  }
  // --- END: RESOURCES CAROUSEL INITIALIZATION ---

  // --- START: GENERAL CONTACT FORM EMAILJS INTEGRATION (for index.html) ---
  emailjs.init("YWr00jt06-K5B1xtt"); // Your EmailJS Public Key for general contact form

  const contactForm = document.getElementById('contactForm'); // General contact form on index.html
  const contactSubmitBtn = document.getElementById('contactSubmitBtn');
  const contactFormMessage = document.getElementById('contactFormMessage');

  if (contactForm && contactSubmitBtn && contactFormMessage) {
    contactForm.addEventListener('submit', async function(event) {
      event.preventDefault();

      const nameField = document.getElementById('name');
      const emailField = document.getElementById('email');
      const serviceField = document.getElementById('service');
      const messageField = document.getElementById('message');

      if (!nameField.value || !emailField.value || !serviceField.value || !messageField.value) {
        contactFormMessage.style.color = 'red';
        contactFormMessage.textContent = t('messageSendFailed', 'missing fields');
        contactFormMessage.style.display = 'block';
        return;
      }

      contactSubmitBtn.disabled = true;
      contactSubmitBtn.textContent = t('sending');
      contactFormMessage.style.display = 'none';

      const templateParams = {
        user_name: sanitizeForEmailJS(nameField.value), // Sanitized
        user_email: sanitizeForEmailJS(emailField.value), // Sanitized
        user_service: sanitizeForEmailJS(serviceField.value), // Sanitized
        user_message: sanitizeForEmailJS(messageField.value), // Sanitized
        isQuoteRequest: "No" // Flag for general contact form
      };

      try {
        const response = await emailjs.send(
          "service_oo9vipi", // Your EmailJS Service ID for general contact
          "template_80ep6mu", // Your EmailJS Template ID for general contact
          templateParams
        );

        console.log('Email successfully sent!', response);
        contactFormMessage.style.color = 'green';
        contactFormMessage.textContent = t('messageSentSuccess');
        contactFormMessage.style.display = 'block';
        contactForm.reset();

      } catch (error) {
        console.error('Failed to send email:', error);
        contactFormMessage.style.color = 'red';
        contactFormMessage.textContent = t('messageSendFailed', error.message);
        contactFormMessage.style.display = 'block';
      } finally {
        contactSubmitBtn.disabled = false;
        contactSubmitBtn.textContent = t('proceed');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }
  // --- END: GENERAL CONTACT FORM EMAILJS INTEGRATION ---


  // --- START: QUOTATION PAGE SPECIFIC LOGIC ---

  // Utility to clear a specific error message
  function clearError(id) {
    const errorElement = document.getElementById(id);
    if (errorElement) {
        errorElement.innerText = "";
    }
  }
  window.clearError = clearError; // Expose to global scope for onclick attributes

  function switchTab(type) {
    document
      .getElementById("certifiedTab")
      .classList.toggle("active", type === "certified");
    document
      .getElementById("professionalTab")
      .classList.toggle("active", type === "professional");
    document
      .getElementById("certifiedForm")
      .classList.toggle("hidden", type !== "certified");
    document
      .getElementById("professionalForm")
      .classList.toggle("hidden", type !== "professional");
    updateQuote();
  }
  window.switchTab = switchTab; // Expose to global scope

  function updateToOptions(formType) {
    // Static options already set - no changes needed here.
  }
  window.updateToOptions = updateToOptions; // Expose to global scope

  // --- Uploader Identification & Session Management ---
  let quoteSessionId = null; // Stores a unique ID for this quote session
  let uploaderFirebaseEmail = null; // Stores email if user is logged in via Firebase Auth

  // Store selected FileList globally so modal can access it
  let selectedFilesGlobal = {}; // { certified: FileList, professional: FileList }

  const quotationPageElement = document.getElementById("certifiedFrom");
  if (quotationPageElement) { // Logic specific to quotation page
    quoteSessionId = `quote-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    // Check if a user is authenticated via Firebase Auth
    setTimeout(() => {
        if (typeof auth !== 'undefined' && auth.currentUser) {
            uploaderFirebaseEmail = auth.currentUser.email;
            console.log("Firebase Authenticated Uploader:", uploaderFirebaseEmail);
        } else {
            if (typeof auth !== 'undefined' && auth.onAuthStateChanged) {
                auth.onAuthStateChanged(user => {
                    if (user) {
                        uploaderFirebaseEmail = user.email;
                        console.log("Firebase Authenticated Uploader (onAuthChanged):", uploaderFirebaseEmail);
                    }
                });
            }
            console.log("No Firebase authenticated user initially. Using session ID:", quoteSessionId);
        }
    }, 1000);
  }

  function updateQuote() {
    const isCertified = !document
      .getElementById("certifiedForm")
      .classList.contains("hidden");
    const serviceType = document.getElementById("serviceType");
    const translationType = document.getElementById("translationType");
    const pricing = document.getElementById("pricing");
    const delivery = document.getElementById("delivery");
    const totalDisplay = document.getElementById("quoteTotal");
    const selectedFilesSummary = document.getElementById("selectedFilesSummary");

    const quotationSummaryContainer = document.getElementById('quotation-summary');
    if (!quotationSummaryContainer || !serviceType || !translationType || !pricing || !delivery || !totalDisplay || !selectedFilesSummary) {
        console.warn("Quotation page elements not found, skipping updateQuote().");
        return;
    }

    let filesListHtml = '';
    let currentSelectedFiles = isCertified ? selectedFilesGlobal.certified : selectedFilesGlobal.professional;

    const localeForDate = currentLang === 'ar' ? 'ar-SA' : 'en-US';

    if (isCertified) {
      let pages = parseInt(document.getElementById("certifiedPages").value) || 0;
      if (pages < 0) pages = 0;

      const urgencyRadio = document.querySelector('input[name="certifiedUrgency"]:checked');
      const urgency = urgencyRadio ? urgencyRadio.value : '';

      const basePrice = 31.75;
      const urgencyFee = (urgency === "priority" && pages > 0) ? 7.94 : 0;
      const total = pages > 0 ? (pages * basePrice + urgencyFee) : 0;

      serviceType.innerText = currentLang === 'ar' ? "الخدمة: ترجمة معتمدة" : "Service: Certified Translation";
      translationType.innerText = currentLang === 'ar' ? "نوع الترجمة: ترجمة معتمدة قياسية" : "Translation Type: Standard Certified Translation";
      pricing.innerHTML = currentLang === 'ar' ?
          `السعر (${basePrice.toFixed(2)}$ / الصفحة)<br>${pages} صفحة: ${(pages * basePrice).toFixed(2)}$` :
          `Pricing ($${basePrice.toFixed(2)} / page)<br>${pages} page(s): $${(pages * basePrice).toFixed(2)}`;

      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + (urgency === "priority" ? 1 : 2));
      const options = { weekday: "long", month: "long", day: "numeric" };
      const formattedDate = deliveryDate.toLocaleDateString(
        localeForDate,
        options
      );
      delivery.innerText = currentLang === 'ar' ?
          `تاريخ التسليم المتوقع: ${formattedDate} (${urgency === "priority" ? "24 ساعة" : "يومان"})` :
          `Estimated Delivery: ${formattedDate} (${urgency === "priority" ? "24 hours" : "2 days"})`;
      totalDisplay.innerHTML = total > 0
    ? `${currentLang === 'ar' ? 'الإجمالي' : 'Total'}: $${total.toFixed(2)} 💰`
    : `${currentLang === 'ar' ? 'الإجمالي' : 'Total'}: $0.00 💰`;
    } else { // Professional Translation
      let words = parseInt(document.getElementById("professionalWords").value) || 0;
      if (words < 0) words = 0;

      const urgencyRadio = document.querySelector('input[name="professionalUrgency"]:checked');
      const urgency = urgencyRadio ? urgencyRadio.value : '';

      const rate = 0.1;
      const urgencyFee = (urgency === "priority" && words > 0) ? 4.75 : 0;
      const total = words > 0 ? (words * rate + urgencyFee) : 0;

      serviceType.innerText = currentLang === 'ar' ? "الخدمة: ترجمة احترافية" : "Service: Professional Translation";
      translationType.innerText = currentLang === 'ar' ? "نوع الترجمة: احترافية" : "Translation Type: Professional";
      pricing.innerHTML = currentLang === 'ar' ?
          `السعر (${rate.toFixed(2)}$ / كلمة)<br>${words} كلمة: ${(words * rate).toFixed(2)}$` :
          `Pricing ($${rate.toFixed(2)} / word)<br>${words} word(s): $${(words * rate).toFixed(2)}`;

      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + (urgency === "priority" ? 1 : 2));
      const options = { weekday: "long", month: "long", day: "numeric" };
      const formattedDate = deliveryDate.toLocaleDateString(
        localeForDate,
        options
      );
      delivery.innerText = currentLang === 'ar' ?
          `تاريخ التسليم المتوقع: ${formattedDate} (${urgency === "priority" ? "24 ساعة" : "يومان"})` :
          `Estimated Delivery: ${formattedDate} (${urgency === "priority" ? "24 hours" : "2 days"})`;
      totalDisplay.innerHTML = total > 0 ? `${currentLang === 'ar' ? 'الإجمالي' : 'Total'}: $${total.toFixed(2)} 💰` : `${currentLang === 'ar' ? 'الإجمالي' : 'Total'}: $0.00 💰`;
    }

    // Display selected files in the summary
    if (currentSelectedFiles && currentSelectedFiles.length > 0) {
        filesListHtml = `<h4>${t('selectedFilesTitle')}</h4><ul class="uploaded-files-list">`;
        Array.from(currentSelectedFiles).forEach(file => { // Iterate over FileList
            filesListHtml += `<li>${file.name}</li>`;
        });
        filesListHtml += '</ul>';
    } else {
        filesListHtml = `<p>${t('noFilesSelectedYet')}</p>`;
    }
    selectedFilesSummary.innerHTML = filesListHtml;
  }
  window.updateQuote = updateQuote;


  // --- START: CLOUDINARY FILE UPLOAD LOGIC (Triggered on Modal Submit) ---

  const CLOUDINARY_CLOUD_NAME = "drxvjsnm2"; // Your Cloudinary Cloud Name
  const CLOUDINARY_UPLOAD_PRESET = "Damascus Translation"; // Your Cloudinary Upload Preset Name
  const UPLOAD_MAX_PER_FILE_MB = 50; // Max file size in MB

  async function uploadFilesToCloudinaryAndGetUrls(files, statusDiv, progressBar, progressBarInner, uploaderEmailFromModal) {
      if (!statusDiv || !progressBar || !progressBarInner) {
          console.error("Cloudinary upload UI elements not found. Cannot display progress.");
          throw new Error("Upload UI elements missing.");
      }

      statusDiv.innerHTML = '';
      progressBar.style.display = 'none';
      progressBarInner.style.width = '0%';
      progressBarInner.textContent = '0%';

      if (files.length === 0) {
          statusDiv.innerHTML = `<span class="text-danger">${t('noFilesSelected')}</span>`;
          return [];
      }

      const uploadedFileDetails = [];
      let filesProcessed = 0; // Tracks successfully completed file uploads

      progressBar.style.display = 'block';

      const uploadPromises = [];

      for (let i = 0; i < files.length; i++) {
          const file = files[i];

          if (file.size > UPLOAD_MAX_PER_FILE_MB * 1024 * 1024) {
              statusDiv.innerHTML = `<span class="text-danger">${file.name} ${t('fileSizeLimitError', UPLOAD_MAX_PER_FILE_MB)}</span>`;
              progressBar.style.display = 'none';
              throw new Error(`File "${file.name}" exceeds ${UPLOAD_MAX_PER_FILE_MB}MB limit.`);
          }

          const formData = new FormData();
          formData.append('file', file);
          formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

          let contextString = `uploader_email=${uploaderEmailFromModal || 'anonymous'}`;
          contextString += `|quote_session_id=${quoteSessionId}`;
          if (uploaderFirebaseEmail) {
            contextString += `|firebase_email=${uploaderFirebaseEmail}`;
          }
          const currentFormType = document.getElementById("certifiedForm").classList.contains("hidden") ? 'professional' : 'certified';
          contextString += `|quote_type=${currentFormType}`;
          formData.append('context', contextString);


          const xhrPromise = new Promise((resolve, reject) => {
              const xhr = new XMLHttpRequest();

              xhr.upload.addEventListener('progress', (event) => {
                  if (event.lengthComputable && progressBarInner) {
                      const progress = (event.loaded / event.total) * 100;
                      const overallProgress = ((filesProcessed * 100) + progress) / files.length;

                      progressBarInner.style.width = overallProgress + '%';
                      progressBarInner.textContent = `${Math.round(overallProgress)}%`;
                      statusDiv.innerHTML = `${t('uploading', file.name, progress)}`;
                  }
              });

              xhr.addEventListener('load', () => {
                  if (xhr.status >= 200 && xhr.status < 300) {
                      const data = JSON.parse(xhr.responseText);
                      uploadedFileDetails.push({ name: data.original_filename || file.name, url: data.secure_url });
                      filesProcessed++;
                      statusDiv.innerHTML = `<span class="text-success">${t('uploaded', file.name)}</span>`;
                      resolve();
                  } else {
                      const errorData = JSON.parse(xhr.responseText);
                      reject(new Error(errorData.error.message || `Cloudinary upload failed for ${file.name}`));
                  }
              });

              xhr.addEventListener('error', () => {
                  reject(new Error(t('uploadFailed', file.name, t('generalUploadError'))));
              });

              xhr.addEventListener('abort', () => {
                  reject(new Error(t('uploadFailed', file.name, 'Upload aborted.')));
              });

              xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`);
              xhr.send(formData);
          });
          uploadPromises.push(xhrPromise);
      }

      try {
          await Promise.all(uploadPromises);
          progressBar.style.display = 'none';
          statusDiv.innerHTML = `<span class="text-success">${t('uploaded', files.length + ' files')}</span>`;
          return uploadedFileDetails;
      } catch (error) {
          console.error('Cloudinary overall upload error:', error);
          statusDiv.innerHTML = `<span class="text-danger">${t('generalUploadError')}: ${error.message}</span>`;
          progressBar.style.display = 'none';
          uploadedFileDetails.length = 0;
          throw error;
      }
  }
  window.uploadFilesToCloudinaryAndGetUrls = uploadFilesToCloudinaryAndGetUrls;


  // Attach event listeners to file inputs (on first form)
  const certifiedFilesInput = document.getElementById('certifiedFiles');
  const professionalFilesInput = document.getElementById('professionalFiles');

  if (certifiedFilesInput) {
    certifiedFilesInput.addEventListener('change', () => {
        clearError('fileError');
        selectedFilesGlobal.certified = certifiedFilesInput.files;
        updateQuote();
    });
  }
  if (professionalFilesInput) {
    professionalFilesInput.addEventListener('change', () => {
        clearError('fileErrorProf');
        selectedFilesGlobal.professional = professionalFilesInput.files;
        updateQuote();
    });
  }


  // Quotation page initial setup & event listeners
  const certifiedFromSelect = document.getElementById("certifiedFrom");
  if (certifiedFromSelect) { // This element is unique to quotation page
    certifiedFromSelect.value = currentLang === 'ar' ? "Arabic" : "English";
    document.getElementById("professionalFrom").value = currentLang === 'ar' ? "Arabic" : "English";

    const certifiedPagesInput = document.getElementById("certifiedPages");
    const certifiedUrgencyRadios = document.querySelectorAll('input[name="certifiedUrgency"]');

    if (certifiedPagesInput) {
      certifiedPagesInput.addEventListener('input', updateQuote);
    }
    certifiedUrgencyRadios.forEach(radio => {
      radio.addEventListener('change', updateQuote);
    });

    const professionalWordsInput = document.getElementById("professionalWords");
    const professionalUrgencyRadios = document.querySelectorAll('input[name="professionalUrgency"]');

    if (professionalWordsInput) {
      professionalWordsInput.addEventListener('input', updateQuote);
    }
    professionalUrgencyRadios.forEach(radio => {
      radio.addEventListener('change', updateQuote);
    });

    updateQuote(); // Initial calculation on quotation page load
  }


  // Modal elements (defined globally for access in event listeners)
  const quoteContactModal = document.getElementById('quoteContactModal');
  const closeButton = quoteContactModal ? quoteContactModal.querySelector('.close-button') : null;
  const quoteModalContactForm = document.getElementById('quoteModalContactForm');

  // Modal form elements
  const quoteModalNameInput = document.getElementById('quoteModalName');
  const quoteModalEmailInput = document.getElementById('quoteModalEmail');
  const quoteModalServiceTypeInput = document.getElementById('quoteModalServiceType');
  const quoteModalMessageInput = document.getElementById('quoteModalMessage');

  // Hidden inputs in the modal form
  const quoteModalSessionIdInput = document.getElementById('quoteModalSessionId');
  const quoteModalQuoteSummaryDataInput = document.getElementById('quoteModalQuoteSummaryData');
  const quoteModalUploaderFirebaseEmailInput = document.getElementById('quoteModalUploaderFirebaseEmail');
  const quoteModalUploadedFileLinksInput = document.getElementById('quoteModalUploadedFileLinks');
  const quoteModalUploadedFileUrlsRawInput = document.getElementById('quoteModalUploadedFileUrlsRaw');
  const quoteModalUploadedFileNamesInput = document.getElementById('quoteModalUploadedFileNames');

  // Modal UI feedback elements
  const quoteModalSendButton = document.getElementById('quoteModalSendButton');
  const quoteModalFormMessage = document.getElementById('quoteModalFormMessage');
  const quoteModalUploadStatus = document.getElementById('quoteModalUploadStatus');
  const quoteModalUploadProgress = document.getElementById('quoteModalUploadProgress');
  const quoteModalProgressBarInner = quoteModalUploadProgress ? quoteModalUploadProgress.querySelector('.progress-bar') : null;
  const quoteModalUploadError = document.getElementById('quoteModalUploadError');


  // Open the modal
  function openQuoteModal() {
    if (quoteContactModal) {
      quoteContactModal.style.display = 'block';
      
      // Populate readonly Service field from main form
      quoteModalServiceTypeInput.value = document.getElementById("serviceType").innerText.replace(/الخدمة:\s*|Service:\s*/, '');

      // Pre-fill email/name if Firebase Auth is used, or leave empty if not.
      if (uploaderFirebaseEmail) {
        quoteModalEmailInput.value = uploaderFirebaseEmail;
      } else {
        quoteModalEmailInput.value = ''; // Clear for new anonymous user
      }
      // Populate Firebase email hidden input (will be 'N/A' if not logged in)
      quoteModalUploaderFirebaseEmailInput.value = uploaderFirebaseEmail || 'N/A';

      // Set other hidden inputs
      quoteModalSessionIdInput.value = quoteSessionId;

      // Reset UI elements
      quoteModalSendButton.textContent = t('modalSendRequest');
      quoteModalSendButton.disabled = false;
      quoteModalFormMessage.style.display = 'none';
      if (quoteModalUploadStatus) quoteModalUploadStatus.style.display = 'none';
      if (quoteModalUploadProgress) quoteModalUploadProgress.style.display = 'none';
      if (quoteModalProgressBarInner) {
        quoteModalProgressBarInner.style.width = '0%';
        quoteModalProgressBarInner.textContent = '0%';
      }
      if (quoteModalUploadError) quoteModalUploadError.style.display = 'none';
    }
  }

  // Close the modal
  function closeQuoteModal() {
    if (quoteContactModal) {
      quoteContactModal.style.display = 'none';
      quoteModalContactForm.reset();
      
      // Clear main form file inputs and selected files global variable
      if (certifiedFilesInput) certifiedFilesInput.value = '';
      if (professionalFilesInput) professionalFilesInput.value = '';
      selectedFilesGlobal = {};
      window.selectedFilesForCloudinaryUpload = []; // Clear the FileList reference
      updateQuote(); // Refresh summary (will show "No files selected yet")
    }
  }

  // Event listeners for modal close
  if (closeButton) {
    closeButton.addEventListener('click', closeQuoteModal);
  }
  window.addEventListener('click', (event) => { // Close if click outside modal content
    if (event.target === quoteContactModal) {
      closeQuoteModal();
    }
  });


  // --- Enhanced validation on "Continue to Options" click (main quote form) ---
  const continueButton = document.querySelector(".continue-btn");
  if (continueButton) {
    continueButton.addEventListener("click", async function (e) {
      e.preventDefault();

      const isCertified = !document
        .getElementById("certifiedForm")
        .classList.contains("hidden");
      let valid = true;

      // Clear previous errors on main form
      [
        "fileError", "langError", "pagesError",
        "fileErrorProf", "langErrorProf", "wordsError",
      ].forEach((id) => clearError(id));

      let currentSelectedFiles = isCertified ? selectedFilesGlobal.certified : selectedFilesGlobal.professional;
      currentSelectedFiles = currentSelectedFiles ? Array.from(currentSelectedFiles) : [];


      // Basic validation for quote form fields
      if (isCertified) {
        if (currentSelectedFiles.length === 0) {
          document.getElementById("fileError").innerText = t('noFilesForValidation');
          valid = false;
        }
        if (
          document.getElementById("certifiedFrom").value ===
          document.getElementById("certifiedTo").value
        ) {
          document.getElementById("langError").innerText = t('langMismatch');
          valid = false;
        }
        if (
          !(parseInt(document.getElementById("certifiedPages").value) > 0)
        ) {
          document.getElementById("pagesError").innerText = t('invalidPageCount');
          valid = false;
        }
      } else { // Professional form validation
        if (currentSelectedFiles.length === 0) {
          document.getElementById("fileErrorProf").innerText = t('noFilesForValidation');
          valid = false;
        }
        if (
          document.getElementById("professionalFrom").value ===
          document.getElementById("professionalTo").value
        ) {
          document.getElementById("langErrorProf").innerText = t('langMismatch');
          valid = false;
        }
        if (
          !(
            parseInt(document.getElementById("professionalWords").value) >
            0
          )
        ) {
          document.getElementById("wordsError").innerText = t('invalidWordCount');
          valid = false;
        }
      }

      if (valid) {
          const serviceNameDisplayed = document.getElementById("serviceType").innerText.replace(/الخدمة:\s*|Service:\s*/, ''); // Remove prefix

          const quoteSummaryData = {
              isCertified: isCertified,
              fromLang: isCertified ? document.getElementById("certifiedFrom").value : document.getElementById("professionalFrom").value,
              toLang: isCertified ? document.getElementById("certifiedTo").value : document.getElementById("professionalTo").value,
              count: isCertified ? document.getElementById("certifiedPages").value : document.getElementById("professionalWords").value,
              urgency: isCertified ? document.querySelector('input[name="certifiedUrgency"]:checked').value : document.querySelector('input[name="professionalUrgency"]:checked').value,
              totalPrice: document.getElementById("quoteTotal").textContent,
              selectedFilesCount: currentSelectedFiles.length
          };

          // Store the actual File objects for Cloudinary upload when modal form is submitted
          window.selectedFilesForCloudinaryUpload = currentSelectedFiles; // Store the array of File objects

          // Populate hidden data in the modal form
          quoteModalQuoteSummaryDataInput.value = JSON.stringify(quoteSummaryData);
          
          openQuoteModal(); // Show the contact modal
      }
    });
  }


  // --- Modal "Send Request" Button Logic ---
  if (quoteModalContactForm) {
      quoteModalContactForm.addEventListener('submit', async function(e) {
          e.preventDefault();

          // Basic validation for modal contact fields
          if (!quoteModalNameInput.value || !quoteModalEmailInput.value) {
              quoteModalFormMessage.style.color = 'red';
              quoteModalFormMessage.textContent = t('messageSendFailed', 'missing contact details');
              quoteModalFormMessage.style.display = 'block';
              return;
          }

          quoteModalSendButton.disabled = true;
          quoteModalSendButton.textContent = t('modalSendingFiles'); // Indicate file upload is starting
          quoteModalFormMessage.style.display = 'none';
          if (quoteModalUploadError) quoteModalUploadError.style.display = 'none';

          const filesToUpload = window.selectedFilesForCloudinaryUpload || []; // Get the selected File[]

          let uploadedCloudinaryFiles = [];
          try {
              if (filesToUpload.length > 0) {
                  uploadedCloudinaryFiles = await window.uploadFilesToCloudinaryAndGetUrls(
                      filesToUpload,
                      quoteModalUploadStatus,
                      quoteModalUploadProgress,
                      quoteModalProgressBarInner,
                      quoteModalEmailInput.value // Pass user email from modal for Cloudinary context
                  );
              } else {
                  console.log("No files selected for upload. Proceeding to send email only.");
              }

              // Collect final template parameters for the Order Confirmation Email
              const quoteSummary = JSON.parse(quoteModalQuoteSummaryDataInput.value);
              const isCertified = quoteSummary.isCertified;
              const count = quoteSummary.count;
              const unitType = isCertified ? (count === 1 ? t('page') : t('pages')) : (count === 1 ? t('word') : t('words'));
              const urgencyType = quoteSummary.urgency === 'priority' ? t('urgent') : t('normal');
              const basePriceRate = isCertified ? 31.75 : 0.1;
              const urgencyFeeRate = isCertified ? 7.94 : 4.75;
              
              const serviceBasePriceCalculated = (count * basePriceRate).toFixed(2);
              const urgencyFeeCalculated = (quoteSummary.urgency === 'priority' && count > 0) ? urgencyFeeRate : 0;
              const finalTotal = (parseFloat(serviceBasePriceCalculated) + urgencyFeeCalculated).toFixed(2);

              // Construct 'orders' array for the EmailJS template's loop
              const orderItems = [];

              // Main service item
              orderItems.push({
                  image_url: t('serviceIconUrl'),
                  name: `${isCertified ? t('certifiedTranslation') : t('professionalTranslation')} (${count} ${unitType})`,
                  units: 1, // Always 1 for the service type
                  price: serviceBasePriceCalculated
              });

              // Add urgency fee as a separate item if applicable
              if (quoteSummary.urgency === 'priority' && count > 0) {
                  orderItems.push({
                      image_url: t('serviceIconUrl'), // Use same icon or a dedicated 'urgent' icon
                      name: `${t('urgencyFee')} (${urgencyType})`,
                      units: 1, // Always 1 for the fee
                      price: urgencyFeeCalculated.toFixed(2)
                  });
              }

              const fileLinksFormatted = uploadedCloudinaryFiles.length > 0 ?
                  uploadedCloudinaryFiles.map(f => `${f.name}: ${f.url}`).join('\n') :
                  t('noFilesSelectedYet');
              
              // Define template parameters to match the NEW Order Confirmation template
              const finalTemplateParams = {
                  // User Contact Details
                  user_name: sanitizeForEmailJS(quoteModalNameInput.value),
                  user_email: sanitizeForEmailJS(quoteModalEmailInput.value),
                  user_service: sanitizeForEmailJS(quoteModalServiceTypeInput.value), // This is the displayed service name
                  user_message: sanitizeForEmailJS(quoteModalMessageInput.value),

                  // Order Summary Details for the template structure
                  order_id: sanitizeForEmailJS(quoteSessionId), // Using session ID as order ID
                  orders: orderItems, // The array for the Handlebars loop
                  cost: {
                      shipping: "0.00", // Hardcoded as per template expectation
                      tax: "0.00",      // Hardcoded as per template expectation
                      total: finalTotal // The calculated total
                  },
                  email: sanitizeForEmailJS(quoteModalEmailInput.value), // For the footer's {{email}}

                  // Additional context/file info
                  uploader_firebase_email: sanitizeForEmailJS(quoteModalUploaderFirebaseEmailInput.value),
                  uploaded_file_links: sanitizeForEmailJS(fileLinksFormatted),
                  uploaded_file_urls_raw: sanitizeForEmailJS(uploadedCloudinaryFiles.map(f => f.url).join(', ') || t('noFilesSelectedYet')),
                  uploaded_file_names: sanitizeForEmailJS(uploadedCloudinaryFiles.map(f => f.name).join(', ') || t('noFilesSelectedYet')),
                  
                  // For the subject line (simplified service name)
                  service_name_for_subject: sanitizeForEmailJS(isCertified ? t('certifiedTranslation') : t('professionalTranslation')),
              };

              console.info('EmailJS payload (sanitized):', JSON.stringify(finalTemplateParams, null, 2));


              quoteModalSendButton.textContent = t('modalSendingEmail');

              const emailResponse = await emailjs.send(
                "service_oo9vipi", // Your EmailJS Service ID
                "template_aq0gztz", // <<< IMPORTANT: Using the new template_aq0gztz ID!
                finalTemplateParams
              );

              console.log('Quote Request Email successfully sent!', emailResponse);
              quoteModalFormMessage.style.color = 'green';
              quoteModalFormMessage.textContent = t('messageSentSuccess');
              quoteModalFormMessage.style.display = 'block';

              // Reset forms and clear stored data after successful submission
              quoteModalContactForm.reset();
              if (certifiedFilesInput) certifiedFilesInput.value = '';
              if (professionalFilesInput) professionalFilesInput.value = '';
              selectedFilesGlobal = {};
              window.selectedFilesForCloudinaryUpload = [];
              updateQuote(); // Refresh main quote summary

              setTimeout(() => {
                  closeQuoteModal();
              }, 2000);

          } catch (error) {
              console.error('Final submission failed:', error);
              quoteModalFormMessage.style.color = 'red';
              quoteModalFormMessage.textContent = t('messageSendFailed', error.message);
              if (quoteModalUploadError) {
                  quoteModalUploadError.style.display = 'block';
                  quoteModalUploadError.textContent = t('generalUploadError') + ': ' + error.message;
              } else {
                  quoteModalFormMessage.style.display = 'block';
              }
          } finally {
              quoteModalSendButton.disabled = false;
              quoteModalSendButton.textContent = t('modalSendRequest');
              if (quoteModalUploadProgress) quoteModalUploadProgress.style.display = 'none';
          }
      });
  }
  // --- END: QUOTATION PAGE SPECIFIC LOGIC ---

});