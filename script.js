// Initialize tooltips
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all tooltips
    tippy('.help-icon', {
        placement: 'right-start',
        offset: [0, 0],
        animation: 'shift-away',
        arrow: true,
        theme: 'custom',
        duration: [200, 150],
        interactive: true
    });

    // Add character counter for campaign name
    const campaignInput = document.getElementById('utmCampaign');
    const charCount = document.getElementById('campaignCharCount');
    
    campaignInput.addEventListener('input', () => {
        const count = campaignInput.value.length;
        charCount.textContent = `${count}/100`;
        if (count > 100) {
            charCount.style.color = 'var(--danger)';
        } else {
            charCount.style.color = 'var(--text-secondary)';
        }
    });

    // Add keyboard shortcut
    document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
            generateUrl();
        }
    });
});

function handleSourceChange() {
    const select = document.getElementById('utmSource');
    const customWrapper = document.getElementById('utmSourceCustomWrapper');
    const customInput = document.getElementById('utmSourceCustom');
    
    if (select.value === 'other') {
        customWrapper.style.display = 'flex';
        customInput.required = true;
    } else {
        customWrapper.style.display = 'none';
        customInput.required = false;
        customInput.value = '';
    }
}

function clearField(fieldId) {
    const field = document.getElementById(fieldId);
    field.value = '';
    field.focus();
    
    // Trigger input event for campaign field to update char count
    if (fieldId === 'utmCampaign') {
        field.dispatchEvent(new Event('input'));
    }
}

async function generateUrl() {
    let rootUrl = document.getElementById('rootUrl').value.trim();
    const utmSourceSelect = document.getElementById('utmSource');
    const utmSourceCustom = document.getElementById('utmSourceCustom');
    const utmSource = utmSourceSelect.value === 'other' ? utmSourceCustom.value : utmSourceSelect.value;
    const utmCampaign = document.getElementById('utmCampaign').value;

    if (!rootUrl || !utmSource || !utmCampaign) {
        alert('Please fill in all fields');
        return;
    }

    if (utmSourceSelect.value === 'other' && !utmSourceCustom.value.trim()) {
        alert('Please enter a custom source');
        return;
    }

    // Show loading state
    const generateButton = document.getElementById('generateButton');
    generateButton.classList.add('loading');

    try {
        // Simulate loading (remove in production)
        await new Promise(resolve => setTimeout(resolve, 800));

        // Remove any existing protocol
        rootUrl = rootUrl.replace(/^https?:\/\//i, '');
        
        // Remove www. if it exists to standardize the URL
        rootUrl = rootUrl.replace(/^www\./i, '');
        
        // Add https://www. to the start
        rootUrl = 'https://www.' + rootUrl;

        const url = new URL(rootUrl);
        url.searchParams.set('utm_source', utmSource);
        url.searchParams.set('utm_campaign', utmCampaign);

        const generatedUrl = url.toString();
        
        // Update result
        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = `
            <div class="result-url">${generatedUrl}</div>
            <button onclick="copyToClipboard()" class="copy-btn">
                <i class="ph ph-copy"></i>
                Copy to Clipboard
            </button>
        `;

    } catch (error) {
        alert('Please enter a valid URL');
    } finally {
        generateButton.classList.remove('loading');
    }
}

function copyToClipboard() {
    const copyBtn = document.querySelector('.copy-btn');
    const originalText = copyBtn.innerHTML;
    const urlText = document.querySelector('.result-url').textContent;
    
    navigator.clipboard.writeText(urlText).then(() => {
        copyBtn.innerHTML = '<i class="ph ph-check"></i> Copied!';
        copyBtn.classList.add('copied');
        
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
            copyBtn.classList.remove('copied');
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}

function resetFields() {
    document.getElementById('rootUrl').value = '';
    document.getElementById('utmSource').value = '';
    document.getElementById('utmCampaign').value = '';
    document.getElementById('result').innerHTML = '';
    
    // Reset and hide the custom source input
    const customInput = document.getElementById('utmSourceCustom');
    const customWrapper = document.getElementById('utmSourceCustomWrapper');
    customInput.value = '';
    customWrapper.style.display = 'none';
    customInput.required = false;
    
    // Reset character count
    document.getElementById('campaignCharCount').textContent = '0/100';
    document.getElementById('campaignCharCount').style.color = 'var(--text-secondary)';
} 