/* ============================================================
   AITECH — Shared JavaScript Module
   ============================================================ */

/* ---------- Configurable School Name ---------- */
const AITECH_CONFIG = {
    projectName: 'AITECH',
    teamName: 'AITECH',
    author: 'Trần Đình Mạnh Phong',
    schoolName: 'Học sinh THPT Việt Nam', // Có thể đổi thành tên trường cụ thể
    year: 2026
};

/* ============================================================
   DATA ISOLATION — Per-Browser User ID (nsUID)
   ============================================================
   Mỗi trình duyệt sẽ có một UUID riêng. Tất cả dữ liệu 
   (chi tiêu, mục tiêu, TKB, điểm, pomodoro, assessment)
   được lưu với prefix chứa UUID này → không trùng giữa
   các máy/trình duyệt khác nhau khi deploy lên GitHub Pages.
   ============================================================ */
function nsGetUserID() {
    let uid = localStorage.getItem('ns_user_id');
    if (!uid) {
        uid = 'ns_' + crypto.randomUUID();
        localStorage.setItem('ns_user_id', uid);
    }
    return uid;
}
const NS_UID = nsGetUserID();

// Namespaced storage helpers — all app data goes through these
function nsStore(key, data) {
    localStorage.setItem(NS_UID + '_' + key, JSON.stringify(data));
}
function nsLoad(key, fallback = null) {
    try {
        const raw = localStorage.getItem(NS_UID + '_' + key);
        return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
}
function nsRemove(key) {
    localStorage.removeItem(NS_UID + '_' + key);
}

// Migrate old non-namespaced data (one-time)
function nsMigrateOldData() {
    const OLD_KEYS = ['ns_expenses', 'ns_planner', 'ns_grades', 'ns_tkb',
        'ns_pomodoro_stats', 'ns_assessment', 'theme'];
    OLD_KEYS.forEach(oldKey => {
        if (oldKey === 'theme') return; // theme is shared, not per-user
        const oldData = localStorage.getItem(oldKey);
        if (oldData && !localStorage.getItem(NS_UID + '_' + oldKey)) {
            localStorage.setItem(NS_UID + '_' + oldKey, oldData);
            localStorage.removeItem(oldKey);
        }
    });
}
nsMigrateOldData();

/* ---------- Theme (Dark / Light) ---------- */
function nsApplyInitialTheme() {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved === 'dark' || (!saved && prefersDark)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}
nsApplyInitialTheme();

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        document.documentElement.classList.toggle('dark', e.matches);
    }
});

function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

/* ---------- Scroll Reveal ---------- */
function nsInitReveal() {
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('active'); });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

/* ---------- Nav Compact on Scroll ---------- */
function nsInitNavScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    const inner = navbar.querySelector('.glass-card') || navbar.querySelector('div');
    if (!inner) return;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) { inner.classList.add('nav-compact', 'shadow-lg'); }
        else { inner.classList.remove('nav-compact', 'shadow-lg'); }
    }, { passive: true });
}

/* ---------- External link handling (Tauri / Web) ---------- */
function nsInitExternalLinks() {
    document.addEventListener('click', async (e) => {
        const a = e.target.closest('a[href]');
        if (!a) return;
        const href = a.getAttribute('href');
        if (href && href.startsWith('http')) {
            if (window.__TAURI__) {
                e.preventDefault(); e.stopPropagation();
                const { open } = window.__TAURI__.shell;
                await open(href);
            } else {
                a.target = '_blank'; a.rel = 'noopener noreferrer';
            }
        }
    }, true);
}

/* ============================================================
   STUDY WITH ME — Music Player (Ad-Free Radio Streams)
   ============================================================
   Sử dụng các kênh radio trực tuyến không quảng cáo.
   Nguồn: Lofi Girl Radio, Chillhop, SomaFM (royalty-free).
   ============================================================ */

