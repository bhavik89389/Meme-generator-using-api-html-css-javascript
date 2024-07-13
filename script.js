document.addEventListener('DOMContentLoaded', function() {
    const templateSelectTrigger = document.querySelector('.custom-select-trigger span');
    const customOptions = document.querySelector('.custom-options');
    const topTextInput = document.getElementById('topText');
    const bottomTextInput = document.getElementById('bottomText');
    const topTextStyleSelect = document.getElementById('topTextStyle');
    const bottomTextStyleSelect = document.getElementById('bottomTextStyle');
    const topFontStyleSelect = document.getElementById('topFontStyle');
    const bottomFontStyleSelect = document.getElementById('bottomFontStyle');
    const generateBtn = document.getElementById('generateBtn');
    const memeImg = document.getElementById('memeImg');
    const shareBtn = document.getElementById('shareBtn');
    const sharePopup = document.querySelector('.share-popup');
    const downloadBtn = document.getElementById('downloadBtn'); 

    
    function toggleSharePopup() {
        sharePopup.style.display = sharePopup.style.display === 'block' ? 'none' : 'block';
    }

    
    fetch('https://api.memegen.link/templates/')
        .then(response => response.json())
        .then(data => {
            data.forEach(template => {
                const option = document.createElement('div');
                option.classList.add('custom-option');
                option.dataset.value = template.id;
                option.innerHTML = `<img src="${template.blank}" alt="${template.name}"><span>${template.name}</span>`;
                customOptions.appendChild(option);
            });

           
            document.querySelectorAll('.custom-option').forEach(option => {
                option.addEventListener('click', function() {
                    templateSelectTrigger.textContent = this.querySelector('span').textContent;
                    templateSelectTrigger.dataset.value = this.dataset.value;
                    customOptions.style.display = 'none';
                });
            });
        })
        .catch(error => console.error('Error fetching templates:', error));

  
    document.querySelector('.custom-select-trigger').addEventListener('click', function() {
        customOptions.style.display = customOptions.style.display === 'block' ? 'none' : 'block';
    });

    
    generateBtn.addEventListener('click', function() {
        const templateId = templateSelectTrigger.dataset.value;
        const topText = encodeURIComponent(topTextInput.value);
        const bottomText = encodeURIComponent(bottomTextInput.value);
        const topTextStyle = topTextStyleSelect.value !== 'default-1' ? topTextStyleSelect.value : null;
        const bottomTextStyle = bottomTextStyleSelect.value !== 'default-2' ? bottomTextStyleSelect.value : null;
        const topFontStyle = topFontStyleSelect.value;
        const bottomFontStyle = bottomFontStyleSelect.value;

        if (templateId) {
            let memeUrl = `https://api.memegen.link/images/${templateId}/${topText}/${bottomText}.png`;

            
            const params = [];

            if (topTextStyle) {
                params.push(`style=${topTextStyle}`);
            }
            if (bottomTextStyle) {
                params.push(`style=${bottomTextStyle}`);
            }
            if (topFontStyle) {
                params.push(`font=${topFontStyle}`);
            }
            if (bottomFontStyle) {
                params.push(`font=${bottomFontStyle}`);
            }

            if (params.length > 0) {
                memeUrl += `?${params.join('&')}`;
            }

            memeImg.src = memeUrl;
        } else {
            alert('Please select a template');
        }
    });

  
    shareBtn.addEventListener('click', function() {
        toggleSharePopup();
    });

    
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.share-popup') && event.target !== shareBtn) {
            sharePopup.style.display = 'none';
        }
    });

    
    downloadBtn.addEventListener('click', function() {
        const memeUrl = memeImg.src;
        if (memeUrl) {
            const a = document.createElement('a');
            a.href = memeUrl;
            a.download = 'meme.png'; 
            a.style.display = 'none'; 
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } else {
            alert('No meme generated to download.');
        }
    });
});