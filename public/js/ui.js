// ui.js - For all shared user interface scripts

document.addEventListener("DOMContentLoaded", () => {

  // Determine current language from HTML lang attribute
  const currentLang = document.documentElement.lang || 'en'; // Default to 'en'

  // Localization strings
  const localizedStrings = {
    en: {
      fileSizeLimitError: (size) => `Error: exceeds ${size}MB limit.`,
      noFilesSelected: 'No files selected.',
      uploading: (fileName) => `Uploading: "${fileName}"...`,
      uploaded: (fileName) => `Uploaded: "${fileName}"`,
      uploadFailed: (fileName, message) => `Failed to upload "${fileName}": ${message}`,
      generalUploadError: 'File upload failed. Please try again.',
      noFilesForValidation: 'Please upload at least one file.',
      langMismatch: 'Source and target languages must differ.',
      invalidPageCount: 'Please enter a valid page count.',
      invalidWordCount: 'Please enter a valid word count.',
      sending: 'Sending...',
      messageSentSuccess: 'Your message has been sent successfully!',
      messageSendFailed: 'Failed to send message. Please try again later.',
      proceed: 'Proceed',
      noFilesUploadedYet: 'No files uploaded yet.',
      uploadedFilesTitle: 'Uploaded Files:' // New string for title
    },
    ar: {
      fileSizeLimitError: (size) => `خطأ: يتجاوز الحد الأقصى للحجم ${size} ميجابايت.`,
      noFilesSelected: 'لم يتم اختيار ملفات.',
      uploading: (fileName) => `جاري الرفع: "${fileName}"...`,
      uploaded: (fileName) => `تم الرفع: "${fileName}"`,
      uploadFailed: (fileName, message) => `فشل رفع "${fileName}": ${message}`,
      generalUploadError: 'فشل تحميل الملف. الرجاء المحاولة مرة أخرى.',
      noFilesForValidation: 'الرجاء رفع ملف واحد على الأقل.',
      langMismatch: 'يجب أن تختلف اللغة الأساسية عن المستهدفة.',
      invalidPageCount: 'الرجاء إدخال عدد صفحات صحيح.',
      invalidWordCount: 'الرجاء إدخال عدد كلمات صحيح.',
      sending: 'جاري الإرسال...',
      messageSentSuccess: 'تم إرسال رسالتك بنجاح!',
      messageSendFailed: 'فشل إرسال الرسالة. الرجاء المحاولة مرة أخرى لاحقًا.',
      proceed: 'إرسال', // For contact form button
      noFilesUploadedYet: 'لم يتم رفع ملفات بعد.',
      uploadedFilesTitle: 'الملفات المرفوعة:' // New string for title
    }
  };

  const t = (key, ...args) => {
    const string = localizedStrings[currentLang][key];
    return typeof string === 'function' ? string(...args) : string;
  };

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

  // --- START: CONTACT FORM EMAILJS INTEGRATION ---
  emailjs.init("YWr00jt06-K5B1xtt"); // Your actual EmailJS Public Key

  const contactForm = document.getElementById('contactForm');
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
        contactFormMessage.textContent = t('messageSendFailed', 'missing fields'); // Use t() for message
        contactFormMessage.style.display = 'block';
        return;
      }

      contactSubmitBtn.disabled = true;
      contactSubmitBtn.textContent = t('sending'); // Use t() for button text
      contactFormMessage.style.display = 'none';

      const templateParams = {
        user_name: nameField.value,
        user_email: emailField.value,
        user_service: serviceField.value,
        user_message: messageField.value
      };

      try {
        const response = await emailjs.send(
          "service_oo9vipi",
          "template_80ep6mu",
          templateParams
        );

        console.log('Email successfully sent!', response);
        contactFormMessage.style.color = 'green';
        contactFormMessage.textContent = t('messageSentSuccess'); // Use t() for message
        contactFormMessage.style.display = 'block';
        contactForm.reset();

      } catch (error) {
        console.error('Failed to send email:', error);
        contactFormMessage.style.color = 'red';
        contactFormMessage.textContent = t('messageSendFailed', error.message); // Use t() for message
        contactFormMessage.style.display = 'block';
      } finally {
        contactSubmitBtn.disabled = false;
        contactSubmitBtn.textContent = t('proceed'); // Use t() for button text
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }
  // --- END: CONTACT FORM EMAILJS INTEGRATION ---


  // --- START: QUOTATION PAGE SPECIFIC LOGIC (Moved from inline script in quotation.html) ---

  // Utility to clear a specific error message
  function clearError(id) {
    const errorElement = document.getElementById(id);
    if (errorElement) {
        errorElement.innerText = "";
    }
  }
  window.clearError = clearError;

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
    updateQuote(); // Recalculate quote after tab switch
  }
  window.switchTab = switchTab;

  function updateToOptions(formType) {
    // Static options already set - no changes needed here.
  }
  window.updateToOptions = updateToOptions;

  function updateQuote() {
    const isCertified = !document
      .getElementById("certifiedForm")
      .classList.contains("hidden");
    const serviceType = document.getElementById("serviceType");
    const translationType = document.getElementById("translationType");
    const pricing = document.getElementById("pricing");
    const delivery = document.getElementById("delivery");
    const totalDisplay = document.getElementById("quoteTotal");
    const uploadedFilesSummary = document.getElementById("uploadedFilesSummary");

    if (!serviceType || !translationType || !pricing || !delivery || !totalDisplay || !uploadedFilesSummary) {
        return;
    }

    let filesListHtml = '';
    let uploadedUrls = [];

    const localeForDate = currentLang === 'ar' ? 'ar-SA' : 'en-US';

    if (isCertified) {
      let pages = parseInt(document.getElementById("certifiedPages").value) || 0;
      if (pages < 0) pages = 0;

      const urgencyRadio = document.querySelector('input[name="certifiedUrgency"]:checked');
      const urgency = urgencyRadio ? urgencyRadio.value : '';

      const basePrice = 31.75; // Use original values from Arabic HTML for consistency
      const urgencyFee = (urgency === "priority" && pages > 0) ? 7.94 : 0; // Use original values
      const total = pages > 0 ? (pages * basePrice + urgencyFee) : 0;

      serviceType.innerText = currentLang === 'ar' ? "الخدمة: ترجمة معتمدة" : "Service: Certified Translation";
      translationType.innerText = currentLang === 'ar' ? "نوع الترجمة: ترجمة معتمدة قياسية" : "Translation Type: Standard Certified Translation";
      pricing.innerHTML = currentLang === 'ar' ?
          `السعر (${basePrice.toFixed(2)}$ / الصفحة)<br>${pages} صفحة: ${(pages * basePrice).toFixed(2)}$` :
          `Pricing ($${basePrice.toFixed(2)} / page)<br>${pages} page(s): $${(pages * basePrice).toFixed(2)}`;

      const certifiedUploadedUrlsInput = document.getElementById('certifiedUploadedUrls');
      if (certifiedUploadedUrlsInput && certifiedUploadedUrlsInput.value) {
          try { uploadedUrls = JSON.parse(certifiedUploadedUrlsInput.value); } catch (e) { console.error("Error parsing certifiedUploadedUrls:", e); }
      }

      const deliveryDate = new Date();
      const deliveryDays = urgency === "priority" ? 1 : 2;
      deliveryDate.setDate(deliveryDate.getDate() + deliveryDays);
      const options = { weekday: "long", month: "long", day: "numeric" };
      const formattedDate = deliveryDate.toLocaleDateString(
        localeForDate,
        options
      );
      delivery.innerText = currentLang === 'ar' ?
          `تاريخ التسليم المتوقع: ${formattedDate} (${deliveryDays === 1 ? "24 ساعة" : "يومان"})` :
          `Estimated Delivery: ${formattedDate} (${deliveryDays === 1 ? "24 hours" : "2 days"})`;
      totalDisplay.innerHTML = total > 0 ? `الإجمالي: $${total.toFixed(2)} 💰` : `الإجمالي: $0.00 💰`;
    } else { // Professional Translation
      let words = parseInt(document.getElementById("professionalWords").value) || 0;
      if (words < 0) words = 0;

      const urgencyRadio = document.querySelector('input[name="professionalUrgency"]:checked');
      const urgency = urgencyRadio ? urgencyRadio.value : '';

      const rate = 0.1; // Use original values from Arabic HTML for consistency
      const urgencyFee = (urgency === "priority" && words > 0) ? 4.75 : 0; // Use original values
      const total = words > 0 ? (words * rate + urgencyFee) : 0;

      serviceType.innerText = currentLang === 'ar' ? "الخدمة: ترجمة احترافية" : "Service: Professional Translation";
      translationType.innerText = currentLang === 'ar' ? "نوع الترجمة: احترافية" : "Translation Type: Professional";
      pricing.innerHTML = currentLang === 'ar' ?
          `السعر (${rate.toFixed(2)}$ / كلمة)<br>${words} كلمة: ${(words * rate).toFixed(2)}$` :
          `Pricing ($${rate.toFixed(2)} / word)<br>${words} word(s): $${(words * rate).toFixed(2)}`;

      const professionalUploadedUrlsInput = document.getElementById('professionalUploadedUrls');
      if (professionalUploadedUrlsInput && professionalUploadedUrlsInput.value) {
          try { uploadedUrls = JSON.parse(professionalUploadedUrlsInput.value); } catch (e) { console.error("Error parsing professionalUploadedUrls:", e); }
      }

      const deliveryDate = new Date();
      const deliveryDays = urgency === "priority" ? 1 : 2;
      deliveryDate.setDate(deliveryDate.getDate() + deliveryDays);
      const options = { weekday: "long", month: "long", day: "numeric" };
      const formattedDate = deliveryDate.toLocaleDateString(
        localeForDate,
        options
      );
      delivery.innerText = currentLang === 'ar' ?
          `تاريخ التسليم المتوقع: ${formattedDate} (${deliveryDays === 1 ? "24 ساعة" : "يومان"})` :
          `Estimated Delivery: ${formattedDate} (${deliveryDays === 1 ? "24 hours" : "2 days"})`;
      totalDisplay.innerHTML = total > 0 ? `الإجمالي: $${total.toFixed(2)} 💰` : `الإجمالي: $0.00 💰`;
    }

    // Display uploaded files in the summary - NOW AS STATIC TEXT
    if (uploadedUrls.length > 0) {
        filesListHtml = `<h4>${t('uploadedFilesTitle')}</h4><ul class="uploaded-files-list">`;
        uploadedUrls.forEach(fileInfo => {
            filesListHtml += `<li>${fileInfo.name}</li>`; // Changed from <a> to static text
        });
        filesListHtml += '</ul>';
    } else {
        filesListHtml = `<p>${t('noFilesUploadedYet')}</p>`;
    }
    uploadedFilesSummary.innerHTML = filesListHtml;
  }
  window.updateQuote = updateQuote;


  // --- START: CLOUDINARY FILE UPLOAD LOGIC FOR QUOTATION PAGE ---

  const CLOUDINARY_CLOUD_NAME = "drxvjsnm2"; // Your Cloudinary Cloud Name
  const CLOUDINARY_UPLOAD_PRESET = "Damascus Translation"; // Your Cloudinary Upload Preset Name

  async function uploadFilesToCloudinary(files, statusDivId, progressDivId, hiddenInputId) {
      const statusDiv = document.getElementById(statusDivId);
      const progressBar = document.getElementById(progressDivId);
      const progressBarInner = progressBar ? progressBar.querySelector('.progress-bar') : null;
      const hiddenInput = document.getElementById(hiddenInputId);

      // Clear previous status and hide progress bar
      if (statusDiv) statusDiv.innerHTML = '';
      if (progressBar) progressBar.style.display = 'none';
      if (progressBarInner) {
        progressBarInner.style.width = '0%';
        progressBarInner.textContent = '0%';
      }
      if (hiddenInput) hiddenInput.value = ''; // Clear previous URLs

      if (files.length === 0) {
          if (statusDiv) statusDiv.innerHTML = `<span class="text-danger">${t('noFilesSelected')}</span>`;
          return [];
      }

      const uploadedFileDetails = [];
      let filesProcessed = 0;

      if (progressBar) progressBar.style.display = 'block';

      // Use Promise.all to handle multiple uploads concurrently and track their individual progress
      const uploadPromises = [];
      const MAX_FILE_SIZE_MB = 5;

      for (let i = 0; i < files.length; i++) {
          const file = files[i];

          if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
              if (statusDiv) statusDiv.innerHTML = `<span class="text-danger">${file.name} ${t('fileSizeLimitError', MAX_FILE_SIZE_MB)}</span>`;
              if (progressBar) progressBar.style.display = 'none';
              return []; // Stop on first oversized file
          }

          const formData = new FormData();
          formData.append('file', file);
          formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

          // Use XMLHttpRequest for dynamic progress tracking
          const xhrPromise = new Promise((resolve, reject) => {
              const xhr = new XMLHttpRequest();

              // Track upload progress for this specific file
              xhr.upload.addEventListener('progress', (event) => {
                  if (event.lengthComputable && progressBarInner) {
                      // Calculate overall progress across all files if needed,
                      // but for simplicity here, we'll update based on current file's progress
                      // and then average if multiple files are in queue.
                      const progress = (event.loaded / event.total) * 100;
                      // Note: This simple approach might show "jumps" if multiple files are handled sequentially.
                      // For true overall progress of multiple concurrent uploads,
                      // you'd sum loaded/total for all active XHRs.
                      progressBarInner.style.width = progress + '%';
                      progressBarInner.textContent = `${Math.round(progress)}%`;
                      if (statusDiv) statusDiv.innerHTML = `${t('uploading', file.name)} (${Math.round(progress)}%)`;
                  }
              });

              xhr.addEventListener('load', () => {
                  if (xhr.status >= 200 && xhr.status < 300) {
                      const data = JSON.parse(xhr.responseText);
                      uploadedFileDetails.push({ name: data.original_filename || file.name, url: data.secure_url });
                      filesProcessed++;
                      // Update overall progress based on files completed
                      const totalProgress = (filesProcessed / files.length) * 100;
                      if (progressBarInner) {
                          progressBarInner.style.width = totalProgress + '%';
                          progressBarInner.textContent = `${Math.round(totalProgress)}%`;
                      }
                      if (statusDiv) statusDiv.innerHTML = `<span class="text-success">${t('uploaded', file.name)}</span>`;
                      resolve();
                  } else {
                      const errorData = JSON.parse(xhr.responseText);
                      reject(new Error(errorData.error.message || `Cloudinary upload failed for ${file.name}`));
                  }
              });

              xhr.addEventListener('error', () => {
                  reject(new Error(t('uploadFailed', file.name, 'Network error or server issue.')));
              });

              xhr.addEventListener('abort', () => {
                  reject(new Error(t('uploadFailed', file.name, 'Upload aborted.')));
              });

              xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`);
              xhr.send(formData);
          });
          uploadPromises.push(xhrPromise);
      }

      // Wait for all selected files to finish uploading
      await Promise.all(uploadPromises)
        .then(() => {
          if (progressBar) progressBar.style.display = 'none';
          if (hiddenInput) hiddenInput.value = JSON.stringify(uploadedFileDetails);
          updateQuote(); // Update quote summary to show uploaded files
        })
        .catch((error) => {
          console.error('Cloudinary overall upload error:', error);
          if (statusDiv) statusDiv.innerHTML = `<span class="text-danger">${t('generalUploadError')}: ${error.message}</span>`;
          if (progressBar) progressBar.style.display = 'none';
          // Clear any partial uploads if an error occurs mid-way for a set of files
          if (hiddenInput) hiddenInput.value = '';
          uploadedFileDetails.length = 0; // Clear array
          updateQuote(); // Update summary
        });

      return uploadedFileDetails;
  }


  // Attach event listeners to your file input elements
  const certifiedFilesInput = document.getElementById('certifiedFiles');
  const professionalFilesInput = document.getElementById('professionalFiles');

  if (certifiedFilesInput) {
    certifiedFilesInput.addEventListener('change', () => uploadFilesToCloudinary(
        certifiedFilesInput.files,
        'certifiedFilesStatus',
        'certifiedUploadProgress',
        'certifiedUploadedUrls'
    ));
  }
  if (professionalFilesInput) {
    professionalFilesInput.addEventListener('change', () => uploadFilesToCloudinary(
        professionalFilesInput.files,
        'professionalFilesStatus',
        'professionalUploadProgress',
        'professionalUploadedUrls'
    ));
  }

  // Initialize defaults and set up event listeners for quotation page elements
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


  // Enhanced validation on Continue click (for quotation page)
  const continueButton = document.querySelector(".continue-btn");
  if (continueButton) { // Ensure button exists before attaching listener
    continueButton.addEventListener("click", function (e) {
      const isCertified = !document
        .getElementById("certifiedForm")
        .classList.contains("hidden");
      let valid = true;

      // Clear previous errors
      [
        "fileError", "langError", "pagesError",
        "fileErrorProf", "langErrorProf", "wordsError",
      ].forEach((id) => clearError(id));

      let filesUploaded = false;
      let currentFilesInputId = isCertified ? "certifiedUploadedUrls" : "professionalUploadedUrls";
      const uploadedUrlsInput = document.getElementById(currentFilesInputId);

      if (uploadedUrlsInput && uploadedUrlsInput.value) {
          try {
              const urls = JSON.parse(uploadedUrlsInput.value);
              if (urls.length > 0) {
                  filesUploaded = true;
              }
          } catch (e) {
              console.error("Error parsing uploaded URLs:", e);
          }
      }

      if (isCertified) {
        // File check - check if files were successfully uploaded
        if (!filesUploaded) {
          document.getElementById("fileError").innerText = t('noFilesForValidation');
          valid = false;
        }
        // Language mismatch
        if (
          document.getElementById("certifiedFrom").value ===
          document.getElementById("certifiedTo").value
        ) {
          document.getElementById("langError").innerText = t('langMismatch');
          valid = false;
        }
        // Pages count
        if (
          !(parseInt(document.getElementById("certifiedPages").value) > 0)
        ) {
          document.getElementById("pagesError").innerText = t('invalidPageCount');
          valid = false;
        }
      } else { // Professional form validation
        // File check
        if (!filesUploaded) {
          document.getElementById("fileErrorProf").innerText = t('noFilesForValidation');
          valid = false;
        }
        // Language mismatch
        if (
          document.getElementById("professionalFrom").value ===
          document.getElementById("professionalTo").value
        ) {
          document.getElementById("langErrorProf").innerText = t('langMismatch');
          valid = false;
        }
        // Words count
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

      if (!valid) e.preventDefault();
    });
  } // End if (continueButton) check

  // --- END: QUOTATION PAGE SPECIFIC LOGIC ---

});