// BigQuery Release Radar - Client Application Controller
document.addEventListener('DOMContentLoaded', () => {
    // Select elements
    const refreshBtn = document.getElementById('refreshBtn');
    const retryBtn = document.getElementById('retryBtn');
    const searchInput = document.getElementById('searchInput');
    const filterTags = document.getElementById('filterTags');
    const loadingState = document.getElementById('loadingState');
    const errorState = document.getElementById('errorState');
    const errorMessage = document.getElementById('errorMessage');
    const emptyState = document.getElementById('emptyState');
    const releasesContainer = document.getElementById('releasesContainer');

    // App State
    let allReleases = [];
    let currentFilter = 'all';
    let currentSearch = '';
    let selectedReleaseId = null;

    // Helper: Strip HTML tags and truncate text for Twitter compatibility
    function cleanAndTruncateText(htmlContent, maxLength = 140) {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = htmlContent;
        let text = tempDiv.textContent || tempDiv.innerText || "";
        
        // Remove duplicate spaces and clean line breaks
        text = text.replace(/\s+/g, ' ').trim();
        
        if (text.length > maxLength) {
            return text.substring(0, maxLength - 3) + '...';
        }
        return text;
    }

    // Helper: Map release types to CSS badge classes
    function getBadgeClass(type) {
        const normalized = type.toLowerCase().replace(/\s+/g, '');
        if (normalized.includes('feature')) return 'badge-feature';
        if (normalized.includes('bug') || normalized.includes('fix')) return 'badge-bugfix';
        if (normalized.includes('deprecat')) return 'badge-deprecation';
        if (normalized.includes('change')) return 'badge-changed';
        if (normalized.includes('note')) return 'badge-note';
        return 'badge-update';
    }

    // Fetch releases from Python backend
    async function loadReleases(isRefresh = false) {
        // UI states before request
        loadingState.classList.remove('hidden');
        errorState.classList.add('hidden');
        emptyState.classList.add('hidden');
        
        if (isRefresh) {
            refreshBtn.classList.add('loading');
            refreshBtn.disabled = true;
            releasesContainer.classList.add('loading');
        } else {
            releasesContainer.classList.add('hidden');
        }

        try {
            const response = await fetch('/api/releases');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            if (data.success) {
                allReleases = data.releases;
                renderReleases();
            } else {
                throw new Error(data.error || 'Unknown server error');
            }
        } catch (error) {
            console.error('Error fetching release notes:', error);
            errorMessage.textContent = error.message || 'Check your server and internet connection.';
            errorState.classList.remove('hidden');
            releasesContainer.classList.add('hidden');
        } finally {
            loadingState.classList.add('hidden');
            refreshBtn.classList.remove('loading');
            refreshBtn.disabled = false;
            releasesContainer.classList.remove('loading');
        }
    }

    // Render cards list based on search and filters
    function renderReleases() {
        releasesContainer.innerHTML = '';
        
        // Filter elements
        const filtered = allReleases.filter(release => {
            // Category tag match
            let matchesCategory = false;
            if (currentFilter === 'all') {
                matchesCategory = true;
            } else {
                const normType = release.type.toLowerCase();
                const normFilter = currentFilter.toLowerCase();
                
                if (normFilter === 'bug fix') {
                    matchesCategory = normType.includes('bug') || normType.includes('fix');
                } else if (normFilter === 'deprecated') {
                    matchesCategory = normType.includes('deprecat');
                } else {
                    matchesCategory = normType.includes(normFilter);
                }
            }

            // Keyword Search Match
            const matchesSearch = currentSearch === '' || 
                release.content.toLowerCase().includes(currentSearch) ||
                release.date.toLowerCase().includes(currentSearch) ||
                release.type.toLowerCase().includes(currentSearch);

            return matchesCategory && matchesSearch;
        });

        if (filtered.length === 0) {
            emptyState.classList.remove('hidden');
            releasesContainer.classList.add('hidden');
            return;
        }

        emptyState.classList.add('hidden');
        releasesContainer.classList.remove('hidden');

        // Render card nodes
        filtered.forEach(release => {
            const card = document.createElement('div');
            card.className = `release-card glass-panel ${release.id === selectedReleaseId ? 'selected' : ''}`;
            card.dataset.id = release.id;

            // HTML content construction
            card.innerHTML = `
                <div class="card-header">
                    <span class="badge ${getBadgeClass(release.type)}">${release.type}</span>
                    <span class="card-date">${release.date}</span>
                </div>
                <div class="card-content">
                    ${release.content}
                </div>
                <div class="card-actions">
                    <a href="${release.link}" target="_blank" class="card-link" title="Open official release notes page">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                        <span>Official Notes</span>
                    </a>
                    <button class="btn-tweet" title="Share this specific release note on Twitter">
                        <svg viewBox="0 0 24 24">
                            <!-- SVG Twitter/X New Logo Path -->
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                        <span>Tweet Update</span>
                    </button>
                </div>
            `;

            // Card Interactive Click handlers
            card.addEventListener('click', (e) => {
                // Ignore click if user clicked a link or button directly
                if (e.target.closest('a') || e.target.closest('button')) {
                    return;
                }
                
                // Toggle selection
                document.querySelectorAll('.release-card').forEach(c => c.classList.remove('selected'));
                if (selectedReleaseId === release.id) {
                    selectedReleaseId = null;
                } else {
                    selectedReleaseId = release.id;
                    card.classList.add('selected');
                }
            });

            // Card premium lighting/glow dynamic coordinate calculations
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--x', `${x}px`);
                card.style.setProperty('--y', `${y}px`);
            });

            // Wire up Tweet share event trigger
            const tweetBtn = card.querySelector('.btn-tweet');
            tweetBtn.addEventListener('click', () => {
                const cleanText = cleanAndTruncateText(release.content, 140);
                const tweetPayload = `BigQuery Update [${release.type} - ${release.date}]:\n"${cleanText}"\n\n#GoogleCloud #BigQuery`;
                const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetPayload)}&url=${encodeURIComponent(release.link)}`;
                window.open(tweetUrl, '_blank');
            });

            releasesContainer.appendChild(card);
        });
    }

    // Set up search handler
    searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value.toLowerCase().trim();
        renderReleases();
    });

    // Set up filter tags handlers
    filterTags.addEventListener('click', (e) => {
        const targetBtn = e.target.closest('.tag-btn');
        if (!targetBtn) return;

        // Toggle Active classes
        document.querySelectorAll('.tag-btn').forEach(btn => btn.classList.remove('active'));
        targetBtn.classList.add('active');

        currentFilter = targetBtn.dataset.filter;
        renderReleases();
    });

    // Refresh & Retry Click triggers
    refreshBtn.addEventListener('click', () => loadReleases(true));
    retryBtn.addEventListener('click', () => loadReleases(false));

    // Initial load call
    loadReleases();
});
