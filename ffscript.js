// ১. লাইক এবং রিঅ্যাকশন বাটন কাজ করানো
const reactionButtons = document.querySelectorAll('.reaction-btn');

reactionButtons.forEach(button => {
    button.addEventListener('click', function() {
        const span = this.querySelector('span');
        let count = parseInt(span.innerText);
        
        // বাটনটি একবার ক্লিক করলে সংখ্যা বাড়বে
        if (!this.classList.contains('active')) {
            count++;
            span.innerText = count;
            this.classList.add('active');
            this.style.background = "#ffebee";
            this.style.borderColor = "#ff6b6b";
            
            // ছোট পপ এনিমেশন
            this.style.transform = "scale(1.1)";
            setTimeout(() => {
                this.style.transform = "scale(1)";
            }, 200);
        }
    });
});

// ২. ব্যাক বাটনের কাজ
const backBtn = document.querySelector('.back-btn');
if (backBtn) {
    backBtn.addEventListener('click', () => {
        alert("আপনি হোমপেজে ফিরে যাচ্ছেন...");
        // ডিরেক্ট ইউআরএল দিতে চাইলে নিচের লাইনটি ব্যবহার করা যায়:
        // window.location.href = "index.html"; 
    });
}

// ৩. শেয়ার বাটনের কাজ
const shareBtn = document.querySelector('.share-btn');
if (shareBtn) {
    shareBtn.addEventListener('click', () => {
        if (navigator.share) {
            navigator.share({
                title: 'বিড়াল কেন সেরা সঙ্গী',
                url: window.location.href
            }).catch(console.error);
        } else {
            alert("লিঙ্কটি কপি করা হয়েছে!");
        }
    });
}
