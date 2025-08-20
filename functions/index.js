// main functions file for Firebase Cloud Functions (File Uploads Only)
const functions = require('firebase-functions');
const logger = require("firebase-functions/logger");
const { google } = require('googleapis'); // For Google Drive API
const formidable = require('formidable');   // For parsing multipart form data (files)
const path = require('path');             // Node.js path module
const fs = require('fs');                 // Node.js File System module
const admin = require('firebase-admin'); // Firebase Admin SDK (required if you plan Firestore logging)
const cors = require('cors')({ origin: true }); // CORS middleware for HTTP function

// Initialize Firebase Admin SDK (important for any Firebase service interaction like Firestore)
// If you don't plan to use Firestore or other Admin SDK features for this function,
// you could technically remove admin.initializeApp() and its import,
// but it's good practice to keep it initialized if your project uses Admin SDK elsewhere.
admin.initializeApp();

// --- Google Drive API Setup for File Upload ---
// Authenticates using GOOGLE_APPLICATION_CREDENTIALS environment variable
const auth = new google.auth.GoogleAuth({
    // We only need the drive.file scope for uploading files created/opened by the app
    scopes: ['https://www.googleapis.com/auth/drive.file'],
});
const drive = google.drive({ version: 'v3', auth });

// IMPORTANT: Ensure DRIVE_FOLDER_ID environment variable is set in Firebase project config
// (e.g., firebase functions:config:set drive.folder_id="YOUR_FOLDER_ID")
// For local emulation, ensure DRIVE_FOLDER_ID is set in your .env file
const DRIVE_FOLDER_ID = functions.config().drive?.folder_id || process.env.DRIVE_FOLDER_ID;

// Helper function to parse multipart form data (files)
// This is essential for handling file uploads (multipart/form-data) via HTTP requests
function parseMultipartForm(req) {
    return new Promise((resolve, reject) => {
        const form = formidable({
            multiples: true, // Allow multiple files for a single input name
            maxFileSize: 5 * 1024 * 1024, // 5 MB limit per file (client-side also needs this)
            uploadDir: path.join(process.env.TEMP || '/tmp'), // Use /tmp for Cloud Functions temporary storage
            keepExtensions: true, // Keep original file extensions
        });

        form.parse(req, (err, fields, files) => {
            if (err) {
                console.error('Error parsing form data:', err);
                return reject(err);
            }
            resolve({ fields, files });
        });
    });
}

// --- Cloud Function to handle file uploads to Google Drive ---
// This is an HTTP triggered function (`onRequest`).
// Its endpoint will be something like: https://REGION-YOUR_PROJECT_ID.cloudfunctions.net/uploadFileToDrive
exports.uploadFileToDrive = functions.https.onRequest((req, res) => {
    // Enable CORS for cross-origin requests from your frontend
    cors(req, res, async () => {
        if (req.method !== 'POST') {
            return res.status(405).send('Method Not Allowed. Only POST requests are accepted.');
        }

        if (!DRIVE_FOLDER_ID) {
            console.error('Server configuration error: DRIVE_FOLDER_ID environment variable is not set.');
            return res.status(500).send('Server configuration error: Google Drive folder ID missing.');
        }

        try {
            const { fields, files } = await parseMultipartForm(req);

            const uploadedFileLinks = []; // To store Google Drive webViewLinks

            // Process each file input field
            for (const fieldName in files) {
                const fileOrFiles = files[fieldName];
                const fileArray = Array.isArray(fileOrFiles) ? fileOrFiles : [fileOrFiles];

                for (const file of fileArray) {
                    const fileContent = fs.readFileSync(file.filepath);
                    const originalFileName = file.originalFilename || path.basename(file.filepath);
                    const mimeType = file.mimetype;

                    const allowedMimeTypes = [
                        'application/pdf',
                        'application/msword',
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
                        'text/plain',
                        'image/jpeg',
                        'image/png',
                        'application/zip',
                        'video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-flv', 'video/webm' // Common video types
                    ];
                    if (!allowedMimeTypes.includes(mimeType)) {
                        logger.warn(`Disallowed file type attempted: ${mimeType} for file ${originalFileName}`);
                        fs.unlinkSync(file.filepath); // Clean up temp file
                        continue;
                    }

                    const driveResponse = await drive.files.create({
                        requestBody: {
                            name: originalFileName,
                            parents: [DRIVE_FOLDER_ID],
                        },
                        media: {
                            mimeType: mimeType,
                            body: fileContent,
                        },
                        fields: 'id,webViewLink,name',
                    });

                    const uploadedFile = driveResponse.data;
                    uploadedFileLinks.push({
                        name: uploadedFile.name,
                        url: uploadedFile.webViewLink,
                        id: uploadedFile.id
                    });

                    fs.unlinkSync(file.filepath);
                }
            }

            // TODO (Next Iteration): Store uploadedFileLinks metadata in Firestore for Admin Dashboard
            // Example:
            // await admin.firestore().collection('quotationUploads').add({
            //     timestamp: admin.firestore.FieldValue.serverTimestamp(),
            //     uploadedFiles: uploadedFileLinks, // Array of { name, url, id }
            //     // You might want to pass user ID, quotation type, etc., from the frontend here
            // });

            res.status(200).send({
                message: 'Files uploaded successfully!',
                uploadedFileLinks: uploadedFileLinks
            });

        } catch (error) {
            logger.error('File upload failed:', error);
            if (files) {
                 const filesToClean = Object.values(files).flat();
                 for (const file of filesToClean) {
                     if (file.filepath && fs.existsSync(file.filepath)) {
                         fs.unlinkSync(file.filepath);
                     }
                 }
            }
            res.status(500).send({ message: 'File upload failed. Please check server logs.', error: error.message || 'Unknown error.' });
        }
    });
});