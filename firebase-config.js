/* ============================================================
   AITECH — Firebase Configuration & Authentication
   ============================================================
   Cấu hình Firebase cho:
   1. Firebase Authentication (Google Sign-In)
   2. Firestore Database (lưu thông tin user)
   
   📌 HƯỚNG DẪN SETUP:
   1. Vào https://console.firebase.google.com → Tạo project
   2. Vào Project Settings → General → Web app → Register app
   3. Copy config bên dưới và thay vào FIREBASE_CONFIG
   4. Vào Authentication → Sign-in method → Bật Google
   5. Vào Firestore Database → Create database (test mode)
   ============================================================ */

// ⬇️ THAY FIREBASE CONFIG CỦA BẠN VÀO ĐÂY
const FIREBASE_CONFIG = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};
// ⬆️ Lấy config tại: Firebase Console → Project Settings → General → Web app

/* ---------- Initialize Firebase ---------- */
let firebaseApp = null;
let firebaseAuth = null;
let firebaseDb = null;

function aitechInitFirebase() {
    try {
        // Check if Firebase SDK is loaded
        if (typeof firebase === 'undefined') {
            console.warn('Firebase SDK chưa được tải.');
            return false;
        }

        // Don't re-initialize
        if (firebase.apps.length > 0) {
            firebaseApp = firebase.apps[0];
        } else {
            // Check if config is still placeholder
            if (FIREBASE_CONFIG.apiKey === 'YOUR_API_KEY') {
                console.warn('⚠️ Firebase chưa được cấu hình. Vui lòng cập nhật FIREBASE_CONFIG trong firebase-config.js');
                return false;
            }
            firebaseApp = firebase.initializeApp(FIREBASE_CONFIG);
        }

        firebaseAuth = firebase.auth();
        firebaseDb = firebase.firestore();

        // Set language to Vietnamese
        firebaseAuth.languageCode = 'vi';

        // Listen for auth state changes
        firebaseAuth.onAuthStateChanged(handleAuthStateChanged);

        console.log('✅ Firebase đã khởi tạo thành công!');
        return true;
    } catch (error) {
        console.error('❌ Lỗi khởi tạo Firebase:', error);
        return false;
    }
}

/* ---------- Auth State Observer ---------- */
function handleAuthStateChanged(user) {
    const loginBtns = document.querySelectorAll('.aitech-login-btn');
    const userInfos = document.querySelectorAll('.aitech-user-info');
    const userNames = document.querySelectorAll('.aitech-user-name');
    const userAvatars = document.querySelectorAll('.aitech-user-avatar');

    if (user) {
        // User is signed in
        loginBtns.forEach(btn => btn.style.display = 'none');
        userInfos.forEach(el => el.style.display = 'flex');
        userNames.forEach(el => el.textContent = user.displayName || 'Người dùng');
        userAvatars.forEach(el => {
            if (user.photoURL) {
                el.src = user.photoURL;
                el.style.display = 'block';
            }
        });

        // Save user to Firestore
        saveUserToFirestore(user);

        // Store UID locally
        localStorage.setItem('aitech_uid', user.uid);
        localStorage.setItem('aitech_user_name', user.displayName || '');
    } else {
        // User is signed out
        loginBtns.forEach(btn => btn.style.display = 'inline-flex');
        userInfos.forEach(el => el.style.display = 'none');
        userNames.forEach(el => el.textContent = '');
        userAvatars.forEach(el => el.style.display = 'none');

        localStorage.removeItem('aitech_uid');
        localStorage.removeItem('aitech_user_name');
    }
}

/* ---------- Google Sign-In ---------- */
async function signInWithGoogle() {
    if (!firebaseAuth) {
        // Try to initialize if not done
        if (!aitechInitFirebase()) {
            alert('⚠️ Firebase chưa được cấu hình.\n\nVui lòng cập nhật FIREBASE_CONFIG trong firebase-config.js\n\nXem hướng dẫn tại: https://console.firebase.google.com');
            return null;
        }
    }

    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('profile');
        provider.addScope('email');

        const result = await firebaseAuth.signInWithPopup(provider);
        console.log('✅ Đăng nhập thành công:', result.user.displayName);
        return result.user;
    } catch (error) {
        console.error('❌ Lỗi đăng nhập:', error);

        if (error.code === 'auth/popup-closed-by-user') {
            // User closed popup - no alert needed
            return null;
        }
        if (error.code === 'auth/popup-blocked') {
            alert('🚫 Popup bị chặn! Vui lòng cho phép popup trên trình duyệt của bạn.');
            return null;
        }
        if (error.code === 'auth/unauthorized-domain') {
            alert('🚫 Domain hiện tại chưa được phép. Vui lòng thêm domain vào Firebase Console → Authentication → Settings → Authorized domains.');
            return null;
        }

        alert('❌ Lỗi đăng nhập: ' + error.message);
        return null;
    }
}

/* ---------- Sign Out ---------- */
async function signOutUser() {
    if (!firebaseAuth) return;

    try {
        await firebaseAuth.signOut();
        console.log('✅ Đã đăng xuất.');
    } catch (error) {
        console.error('❌ Lỗi đăng xuất:', error);
    }
}

/* ---------- Save User to Firestore ---------- */
async function saveUserToFirestore(user) {
    if (!firebaseDb || !user) return;

    try {
        const userRef = firebaseDb.collection('users').doc(user.uid);
        const doc = await userRef.get();

        const userData = {
            uid: user.uid,
            displayName: user.displayName || '',
            email: user.email || '',
            photoURL: user.photoURL || '',
            lastLogin: firebase.firestore.FieldValue.serverTimestamp()
        };

        if (!doc.exists) {
            // New user — set createdAt
            userData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            await userRef.set(userData);
            console.log('✅ Tạo user mới trên Firestore:', user.uid);
        } else {
            // Existing user — update last login
            await userRef.update(userData);
            console.log('✅ Cập nhật user trên Firestore:', user.uid);
        }
    } catch (error) {
        console.error('❌ Lỗi lưu user vào Firestore:', error);
    }
}

/* ---------- Get Current User ---------- */
function getCurrentUser() {
    return firebaseAuth ? firebaseAuth.currentUser : null;
}

/* ---------- Auto-Init on DOM Ready ---------- */
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure Firebase SDK is fully loaded
    setTimeout(() => {
        aitechInitFirebase();
    }, 100);
});