const NS_MUSIC_TRACKS = [
    { title: 'Lofi Girl Radio', src: 'https://play.streamafrica.net/lofiradio', type: 'audio', color: '#7c5cfc' },
    { title: 'Chillhop Radio', src: 'https://streams.fluxfm.de/Chillhop/mp3-320/streams.fluxfm.de/', type: 'audio', color: '#38bdf8' },
    { title: 'SomaFM Groove Salad', src: 'https://ice1.somafm.com/groovesalad-256-mp3', type: 'audio', color: '#34d399' },
    { title: 'SomaFM Drone Zone', src: 'https://ice1.somafm.com/dronezone-256-mp3', type: 'audio', color: '#fb923c' },
    { title: 'Jazz Radio', src: 'https://jazz-wr04.ice.infomaniak.ch/jazz-wr04-128.mp3', type: 'audio', color: '#f472b6' },
];

let nsMusicCurrentTrack = 0;
let nsMusicPlaying = false;
let nsMusicPlayerEl = null;
let nsMusicIframe = null;

// Hidden audio element for ad-free playback
let nsMusicAudio = null;

function nsCreateMusicPlayer() {
    if (document.querySelector('.ns-music-player')) return;

    // Create audio element (replaces iframe)
    nsMusicAudio = new Audio();
    nsMusicAudio.volume = 0.5;
    nsMusicAudio.crossOrigin = 'anonymous';

    const player = document.createElement('div');
    player.className = 'ns-music-player collapsed no-print';
    player.innerHTML = `
        <div class="player-body">
            <div class="ns-music-toggle" style="padding:6px;text-align:center;cursor:pointer" onclick="nsToggleMusicPanel()">
                <div style="display:flex;align-items:center;justify-content:center;gap:6px;padding:6px">
                    <i class="ph-fill ph-music-notes" style="font-size:20px;color:#7c5cfc"></i>
                    <span class="ns-music-label" style="font-size:12px;font-weight:700;color:#7c5cfc;display:none">Study Music</span>
                </div>
            </div>
            <div class="ns-music-panel" style="display:none;padding:12px 14px 14px">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
                    <div style="display:flex;align-items:center;gap:6px">
                        <div class="ns-eq" style="display:none;align-items:flex-end;gap:2px;height:16px">
                            <span class="eq-bar" style="height:4px"></span>
                            <span class="eq-bar" style="height:8px"></span>
                            <span class="eq-bar" style="height:4px"></span>
                        </div>
                        <span class="track-title" style="font-size:13px;font-weight:700;max-width:140px"></span>
                    </div>
                    <button class="player-btn" onclick="nsToggleMusicPanel()" title="Thu gọn">
                        <i class="ph-bold ph-minus"></i>
                    </button>
                </div>
                <div style="display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:8px">
                    <button class="player-btn" onclick="nsMusicPrev()" title="Trước"><i class="ph-bold ph-skip-back"></i></button>
                    <button class="player-btn play-btn" id="ns-music-play" onclick="nsMusicTogglePlay()" title="Play/Pause">
                        <i class="ph-fill ph-play"></i>
                    </button>
                    <button class="player-btn" onclick="nsMusicNext()" title="Tiếp"><i class="ph-bold ph-skip-forward"></i></button>
                </div>
                <div style="display:flex;align-items:center;gap:6px;justify-content:center">
                    <i class="ph-fill ph-speaker-low" style="font-size:14px;color:#94a3b8"></i>
                    <input type="range" class="volume-slider" min="0" max="100" value="50" oninput="nsMusicSetVolume(this.value)">
                    <i class="ph-fill ph-speaker-high" style="font-size:14px;color:#94a3b8"></i>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(player);
    nsMusicPlayerEl = player;
    nsUpdateTrackDisplay();
}

function nsToggleMusicPanel() {
    if (!nsMusicPlayerEl) return;
    const isCollapsed = nsMusicPlayerEl.classList.contains('collapsed');
    nsMusicPlayerEl.classList.toggle('collapsed');
    const panel = nsMusicPlayerEl.querySelector('.ns-music-panel');
    const label = nsMusicPlayerEl.querySelector('.ns-music-label');
    if (isCollapsed) {
        panel.style.display = 'block';
        label.style.display = 'inline';
    } else {
        panel.style.display = 'none';
        label.style.display = 'none';
    }
}

function nsUpdateTrackDisplay() {
    const track = NS_MUSIC_TRACKS[nsMusicCurrentTrack];
    const titleEl = nsMusicPlayerEl?.querySelector('.track-title');
    if (titleEl) {
        titleEl.textContent = track.title;
        titleEl.style.color = track.color;
    }
}

function nsMusicTogglePlay() {
    if (nsMusicPlaying) { nsMusicStop(); } else { nsMusicPlay(); }
}

function nsMusicPlay() {
    const track = NS_MUSIC_TRACKS[nsMusicCurrentTrack];
    const playBtn = document.getElementById('ns-music-play');
    const eq = nsMusicPlayerEl?.querySelector('.ns-eq');
    if (nsMusicAudio) {
        nsMusicAudio.src = track.src;
        nsMusicAudio.play().catch(() => { /* autoplay blocked */ });
    }
    if (playBtn) playBtn.innerHTML = '<i class="ph-fill ph-pause"></i>';
    if (eq) eq.style.display = 'flex';
    nsMusicPlaying = true;
}

function nsMusicStop() {
    const playBtn = document.getElementById('ns-music-play');
    const eq = nsMusicPlayerEl?.querySelector('.ns-eq');
    if (nsMusicAudio) { nsMusicAudio.pause(); nsMusicAudio.src = ''; }
    if (playBtn) playBtn.innerHTML = '<i class="ph-fill ph-play"></i>';
    if (eq) eq.style.display = 'none';
    nsMusicPlaying = false;
}

function nsMusicNext() {
    nsMusicCurrentTrack = (nsMusicCurrentTrack + 1) % NS_MUSIC_TRACKS.length;
    nsUpdateTrackDisplay();
    if (nsMusicPlaying) nsMusicPlay();
}

function nsMusicPrev() {
    nsMusicCurrentTrack = (nsMusicCurrentTrack - 1 + NS_MUSIC_TRACKS.length) % NS_MUSIC_TRACKS.length;
    nsUpdateTrackDisplay();
    if (nsMusicPlaying) nsMusicPlay();
}

function nsMusicSetVolume(val) {
    if (nsMusicAudio) nsMusicAudio.volume = val / 100;
}

/* ============================================================
   CHATBOT — Gemini API Integration
   ============================================================
   Hệ thống API key:
   1. NS_DEFAULT_API_KEY — key của chủ dự án (hardcode bên dưới)
   2. Nếu key mặc định lỗi/hết hạn → yêu cầu người dùng nhập key riêng
   3. Key người dùng lưu vào localStorage
   
   Lấy API key miễn phí tại: https://aistudio.google.com/apikey
   ============================================================ */

// ⬇️ THAY API KEY CỦA BẠN VÀO ĐÂY (lấy tại https://aistudio.google.com/apikey)
const NS_DEFAULT_API_KEY = 'AIzaSyDA7HnTp3Ix9ZfdFheB_Ecxp-SzlzEp4f0';
// ⬆️ Để trống '' nếu muốn người dùng tự nhập key từ đầu

const NS_GEMINI_MODEL = 'gemini-3-flash-preview';
const NS_GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/';

const NS_CHATBOT_SYSTEM_PROMPT = `Bạn là AITECH Study Assistant — trợ lý AI thuộc dự án AITECH.
Tác giả: Trần Đình Mạnh Phong.
Quy tắc:
- Xưng hô: "mình" – "bạn". Thân thiện, lịch sự, chuẩn học đường.
- Không toxic, không kích động, không hướng dẫn hành vi nguy hiểm.
- Ưu tiên: giải thích dễ hiểu, có ví dụ, có bước làm bài, có câu hỏi gợi mở tự học.
- Khi không chắc chắn: nói "Mình chưa có đủ dữ liệu để xác minh điều này" thay vì bịa.
- Hỗ trợ 3 chế độ: ôn tập nhanh / giải chi tiết / lập kế hoạch.
- Luôn khuyến khích cách tiếp cận tự chủ trong học tập.
- Khi nhận được hình ảnh: phân tích nội dung và đưa gợi ý liên quan.
- Trả lời bằng tiếng Việt. Dùng markdown formatting.`;

// Conversation history for multi-turn chat
let nsChatHistory = [];

/* ----- API Key Management ----- */
function nsGetApiKey() {
    // Priority: user key > default key
    const userKey = localStorage.getItem('ns_user_api_key');
    if (userKey && userKey.trim()) return { key: userKey.trim(), source: 'user' };
    if (NS_DEFAULT_API_KEY && NS_DEFAULT_API_KEY.trim()) return { key: NS_DEFAULT_API_KEY.trim(), source: 'default' };
    return null;
}

function nsSaveUserApiKey(key) {
    localStorage.setItem('ns_user_api_key', key.trim());
    nsUpdateApiKeyUI();
}

function nsClearUserApiKey() {
    localStorage.removeItem('ns_user_api_key');
    nsUpdateApiKeyUI();
}

function nsUpdateApiKeyUI() {
    const statusEl = document.getElementById('ns-api-status');
    const inputEl = document.getElementById('ns-api-key-input');
    const clearBtn = document.getElementById('ns-api-clear-btn');
    if (!statusEl) return;

    const apiInfo = nsGetApiKey();
    if (!apiInfo) {
        statusEl.innerHTML = '<span style="color:#ef4444">⚠️ Chưa có API key — nhập bên dưới</span>';
        if (clearBtn) clearBtn.style.display = 'none';
    } else if (apiInfo.source === 'default') {
        statusEl.innerHTML = '<span style="color:#34d399">✅ Đang dùng key dự án</span>';
        if (clearBtn) clearBtn.style.display = 'none';
    } else {
        statusEl.innerHTML = '<span style="color:#38bdf8">🔑 Đang dùng key cá nhân</span>';
        if (clearBtn) clearBtn.style.display = 'inline-block';
    }
    if (inputEl) {
        const userKey = localStorage.getItem('ns_user_api_key') || '';
        inputEl.value = userKey ? '••••••••' + userKey.slice(-6) : '';
    }
}

function nsToggleApiSettings() {
    const panel = document.getElementById('ns-api-settings');
    if (panel) {
        const isHidden = panel.classList.toggle('hidden');
        if (!isHidden) nsUpdateApiKeyUI();
    }
}

function nsHandleApiKeySave() {
    const input = document.getElementById('ns-api-key-input');
    if (!input) return;
    const key = input.value.trim();
    if (!key || key.startsWith('••••')) {
        alert('Vui lòng nhập API key hợp lệ!');
        return;
    }
    nsSaveUserApiKey(key);
    alert('✅ Đã lưu API key! Chatbot sẵn sàng sử dụng.');
}

/* ----- File Attachment ----- */
let nsChatbotAttachedFiles = [];

function nsChatbotAttachFile(inputEl) {
    const files = inputEl.files;
    if (!files || files.length === 0) return;
    for (const file of files) {
        if (file.size > 10 * 1024 * 1024) {
            alert('File quá lớn! Tối đa 10MB.');
            continue;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            nsChatbotAttachedFiles.push({
                name: file.name,
                type: file.type,
                size: file.size,
                dataUrl: e.target.result
            });
            nsChatbotRenderAttachments();
        };
        reader.readAsDataURL(file);
    }
    inputEl.value = '';
}

function nsChatbotRemoveFile(index) {
    nsChatbotAttachedFiles.splice(index, 1);
    nsChatbotRenderAttachments();
}

function nsChatbotRenderAttachments() {
    const container = document.getElementById('chatbot-attachments');
    if (!container) return;
    if (nsChatbotAttachedFiles.length === 0) {
        container.innerHTML = '';
        return;
    }
    container.innerHTML = nsChatbotAttachedFiles.map((f, i) => {
        const isImage = f.type.startsWith('image/');
        return `<div class="chatbot-file-preview">
            ${isImage ? `<img src="${f.dataUrl}" style="width:32px;height:32px;border-radius:6px;object-fit:cover">` :
                `<i class="ph-fill ph-file" style="font-size:20px;color:#7c5cfc"></i>`}
            <span style="max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${f.name}</span>
            <span style="color:#94a3b8;font-size:11px">${(f.size / 1024).toFixed(0)}KB</span>
            <span class="remove-file" onclick="nsChatbotRemoveFile(${i})"><i class="ph-bold ph-x-circle"></i></span>
        </div>`;
    }).join('');
}

/* ----- Gemini API Call ----- */
async function nsChatbotAsk(userMessage) {
    const apiInfo = nsGetApiKey();

    // No API key → show setup prompt
    if (!apiInfo) {
        return nsNoKeyResponse();
    }

    // Build message parts for Gemini
    const parts = [];

    // Add text
    if (userMessage) {
        parts.push({ text: userMessage });
    }

    // Add images (Gemini inline_data)
    const imageFiles = nsChatbotAttachedFiles.filter(f => f.type.startsWith('image/'));
    const nonImageFiles = nsChatbotAttachedFiles.filter(f => !f.type.startsWith('image/'));

    for (const img of imageFiles) {
        const base64 = img.dataUrl.split(',')[1];
        parts.push({
            inline_data: { mime_type: img.type, data: base64 }
        });
    }

    // Mention non-image files in text context
    if (nonImageFiles.length > 0) {
        const names = nonImageFiles.map(f => f.name).join(', ');
        parts.push({ text: `\n[Đính kèm: ${names} — hiện chỉ hỗ trợ phân tích hình ảnh]` });
    }

    // Clear attachments after building
    nsChatbotAttachedFiles = [];
    nsChatbotRenderAttachments();

    // Add to conversation history
    nsChatHistory.push({ role: 'user', parts });

    // Keep last 10 turns for speed (less tokens = faster response)
    if (nsChatHistory.length > 10) {
        nsChatHistory = nsChatHistory.slice(-10);
    }

    // Make API request with streaming for faster perceived speed
    const url = `${NS_GEMINI_ENDPOINT}${NS_GEMINI_MODEL}:streamGenerateContent?alt=sse&key=${apiInfo.key}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_instruction: { parts: [{ text: NS_CHATBOT_SYSTEM_PROMPT }] },
                contents: nsChatHistory,
                generationConfig: {
                    temperature: 0.7,
                    topP: 0.9,
                    topK: 40,
                    maxOutputTokens: 1500,
                },
                safetySettings: [
                    { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
                    { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
                    { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
                    { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
                ]
            })
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            const errMsg = errData?.error?.message || '';
            const status = response.status;

            // Remove failed user message from history
            nsChatHistory.pop();

            if (status === 400 && errMsg.includes('API_KEY_INVALID')) return nsApiKeyError('invalid');
            if (status === 429) return nsApiKeyError('quota');
            if (status === 403) return nsApiKeyError('forbidden');
            return `❌ **Lỗi API (${status}):**\n${errMsg || 'Không xác định'}\n\n*Nhấn ⚙️ để kiểm tra API key.*`;
        }

        // Stream response for faster display
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullText = '';
        const streamCallback = window._nsChatStreamCallback;

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            // Parse SSE events
            const lines = chunk.split('\n');
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    try {
                        const json = JSON.parse(line.slice(6));
                        const part = json?.candidates?.[0]?.content?.parts?.[0]?.text;
                        if (part) {
                            fullText += part;
                            if (streamCallback) streamCallback(fullText);
                        }
                        if (json?.candidates?.[0]?.finishReason === 'SAFETY') {
                            nsChatHistory.pop();
                            return '⚠️ Câu trả lời bị chặn bởi bộ lọc an toàn. Vui lòng thử câu hỏi khác!';
                        }
                    } catch (e) { /* skip invalid JSON */ }
                }
            }
        }

        if (!fullText) {
            nsChatHistory.pop();
            return '⚠️ Không nhận được phản hồi từ AI. Vui lòng thử lại!';
        }

        // Add assistant reply to history
        nsChatHistory.push({ role: 'model', parts: [{ text: fullText }] });
        return fullText;

    } catch (err) {
        nsChatHistory.pop();
        if (err.name === 'TypeError' && err.message.includes('fetch')) {
            return '🌐 **Lỗi kết nối mạng.** Vui lòng kiểm tra internet và thử lại!';
        }
        return `❌ **Lỗi:** ${err.message}\n\n*Nhấn ⚙️ để kiểm tra API key.*`;
    }
}

/* ----- Error Response Helpers ----- */
function nsNoKeyResponse() {
    return `⚠️ **Chưa có API key!**

Để sử dụng chatbot AI, bạn cần nhập API key Gemini:

1. Truy cập 👉 [Google AI Studio](https://aistudio.google.com/apikey)
2. Đăng nhập tài khoản Google
3. Nhấn **"Create API Key"**
4. Copy key và nhấn **⚙️** ở chatbot để dán vào

💡 API key Gemini **hoàn toàn miễn phí** (giới hạn 15 request/phút).`;
}

function nsApiKeyError(type) {
    if (type === 'invalid') {
        return `🔑 **API key không hợp lệ hoặc đã hết hạn!**

Vui lòng:
1. Nhấn **⚙️** để mở cài đặt
2. Nhập API key mới từ [Google AI Studio](https://aistudio.google.com/apikey)

💡 *Tạo key Gemini miễn phí chỉ mất 30 giây!*`;
    }
    if (type === 'quota') {
        return `⏳ **Đã hết lượt sử dụng!**

API key hiện tại đã hết quota. Bạn có thể:
- ⏰ **Chờ 1 phút** rồi thử lại (giới hạn 15 req/phút)
- 🔑 Nhấn **⚙️** để nhập API key **riêng** của bạn

💡 *Tạo key miễn phí tại [aistudio.google.com](https://aistudio.google.com/apikey)*`;
    }
    if (type === 'forbidden') {
        return `🚫 **API key bị từ chối!**

Key hiện tại không có quyền truy cập. Vui lòng:
1. Nhấn **⚙️** để mở cài đặt
2. Nhập API key khác từ [Google AI Studio](https://aistudio.google.com/apikey)`;
    }
    return '❌ Lỗi API key không xác định.';
}

// Reset conversation
function nsChatReset() {
    nsChatHistory = [];
}

/* ---------- Init All ---------- */
function nsInit() {
    nsInitReveal();
    nsInitNavScroll();
    nsInitExternalLinks();
    nsCreateMusicPlayer();
    nsCreateSparkles();
    nsCreateAurora();
}
document.addEventListener('DOMContentLoaded', nsInit);

/* ---------- Sparkle Particles ---------- */
function nsCreateSparkles() {
    const container = document.createElement('div');
    container.className = 'sparkle-container';
    container.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < 20; i++) {
        const s = document.createElement('div');
        s.className = 'sparkle';
        s.style.left = Math.random() * 100 + '%';
        s.style.animationDelay = Math.random() * 6 + 's';
        s.style.animationDuration = (4 + Math.random() * 4) + 's';
        container.appendChild(s);
    }
    document.body.appendChild(container);
}

/* ---------- Aurora Background ---------- */
function nsCreateAurora() {
    const aurora = document.createElement('div');
    aurora.className = 'aurora-bg';
    aurora.setAttribute('aria-hidden', 'true');
    document.body.appendChild(aurora);
}
